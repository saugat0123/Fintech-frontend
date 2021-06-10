import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FixAssetCollateralComponent} from '../../fix-asset-collateral/fix-asset-collateral.component';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {ValuatorService} from '../../../../../admin/component/valuator/valuator.service';
import {BranchService} from '../../../../../admin/component/branch/branch.service';
import {Branch} from '../../../../../admin/modal/branch';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {LocalStorageUtil} from '../../../../../../@core/utils/local-storage-util';
import {SecurityValuator} from '../../../../../loan/model/securityValuator';
import {RelationshipList} from '../../../../../loan/model/relationshipList';
import {CalendarType} from '../../../../../../@core/model/calendar-type';
import {RoleService} from '../../../../../admin/component/role-permission/role.service';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../../@core/utils';
import {OwnershipTransfer} from '../../../../../loan/model/ownershipTransfer';

@Component({
  selector: 'app-land-security',
  templateUrl: './land-security.component.html',
  styleUrls: ['./land-security.component.scss']
})
export class LandSecurityComponent implements OnInit {
  landSecurityForm: FormGroup;

  @Input() customerSecurityId: number;
  @Input() calendarType: CalendarType;

  branchLists: Array<Branch> = new Array<Branch>();
  securityValuator: SecurityValuator = new SecurityValuator();
  collateralOwnerRelationshipList: RelationshipList = new RelationshipList();
  ownershipTransferEnumPair = OwnershipTransfer.enumObject();
  ownershipTransfers = OwnershipTransfer;
  dialogRef: NbDialogRef<any>;
  isOpen = false;
  landOwnerKycChecked: boolean;
  areaFormat = ['R-A-P-D', 'B-K-D', 'SQF', 'Sq.m'];
  typeOfProperty = ['Guthi', 'Lease Hold', 'Free Hold', 'Rajkar', 'Others'];
  designationList = [];
  spinner = false;

  constructor(private valuatorService: ValuatorService,
              private branchService: BranchService,
              private roleService: RoleService,
              private toastService: ToastService,
              private nbDialogService: NbDialogService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    this.getAllBranchList();
    this.getRoleList();
  }

  private buildForm(): FormGroup {
    return this.landSecurityForm = this.formBuilder.group({
      description: [undefined],
      landSecurity: this.formBuilder.array([this.landSecurityFormGroup()]),
    });
  }

  private landSecurityFormGroup(): FormGroup {
    return this.formBuilder.group({
      owner: [undefined],
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
      landOwnerKyc: [undefined],
    });
  }

  public close(): void {
    if (this.isOpen) {
      this.dialogRef.close();
      this.isOpen = false;
    }
  }

  public addMoreLand(): void {
    (this.landSecurityForm.get('landSecurity') as FormArray).push(this.landSecurityFormGroup());
  }

  public removeLandSecurity(index): void {
    (<FormArray>this.landSecurityForm.get('landSecurity')).removeAt(index);
  }

  public valuator(index: number) {
    const branchSearchObj = {
      'branchIds': LocalStorageUtil.getStorage().branch
    };
    if (!ObjectUtil.isEmpty(branchSearchObj.branchIds)) {
      this.valuatorService.getListWithSearchObject(branchSearchObj).subscribe((res: any) => {
        this.securityValuator.landValuator[index] = res.detail;
      });
    }
  }

  private getAllBranchList(): void {
    this.branchService.getAll().subscribe((res: any) => {
      this.branchLists = res.detail;
    });
  }

  private getRoleList(): void {
    this.spinner = true;
    this.roleService.getAll().subscribe(res => {
      this.designationList = res.detail;
      this.spinner = false;
    }, (error) => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Error While Fetching List'));
      this.spinner = false;
    });
  }

  public resetOtherTransferParameter(formArray, index: number, resetAmountOnly: boolean): void {
    this.landSecurityForm.get([formArray, index, 'saleRegistrationAmount']).patchValue(undefined);
    this.landSecurityForm.get([formArray, index, 'familyRegistrationAmount']).patchValue(undefined);
    this.landSecurityForm.get([formArray, index, 'giftRegistrationAmount']).patchValue(undefined);
    if (resetAmountOnly) {
      return;
    }
    this.landSecurityForm.get([formArray, index, 'saleOwnershipTransfer']).patchValue(undefined);
    this.landSecurityForm.get([formArray, index, 'familyTransferOwnershipTransfer']).patchValue(undefined);
    this.landSecurityForm.get([formArray, index, 'giftOwnershipTransfer']).patchValue(undefined);

  }

  public landOwnerKycCheck(event, index: number): void {
    const val = this.landOwnerKycChecked = event;
    this.landSecurityForm.get(['landSecurity', index, 'landOwnerKyc']).setValue(val);
  }

  public openSiteVisitModel(security: string): void {
    this.close();
    const context = {
      securityId: this.customerSecurityId,
      security: security
    };
    this.dialogRef = this.nbDialogService.open(FixAssetCollateralComponent, {
      context,
      closeOnBackdropClick: false,
      hasBackdrop: false,
      hasScroll: true
    });
    this.isOpen = true;
  }

}
