import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';
import {CustomerType} from '../../../customer/model/customerType';
import {ToastService} from '../../../../@core/utils';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {ValuatorService} from '../../../admin/component/valuator/valuator.service';
import {SecurityValuator} from '../../../loan/model/securityValuator';
import {BranchService} from '../../../admin/component/branch/branch.service';
import {RelationshipList} from '../../../loan/model/relationshipList';
import {CalendarType} from '../../../../@core/model/calendar-type';
import {RoleService} from '../../../admin/component/role-permission/role.service';
import {OwnershipTransfer} from '../../../loan/model/ownershipTransfer';
import {Security} from '../../../loan/model/security';

@Component({
  selector: 'app-land',
  templateUrl: './land.component.html',
  styleUrls: ['./land.component.scss']
})
export class LandComponent implements OnInit {
  @Input() customerType: CustomerType;
  landForm: FormGroup;
  submitted = false;
  loanList = [];
  areaFormat = ['R-A-P-D', 'B-K-D', 'SQF', 'Sq.m'];
  typeOfProperty = ['Guthi', 'Lease Hold', 'Free Hold', 'Rajkar', 'Others'];
  totaldv = 0;
  totalmv = 0;
  totalcv = 0;
  securityValuator: SecurityValuator = new SecurityValuator();
  landOtherBranchChecked = false;
  branchLists;
  collateralOwnerRelationshipList: RelationshipList = new RelationshipList();
  @Input() calendarType: CalendarType;
  designationList = [];
  spinner = false;
  newOwnerShipTransfer = [];
  ownershipTransferEnumPair = OwnershipTransfer.enumObject();
  ownershipTransfers = OwnershipTransfer;
  @Input() security: Security;
  @Input() isEdit = false;


  constructor(private loanConfigService: LoanConfigService,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private valuatorService: ValuatorService,
              private branchService: BranchService,
              private roleService: RoleService) { }

  ngOnInit() {
    this.buildForm();
    // this.getLoanConfig();
    this.branchList();
    this.getRoleList();
    this.reArrangeEnumType();
    if (this.isEdit) {
      this.setLandDetail();
    } else {
      this.addMoreLand();
    }
  }

  setLandDetail() {
    const formData = JSON.parse(this.security.data);
    const landForm = this.landForm.get('landDetails') as FormArray;
    landForm.push(
        this.formBuilder.group({
          owner: [formData.owner],
          location: [formData.location],
          plotNumber: [formData.plotNumber],
          areaFormat: [formData.areaFormat],
          area: [formData.area],
          fairMarketValue: [formData.fairMarketValue],
          distressValue: [formData.distressValue],
          considerValue: [formData.considerValue],
          description: [formData.description],
          landValuator: [formData.landValuator],
          landValuatorDate: [formData.landValuatorDate ? new Date(formData.landValuatorDate) : ''],
          landValuatorRepresentative: [formData.landValuatorRepresentative],
          landStaffRepresentativeName: [formData.landStaffRepresentativeName],
          landBranch: [formData.landBranch],
          landConsideredValue: [formData.landConsideredValue],
          typeOfProperty: [formData.typeOfProperty],
          revaluationData: [formData.revaluationData],
          landStaffRepresentativeDesignation: [formData.landStaffRepresentativeDesignation],
          landStaffRepresentativeName2: [formData.landStaffRepresentativeName2],
          landStaffRepresentativeDesignation2: [formData.landStaffRepresentativeDesignation2],
          landSecurityLegalDocumentAddress: [formData.landSecurityLegalDocumentAddress],
          ownershipTransferDate: [formData.ownershipTransferDate ? new Date(formData.ownershipTransferDate) : ''],
          ownershipTransferThrough: [formData.ownershipTransferThrough],
          otherOwnershipTransferValue: [formData.otherOwnershipTransferValue],
          saleOwnershipTransfer: [formData.saleOwnershipTransfer],
          familyTransferOwnershipTransfer: [formData.familyTransferOwnershipTransfer],
          giftOwnershipTransfer: [formData.giftOwnershipTransfer],
          saleRegistrationAmount: [formData.saleRegistrationAmount],
          familyRegistrationAmount: [formData.familyRegistrationAmount],
          giftRegistrationAmount: [formData.giftRegistrationAmount],
          landCollateralOwnerRelationship: [formData.landCollateralOwnerRelationship],
          roadAccessBluePrint: [formData.roadAccessBluePrint],
          roadAccessDescribe: [formData.roadAccessDescribe],
          ownerKycApplicableData: [formData.ownerKycApplicableData],
          landOtherBranchChecked: [formData.landOtherBranchChecked],
          kycCheckForLand: [formData.kycCheckForLand],
          landRate: [formData.landRate],
          landFirstValuationDate: [formData.landFirstValuationDate ? new Date(formData.landFirstValuationDate) : ''],
          isValuated: [formData.isValuated]
        })
    );
  }

  private buildForm(): FormGroup {
    return this.landForm = this.formBuilder.group({
      landCrossChecked: [undefined],
      landExposureTotal: [undefined],
      landRmValueTotal: [undefined],
      landFmvOfFacTotal: [undefined],
      description: [undefined],
      totalLandValueRemarks: [undefined],
      landCross: this.formBuilder.array([]),
      landDetails: this.formBuilder.array([]),
    });
  }

  public reArrangeEnumType(): void {
    const other = this.ownershipTransferEnumPair.filter(value => value.value.toString() === 'Other');
    const index = this.ownershipTransferEnumPair.indexOf(other[0]);
    this.ownershipTransferEnumPair.splice(index, 1);
    this.newOwnerShipTransfer = this.ownershipTransferEnumPair.concat(other);
  }

