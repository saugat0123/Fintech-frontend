import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MicroBaselRiskExposure} from '../../../loan/model/micro-basel-risk-exposure';
import {ToastService} from '../../../../@core/utils';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../@theme/model/Alert';

@Component({
  selector: 'app-basel-risk-exposure',
  templateUrl: './basel-risk-exposure.component.html',
  styleUrls: ['./basel-risk-exposure.component.scss']
})
export class BaselRiskExposureComponent implements OnInit {
  @Output() baselRiskExposureEmitter = new EventEmitter();
  @Input() formData: MicroBaselRiskExposure;
  formGroup: FormGroup;
  dataForEdit;
  baselRiskExposure: MicroBaselRiskExposure = new MicroBaselRiskExposure();
  submitted = false;

  constructor(private formBuilder: FormBuilder,
              private elementRef: ElementRef,
              private toastService: ToastService) {
  }

  get formControls() {
    return this.formGroup.controls;
  }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.formData)) {
      this.baselRiskExposure = this.formData;
      this.dataForEdit = JSON.parse(this.formData.data);
      this.formGroup.patchValue(this.dataForEdit);
    }
    console.log(this.dataForEdit);
  }

  buildForm() {
    this.formGroup = this.formBuilder.group({
      corporationClaimBookValue: [undefined, Validators.required],
      corporationClaimSpecificProvision: [undefined, Validators.required],
      corporationClaimEligible: [undefined, Validators.required],
      corporationClaimNetValue: [undefined, Validators.required],
      corporationClaimRiskWeight: [undefined, Validators.required],
      corporationClaimRwe: [undefined, Validators.required],
      OffBalanceSheetItemBookValue: [undefined, Validators.required],
      OffBalanceSheetItemSpecificProvision: [undefined, Validators.required],
      OffBalanceSheetItemEligible: [undefined, Validators.required],
      OffBalanceSheetItemNetValue: [undefined, Validators.required],
      OffBalanceSheetItemRiskWeight: [undefined, Validators.required],
      OffBalanceSheetItemRwe: [undefined, Validators.required],
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

  public submitForm() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      this.scrollToInvalidControl();
      this.toastService.show(new Alert(AlertType.ERROR, 'Please fill all fields!'));
      return;
    }
    this.baselRiskExposure.data = JSON.stringify(this.formGroup.value);
    this.baselRiskExposureEmitter.emit(this.baselRiskExposure);
  }

}
