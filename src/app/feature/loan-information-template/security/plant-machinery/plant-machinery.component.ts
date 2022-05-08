import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {InsuranceList} from '../../../loan/model/insuranceList';
import {ValuatorService} from '../../../admin/component/valuator/valuator.service';
import {SecurityValuator} from '../../../loan/model/securityValuator';
import {BranchService} from '../../../admin/component/branch/branch.service';
import {CalendarType} from '../../../../@core/model/calendar-type';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {RoleService} from '../../../admin/component/role-permission/role.service';
import {ToastService} from '../../../../@core/utils';

@Component({
  selector: 'app-plant-machinery',
  templateUrl: './plant-machinery.component.html',
  styleUrls: ['./plant-machinery.component.scss']
})
export class PlantMachineryComponent implements OnInit {
  plantMachineryForm: FormGroup;
  submitted = false;
  insuranceCompanyList = InsuranceList.insuranceCompanyList;
  landOtherBranchChecked = false;
  apartmentOtherBranchChecked = false;
  landBuildingOtherBranchChecked = false;
  vehicleOtherBranchChecked = false;
  plantOtherBranchChecked = false;
  securityValuator: SecurityValuator = new SecurityValuator();
  branchLists;
  @Input() calendarType: CalendarType;
  designationList = [];
  spinner = false;

  constructor(private valuatorService: ValuatorService,
              private branchService: BranchService,
              private roleService: RoleService,
              private toastService: ToastService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    this.branchList();
    this.getRoleList();
  }

  private buildForm(): FormGroup {
    return this.plantMachineryForm = this.formBuilder.group({
      plantDetails: this.formBuilder.array([])
    });
  }

  branchList() {
    this.branchService.getAll().subscribe((res: any) => {
      this.branchLists = res.detail;
    });
  }


  getRoleList() {
    this.spinner = true;
    this.roleService.getAll().subscribe(res => {
      this.designationList = res.detail;
      this.spinner = false;
    }, error => {
      this.toastService.show(new Alert(AlertType.ERROR, 'Error While Fetching List'));
      this.spinner = false;
    });
  }

  calcRealiasable(i, key) {
    switch (key) {
      case 'apartment': {
        const reliasableValue = (Number(this.plantMachineryForm.get(['buildingDetails', i, 'buildingDistressValue']).value)
            * (Number(this.plantMachineryForm.get(['buildingDetails', i, 'apartmentRate']).value) / 100));
        this.plantMachineryForm.get(['buildingDetails', i, 'buildingReliasableValue']).patchValue(reliasableValue);
      }
        break;
      case 'vehicle': {
        const reliasableValue = (Number(this.plantMachineryForm.get(['vehicleDetails', i, 'quotationAmount']).value)
            * (Number(this.plantMachineryForm.get(['vehicleDetails', i, 'vehicleRate']).value) / 100));
        this.plantMachineryForm.get(['vehicleDetails', i, 'vehicleRealiasableAmount']).patchValue(reliasableValue);
      }
        break;
      case 'plant': {
        const reliasableValue = (Number(this.plantMachineryForm.get(['plantDetails', i, 'realisableValue']).value)
            * (Number(this.plantMachineryForm.get(['plantDetails', i, 'realisableRate']).value) / 100));
        this.plantMachineryForm.get(['plantDetails', i, 'quotation']).patchValue(reliasableValue);
      }
        break;
      case 'share': {
        const reliasableValue = (Number(this.plantMachineryForm.get(['shareSecurityDetails', i, 'total']).value)
            * (Number(this.plantMachineryForm.get(['shareSecurityDetails', i, 'shareRate']).value) / 100));
        this.plantMachineryForm.get(['shareSecurityDetails', i, 'consideredValue']).patchValue(reliasableValue);
      }
        break;
    }
  }

  valuator(branchId, type: string, index: number) {
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

  removePlantDetails(index: number) {
    (this.plantMachineryForm.get('plantDetails') as FormArray).removeAt(index);
  }

  addPlantandMachinery() {
    (this.plantMachineryForm.get('plantDetails') as FormArray).push(this.plantDetailsFormGroup());
  }

  plantDetailsFormGroup(): FormGroup {
    return this.formBuilder.group({
      model: [undefined, Validators.required],
      quotation: [undefined, Validators.required],
      supplier: [undefined],
      downPay: [undefined],
      loanExp: [undefined],
      plantMachineryValuator: [undefined],
      plantMachineryValuatorDate: [undefined],
      plantMachineryValuatorRepresentative: [undefined],
      plantMachineryStaffRepresentativeName: [undefined],
      plantBranch: [undefined],
      plantMachineryStaffRepresentativeDesignation: [undefined],
      plantMachineryStaffRepresentativeDesignation2: [undefined],
      plantMachineryStaffRepresentativeName2: [undefined],
      plantOtherBranchChecked: [undefined],
      realisableRate: [undefined],
      realisableValue: [undefined],
    });
  }

}
