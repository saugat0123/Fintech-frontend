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
  apartmentOtherBranchChecked = false;
  landBuildingOtherBranchChecked = false;
  vehicleOtherBranchChecked = false;
  plantOtherBranchChecked = false;
  landOtherBranchChecked = false;
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

  constructor(private formBuilder: FormBuilder,
              private loanConfigService: LoanConfigService,
              private toastService: ToastService,
              private valuatorService: ValuatorService,
              private branchService: BranchService,
              private roleService: RoleService) { }

  ngOnInit() {
    this.buildForm();
    this.getLoanConfig();
    this.branchList();
    this.getRoleList();
    this.reArrangeEnumType();
  }

  private buildForm(): FormGroup {
    return this.landBuildingForm = this.formBuilder.group({
      landDetails: this.formBuilder.array([]),
      landCross: this.formBuilder.array([]),
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
    switch (value) {
      case 'landCross':
        if (event) {
          this.landBuildingForm.get('landCrossChecked').patchValue(event);
        } else {
          this.landBuildingForm.get('landCrossChecked').patchValue(event);
        }
        break;
      case 'lbCross':
        if (event) {
          this.landBuildingForm.get('lbCrossChecked').patchValue(event);
        } else {
          this.landBuildingForm.get('lbCrossChecked').patchValue(event);
        }
        break;
      case 'apartmentCross':
        if (event) {
          this.landBuildingForm.get('apartmentCrossChecked').patchValue(event);
        } else {
          this.landBuildingForm.get('apartmentCrossChecked').patchValue(event);
        }
        break;
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
    switch (security) {
      case 'landCross':
        this.landBuildingForm.get('landExposureTotal').patchValue(totalExposure);
        this.landBuildingForm.get('landRmValueTotal').patchValue(totalRmValue);
        this.landBuildingForm.get('landFmvOfFacTotal').patchValue(totalFMV);
        break;
      case 'lbCross':
        this.landBuildingForm.get('lbExposureTotal').patchValue(totalExposure);
        this.landBuildingForm.get('lbRmValueTotal').patchValue(totalRmValue);
        this.landBuildingForm.get('lbFmvOfFacTotal').patchValue(totalFMV);
        break;
      case 'apartmentCross':
        this.landBuildingForm.get('apartmentExposureTotal').patchValue(totalExposure);
        this.landBuildingForm.get('apartmentRmValueTotal').patchValue(totalRmValue);
        this.landBuildingForm.get('apartmentFmvOfFacTotal').patchValue(totalFMV);
        break;
    }
  }

  public removeCrossCollateralized(securityType: string, index: number) {
    (<FormArray>this.landBuildingForm.get(securityType)).removeAt(index);
    this.calculateTotalCross(securityType);
  }

  public addCrossCollateralized(arrayName) {
    (this.landBuildingForm.get(arrayName) as FormArray).push(this.crossCollateralizedFormGroup());
  }


  private crossCollateralizedFormGroup(): FormGroup {
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
    const landDetails = this.landBuildingForm.get('landDetails') as FormArray;
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
        this.totalmv += Number(sec['marketValue']);
        this.totalcv += Number(sec['landConsideredValue']);
      }

    });
  }

  public calConsiderValue(type, index): void {
    switch (type) {
      case 'land':
        const considerValue = (Number(this.landBuildingForm.get(['landDetails', index, 'distressValue']).value)
            * (Number(this.landBuildingForm.get(['landDetails', index, 'landRate']).value)) / 100);
        this.landBuildingForm.get(['landDetails', index, 'landConsideredValue']).patchValue(considerValue);
        break;
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

  public valuator(branchId, type: string, index: number): void {
    if ((this.landOtherBranchChecked || this.landBuildingOtherBranchChecked || this.apartmentOtherBranchChecked ||
        this.vehicleOtherBranchChecked || this.plantOtherBranchChecked) && ObjectUtil.isEmpty(branchId)) {
      return;
    }
    const valuatorSearch = {
      'branchIds': LocalStorageUtil.getStorage().branch
    };
    if (!ObjectUtil.isEmpty(branchId)) {
      valuatorSearch.branchIds = JSON.stringify(branchId);
    }
    switch (type) {
      case 'land':
        this.valuatorService.getListWithSearchObject(valuatorSearch).subscribe((res: any) => {
          this.securityValuator.landValuator[index] = res.detail.filter(item => item.valuatingField.includes('LAND'));
        });
        break;
      case 'apartment':
        this.valuatorService.getListWithSearchObject(valuatorSearch).subscribe((res: any) => {
          this.securityValuator.apartmentValuator[index] = res.detail;
        });
        break;
      case 'vehicle':
        this.valuatorService.getListWithSearchObject(valuatorSearch).subscribe((res: any) => {
          this.securityValuator.vehicalValuator[index] = res.detail.filter(item => item.valuatingField.includes('VEHICLE'));
        });
        break;
      case 'plant':
        this.valuatorService.getListWithSearchObject(valuatorSearch).subscribe((res: any) => {
          this.securityValuator.plantValuator[index] = res.detail;
        });
        break;
      case  'building':
        this.valuatorService.getListWithSearchObject(valuatorSearch).subscribe((res: any) => {
          this.securityValuator.buildingValuator[index] = res.detail.filter(item =>
              item.valuatingField.includes('LAND_BUILDING'));
        });
        break;
    }
  }

  public resetOtherTransferParameter(formArray, index: number, resetAmountOnly: boolean): void {
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

  public removeLandDetails(index: number): void {
    (<FormArray>this.landBuildingForm.get('landDetails')).removeAt(index);
    this.updateLandSecurityTotal();
  }

  public addMoreLand(): void {
    (this.landBuildingForm.get('landDetails') as FormArray).push(this.landDetailsFormGroup());
  }

  private landDetailsFormGroup(): FormGroup {
    return this.formBuilder.group({
      owner: [undefined, Validators.required],
      location: [undefined],
      plotNumber: [undefined],
      areaFormat: [undefined],
      area: [undefined],
      marketValue: [undefined],
      distressValue: [undefined],
      description: [undefined],
      landValuator: [undefined],
      landValuatorDate: [undefined],
      landValuatorRepresentative: [undefined],
      landStaffRepresentativeName: [undefined],
      landBranch: [undefined],
      landConsideredValue: [undefined],
      typeOfProperty: [undefined],
      revaluationData: [{isReValuated: false, reValuatedDv: 0, reValuatedFmv: 0, reValuatedConsideredValue: 0}],
      landStaffRepresentativeDesignation: [undefined],
      landStaffRepresentativeName2: [undefined],
      landStaffRepresentativeDesignation2: [undefined],
      landSecurityLegalDocumentAddress: [undefined],
      ownershipTransferDate: [undefined],
      ownershipTransferThrough: [undefined],
      otherOwnershipTransferValue: [undefined],
      saleOwnershipTransfer: [undefined],
      familyTransferOwnershipTransfer: [undefined],
      giftOwnershipTransfer: [undefined],
      saleRegistrationAmount: [undefined],
      familyRegistrationAmount: [undefined],
      giftRegistrationAmount: [undefined],
      landCollateralOwnerRelationship: [undefined],
      roadAccessBluePrint: [undefined],
      roadAccessDescribe: [undefined],
      ownerKycApplicableData: [undefined],
      landOtherBranchChecked: [undefined],
      kycCheckForLand: [false],
      landRate: [undefined],
    });
  }

}
