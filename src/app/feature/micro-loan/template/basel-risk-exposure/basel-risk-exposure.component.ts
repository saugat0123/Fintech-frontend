import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MicroBaselRiskExposure} from '../../../loan/model/micro-basel-risk-exposure';
import {ToastService} from '../../../../@core/utils';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-basel-risk-exposure',
  templateUrl: './basel-risk-exposure.component.html',
  styleUrls: ['./basel-risk-exposure.component.scss']
})
export class BaselRiskExposureComponent implements OnInit {
  @Output() baselRiskExposureEmitter = new EventEmitter();
  @Input() formData: MicroBaselRiskExposure;
  baselRiskExposureForm: FormGroup;
  dataForEdit;
  baselRiskExposure: MicroBaselRiskExposure = new MicroBaselRiskExposure();
  submitted = false;

  constructor(private formBuilder: FormBuilder,
              private elementRef: ElementRef,
              private toastService: ToastService,
              private overlay: NgxSpinnerService) {
  }

  get formControls() {
    return this.baselRiskExposureForm.controls;
  }

  ngOnInit() {
    this.buildForm();
    console.log(this.formData);
    if (!ObjectUtil.isEmpty(this.formData)) {
      this.baselRiskExposure = this.formData;
      this.dataForEdit = JSON.parse(this.formData.data);
      this.baselRiskExposureForm.patchValue(this.dataForEdit);
    }
    console.log(this.dataForEdit);
  }

  buildForm() {
    this.baselRiskExposureForm = this.formBuilder.group({
      corporationClaimBookValue: [undefined, Validators.required],
      corporationClaimSpecificProvision: [undefined, Validators.required],
      corporationClaimEligible: [undefined, Validators.required],
      corporationClaimNetValue: [undefined, Validators.required],
      corporationClaimRiskWeight: [undefined, [Validators.required,
        Validators.pattern('^[0-9]$|^[1-9][0-9]$|^(100)$')]],
      corporationClaimRwe: [undefined, Validators.required],
      OffBalanceSheetItemBookValue: [undefined, Validators.required],
      OffBalanceSheetItemSpecificProvision: [undefined, Validators.required],
      OffBalanceSheetItemEligible: [undefined, Validators.required],
      OffBalanceSheetItemNetValue: [undefined, Validators.required],
      OffBalanceSheetItemRiskWeight: [undefined, [Validators.required,
      Validators.pattern('^[0-9]$|^[1-9][0-9]$|^(100)$')]],
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

  public calculateCorporateNetValue() {
    const bookValue = Number(this.baselRiskExposureForm.get('corporationClaimBookValue').value);
    const specificProvision = Number(this.baselRiskExposureForm.get('corporationClaimSpecificProvision').value);
    const eligibleCRM = Number(this.baselRiskExposureForm.get('corporationClaimEligible').value);
    const netValue = (bookValue - specificProvision - eligibleCRM);
    return this.baselRiskExposureForm.get('corporationClaimNetValue').setValue(netValue);
  }

  public calculateCorporateRWE() {
    const netValue = Number(this.baselRiskExposureForm.get('corporationClaimNetValue').value);
    const riskWeight = Number(this.baselRiskExposureForm.get('corporationClaimRiskWeight').value);
    const RWE = netValue * (riskWeight / 100);
    return this.baselRiskExposureForm.get('corporationClaimRwe').setValue(RWE.toFixed(2));
  }

  public calculateBalanceSheetNetValue() {
    const bookValue = Number(this.baselRiskExposureForm.get('OffBalanceSheetItemBookValue').value);
    const specificProvision = Number(this.baselRiskExposureForm.get('OffBalanceSheetItemSpecificProvision').value);
    const eligibleCRM = Number(this.baselRiskExposureForm.get('OffBalanceSheetItemEligible').value);
    const netValue = (bookValue - specificProvision - eligibleCRM);
    return this.baselRiskExposureForm.get('OffBalanceSheetItemNetValue').setValue(netValue);
  }

  public calculateBalanceSheetRWE() {
    const netValue = Number(this.baselRiskExposureForm.get('OffBalanceSheetItemNetValue').value);
    const riskWeight = Number(this.baselRiskExposureForm.get('OffBalanceSheetItemRiskWeight').value);
    const RWE = netValue * (riskWeight / 100);
    return this.baselRiskExposureForm.get('OffBalanceSheetItemRwe').setValue(RWE.toFixed(2));
  }

  public submitForm() {
    this.overlay.show();
    this.submitted = true;
    if (this.baselRiskExposureForm.invalid) {
      this.scrollToInvalidControl();
      this.overlay.hide();
      this.toastService.show(new Alert(AlertType.ERROR, 'Please fill all fields!'));
      return;
    }
    this.baselRiskExposure.data = JSON.stringify(this.baselRiskExposureForm.value);
    this.baselRiskExposureEmitter.emit(this.baselRiskExposure);
  }

}
