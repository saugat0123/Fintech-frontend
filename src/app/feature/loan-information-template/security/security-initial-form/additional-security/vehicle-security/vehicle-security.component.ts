import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LocalStorageUtil} from '../../../../../../@core/utils/local-storage-util';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {SecurityValuator} from '../../../../../loan/model/securityValuator';
import {ValuatorService} from '../../../../../admin/component/valuator/valuator.service';
import {Branch} from '../../../../../admin/modal/branch';
import {BranchService} from '../../../../../admin/component/branch/branch.service';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {RoleService} from '../../../../../admin/component/role-permission/role.service';
import {ToastService} from '../../../../../../@core/utils';
import {NumberUtils} from '../../../../../../@core/utils/number-utils';
import {CalendarType} from '../../../../../../@core/model/calendar-type';

@Component({
  selector: 'app-vehicle-security',
  templateUrl: './vehicle-security.component.html',
  styleUrls: ['./vehicle-security.component.scss']
})
export class VehicleSecurityComponent implements OnInit {
  @Input() calendarType: CalendarType;

  vehicleSecurityForm: FormGroup;
  securityValuator: SecurityValuator = new SecurityValuator();
  branchLists: Array<Branch> = new Array<Branch>();
  spinner = false;
  designationList = [];

  constructor(private formBuilder: FormBuilder,
              private valuatorService: ValuatorService,
              private branchService: BranchService,
              private roleService: RoleService,
              private toastService: ToastService, ) { }

  ngOnInit() {
    this.buildForm();
    this.getAllBranchList();
    this.getDesignationList();
  }


  private buildForm(): FormGroup {
    return this.vehicleSecurityForm = this.formBuilder.group({
      vehicleSecurity: this.formBuilder.array([this.vehicleSecurityFormGroup()]),
    });
  }
  public getValuatorList(index: number) {
    const branchSearchObj = {
      'branchIds': LocalStorageUtil.getStorage().branch
    };
    if (!ObjectUtil.isEmpty(branchSearchObj.branchIds)) {
      this.valuatorService.getListWithSearchObject(branchSearchObj).subscribe((res: any) => {
        this.securityValuator.landValuator[index] = res.detail;
      });
    }
  }

  private getDesignationList(): void {
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

  private getAllBranchList(): void {
    this.branchService.getAll().subscribe((res: any) => {
      this.branchLists = res.detail;
    });
  }

  private vehicleSecurityFormGroup(): FormGroup {
    return this.formBuilder.group({
      model: [undefined],
      registrationNumber: [undefined],
      registrationDate: [undefined],
      engineNumber: [undefined],
      chassisNumber: [undefined],
      valuationAmount: [undefined],
      downPayment: [undefined],
      remainingAmount: [undefined],
      loanExposure: [undefined],
      showroomCommission: [undefined],
      vehicalValuator: [undefined],
      vehicalValuatorDate: [undefined],
      vehicalValuatorRepresentative: [undefined],
      vehicalStaffRepresentativeName: [undefined],
      vehicalBranch: [undefined],
      vehicalStaffRepresentativeDesignation: [undefined],
      vehicaleStaffRepresentativeDesignation2: [undefined],
      vehicaleStaffRepresentativeName2: [undefined],
      showroomAddress: undefined,
      showroomName: undefined,
      ownershipTransferDate: undefined,
      vehicleQuotationDate: undefined,
      vehicleRemarks: [undefined],
      vehicleOtherBranchChecked: [undefined],
    });
  }

  public removeVehicleForm(index: number): void {
    (this.vehicleSecurityForm.get('vehicleSecurity') as FormArray).removeAt(index);
  }

  public addVehicleSecurityForm() {
    (this.vehicleSecurityForm.get('vehicleSecurity') as FormArray).push(this.vehicleSecurityFormGroup());
  }
}
