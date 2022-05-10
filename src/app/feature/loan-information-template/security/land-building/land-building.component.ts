import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';
import {CustomerType} from '../../../customer/model/customerType';
import {ToastService} from '../../../../@core/utils';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {ValuatorService} from '../../../admin/component/valuator/valuator.service';
import {BranchService} from '../../../admin/component/branch/branch.service';
import {SecurityValuator} from '../../../loan/model/securityValuator';
import {RelationshipList} from '../../../loan/model/relationshipList';
import {CalendarType} from '../../../../@core/model/calendar-type';
import {RoleService} from '../../../admin/component/role-permission/role.service';
import {OwnershipTransfer} from '../../../loan/model/ownershipTransfer';
import {Province} from '../../../admin/modal/province';
import {District} from '../../../admin/modal/district';
import {MunicipalityVdc} from '../../../admin/modal/municipality_VDC';
import {AddressService} from '../../../../@core/service/baseservice/address.service';

@Component({
  selector: 'app-land-building',
  templateUrl: './land-building.component.html',
  styleUrls: ['./land-building.component.scss']
})
export class LandBuildingComponent implements OnInit {
  landBuildingForm: FormGroup;
  submitted = false;
  loanList = [];
  @Input() customerType: CustomerType;
  areaFormat = ['R-A-P-D', 'B-K-D', 'SQF', 'Sq.m'];
  totaldv = 0;
  totalmv = 0;
  totalcv = 0;
  landBuildingOtherBranchChecked = false;
  securityValuator: SecurityValuator = new SecurityValuator();
  branchLists;
  collateralOwnerRelationshipList: RelationshipList = new RelationshipList();
  @Input() calendarType: CalendarType;
  designationList = [];
  spinner = false;
  typeOfProperty = ['Guthi', 'Lease Hold', 'Free Hold', 'Rajkar', 'Others'];
  newOwnerShipTransfer = [];
  ownershipTransferEnumPair = OwnershipTransfer.enumObject();
  ownershipTransfers = OwnershipTransfer;
  provinces: Province[];
  districtList: District [];
  municipalityList: MunicipalityVdc [];
  isEdit = false;

  constructor(private formBuilder: FormBuilder,
              private loanConfigService: LoanConfigService,
              private toastService: ToastService,
              private valuatorService: ValuatorService,
              private branchService: BranchService,
              private roleService: RoleService,
              private location: AddressService) { }

  ngOnInit() {
    this.buildForm();
    this.getLoanConfig();
    this.branchList();
    this.getRoleList();
    this.reArrangeEnumType();
    this.getProvince();
  }

  private buildForm(): FormGroup {
    return this.landBuildingForm = this.formBuilder.group({
      lbCrossChecked: [undefined],
      landBuildingDescription: [undefined],
      lbExposureTotal: [undefined],
      lbRmValueTotal: [undefined],
      lbFmvOfFacTotal: [undefined],
      landBuilding: this.formBuilder.array([this.LandBuildingDetailsFormGroup()]),
      lbCross: this.formBuilder.array([this.crossCollateralizedFormGroup()]),
    });
  }

  private reArrangeEnumType(): void {
    const other = this.ownershipTransferEnumPair.filter(value => value.value.toString() === 'Other');
    const index = this.ownershipTransferEnumPair.indexOf(other[0]);
    this.ownershipTransferEnumPair.splice(index, 1);
    this.newOwnerShipTransfer = this.ownershipTransferEnumPair.concat(other);
  }

  private branchList(): void {
    this.branchService.getAll().subscribe((res: any) => {
      this.branchLists = res.detail;
    });
  }

  private getRoleList(): void {
    this.spinner = true;
    this.roleService.getAll().subscribe(res => {
      this.designationList = res.detail;
      this.spinner = false;
    }, error => {
      this.toastService.show(new Alert(AlertType.ERROR, 'Error While Fetching List'));
      this.spinner = false;
    });
  }


  private getLoanConfig(): void {
    this.loanConfigService.getAllByLoanCategory(this.customerType).subscribe((res: any) => {
      this.loanList = res.detail;
    }, error => {
      this.toastService.show(new Alert(AlertType.DANGER, 'Could not load data!!!'));
    });
  }

  public checkedChange(event, value): void {
    if (value === 'lbCross') {
      if (event) {
        this.landBuildingForm.get('lbCrossChecked').patchValue(event);
      } else {
        this.landBuildingForm.get('lbCrossChecked').patchValue(event);
      }
    }
    const sec = this.landBuildingForm.get(value) as FormArray;
    sec.clear();
    this.calculateTotalCross(value);
  }

