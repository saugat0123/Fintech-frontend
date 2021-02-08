import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-micro-individual-form',
  templateUrl: './micro-individual-form.component.html',
  styleUrls: ['./micro-individual-form.component.scss']
})
export class MicroIndividualFormComponent implements OnInit {

  microCustomerForm: FormGroup;
  submitted = false;
  deprivedList = ['Socially backward women', 'Dalit', 'Janajati', 'Blind', 'Deaf', 'Physically Challenged'
    , 'Craftsman', 'Landless People', 'Laborers', 'Small Farmers', 'Others'];

  constructor(private formBuilder: FormBuilder) {
  }

  get form() {
    return this.microCustomerForm.controls;
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.microCustomerForm = this.formBuilder.group({
      bankDistance: [undefined, Validators.required],
      customerCategory: [undefined, Validators.required],
      riskClassificationPercent: [undefined, Validators.required],
      riskClassificationBase: [undefined, Validators.required],
      isDeprive: [undefined, Validators.required],
      depriveSector: [undefined, Validators.required],
      depriveSectorOthers: [undefined, Validators.required],
    });
  }

}
