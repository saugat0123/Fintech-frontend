import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {ValuatorService} from '../../../admin/component/valuator/valuator.service';
import {SecurityValuator} from '../../../loan/model/securityValuator';
import {BranchService} from '../../../admin/component/branch/branch.service';
import {CalendarType} from '../../../../@core/model/calendar-type';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {RoleService} from '../../../admin/component/role-permission/role.service';
import {ToastService} from '../../../../@core/utils';
import {CustomerType} from '../../../customer/model/customerType';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';
import {Security} from '../../../loan/model/security';

@Component({
  selector: 'app-apartment',
  templateUrl: './apartment.component.html',
  styleUrls: ['./apartment.component.scss']
})
export class ApartmentComponent implements OnInit {
  underConstructionChecked = false;
  dialogRef: NbDialogRef<any>;
  isOpen = false;
  @Input() customerSecurityId;
  @Input() customerType: CustomerType;
  @Input() calendarType: CalendarType;
  apartmentOtherBranchChecked = false;
  securityValuator: SecurityValuator = new SecurityValuator();
  branchLists;
  designationList = [];
  loanList = [];
  spinner = false;
  submitted = false;
  apartmentForm: FormGroup;

  @Input() security: Security;
  @Input() isEdit = false;

  constructor(private formBuilder: FormBuilder,
              private nbDialogService: NbDialogService,
              private valuatorService: ValuatorService,
              private branchService: BranchService,
              private roleService: RoleService,
              private toastService: ToastService,
              private loanConfigService: LoanConfigService) { }

  ngOnInit() {
    this.buildForm();
    this.branchList();
    this.getRoleList();
    // this.getLoanConfig();
    if (this.isEdit) {
      this.setBuilding();
    } else {
      this.addBuilding();
    }
  }

  setBuilding() {
    const formData = JSON.parse(this.security.data);
    const buildingForm = this.apartmentForm.get('buildingDetails') as FormArray;
    buildingForm.push(
        this.formBuilder.group({
          model: [formData.model],
          buildingName: [formData.buildingName],
          buildingDescription: [formData.buildingDescription],
          buildArea: [formData.buildArea],
          buildRate: [formData.buildRate],
          totalCost: [formData.totalCost],
          floorName: [formData.floorName],
          valuationArea: [formData.valuationArea],
          ratePerSquareFeet: [formData.ratePerSquareFeet],
          estimatedCost: [formData.estimatedCost],
          waterSupply: [formData.waterSupply],
          waterSupplyPercent: [formData.waterSupplyPercent],
          sanitationPercent: [formData.sanitationPercent],
          electrificationPercent: [formData.electrificationPercent],
          sanitation: [formData.sanitation],
          electrification: [formData.electrification],
          buildingTotalCost: [formData.buildingTotalCost],
          fairMarketValue: [formData.fairMarketValue],
          considerValue: [formData.considerValue],
          distressValue: [formData.distressValue],
          buildingDistressValue: [formData.buildingDistressValue],
          buildingDetailsDescription: [formData.buildingDetailsDescription],
          ApartmentValuator: [formData.ApartmentValuator],
          ApartmentValuatorDate: [formData.ApartmentValuatorDate ? new Date(formData.ApartmentValuatorDate) : ''],
          ApartmentValuatorRepresentative: [formData.ApartmentValuatorRepresentative],
          ApartmentStaffRepresentativeName: [formData.ApartmentStaffRepresentativeName],
          apartmentBranch: [formData.apartmentBranch],
          revaluationData: [formData.revaluationData],
          apartmentStaffRepresentativeDesignation: [formData.apartmentStaffRepresentativeDesignation],
          apartmentStaffRepresentativeDesignation2: [formData.apartmentStaffRepresentativeDesignation2],
          apartmentStaffRepresentativeName2: [formData.apartmentStaffRepresentativeName2],
          apartmentOtherBranchChecked: [formData.apartmentOtherBranchChecked],
          proposedOwner: [formData.proposedOwner],
          apartmentRate: [formData.apartmentRate],
          buildingReliasableValue: [formData.buildingReliasableValue],
          apartmentFirstValuationDate: [formData.apartmentFirstValuationDate ? new Date(formData.apartmentFirstValuationDate) : ''],
          isValuated: [formData.isValuated]
        })
    );

  }