  public getRoleList(): void {
    this.spinner = true;
    this.roleService.getAll().subscribe(res => {
      this.designationList = res.detail;
      this.spinner = false;
    }, error => {
      this.toastService.show(new Alert(AlertType.ERROR, 'Error While Fetching List'));
      this.spinner = false;
    });
  }

  public branchList(): void {
    this.branchService.getAll().subscribe((res: any) => {
      this.branchLists = res.detail;
    });
  }

  public getLoanConfig(): void {
    this.loanConfigService.getAllByLoanCategory(this.customerType).subscribe((res: any) => {
      this.loanList = res.detail;
    }, error => {
      this.toastService.show(new Alert(AlertType.DANGER, '!!OPPS something went wrong while fetching data'));
    });
  }

  public checkedChange(event, value): void {
    if (value === 'landCross') {
      this.landForm.get('landCrossChecked').patchValue(event);
    }
    const sec = this.landForm.get(value) as FormArray;
    sec.clear();
    this.calculateTotalCross(value);
  }

  public calculateTotalCross(security) {
    let totalExposure = 0;
    let totalRmValue = 0;
    let totalFMV = 0;
    const crossData = this.landForm.get(security) as FormArray;
    crossData.value.forEach(cd => {
      totalExposure += cd.totalExposure;
      totalRmValue += cd.rmValue;
      totalFMV += cd.fmvApportion;
    });
    if (security === 'landCross') {
      this.landForm.get('landExposureTotal').patchValue(totalExposure);
      this.landForm.get('landRmValueTotal').patchValue(totalRmValue);
      this.landForm.get('landFmvOfFacTotal').patchValue(totalFMV);
    }
  }

  public removeCrossCollateralized(securityType: string, cin: number): void {
    (<FormArray>this.landForm.get(securityType)).removeAt(cin);
    this.calculateTotalCross(securityType);
  }

  public addCrossCollateralized(arrayName): void {
    (this.landForm.get(arrayName) as FormArray).push(this.crossCollateralizedFormGroup());
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
    const landDetails = this.landForm.get('landDetails') as FormArray;
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

  public calConsiderValue(type, index): void {
    if (type === 'land') {
      const considerValue = (Number(this.landForm.get(['landDetails', index, 'distressValue']).value)
          * (Number(this.landForm.get(['landDetails', index, 'landRate']).value)) / 100);
      this.landForm.get(['landDetails', index, 'landConsideredValue']).patchValue(considerValue);
    }
    this.updateLandSecurityTotal();
  }

  public valuator(branchId, type: string, index: number): void {
    if ((this.landOtherBranchChecked) && ObjectUtil.isEmpty(branchId)) {
      return;
    }
    const valuatorSearch = {
      'branchIds': LocalStorageUtil.getStorage().branch
    };
    if (!ObjectUtil.isEmpty(branchId)) {
      valuatorSearch.branchIds = JSON.stringify(branchId);
    }
    if (type === 'land') {
      this.valuatorService.getListWithSearchObject(valuatorSearch).subscribe((res: any) => {
        this.securityValuator.landValuator[index] = res.detail.filter(item => item.valuatingField.includes('LAND'));
      });
    }
  }

  public resetOtherTransferParameter(formArray, index: number, resetAmountOnly: boolean): void {
    this.landForm.get([formArray, index, 'saleRegistrationAmount']).patchValue(undefined);
    this.landForm.get([formArray, index, 'familyRegistrationAmount']).patchValue(undefined);
    this.landForm.get([formArray, index, 'giftRegistrationAmount']).patchValue(undefined);
    if (resetAmountOnly) {
      return;
    }
    this.landForm.get([formArray, index, 'saleOwnershipTransfer']).patchValue(undefined);
    this.landForm.get([formArray, index, 'familyTransferOwnershipTransfer']).patchValue(undefined);
    this.landForm.get([formArray, index, 'giftOwnershipTransfer']).patchValue(undefined);

  }

  public removeLandDetails(index: number): void {
    (<FormArray>this.landForm.get('landDetails')).removeAt(index);
    this.updateLandSecurityTotal();
  }

  public addMoreLand(): void {
    (this.landForm.get('landDetails') as FormArray).push(this.landDetailsFormGroup());
  }

  public landDetailsFormGroup(): FormGroup {
    return this.formBuilder.group({
      owner: [undefined, Validators.required],
      location: [undefined],
      plotNumber: [undefined],
      areaFormat: [undefined],
      area: [undefined],
      fairMarketValue: [undefined],
      distressValue: [undefined],
      considerValue: [undefined],
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
      ownershipTransferDate: undefined,
      ownershipTransferThrough: undefined,
      otherOwnershipTransferValue: undefined,
      saleOwnershipTransfer: undefined,
      familyTransferOwnershipTransfer: undefined,
      giftOwnershipTransfer: undefined,
      saleRegistrationAmount: undefined,
      familyRegistrationAmount: undefined,
      giftRegistrationAmount: undefined,
      landCollateralOwnerRelationship: undefined,
      roadAccessBluePrint: undefined,
      roadAccessDescribe: undefined,
      ownerKycApplicableData: [undefined],
      landOtherBranchChecked: [undefined],
      kycCheckForLand: [false],
      landRate: [undefined],
      landFirstValuationDate: [undefined],
      isValuated: [undefined]
    });
  }

}
