import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

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
    if (!ObjectUtil.isEmpty(this.data)) {
      this.microCustomerForm.patchValue(this.data);
    }
  }

  get form() {
    return this.microCustomerForm.controls;
  }

  buildForm() {
    this.microCustomerForm = this.formBuilder.group({
      repaymentSchedule: [undefined],
      loanProducts: [undefined],
      savingProducts: [undefined],
      otherProducts: [undefined],
    });
  }


  onSubmit() {
    this.submitted = true;
    this.submitData = this.microCustomerForm.value;
  }
}
