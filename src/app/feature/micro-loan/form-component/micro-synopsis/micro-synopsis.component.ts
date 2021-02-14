import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MicroLoanSynopsis} from '../../../loan/model/micro-loan-synopsis';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-micro-synopsis',
  templateUrl: './micro-synopsis.component.html',
  styleUrls: ['./micro-synopsis.component.scss']
})
export class MicroSynopsisComponent implements OnInit {
  synopsisFormGroup: FormGroup;

  @Output() creditworthinessEmitter = new EventEmitter();
  @Input() formData: MicroLoanSynopsis;
  dataForEdit;
  synopsisCreditworthiness: MicroLoanSynopsis = new MicroLoanSynopsis();

  ratingList = ['1', '2', '3', '4', '5'];

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.formData)) {
      this.synopsisCreditworthiness = this.formData;
      this.dataForEdit = JSON.parse(this.formData.data);
      this.synopsisFormGroup.patchValue(this.formData);
    }
    console.log(this.dataForEdit);
  }


  buildForm() {
    this.synopsisFormGroup = this.formBuilder.group({
      industryEnvironment: [undefined],
      financialCondition: [undefined],
      managementQuality: [undefined],
      technicalStrength: [undefined],
      securityRealization: [undefined],
      overallRating: [undefined],
      industryEnvironmentPillar: [undefined],
      financialConditionPillar: [undefined],
      managementQualityPillar: [undefined],
      operationStrengthPillar: [undefined],
      securityRealizationPillar: [undefined],
    });
  }

  public overallRating() {
    const industryEnvironment = Number(this.synopsisFormGroup.get('industryEnvironment').value);
    const financialCondition = Number(this.synopsisFormGroup.get('financialCondition').value);
    const managementQuality = Number(this.synopsisFormGroup.get('managementQuality').value);
    const technicalStrength = Number(this.synopsisFormGroup.get('technicalStrength').value);
    const securityRealization = Number(this.synopsisFormGroup.get('securityRealization').value);
    const overallRating = (industryEnvironment + financialCondition + managementQuality + technicalStrength + securityRealization) / 5;
    return this.synopsisFormGroup.get('overallRating').setValue(Number(overallRating));
  }

  public submitForm() {
    this.synopsisCreditworthiness.data = JSON.stringify(this.synopsisFormGroup.value);
    this.creditworthinessEmitter.emit(this.synopsisCreditworthiness);
  }
}
