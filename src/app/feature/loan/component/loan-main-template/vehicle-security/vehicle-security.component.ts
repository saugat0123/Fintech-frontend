import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {VehicleSecurity} from '../../../../admin/modal/vehicleSecurity';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

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

  valuatorList: any[] = [
    {'id': 'Valuator1', 'name': 'Valuator 1'},
    {'id': 'Valuator2', 'name': 'Valuator 2'},
    {'id': 'Valuator3', 'name': 'Valuator 3'},
    {'id': 'Valuator4', 'name': 'Valuator 4'}
  ];

  constructor(private formBuilder: FormBuilder) {
  }

  get vehicleSecurityControls() {
    return this.vehicleSecurityForm.controls;
  }

  ngOnInit() {
    this.buildForm();
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
      valuator: [ObjectUtil.setUndefinedIfNull(data.valuator), Validators.required],
      valuatedDate: [ObjectUtil.setUndefinedIfNull(data.valuatedDate), Validators.required],
      valuatorRepresentativeName: [ObjectUtil.setUndefinedIfNull(data.valuatorRepresentativeName), Validators.required],
      staffRepresentativeName: [ObjectUtil.setUndefinedIfNull(data.staffRepresentativeName), Validators.required]
    });
  }

  addEmptyGroup(): void {
    const formArray = this.vehicleSecurityForm.get('vehicleSecurityDetails') as FormArray;
    formArray.push(this.addVehicleSecurityDetails({}));
  }

  onSubmit(): void {
    if (!ObjectUtil.isEmpty(this.vehicleSecurityValue)) {
      this.vehicleSecurity = this.vehicleSecurityValue;
    }
    this.vehicleSecurity.data = JSON.stringify(this.vehicleSecurityForm.value);
  }

}
