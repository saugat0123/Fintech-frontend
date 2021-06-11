import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CalendarType} from '../../../../../../@core/model/calendar-type';
import {Branch} from '../../../../../admin/modal/branch';
import {SecurityValuator} from '../../../../../loan/model/securityValuator';
import {LocalStorageUtil} from '../../../../../../@core/utils/local-storage-util';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {ValuatorService} from '../../../../../admin/component/valuator/valuator.service';
import {BranchService} from '../../../../../admin/component/branch/branch.service';
import {RoleService} from '../../../../../admin/component/role-permission/role.service';
import {ToastService} from '../../../../../../@core/utils';
import {NbDialogRef, NbDialogService} from '@nebular/theme';

@Component({
  selector: 'app-plant-and-machinery-security',
  templateUrl: './plant-and-machinery-security.component.html',
  styleUrls: ['./plant-and-machinery-security.component.scss']
})
export class PlantAndMachinerySecurityComponent implements OnInit {
  @Input() calendarType: CalendarType;

  plantMachineryForm: FormGroup;
  branchLists: Array<Branch> = new Array<Branch>();
  securityValuator: SecurityValuator = new SecurityValuator();
  designationList = [];
  spinner = false;
  dialogRef: NbDialogRef<any>;

  constructor(private valuatorService: ValuatorService,
              private branchService: BranchService,
              private roleService: RoleService,
              private toastService: ToastService,
              private nbDialogService: NbDialogService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    this.getRoleList();
    this.getAllBranchList();
  }

  private buildForm(): FormGroup {
    return this.plantMachineryForm = this.formBuilder.group({
      plantMachinery: this.formBuilder.array([this.buildPlantMachineryFormGroup()])
    });
  }

  private buildPlantMachineryFormGroup(): FormGroup {
    return this.formBuilder.group({
      model: [undefined],
      quotation: [undefined],
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
    });
  }

  removePlantMachineryForm(index: number) {
    (this.plantMachineryForm.get('plantMachinery') as FormArray).removeAt(index);
  }

  addPlantAndMachineryForm() {
    (this.plantMachineryForm.get('plantMachinery') as FormArray).push(this.buildPlantMachineryFormGroup());
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

}
