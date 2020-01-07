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
  @Input() vehicleSecurityFormValue: VehicleSecurity;
  vehicleSecurityForm: FormGroup;
  submitted = false;
  vehicleSecurityList: VehicleSecurity = new VehicleSecurity();
  vehicleSecurityFormValueEdit;

  dropDownValuatorList: any[] = [
    {'id': 'Valuator1', 'name': 'Valuator 1'},
    {'id': 'Valuator2', 'name': 'Valuator 2'},
    {'id': 'Valuator3', 'name': 'Valuator 3'},
    {'id': 'Valuator4', 'name': 'Valuator 4'}
  ];

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.buildForm();
    this.addVehicleSecurityDetails();

    if (!ObjectUtil.isEmpty(this.vehicleSecurityFormValue)) {
      this.vehicleSecurityFormValueEdit = JSON.parse(this.vehicleSecurityFormValue.data);
      console.log('data are', this.vehicleSecurityFormValueEdit);
      this.buildForm();
      this.setVehicleSecurityDetails(this.vehicleSecurityFormValueEdit);
    }
  }

  get vehicleSecurityControls() {
    return  this.vehicleSecurityForm.controls;
  }

  buildForm() {
    this.vehicleSecurityForm = this.formBuilder.group({
      vehicleSecurityDetails: this.formBuilder.array([])
    });
  }

  setVehicleSecurityDetails(currentData) {
    const details =  this.vehicleSecurityForm.get('vehicleSecurityDetails') as FormArray;
    currentData.vehicleSecurityDetails.forEach(singleData => {
      details.push(
          this.formBuilder.group({
            vehicleName: [singleData.vehicleName],
            model: [singleData.model],
            manufactureYear: [singleData.manufactureYear],
            registrationNumber: [singleData.registrationNumber],
            valuationAmount: [singleData.valuationAmount],
            engineNumber: [singleData.engineNumber],
            chassisNumber: [singleData.chassisNumber],
            registrationDate: [singleData.registrationDate],
            color: [singleData.color],
            purpose: [singleData.purpose],
            supplier: [singleData.supplier],
            downPayment: [singleData.downPayment],
            loanExposure: [singleData.loanExposure],
            showroomCommission: [singleData.showroomCommission],
            valuator: [singleData.valuator],
            valuatedDate: [singleData.valuatedDate],
            valuatorRepresentativeName: [singleData.valuatorRepresentativeName],
            staffRepresentativeName: [singleData.staffRepresentativeName]
          })
      );
    });
  }


  removeVehicleSecurityDetails(index: number) {
    (this.vehicleSecurityForm.get('vehicleSecurityDetails') as  FormArray).removeAt(index);

  }

  addVehicleSecurityDetails() {
    const addDetails = this.vehicleSecurityForm.get('vehicleSecurityDetails') as FormArray;
    addDetails.push(
        this.formBuilder.group({
          vehicleName: [undefined, Validators.required],
          model: [undefined, Validators.required],
          manufactureYear: [undefined, Validators.required],
          registrationNumber: [undefined, Validators.required],
          valuationAmount: [undefined, Validators.required],
          engineNumber: [undefined, Validators.required],
          chassisNumber: [undefined, Validators.required],
          registrationDate: [undefined, Validators.required],
          color: [undefined, Validators.required],
          purpose: [undefined, Validators.required],
          supplier: [undefined, Validators.required],
          downPayment: [undefined, Validators.required],
          loanExposure: [undefined, Validators.required],
          showroomCommission: [undefined, Validators.required],
          valuator: [undefined, Validators.required],
          valuatedDate: [undefined, Validators.required],
          valuatorRepresentativeName: [undefined, Validators.required],
          staffRepresentativeName: [undefined, Validators.required]
        }));

  }

  onSubmit() {
    this.vehicleSecurityList.data = JSON.stringify(this.vehicleSecurityForm.value);

  }

}
