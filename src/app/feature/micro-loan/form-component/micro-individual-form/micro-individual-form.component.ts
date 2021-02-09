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
      this.microCustomerParseData = JSON.parse(this.microCustomerParseData);
      console.log(this.microCustomerParseData);
    }
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
      isBlBAgent: [undefined, Validators.required],
      blbAgentName: [undefined, Validators.required],
      blbAgentCode: [undefined, Validators.required],
    });
  }

  onSubmit() {
    if (this.microCustomerForm.invalid) {
      return;
    }
    this.submitData = JSON.stringify(this.microCustomerForm.value);
  }

}
