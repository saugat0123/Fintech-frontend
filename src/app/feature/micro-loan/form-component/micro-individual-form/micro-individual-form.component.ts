import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-micro-individual-form',
  templateUrl: './micro-individual-form.component.html',
  styleUrls: ['./micro-individual-form.component.scss']
})
export class MicroIndividualFormComponent implements OnInit {

  @Input() data;

  microCustomerParseData;

  submitData;

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
    if (!ObjectUtil.isEmpty(this.data)) {
      this.microCustomerForm.patchValue(this.data);
    }
  }

  buildForm() {
    this.microCustomerForm = this.formBuilder.group({
      bankDistance: [undefined, Validators.required],
      customerCategory: [undefined, Validators.required],
      riskClassificationPercent: [undefined, Validators.required],
      riskClassificationBase: [undefined, Validators.required],
      isDeprive: [undefined],
      depriveSector: [undefined],
      depriveSectorOthers: [undefined],
      isBlBAgent: [undefined],
      blbAgentName: [undefined],
      blbAgentCode: [undefined],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.microCustomerForm.invalid) {
      return;
    }
    this.submitData = this.microCustomerForm.value;
  }

}