  private buildForm(): FormGroup {
    return this.apartmentForm = this.formBuilder.group({
      underConstructionCheck: [undefined],
      apartmentCrossChecked: [undefined],
      apartmentExposureTotal: [undefined],
      apartmentRmValueTotal: [undefined],
      apartmentFmvOfFacTotal: [undefined],
      buildingDetailsDescription: [undefined],
      buildingDetails: this.formBuilder.array([]),
      buildingUnderConstructions: this.formBuilder.array([]),
      apartmentCross: this.formBuilder.array([]),
    });
  }

  private getLoanConfig(): void {
    this.loanConfigService.getAllByLoanCategory(this.customerType).subscribe((res: any) => {
      this.loanList = res.detail;
    }, error => {
      this.toastService.show(new Alert(AlertType.DANGER, 'Could not load data!!!'));
    });
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

  public underConstruction(checkedStatus): void {
    this.underConstructionChecked = !!checkedStatus;
  }

  public checkedChange(event, value): void {
    if (value === 'apartmentCross') {
      if (event) {
        this.apartmentForm.get('apartmentCrossChecked').patchValue(event);
      } else {
        this.apartmentForm.get('apartmentCrossChecked').patchValue(event);
      }
    }
    const sec = this.apartmentForm.get(value) as FormArray;
    sec.clear();
    this.calculateTotalCross(value);
  }

  public removeBuildingDetails(index: number): void {
    (this.apartmentForm.get('buildingDetails') as FormArray).removeAt(index);
  }

  public addBuilding(): void {
    (this.apartmentForm.get('buildingDetails') as FormArray).push(this.buildingDetailsFormGroup());
  }

  public buildingDetailsFormGroup(): FormGroup {
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
      fairMarketValue: [undefined],
      considerValue: [undefined],
      distressValue: [undefined],
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
      proposedOwner: [undefined],
      apartmentRate: [undefined],
      buildingReliasableValue: [undefined],
      apartmentFirstValuationDate: [undefined],
      isValuated: [undefined]
    });
  }

  removeBuildingUnderConstructions(index: number) {
    (this.apartmentForm.get('buildingUnderConstructions') as FormArray).removeAt(index);
  }

  addBuildingUnderConstructions() {
    const underConstruct = this.apartmentForm.get('buildingUnderConstructions') as FormArray;
    underConstruct.push(
        this.formBuilder.group({
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
            waterSupplyPercent: [undefined],
            sanitationPercent: [undefined],
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
            waterSupplyPercent: [undefined],
            sanitationPercent: [undefined],
            electrificationPercent: [undefined],
            waterSupply: [undefined],
            sanitation: [undefined],
            electrification: [undefined],
            buildingTotalCost: [undefined],
            buildingFairMarketValue: [undefined],
            buildingDistressValue: [undefined]

          })
        })
    );
  }

  public calculateTotalCross(security): void {
    let totalExposure = 0;
    let totalRmValue = 0;
    let totalFMV = 0;
    const crossData = this.apartmentForm.get(security) as FormArray;
    crossData.value.forEach(cd => {
      totalExposure += cd.totalExposure;
      totalRmValue += cd.rmValue;
      totalFMV += cd.fmvApportion;
    });
    if (security === 'apartmentCross') {
      this.apartmentForm.get('apartmentExposureTotal').patchValue(totalExposure);
      this.apartmentForm.get('apartmentRmValueTotal').patchValue(totalRmValue);
      this.apartmentForm.get('apartmentFmvOfFacTotal').patchValue(totalFMV);
    }
  }

  public removeCrossCollateralized(securityType: string, cin: number): void {
    (<FormArray>this.apartmentForm.get(securityType)).removeAt(cin);
    this.calculateTotalCross(securityType);
  }

  public addCrossCollateralized(arrayName): void {
    (this.apartmentForm.get(arrayName) as FormArray).push(this.crossCollateralizedFormGroup());
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

  public close(): void {
    if (this.isOpen) {
      this.dialogRef.close();
      this.isOpen = false;
    }
  }

  public calculateBuildUpAreaRate(i, type): void {
    switch (type) {
      case 'building':
        const totalBuildRate = (Number(this.apartmentForm.get(['buildingDetails', i, 'buildArea']).value)
            * Number(this.apartmentForm.get(['buildingDetails', i, 'buildRate']).value)).toFixed(2);
        this.apartmentForm.get(['buildingDetails', i, 'totalCost']).patchValue(totalBuildRate);
        break;
      case 'before':
        const beforeTotalBuildRate = (Number(this.apartmentForm.get(['buildingUnderConstructions', i,
              'buildingDetailsBeforeCompletion', 'buildArea']).value)
            * Number(this.apartmentForm.get(['buildingUnderConstructions', i,
              'buildingDetailsBeforeCompletion', 'buildRate']).value)).toFixed(2);
        this.apartmentForm.get(['buildingUnderConstructions', i,
          'buildingDetailsBeforeCompletion', 'totalCost']).patchValue(beforeTotalBuildRate);
        break;
      case 'after':
        const afterTotalBuildRate = (Number(this.apartmentForm.get(['buildingUnderConstructions', i,
              'buildingDetailsAfterCompletion', 'buildArea']).value)
            * Number(this.apartmentForm.get(['buildingUnderConstructions', i,
              'buildingDetailsAfterCompletion', 'buildRate']).value)).toFixed(2);
        this.apartmentForm.get(['buildingUnderConstructions', i,
          'buildingDetailsAfterCompletion', 'totalCost']).patchValue(afterTotalBuildRate);
        break;
    }
  }


  public calculateWaterSupply(i, type): void {
    switch (type) {
      case 'building':
        const waterSupply = (Number(this.apartmentForm.get(['buildingDetails', i, 'waterSupplyPercent']).value) / 100
            * Number(this.apartmentForm.get(['buildingDetails', i, 'totalCost']).value)).toFixed(2);
        this.apartmentForm.get(['buildingDetails', i, 'waterSupply']).patchValue(waterSupply);
        break;
      case 'before':
        const beforeWaterSupply = (Number(this.apartmentForm.get(['buildingUnderConstructions', i,
              'buildingDetailsBeforeCompletion', 'waterSupplyPercent']).value) / 100
            * Number(this.apartmentForm.get(['buildingUnderConstructions', i,
              'buildingDetailsBeforeCompletion', 'totalCost']).value)).toFixed(2);
        this.apartmentForm.get(['buildingUnderConstructions', i,
          'buildingDetailsBeforeCompletion', 'waterSupply']).patchValue(beforeWaterSupply);
        break;
      case 'after':
        const afterWaterSupply = (Number(this.apartmentForm.get(['buildingUnderConstructions', i,
              'buildingDetailsAfterCompletion', 'waterSupplyPercent']).value) / 100
            * Number(this.apartmentForm.get(['buildingUnderConstructions', i,
              'buildingDetailsAfterCompletion', 'totalCost']).value)).toFixed(2);
        this.apartmentForm.get(['buildingUnderConstructions', i,
          'buildingDetailsAfterCompletion', 'waterSupply']).patchValue(afterWaterSupply);
        break;
    }
  }

  public calculateSanitation(i, type): void {
    switch (type) {
      case 'building':
        const sanitation = (Number(this.apartmentForm.get(['buildingDetails', i, 'sanitationPercent']).value) / 100
            * Number(this.apartmentForm.get(['buildingDetails', i, 'totalCost']).value)).toFixed(2);
        this.apartmentForm.get(['buildingDetails', i, 'sanitation']).patchValue(sanitation);
        break;
      case 'before':
        const beforeSanitation = (Number(this.apartmentForm.get(['buildingUnderConstructions', i,
              'buildingDetailsBeforeCompletion', 'sanitationPercent']).value) / 100
            * Number(this.apartmentForm.get(['buildingUnderConstructions', i,
              'buildingDetailsBeforeCompletion', 'totalCost']).value)).toFixed(2);
        this.apartmentForm.get(['buildingUnderConstructions', i,
          'buildingDetailsBeforeCompletion', 'sanitation']).patchValue(beforeSanitation);
        break;
      case 'after':
        const afterSanitation = (Number(this.apartmentForm.get(['buildingUnderConstructions', i,
              'buildingDetailsAfterCompletion', 'sanitationPercent']).value) / 100
            * Number(this.apartmentForm.get(['buildingUnderConstructions', i,
              'buildingDetailsAfterCompletion', 'totalCost']).value)).toFixed(2);
        this.apartmentForm.get(['buildingUnderConstructions', i,
          'buildingDetailsAfterCompletion', 'sanitation']).patchValue(afterSanitation);
        break;
    }
  }

  public calculateElectrification(i, type): void {
    switch (type) {
      case 'building':
        const electrification = (Number(this.apartmentForm.get(['buildingDetails', i, 'electrificationPercent']).value) / 100
            * Number(this.apartmentForm.get(['buildingDetails', i, 'totalCost']).value)).toFixed(2);
        this.apartmentForm.get(['buildingDetails', i, 'electrification']).patchValue(electrification);
        break;
      case 'before':
        const beforeElectrification = (Number(this.apartmentForm.get(['buildingUnderConstructions', i,
              'buildingDetailsBeforeCompletion', 'electrificationPercent']).value) / 100
            * Number(this.apartmentForm.get(['buildingUnderConstructions', i,
              'buildingDetailsBeforeCompletion', 'totalCost']).value)).toFixed(2);
        this.apartmentForm.get(['buildingUnderConstructions', i,
          'buildingDetailsBeforeCompletion', 'electrification']).patchValue(beforeElectrification);
        break;
      case 'after':
        const afterElectrification = (Number(this.apartmentForm.get(['buildingUnderConstructions', i,
              'buildingDetailsAfterCompletion', 'electrificationPercent']).value) / 100
            * Number(this.apartmentForm.get(['buildingUnderConstructions', i,
              'buildingDetailsAfterCompletion', 'totalCost']).value)).toFixed(2);
        this.apartmentForm.get(['buildingUnderConstructions', i,
          'buildingDetailsAfterCompletion', 'electrification']).patchValue(afterElectrification);
        break;
    }
  }

  public calculateTotalApartmentCost(i, type): void {
    switch (type) {
      case 'building':
        const totalApartmentCost = (Number(this.apartmentForm.get(['buildingDetails', i, 'estimatedCost']).value) +
            Number(this.apartmentForm.get(['buildingDetails', i, 'waterSupply']).value) +
            Number(this.apartmentForm.get(['buildingDetails', i, 'sanitation']).value) +
            Number(this.apartmentForm.get(['buildingDetails', i, 'electrification']).value)).toFixed(2);
        this.apartmentForm.get(['buildingDetails', i, 'buildingTotalCost']).patchValue(totalApartmentCost);
        break;
      case 'before':
        const beforeTotalApartmentCost = (Number(this.apartmentForm.get(['buildingUnderConstructions', i,
              'buildingDetailsBeforeCompletion', 'estimatedCost']).value) +
            Number(this.apartmentForm.get(['buildingUnderConstructions', i,
              'buildingDetailsBeforeCompletion', 'waterSupply']).value) +
            Number(this.apartmentForm.get(['buildingUnderConstructions', i,
              'buildingDetailsBeforeCompletion', 'sanitation']).value) +
            Number(this.apartmentForm.get(['buildingUnderConstructions', i,
              'buildingDetailsBeforeCompletion', 'electrification']).value)).toFixed(2);
        this.apartmentForm.get(['buildingUnderConstructions', i,
          'buildingDetailsBeforeCompletion', 'buildingTotalCost']).patchValue(beforeTotalApartmentCost);
        break;
      case 'after':
        const afterTotalApartmentCost = (Number(this.apartmentForm.get(['buildingUnderConstructions', i,
              'buildingDetailsAfterCompletion', 'estimatedCost']).value) +
            Number(this.apartmentForm.get(['buildingUnderConstructions', i,
              'buildingDetailsAfterCompletion', 'waterSupply']).value) +
            Number(this.apartmentForm.get(['buildingUnderConstructions', i,
              'buildingDetailsAfterCompletion', 'sanitation']).value) +
            Number(this.apartmentForm.get(['buildingUnderConstructions', i,
              'buildingDetailsAfterCompletion', 'electrification']).value)).toFixed(2);
        this.apartmentForm.get(['buildingUnderConstructions', i,
          'buildingDetailsAfterCompletion', 'buildingTotalCost']).patchValue(afterTotalApartmentCost);
    }
  }

  public calculateEstimatedCost(i, type): void {
    switch (type) {
      case 'building':
        const estimatedCost = (Number(this.apartmentForm.get(['buildingDetails', i, 'valuationArea']).value)
            * Number(this.apartmentForm.get(['buildingDetails', i, 'ratePerSquareFeet']).value)).toFixed(2);
        this.apartmentForm.get(['buildingDetails', i, 'estimatedCost']).patchValue(estimatedCost);
        break;
      case 'before':
        const beforeEstimatedCost = (Number(this.apartmentForm.get(['buildingUnderConstructions', i,
              'buildingDetailsBeforeCompletion', 'valuationArea']).value)
            * Number(this.apartmentForm.get(['buildingUnderConstructions', i,
              'buildingDetailsBeforeCompletion', 'ratePerSquareFeet']).value)).toFixed(2);
        this.apartmentForm.get(['buildingUnderConstructions', i,
          'buildingDetailsBeforeCompletion', 'estimatedCost']).patchValue(beforeEstimatedCost);
        break;
      case 'after':
        const afterEstimatedCost = (Number(this.apartmentForm.get(['buildingUnderConstructions', i,
              'buildingDetailsAfterCompletion', 'valuationArea']).value)
            * Number(this.apartmentForm.get(['buildingUnderConstructions', i,
              'buildingDetailsAfterCompletion', 'ratePerSquareFeet']).value)).toFixed(2);
        this.apartmentForm.get(['buildingUnderConstructions', i,
          'buildingDetailsAfterCompletion', 'estimatedCost']).patchValue(afterEstimatedCost);
        break;
    }
  }

  public calcRealiasable(i, key): void {
    switch (key) {
      case 'apartment': {
        const reliasableValue = (Number(this.apartmentForm.get(['buildingDetails', i, 'buildingDistressValue']).value)
            * (Number(this.apartmentForm.get(['buildingDetails', i, 'apartmentRate']).value) / 100));
        this.apartmentForm.get(['buildingDetails', i, 'buildingReliasableValue']).patchValue(reliasableValue);
      }
        break;
    }
  }

  public valuator(branchId, type: string, index: number): void {
    if ((this.apartmentOtherBranchChecked) && ObjectUtil.isEmpty(branchId)) {
      return;
    }
    const valuatorSearch = {
      'branchIds': LocalStorageUtil.getStorage().branch
    };
    if (!ObjectUtil.isEmpty(branchId)) {
      valuatorSearch.branchIds = JSON.stringify(branchId);
    }
    if (type === 'apartment') {
      this.valuatorService.getListWithSearchObject(valuatorSearch).subscribe((res: any) => {
        this.securityValuator.apartmentValuator[index] = res.detail;
      });
    }
  }

  public onSubmit(): void {

  }

}
