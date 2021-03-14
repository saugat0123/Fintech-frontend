import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MicroLoanSynopsis} from '../../../loan/model/micro-loan-synopsis';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';

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
  submitted = false;

  ratingList = ['1', '2', '3', '4', '5'];

  constructor(private formBuilder: FormBuilder,
              private elementRef: ElementRef,
              private toastService: ToastService,) {
  }

  get formControls() {
    return this.synopsisFormGroup.controls;
  }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.formData)) {
      this.synopsisCreditworthiness = this.formData;
      this.dataForEdit = JSON.parse(this.formData.data);
      this.synopsisFormGroup.patchValue(this.dataForEdit);
    }
    console.log(this.dataForEdit);
  }


  buildForm() {
    this.synopsisFormGroup = this.formBuilder.group({
      industryEnvironment: [undefined, Validators.required],
      financialCondition: [undefined, Validators.required],
      managementQuality: [undefined, Validators.required],
      technicalStrength: [undefined, Validators.required],
      securityRealization: [undefined, Validators.required],
      overallRating: [undefined, Validators.required],
      industryEnvironmentPillar: [undefined, Validators.required],
      financialConditionPillar: [undefined, Validators.required],
      managementQualityPillar: [undefined, Validators.required],
      operationStrengthPillar: [undefined, Validators.required],
      securityRealizationPillar: [undefined, Validators.required],
    });
  }

  scrollToInvalidControl() {
    const firstInvalidControl: HTMLElement = this.elementRef.nativeElement.querySelector(
        'form .ng-invalid'
    );
    window.scroll({
      top: this.getTopOffset(firstInvalidControl),
      left: 0,
      behavior: 'smooth'
    });
    firstInvalidControl.focus();
  }

  private getTopOffset(controlEl: HTMLElement): number {
    const labelOffSet = 50;
    return controlEl.getBoundingClientRect().top + window.scrollY - labelOffSet;
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
    this.submitted = true;
    if (this.synopsisFormGroup.invalid) {
      this.scrollToInvalidControl();
      this.toastService.show(new Alert(AlertType.ERROR, 'All fields are mandatory!'));
      return;
    }
    this.synopsisCreditworthiness.data = JSON.stringify(this.synopsisFormGroup.value);
    this.creditworthinessEmitter.emit(this.synopsisCreditworthiness);
  }
}
