import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IncomeFromAccount} from '../../admin/modal/incomeFromAccount';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-income-from-account',
  templateUrl: './income-from-account.component.html',
  styleUrls: ['./income-from-account.component.scss']
})
export class IncomeFromAccountComponent implements OnInit {
  @Input() incomeFromAccountDataResponse: IncomeFromAccount;
  @Input() fromProfile;
  @Output() incomeFromAccountDataEmitter = new EventEmitter;
  incomeDataObject = new IncomeFromAccount();
  incomeFormGroup: FormGroup;
  submitted = false;
  dataForEdit;

  constructor(private formBuilder: FormBuilder, private el: ElementRef) {
  }

  get formControls() {
    return this.incomeFormGroup.controls;
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.incomeFromAccountDataResponse)) {
      this.dataForEdit = JSON.parse(this.incomeFromAccountDataResponse.data);
    }
    this.buildForm(this.dataForEdit);

  }

  buildForm(data) {
    this.incomeFormGroup = this.formBuilder.group({
      interestDuringReview: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.interestDuringReview),
        [Validators.required]],
      interestAfterNextReview: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.interestAfterNextReview),
        [Validators.required]],
      commissionDuringReview: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.commissionDuringReview),
        [Validators.required]],
      commissionAfterNextReview: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.commissionAfterNextReview),
        [Validators.required]],
      otherChargesDuringReview: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.otherChargesDuringReview),
        [Validators.required]],
      otherChargesAfterNextReview: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.otherChargesAfterNextReview),
        [Validators.required]],
      incomeFromTheAccount: [ObjectUtil.isEmpty(data) ? undefined : ObjectUtil.setUndefinedIfNull(data.incomeFromTheAccount),
        Validators.required],
      totalIncomeAfterNextReview: [ObjectUtil.isEmpty(data) ? 0 : ObjectUtil.setUndefinedIfNull(data.totalIncomeAfterNextReview),
        [Validators.required]],
      totalIncomeDuringReview: [ObjectUtil.isEmpty(data) ? 0 : ObjectUtil.setUndefinedIfNull(data.totalIncomeDuringReview),
        [Validators.required]],
    });
  }

  calculateTotalIncomeDuringReview() {
    let totalIncomeDuringReview = 0;
    totalIncomeDuringReview = this.incomeFormGroup.get('interestDuringReview').value +
        this.incomeFormGroup.get('commissionDuringReview').value +
        this.incomeFormGroup.get('otherChargesDuringReview').value;
    this.incomeFormGroup.get('totalIncomeDuringReview').setValue(totalIncomeDuringReview);
  }

  calculateTotalIncomeAfterReview() {
    let totalIncomeAfterNextReview = 0;
    totalIncomeAfterNextReview = this.incomeFormGroup.get('interestAfterNextReview').value +
        this.incomeFormGroup.get('commissionAfterNextReview').value +
        this.incomeFormGroup.get('otherChargesAfterNextReview').value;
    this.incomeFormGroup.get('totalIncomeAfterNextReview').setValue(totalIncomeAfterNextReview);
  }
  scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
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
    const labelOffset = 50;
    return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
  }

  submitForm() {
    this.submitted = true;
    if (this.incomeFormGroup.invalid) {
      this.scrollToFirstInvalidControl();
      return;
    }
    if (!ObjectUtil.isEmpty(this.incomeFromAccountDataResponse)) {
      this.incomeDataObject = this.incomeFromAccountDataResponse;
    }
    this.incomeDataObject.data = JSON.stringify(this.incomeFormGroup.value);
    this.incomeFromAccountDataEmitter.emit(this.incomeDataObject);
  }

}