  public calculateTotalCross(security): void {
    let totalExposure = 0;
    let totalRmValue = 0;
    let totalFMV = 0;
    const crossData = this.landBuildingForm.get(security) as FormArray;
    crossData.value.forEach(cd => {
      totalExposure += cd.totalExposure;
      totalRmValue += cd.rmValue;
      totalFMV += cd.fmvApportion;
    });
    if (security === 'lbCross') {
      this.landBuildingForm.get('lbExposureTotal').patchValue(totalExposure);
      this.landBuildingForm.get('lbRmValueTotal').patchValue(totalRmValue);
      this.landBuildingForm.get('lbFmvOfFacTotal').patchValue(totalFMV);
    }
  }

  public removeCrossCollateralized(securityType: string, cin: number) {
    (<FormArray>this.landBuildingForm.get(securityType)).removeAt(cin);
    this.calculateTotalCross(securityType);
  }

  public addCrossCollateralized(arrayName): void {
    (this.landBuildingForm.get(arrayName) as FormArray).push(this.crossCollateralizedFormGroup());
  }


  public crossCollateralizedFormGroup(): FormGroup {
    return this.formBuilder.group({
      borrowerName: [undefined],
      facilityName: [undefined],
      totalExposure: [undefined],
      rmValue: [undefined],
      fmvApportion: [undefined],
      drawDown: [undefined],
      residualFmv: [undefined],
    });
  }

  public updateLandSecurityTotal(): void {
    const landDetails = this.landBuildingForm.get('landBuilding') as FormArray;
    this.totaldv = 0;
    this.totalmv = 0;
    this.totalcv = 0;
    landDetails['value'].forEach((sec, index) => {
      if (sec['revaluationData'] !== null && sec['revaluationData']['isReValuated']) {
        this.totaldv += Number(sec['revaluationData']['reValuatedDv']);
        this.totalmv += Number(sec['revaluationData']['reValuatedFmv']);
        this.totalcv += Number(sec['revaluationData']['reValuatedConsideredValue']);
      } else {
        this.totaldv += Number(sec['distressValue']);
        this.totalmv += Number(sec['fairMarketValue']);
        this.totalcv += Number(sec['landConsideredValue']);
      }
    });
  }

  public resetOtherTransferParameter(formArray, index: number, resetAmountOnly: boolean) {
    this.landBuildingForm.get([formArray, index, 'saleRegistrationAmount']).patchValue(undefined);
    this.landBuildingForm.get([formArray, index, 'familyRegistrationAmount']).patchValue(undefined);
    this.landBuildingForm.get([formArray, index, 'giftRegistrationAmount']).patchValue(undefined);
    if (resetAmountOnly) {
      return;
    }
    this.landBuildingForm.get([formArray, index, 'saleOwnershipTransfer']).patchValue(undefined);
    this.landBuildingForm.get([formArray, index, 'familyTransferOwnershipTransfer']).patchValue(undefined);
    this.landBuildingForm.get([formArray, index, 'giftOwnershipTransfer']).patchValue(undefined);

  }

  public calConsiderValue(type, index): void {
    switch (type) {
      case 'landBuilding':
        const landConValue = (Number(this.landBuildingForm.get(['landBuilding', index, 'distressValue']).value)
            * (Number(this.landBuildingForm.get(['landBuilding', index, 'landBuildingRate']).value / 100)));
        this.landBuildingForm.get(['landBuilding', index, 'totalLandRealisableValue'])
            .patchValue(Number(landConValue));
        const landBuildingConValue = (Number(this.landBuildingForm.get(['landBuilding', index, 'apartmentDistressValue']).value)
            * (Number(this.landBuildingForm.get(['landBuilding', index, 'apartmentRate']).value / 100)));
        this.landBuildingForm.get(['landBuilding', index, 'totalApartmentRealisableValue'])
            .patchValue(Number(landBuildingConValue));
        this.landBuildingForm.get(['landBuilding', index, 'landConsideredValue'])
            .patchValue(Number(landConValue + landBuildingConValue));
        break;
      case 'lbUnderConstruction':
        const lbUnderConValue = (Number(this.landBuildingForm.get(['landBuilding', index, 'distressValueConstruction']).value)
            * (Number(this.landBuildingForm.get(['landBuilding', index, 'landbuildingUnderRate']).value) / 100));
        this.landBuildingForm.get(['landBuilding', index, 'landConsideredValueConstruction']).patchValue(lbUnderConValue);
        break;
    }
    this.updateLandSecurityTotal();
  }

  public valuator(branchId, type: string, index: number) {
    if ((this.landBuildingOtherBranchChecked) && ObjectUtil.isEmpty(branchId)) {
      return;
    }
    const valuatorSearch = {
      'branchIds': LocalStorageUtil.getStorage().branch
    };
    if (!ObjectUtil.isEmpty(branchId)) {
      valuatorSearch.branchIds = JSON.stringify(branchId);
    }
    if (type === 'building') {
      this.valuatorService.getListWithSearchObject(valuatorSearch).subscribe((res: any) => {
        this.securityValuator.buildingValuator[index] = res.detail.filter(item =>
            item.valuatingField.includes('LAND_BUILDING'));
      });
    }
  }


