import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {VehicleSecurity} from '../../../../admin/modal/vehicleSecurity';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {ValuatorService} from '../../../../admin/component/valuator/valuator.service';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {VehicleSecurityValuator} from '../../../../admin/modal/VehicleSecurityValuator';
import {Valuator} from '../../../../admin/modal/valuator';

@Component({
  selector: 'app-vehicle-security',
  templateUrl: './vehicle-security.component.html',
  styleUrls: ['./vehicle-security.component.scss']
})
export class VehicleSecurityComponent implements OnInit {
  @Input() vehicleSecurityValue: VehicleSecurity;
  vehicleSecurityForm: FormGroup;
  submitted = false;
  vehicleSecurity: VehicleSecurity = new VehicleSecurity();
  valuatorList: { id: number, name: string }[];

  constructor(
      private formBuilder: FormBuilder,
      private valuatorService: ValuatorService,
      private toastService: ToastService,
  ) {
  }

  get vehicleSecurityControls() {
    return this.vehicleSecurityForm.controls;
  }

  ngOnInit() {
    this.buildForm();
    const valuatorSearch = {
      valuatingField: 'VEHICLE',
      'branchIds': LocalStorageUtil.getStorage().branch,
    };
    this.valuatorService.getListWithSearchObject(valuatorSearch).subscribe((response: any) => {
      this.valuatorList = [];
      response.detail.forEach(v => this.valuatorList.push({id: v.id, name: v.name}));
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Error loading valuators!!!'));
    });
  }

  buildForm(): void {
    this.vehicleSecurityForm = this.formBuilder.group({
      vehicleSecurityDetails: this.formBuilder.array([])
    });

    if (ObjectUtil.isEmpty(this.vehicleSecurityValue)) {
      this.addEmptyGroup();
    } else {
      const formArray = this.vehicleSecurityForm.get('vehicleSecurityDetails') as FormArray;
      const data = JSON.parse(this.vehicleSecurityValue.data)['vehicleSecurityDetails'];
      data.forEach(v => formArray.push(this.addVehicleSecurityDetails(v)));
      this.vehicleSecurityValue.valuatorList.forEach((v, index: number) => {
        formArray.controls[index].get('vehicleSecurityValuatorId').setValue(v.id);
        formArray.controls[index].get('version').setValue(v.version);
      });
    }
  }

  removeVehicleSecurityDetails(index: number): void {
    (this.vehicleSecurityForm.get('vehicleSecurityDetails') as FormArray).removeAt(index);
  }

  addVehicleSecurityDetails(data) {
    return this.formBuilder.group({
      vehicleName: [ObjectUtil.setUndefinedIfNull(data.vehicleName), Validators.required],
      manufactureYear: [ObjectUtil.setUndefinedIfNull(data.manufactureYear), Validators.required],
      registrationNumber: [ObjectUtil.setUndefinedIfNull(data.registrationNumber), Validators.required],
      valuationAmount: [ObjectUtil.setUndefinedIfNull(data.valuationAmount), Validators.required],
      engineNumber: [ObjectUtil.setUndefinedIfNull(data.engineNumber), Validators.required],
      chassisNumber: [ObjectUtil.setUndefinedIfNull(data.chassisNumber), Validators.required],
      registrationDate: [ObjectUtil.setUndefinedIfNull(data.registrationDate), Validators.required],
      color: [ObjectUtil.setUndefinedIfNull(data.color), Validators.required],
      purpose: [ObjectUtil.setUndefinedIfNull(data.purpose), Validators.required],
      supplier: [ObjectUtil.setUndefinedIfNull(data.supplier), Validators.required],
      model: [ObjectUtil.setUndefinedIfNull(data.model), Validators.required],
      downPayment: [ObjectUtil.setUndefinedIfNull(data.downPayment), Validators.required],
      loanExposure: [ObjectUtil.setUndefinedIfNull(data.loanExposure), Validators.required],
      showroomCommission: [ObjectUtil.setUndefinedIfNull(data.showroomCommission), Validators.required],
      vehicleSecurityValuatorId: [undefined],
      valuator: [ObjectUtil.setUndefinedIfNull(data.valuator), Validators.required],
      valuatedDate: [ObjectUtil.setUndefinedIfNull(data.valuatedDate), Validators.required],
      valuatorRepresentativeName: [ObjectUtil.setUndefinedIfNull(data.valuatorRepresentativeName), Validators.required],
      staffRepresentativeName: [ObjectUtil.setUndefinedIfNull(data.staffRepresentativeName), Validators.required],
      version: [undefined]
    });
  }

  addEmptyGroup(): void {
    const formArray = this.vehicleSecurityForm.get('vehicleSecurityDetails') as FormArray;
    formArray.push(this.addVehicleSecurityDetails({}));
  }

  onSubmit(): void {
    // pass data into JSON
    if (!ObjectUtil.isEmpty(this.vehicleSecurityValue)) {
      this.vehicleSecurity = this.vehicleSecurityValue;
    }
    this.vehicleSecurity.data = JSON.stringify(this.vehicleSecurityForm.value);
    // pass valuator data
    this.vehicleSecurity.valuatorList = new Array<VehicleSecurityValuator>();
    const formArray = this.vehicleSecurityForm.get('vehicleSecurityDetails') as FormArray;
    formArray['controls'].forEach(c => {
      if (!ObjectUtil.isEmpty(c.get('valuator').value)) {
        const vehicleSecurityValuator = new VehicleSecurityValuator();
        vehicleSecurityValuator.id = c.get('vehicleSecurityValuatorId').value;
        const valuator = new Valuator();
        valuator.id = c.get('valuator').value;
        vehicleSecurityValuator.valuator = valuator;
        vehicleSecurityValuator.valuatedDate = c.get('valuatedDate').value;
        vehicleSecurityValuator.valuatorRepresentativeName = c.get('valuatorRepresentativeName').value;
        vehicleSecurityValuator.staffRepresentativeName = c.get('staffRepresentativeName').value;
        vehicleSecurityValuator.version = c.get('version').value;
        this.vehicleSecurity.valuatorList.push(vehicleSecurityValuator);
      }
    });
  }

}
