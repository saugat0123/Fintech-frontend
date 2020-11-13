import {Component, EventEmitter, Input, OnInit, Output, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IncomeFromAccount} from '../../admin/modal/incomeFromAccount';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {Pattern} from '../../../@core/utils/constants/pattern';
import {RepaymentTrackCurrentBank} from '../../admin/modal/crg/RepaymentTrackCurrentBank';
import {NumberUtils} from '../../../@core/utils/number-utils';

@Component({
  selector: 'app-income-from-account',
  templateUrl: './income-from-account.component.html',
  styleUrls: ['./income-from-account.component.scss']
})
export class IncomeFromAccountComponent implements OnInit {
  @Input() incomeFromAccountDataResponse: IncomeFromAccount;
  @Input() fromProfile;
  @Output() incomeFromAccountDataEmitter = new EventEmitter();
  incomeDataObject = new IncomeFromAccount();
  incomeFormGroup: FormGroup;
  submitted = false;
  dataForEdit;
  isNewCustomer = false;
  pattern = Pattern;
  repaymentTrack = RepaymentTrackCurrentBank.enumObject();

  constructor(private formBuilder: FormBuilder,
              private el: ElementRef,
  ) {
  }

  get formControls() {
    return this.incomeFormGroup.controls;
  }

  get transactionForm() {
    return this.incomeFormGroup.controls.accountTransactionForm['controls'];
  }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.incomeFromAccountDataResponse)) {
      this.dataForEdit = JSON.parse(this.incomeFromAccountDataResponse.data);
      this.incomeFormGroup.patchValue(this.dataForEdit);
      if (!this.dataForEdit.newCustomerChecked && !ObjectUtil.isEmpty(this.dataForEdit.accountTransactionForm)) {
      this.incomeFormGroup.get('accountTransactionForm').patchValue(this.dataForEdit.accountTransactionForm);
      }
    }

  }

  buildForm() {
    this.incomeFormGroup = this.formBuilder.group({
      interestDuringReview: [undefined,
        [Validators.required]],
      interestAfterNextReview: [undefined,
        [Validators.required]],
      commissionDuringReview: [undefined,
        [Validators.required]],
      commissionAfterNextReview: [undefined,
        [Validators.required]],
      otherChargesDuringReview: [undefined,
        [Validators.required]],
      otherChargesAfterNextReview: [undefined,
        [Validators.required]],
      incomeFromTheAccount: [undefined,
        Validators.required],
      totalIncomeAfterNextReview: [undefined,
        [Validators.required]],
      totalIncomeDuringReview: [undefined,
        [Validators.required]],
      interestIncomeDuringReview: [undefined, [Validators.required]],
      interestIncomeAfterReview: [undefined, [Validators.required]],
      loanProcessingFeeDuringReview: [undefined, [Validators.required]],
      loanProcessingFeeAfterReview: [undefined, [Validators.required]],
      newCustomerChecked: [false],
      accountTransactionForm: this.buildAccountTransactionForm()
    });
  }

  buildAccountTransactionForm() {
    return this.formBuilder.group({
      creditTransactionNumber: [undefined, [Validators.required, Validators.pattern(Pattern.NUMBER_ONLY)]],
      creditTransactionValue: [undefined, [Validators.required, Validators.pattern(Pattern.NUMBER_ONLY)]],
      debitTransactionNumber: [undefined, [Validators.required, Validators.pattern(Pattern.NUMBER_ONLY)]],
      debitTransactionValue: [undefined, [Validators.required, Validators.pattern(Pattern.NUMBER_ONLY)]],
      repaymentTrackWithCurrentBank: [undefined, [Validators.required]],
    });
  }

  calculateTotalIncomeDuringReview() {
    let totalIncomeDuringReview = 0;
    totalIncomeDuringReview = this.incomeFormGroup.get('interestDuringReview').value +
        this.incomeFormGroup.get('commissionDuringReview').value +
        this.incomeFormGroup.get('otherChargesDuringReview').value +
        this.incomeFormGroup.get('totalIncomeDuringReview').value;
    this.incomeFormGroup.get('totalIncomeDuringReview').setValue(totalIncomeDuringReview);
  }

  calculateTotalIncomeAfterReview() {
    let totalIncomeAfterNextReview = 0;
    totalIncomeAfterNextReview = this.incomeFormGroup.get('interestAfterNextReview').value +
        this.incomeFormGroup.get('commissionAfterNextReview').value +
        this.incomeFormGroup.get('otherChargesAfterNextReview').value
    ;
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
    console.log(this.incomeFormGroup);
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

  onAdditionalFieldSelect(chk) {
    if (chk) {
      this.incomeFormGroup.get('accountTransactionForm').disable();
    } else {
      this.incomeFormGroup.get('accountTransactionForm').enable();
    }
    this.isNewCustomer = chk;
  }

  calcTotalIncomeDuringReview(amount) {
    let total = this.incomeFormGroup.get('totalIncomeDuringReview').value;
    total += amount;
    this.incomeFormGroup.get('totalIncomeDuringReview').setValue(NumberUtils.isNumber(total));
  }

  calcTotalIncomeAfterReview(amount) {
    let total = this.incomeFormGroup.get('totalIncomeAfterNextReview').value;
    total += amount;
    this.incomeFormGroup.get('totalIncomeAfterNextReview').setValue(NumberUtils.isNumber(total));
  }

}
