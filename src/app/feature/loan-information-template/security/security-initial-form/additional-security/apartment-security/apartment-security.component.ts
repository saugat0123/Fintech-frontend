import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {FixAssetCollateralComponent} from '../../fix-asset-collateral/fix-asset-collateral.component';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {Branch} from '../../../../../admin/modal/branch';
import {SecurityValuator} from '../../../../../loan/model/securityValuator';
import {LocalStorageUtil} from '../../../../../../@core/utils/local-storage-util';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {ValuatorService} from '../../../../../admin/component/valuator/valuator.service';
import {BranchService} from '../../../../../admin/component/branch/branch.service';
import {CalendarType} from '../../../../../../@core/model/calendar-type';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {RoleService} from '../../../../../admin/component/role-permission/role.service';
import {ToastService} from '../../../../../../@core/utils';

@Component({
  selector: 'app-apartment-security',
  templateUrl: './apartment-security.component.html',
  styleUrls: ['./apartment-security.component.scss']
})
export class ApartmentSecurityComponent implements OnInit {
  @Input() customerSecurityId: number;
  @Input() calendarType: CalendarType;

  apartmentSecurityForm: FormGroup;

  underConstructionChecked = false;
  isOpen = false;
  spinner = false;
  dialogRef: NbDialogRef<any>;
  branchLists: Array<Branch> = new Array<Branch>();
  securityValuator: SecurityValuator = new SecurityValuator();
  designationList = [];


  constructor(private nbDialogService: NbDialogService,
              private toastService: ToastService,
              private valuatorService: ValuatorService,
              private branchService: BranchService,
              private roleService: RoleService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    this.getAllBranchList();
    this.getDesignationListForApartment();
  }
  public underConstruction(checkedStatus): void {
    this.underConstructionChecked = !!checkedStatus;
  }

  private buildForm(): FormGroup {
    return this.apartmentSecurityForm = this.formBuilder.group({
      checkUnderConstruction: [undefined],
      buildingDetailsDescription: [undefined],
      apartmentSecurity: this.formBuilder.array([this.buildingApartmentFormGroup()]),
      apartmentUnderConstructions: this.formBuilder.array([this.buildApartmentUnderConstructionsFormGroup()]),
    });
  }

  private buildingApartmentFormGroup(): FormGroup {
    return this.formBuilder.group({
      buildingName: [undefined],
      buildingDescription: [undefined],
      buildArea: [undefined],
      buildRate: [undefined],
      totalCost: [undefined],
      floorName: [undefined],
      valuationArea: [undefined],
      ratePerSquareFeet: [undefined],
      estimatedCost: [undefined],
      waterSupply: [undefined],
      waterSupplyPercent: [undefined],
      sanitationPercent: [undefined],
      electrificationPercent: [undefined],
      sanitation: [undefined],
      electrification: [undefined],
      buildingTotalCost: [undefined],
      buildingFairMarketValue: [undefined],
      buildingDistressValue: [undefined],
      buildingDetailsDescription: [undefined],
      ApartmentValuator: [undefined],
      ApartmentValuatorDate: [undefined],
      ApartmentValuatorRepresentative: [undefined],
      ApartmentStaffRepresentativeName: [undefined],
      apartmentBranch: [undefined],
      revaluationData: [undefined],
      apartmentStaffRepresentativeDesignation: [undefined],
      apartmentStaffRepresentativeDesignation2: [undefined],
      apartmentStaffRepresentativeName2: [undefined],
      apartmentOtherBranchChecked: [undefined],
    });
  }

  public addApartmentForm(): void {
    (this.apartmentSecurityForm.get('apartmentSecurity') as FormArray).push(this.buildingApartmentFormGroup());
  }

  public removeApartmentForm(index: number): void {
    (this.apartmentSecurityForm.get('apartmentSecurity') as FormArray).removeAt(index);
  }

  private buildApartmentUnderConstructionsFormGroup(): FormGroup {
        return this.formBuilder.group({
          buildingDetailsBeforeCompletion: this.formBuilder.group({
            buildingName: [undefined],
            buildingDescription: [undefined],
            buildArea: [undefined],
            buildRate: [undefined],
            totalCost: [undefined],
            floorName: [undefined],
            valuationArea: [undefined],
            ratePerSquareFeet: [undefined],
            estimatedCost: [undefined],
            waterSupply: [undefined],
            beforeWaterSupplyPercent: [undefined],
            beforeSanitationPercent: [undefined],
            electrificationPercent: [undefined],
            sanitation: [undefined],
            electrification: [undefined],
            buildingTotalCost: [undefined],
            buildingFairMarketValue: [undefined],
            buildingDistressValue: [undefined]
          }),
          buildingDetailsAfterCompletion: this.formBuilder.group({
            buildingName: [undefined],
            buildingDescription: [undefined],
            buildArea: [undefined],
            buildRate: [undefined],
            totalCost: [undefined],
            floorName: [undefined],
            valuationArea: [undefined],
            ratePerSquareFeet: [undefined],
            estimatedCost: [undefined],
            afterWaterSupplyPercent: [undefined],
            afterSanitationPercent: [undefined],
            electrificationPercent: [undefined],
            waterSupply: [undefined],
            sanitation: [undefined],
            electrification: [undefined],
            buildingTotalCost: [undefined],
            buildingFairMarketValue: [undefined],
            buildingDistressValue: [undefined]

          })
        });
  }

  public addApartmentBuildingUnderConstructions(): void {
    (this.apartmentSecurityForm.get('apartmentUnderConstructions') as FormArray).push(this.buildApartmentUnderConstructionsFormGroup());
  }

  public removeApartmentUnderConstructions(index): void {
    (this.apartmentSecurityForm.get('apartmentUnderConstructions') as FormArray).removeAt(index);
  }

  public close() {
    if (this.isOpen) {
      this.dialogRef.close();
      this.isOpen = false;
    }
  }

  private getAllBranchList(): void {
    this.branchService.getAll().subscribe((res: any) => {
      this.branchLists = res.detail;
    });
  }

  private getDesignationListForApartment(): void {
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

  openSiteVisitModel(security: string) {
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
