import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CalendarType} from '../../../../../../@core/model/calendar-type';
import {FixAssetCollateralComponent} from '../../fix-asset-collateral/fix-asset-collateral.component';
import {ValuatorService} from '../../../../../admin/component/valuator/valuator.service';
import {BranchService} from '../../../../../admin/component/branch/branch.service';
import {RoleService} from '../../../../../admin/component/role-permission/role.service';
import {ToastService} from '../../../../../../@core/utils';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {Branch} from '../../../../../admin/modal/branch';
import {SecurityValuator} from '../../../../../loan/model/securityValuator';
import {LocalStorageUtil} from '../../../../../../@core/utils/local-storage-util';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {RelationshipList} from '../../../../../loan/model/relationshipList';
import {OwnershipTransfer} from '../../../../../loan/model/ownershipTransfer';

@Component({
  selector: 'app-land-and-building-security',
  templateUrl: './land-and-building-security.component.html',
  styleUrls: ['./land-and-building-security.component.scss']
})
export class LandAndBuildingSecurityComponent implements OnInit {
  @Input() calendarType: CalendarType;
  @Input() customerSecurityId: number;

  landBuildingSecurityForm: FormGroup;
  collateralOwnerRelationshipList: RelationshipList = new RelationshipList();
  branchLists: Array<Branch> = new Array<Branch>();
  securityValuator: SecurityValuator = new SecurityValuator();
  ownershipTransferEnumPair = OwnershipTransfer.enumObject();
  ownershipTransfers = OwnershipTransfer;
  dialogRef: NbDialogRef<any>;
  designationList = [];
  areaFormat = ['R-A-P-D', 'B-K-D', 'SQF', 'Sq.m'];
  typeOfProperty = ['Guthi', 'Lease Hold', 'Free Hold', 'Rajkar', 'Others'];
  spinner = false;
  isOpen = false;

  constructor(private valuatorService: ValuatorService,
              private branchService: BranchService,
              private roleService: RoleService,
              private toastService: ToastService,
              private nbDialogService: NbDialogService,
              private formBuilder: FormBuilder ) { }

  ngOnInit() {
    this.buildForm();
    this.getRoleList();
    this.getAllBranchList();
  }

  private buildForm(): FormGroup {
    return this.landBuildingSecurityForm = this.formBuilder.group({
      landBuildingDescription: [undefined],
      landBuildingSecurity: this.formBuilder.array([this.landBuildingDetailsFormGroup()]),
    });
  }

 private landBuildingDetailsFormGroup(): FormGroup {
    return this.formBuilder.group({
      landBuildingOwnerKyc: [undefined],
      owner: [undefined],
      location: undefined,
      plotNumber: undefined,
      areaFormat: undefined,
      area: undefined,
      marketValue: undefined,
      distressValue: undefined,
      description: undefined,
      houseNumber: [undefined],
      totalBuildingArea: [undefined],
      costPerSquare: undefined,
      totalCost: undefined,
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
      landBuildingOtherBranchChecked: [undefined]
    });
  }

  public removeLandBuildingForm(i): void {
    (this.landBuildingSecurityForm.get('landBuildingSecurity') as FormArray).removeAt(i);
  }

  public addLandBuildingForm(): void {
    (this.landBuildingSecurityForm.get('landBuildingSecurity') as FormArray).push(this.landBuildingDetailsFormGroup());
  }

  public valuator(index: number): void {
    const branchSearchObj = {
      'branchIds': LocalStorageUtil.getStorage().branch
    };
    if (!ObjectUtil.isEmpty(branchSearchObj.branchIds)) {
      this.valuatorService.getListWithSearchObject(branchSearchObj).subscribe((res: any) => {
        this.securityValuator.landValuator[index] = res.detail;
      });
    }
  }

  public landBuildingOwnerInfoCheck(event, index: number): void {
    this.landBuildingSecurityForm.get(['landBuildingSecurity', index, 'landBuildingOwnerKyc']).setValue(event);
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
    this.landBuildingSecurityForm.get([formArray, index, 'saleRegistrationAmount']).patchValue(undefined);
    this.landBuildingSecurityForm.get([formArray, index, 'familyRegistrationAmount']).patchValue(undefined);
    this.landBuildingSecurityForm.get([formArray, index, 'giftRegistrationAmount']).patchValue(undefined);
    if (resetAmountOnly) {
      return;
    }
    this.landBuildingSecurityForm.get([formArray, index, 'saleOwnershipTransfer']).patchValue(undefined);
    this.landBuildingSecurityForm.get([formArray, index, 'familyTransferOwnershipTransfer']).patchValue(undefined);
    this.landBuildingSecurityForm.get([formArray, index, 'giftOwnershipTransfer']).patchValue(undefined);

  }

  public close(): void {
    if (this.isOpen) {
      this.dialogRef.close();
      this.isOpen = false;
    }
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