  ownerKycRelationInfoCheck(kycCheck, kycCheckId, index) {
    // if (kycCheckId === 'land') {
    //   this.ownerKycRelationInfoCheckedForLand = true;
    // }
    // if (kycCheckId === 'land_building') {
    //   this.ownerKycRelationInfoCheckedForLandBuilding = true;
    // }
    // if (kycCheckId === 'hypothecation') {
    //   this.ownerKycRelationInfoCheckedForHypothecation = true;
    // }
  }

  removeLandBuildingDetails(i) {
    (this.landBuildingForm.get('landBuilding') as FormArray).removeAt(i);
  }

  addLandBuilding() {
    (this.landBuildingForm.get('landBuilding') as FormArray).push(this.LandBuildingDetailsFormGroup());
  }

  public LandBuildingDetailsFormGroup() {
    return this.formBuilder.group({
      owner: [undefined, Validators.required],
      location: [undefined],
      plotNumber: [undefined],
      areaFormat: [undefined],
      area: [undefined],
      fairMarketValue: [undefined],
      distressValue: [undefined],
      description: [undefined],
      houseNumber: [undefined],
      totalBuildingArea: [undefined],
      costPerSquare: [undefined],
      totalCost: [undefined],
      buildingValuator: [undefined],
      buildingValuatorDate: [undefined],
      buildingValuatorRepresentative: [undefined],
      buildingStaffRepresentativeName: [undefined],
      buildingBranch: [undefined],
      landConsideredValue: [undefined],
      typeOfProperty: [undefined],
      ownershipTransferDate: [undefined],
      ownershipTransferThrough: [undefined],
      otherOwnershipTransferValue: undefined,
      saleOwnershipTransfer: [undefined],
      familyTransferOwnershipTransfer: [undefined],
      giftOwnershipTransfer: [undefined],
      saleRegistrationAmount: [undefined],
      familyRegistrationAmount: [undefined],
      giftRegistrationAmount: [undefined],
      ownerConstruction: undefined,
      locationConstruction: undefined,
      plotNumberConstruction: undefined,
      areaFormatConstruction: undefined,
      areaConstruction: undefined,
      marketValueConstruction: undefined,
      distressValueConstruction: undefined,
      descriptionConstruction: undefined,
      totalBuildingAreaConstruction: undefined,
      costPerSquareConstruction: undefined,
      totalCostConstruction: undefined,
      landConsideredValueConstruction: [undefined],
      underConstructionChecked: undefined,
      revaluationData: [undefined],
      landBuildingStaffRepresentativeDesignation: [undefined],
      landBuildingStaffRepresentativeDesignation2: [undefined],
      landBuildingStaffRepresentativeName2: [undefined],
      landAndBuildingSecurityLegalDocumentAddress: [undefined],
      landBuildingCollateralOwnerRelationship: [undefined],
      roadAccessBluePrint: [undefined],
      roadAccessDescribe: [undefined],
      ownerKycApplicableData: [undefined],
      progessCost: [undefined],
      landBuildingOtherBranchChecked: [undefined],
      kycCheckForLandAndBuilding: [false],
      landBuildingRate: [undefined],
      landbuildingUnderRate: [undefined],
      totalLandRealisableValue: [undefined],
      apartmentDistressValue: [undefined],
      apartmentRate: [undefined],
      totalApartmentRealisableValue: [undefined],
      governmentRate: [undefined],
      dv: [undefined],
      considerValue: [undefined],
      sheetNo: [undefined],
      province: [undefined],
      district: [undefined],
      municipalityVdc: [undefined],
      geoLocation: [undefined],
      addressLine1: [undefined],
      addressLine2: [undefined],
      registerOffice: [undefined],
      freeLimit: [undefined]
    });
  }

  public getProvince(): void {
    this.location.getProvince().subscribe((res: any) => {
      this.provinces = res.detail;
    });
  }

  public getDistrict(province: Province): void {
    this.location.getDistrictByProvince(province).subscribe((res: any) => {
      this.districtList = res.detail;
    });
  }

  public getMunicipality(district: District): void {
    this.location.getMunicipalityVDCByDistrict(district).subscribe((res: any) => {
      this.municipalityList = res.detail;
    });
  }

  public setFreeLimitAmount(index, formArrayName: string, considerValue: number) {
    if (this.isEdit === false) {
      this.landBuildingForm.get([formArrayName, index, 'freeLimit']).setValue(considerValue);
    }
  }

}
