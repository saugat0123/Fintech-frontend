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
import {Security} from '../../../loan/model/security';

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

  @Input() security: Security;
  @Input() isEdit = false;


  constructor(private valuatorService: ValuatorService,
              private branchService: BranchService,
              private roleService: RoleService,
              private toastService: ToastService,
              private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.buildForm();
        this.branchList();
        this.getRoleList();
        if (this.isEdit) {
            this.setPlantAndMachinery();
        } else {
            this.addPlantandMachinery();
        }
    }

    setPlantAndMachinery() {
        const formData = JSON.parse(this.security.data);
        const plantAndMachineryForm = this.plantMachineryForm.get('plantDetails') as FormArray;
        plantAndMachineryForm.push(
            this.formBuilder.group({
                model: [formData.model],
                quotation: [formData.quotation],
                supplier: [formData.supplier],
                plantMachineryValuator: [formData.plantMachineryValuator],
                plantMachineryValuatorDate: [new Date(formData.plantMachineryValuatorDate)],
                plantMachineryValuatorRepresentative: [formData.plantMachineryValuatorRepresentative],
                plantMachineryStaffRepresentativeName: [formData.plantMachineryStaffRepresentativeName],
                plantBranch: [formData.plantBranch],
                fairMarketValue: [formData.fairMarketValue],
                considerValue: [formData.considerValue],
                distressValue: [formData.distressValue],
                plantMachineryStaffRepresentativeDesignation: [formData.plantMachineryStaffRepresentativeDesignation],
                plantMachineryStaffRepresentativeDesignation2: [formData.plantMachineryStaffRepresentativeDesignation2],
                plantMachineryStaffRepresentativeName2: [formData.plantMachineryStaffRepresentativeName2],
                plantOtherBranchChecked: [formData.plantOtherBranchChecked],
                realisableRate: [formData.realisableRate],
                realisableValue: [formData.realisableValue],
                plantMachineryFirstValuationDate: [new Date(formData.plantMachineryFirstValuationDate)]
            })
        );

    }

    private buildForm(): FormGroup {
        return this.plantMachineryForm = this.formBuilder.group({
            plantDetails: this.formBuilder.array([])
        });
    }

  public branchList(): void {
    this.branchService.getAll().subscribe((res: any) => {
      this.branchLists = res.detail;
    });
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

  public calcRealiasable(i, key): void {
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

  public removePlantDetails(index: number): void {
    (this.plantMachineryForm.get('plantDetails') as FormArray).removeAt(index);
  }

  public addPlantandMachinery(): void {
    (this.plantMachineryForm.get('plantDetails') as FormArray).push(this.plantDetailsFormGroup());
  }

  public plantDetailsFormGroup(): FormGroup {
    return this.formBuilder.group({
      model: [undefined, Validators.required],
      quotation: [undefined, Validators.required],
      supplier: [undefined],
      plantMachineryValuator: [undefined],
      plantMachineryValuatorDate: [undefined],
      plantMachineryValuatorRepresentative: [undefined],
      plantMachineryStaffRepresentativeName: [undefined],
      plantBranch: [undefined],
      fairMarketValue: [undefined],
      considerValue: [undefined],
      distressValue: [undefined],
      plantMachineryStaffRepresentativeDesignation: [undefined],
      plantMachineryStaffRepresentativeDesignation2: [undefined],
      plantMachineryStaffRepresentativeName2: [undefined],
      plantOtherBranchChecked: [undefined],
      realisableRate: [undefined],
      realisableValue: [undefined],
        plantMachineryFirstValuationDate: [undefined]
    });
  }

}
