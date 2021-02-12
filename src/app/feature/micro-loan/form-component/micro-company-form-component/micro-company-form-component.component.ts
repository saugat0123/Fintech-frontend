import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-micro-company-form-component',
  templateUrl: './micro-company-form-component.component.html',
  styleUrls: ['./micro-company-form-component.component.scss']
})
export class MicroCompanyFormComponentComponent implements OnInit {
  @Input() data;

  microCustomerParseData;
  submitData;
  ckeConfig;
  microCustomerForm: FormGroup;
  submitted = false;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  get form() {
    return this.microCustomerForm.controls;
  }

  buildForm() {
    this.microCustomerForm = this.formBuilder.group({
      repaymentSchedule: [undefined , Validators.required],
      loanProducts: [undefined , Validators.required],
      savingProducts: [undefined , Validators.required],
      otherProducts: [undefined , Validators.required],
    });
  }
}
