import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IncomeFromAccount} from '../../admin/modal/incomeFromAccount';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {Pattern} from '../../../@core/utils/constants/pattern';
import {RepaymentTrackCurrentBank} from '../../admin/modal/crg/RepaymentTrackCurrentBank';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {AffiliateId} from '../../../@core/utils/constants/affiliateId';
import {environment} from '../../../../environments/environment';
import {NgxSpinnerService} from 'ngx-spinner';

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
  srdbAffiliatedId = false;
  currentFormData: Object;
  disabledLambda = environment.disableCrgLambda;
  disabledAlpha = environment.disableCrgAlpha;

  constructor(private formBuilder: FormBuilder,
              private el: ElementRef,
              private overlay: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    if (LocalStorageUtil.getStorage().bankUtil.AFFILIATED_ID === AffiliateId.SRDB) {
      this.srdbAffiliatedId = true;
    }
    this.buildForm();
    this.arrayData();
    if (!this.incomeFromAccountDataResponse) {
        this.addIncomeFromAccount();
    }
  }

  buildForm() {
    this.incomeFormGroup = this.formBuilder.group({
      incomeFromAccount: this.formBuilder.array([])
    });
  }

  setIncomeFromAccount(currentData) {
    const controls = this.incomeFormGroup.get('incomeFromAccount') as FormArray;
    currentData.forEach(singleData => {
        if ( currentData.accountTransactionForm === undefined) {
            controls.push(
                this.formBuilder.group({
                    interestDuringReview: [singleData.interestDuringReview, [Validators.required]],
                    interestAfterNextReview: [singleData.interestAfterNextReview, [Validators.required]],
                    commissionDuringReview: [singleData.commissionDuringReview],
                    commissionAfterNextReview: [singleData.commissionAfterNextReview],
                    otherChargesDuringReview: [singleData.otherChargesDuringReview],
                    otherChargesAfterNextReview: [singleData.otherChargesAfterNextReview],
                    incomeFromTheAccount: [singleData.incomeFromTheAccount, [Validators.required]],
                    totalIncomeAfterNextReview: [singleData.totalIncomeAfterNextReview, [Validators.required]],
                    totalIncomeDuringReview: [singleData.totalIncomeDuringReview, [Validators.required]],
                    accountNo: [singleData.accountNo],
                    newCustomerChecked: [singleData.newCustomerChecked],
                    loanProcessingDuringReview: singleData.loanProcessingDuringReview,
                    loanProcessingAfterNextReview: singleData.loanProcessingAfterNextReview,
                    lcCommissionDuringReview: singleData.lcCommissionDuringReview,
                    lcCommissionAfterNextReview: singleData.lcCommissionAfterNextReview,
                    guaranteeCommissionDuringReview: singleData.guaranteeCommissionDuringReview,
                    guaranteeCommissionAfterNextReview: singleData.guaranteeCommissionAfterNextReview,
                    accountTransactionForm: this.buildAccountTransactionForm()
                })
            );
        } else {
            controls.push(
                this.formBuilder.group({
                    interestDuringReview: [singleData.interestDuringReview, [Validators.required]],
                    interestAfterNextReview: [singleData.interestAfterNextReview, [Validators.required]],
                    commissionDuringReview: [singleData.commissionDuringReview],
                    commissionAfterNextReview: [singleData.commissionAfterNextReview],
                    otherChargesDuringReview: [singleData.otherChargesDuringReview],
                    otherChargesAfterNextReview: [singleData.otherChargesAfterNextReview],
                    incomeFromTheAccount: [singleData.incomeFromTheAccount, [Validators.required]],
                    totalIncomeAfterNextReview: [singleData.totalIncomeAfterNextReview, [Validators.required]],
                    totalIncomeDuringReview: [singleData.totalIncomeDuringReview, [Validators.required]],
                    accountNo: [singleData.accountNo],
                    newCustomerChecked: [singleData.newCustomerChecked],
                    loanProcessingDuringReview: singleData.loanProcessingDuringReview,
                    loanProcessingAfterNextReview: singleData.loanProcessingAfterNextReview,
                    lcCommissionDuringReview: singleData.lcCommissionDuringReview,
                    lcCommissionAfterNextReview: singleData.lcCommissionAfterNextReview,
                    guaranteeCommissionDuringReview: singleData.guaranteeCommissionDuringReview,
                    guaranteeCommissionAfterNextReview: singleData.guaranteeCommissionAfterNextReview,
                    accountTransactionForm: this.formBuilder.group({
                        creditTransactionNumber: [singleData.accountTransactionForm.creditTransactionNumber,
                            [Validators.required, Validators.pattern(Pattern.NUMBER_DOUBLE)]],
                        creditTransactionValue: [singleData.accountTransactionForm.creditTransactionValue,
                            [Validators.required, Validators.pattern(Pattern.NUMBER_DOUBLE)]],
                        debitTransactionNumber: [singleData.accountTransactionForm.debitTransactionNumber,
                            [Validators.required, Validators.pattern(Pattern.NUMBER_DOUBLE)]],
                        debitTransactionValue: [singleData.accountTransactionForm.debitTransactionValue,
                            [Validators.required, Validators.pattern(Pattern.NUMBER_DOUBLE)]],
                        repaymentTrackWithCurrentBank: [singleData.accountTransactionForm.repaymentTrackWithCurrentBank,
                            !this.disabledLambda && !this.disabledAlpha ? Validators.required : undefined]
                    })
                })
            );
        }
    });
  }

  addIncomeFromAccount() {
    const control = this.incomeFormGroup.get('incomeFromAccount') as FormArray;
    control.push(
        this.formBuilder.group({
          interestDuringReview: [undefined,
            [Validators.required]],
          interestAfterNextReview: [undefined,
            [Validators.required]],
          commissionDuringReview: [undefined],
          commissionAfterNextReview: [undefined],
          otherChargesDuringReview: [undefined],
          otherChargesAfterNextReview: [undefined],
          incomeFromTheAccount: [undefined,
            Validators.required],
          totalIncomeAfterNextReview: [undefined,
            [Validators.required]],
          totalIncomeDuringReview: [undefined,
            [Validators.required]],
          accountNo: [undefined],
          newCustomerChecked: [false],
          loanProcessingDuringReview: undefined,
          loanProcessingAfterNextReview: undefined,
          lcCommissionDuringReview: undefined,
          lcCommissionAfterNextReview: undefined,
          guaranteeCommissionDuringReview: undefined,
          guaranteeCommissionAfterNextReview: undefined,
          accountTransactionForm: this.buildAccountTransactionForm()
        })
    );
  }

  buildAccountTransactionForm() {
    return this.formBuilder.group({
      creditTransactionNumber: [undefined, [Validators.required, Validators.pattern(Pattern.NUMBER_DOUBLE)]],
      creditTransactionValue: [undefined, [Validators.required, Validators.pattern(Pattern.NUMBER_DOUBLE)]],
      debitTransactionNumber: [undefined, [Validators.required, Validators.pattern(Pattern.NUMBER_DOUBLE)]],
      debitTransactionValue: [undefined, [Validators.required, Validators.pattern(Pattern.NUMBER_DOUBLE)]],
      repaymentTrackWithCurrentBank: [undefined, !this.disabledLambda && !this.disabledAlpha ? Validators.required : undefined]
    });
  }

  calculateTotalIncomeDuringReview() {
    let totalIncomeDuringReview = 0;
      (this.incomeFormGroup.get('incomeFromAccount') as FormArray).controls.forEach(item => {
          totalIncomeDuringReview =
              (item.get('interestDuringReview').value +
                  item.get('commissionDuringReview').value +
                  item.get('otherChargesDuringReview').value +
                  item.get('loanProcessingDuringReview').value +
                  item.get('lcCommissionDuringReview').value +
                  item.get('guaranteeCommissionDuringReview').value).toFixed(2);
          item.get('totalIncomeDuringReview').setValue(totalIncomeDuringReview);
      });
  }

  calculateTotalIncomeAfterReview() {
    let totalIncomeAfterNextReview = 0;
      (this.incomeFormGroup.get('incomeFromAccount') as FormArray).controls.forEach(item => {
          totalIncomeAfterNextReview =
              (item.get('interestAfterNextReview').value +
                  item.get('commissionAfterNextReview').value +
                  item.get('otherChargesAfterNextReview').value +
                  item.get('loanProcessingAfterNextReview').value +
                  item.get('lcCommissionAfterNextReview').value +
                  item.get('guaranteeCommissionAfterNextReview').value).toFixed(2);
          item.get('totalIncomeAfterNextReview').setValue(totalIncomeAfterNextReview);
      });

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
    this.overlay.show();
    this.submitted = true;
        const data = this.incomeFormGroup.get('incomeFromAccount') as FormArray;
        data.controls.forEach(item => {
            const controls = item.get('accountTransactionForm') as FormGroup;
            const newCustomer = item.value.newCustomerChecked;
            this.changeValidation(controls, newCustomer);
        });
    if (this.incomeFormGroup.invalid) {
      this.scrollToFirstInvalidControl();
      this.overlay.hide();
      return;
    }
    if (!ObjectUtil.isEmpty(this.incomeFromAccountDataResponse)) {
      this.incomeDataObject = this.incomeFromAccountDataResponse;
    }
    this.currentFormData = this.incomeFormGroup.value;
    this.incomeDataObject.data = JSON.stringify(this.currentFormData);
    this.incomeFromAccountDataEmitter.emit(this.incomeDataObject.data);
  }

  onAdditionalFieldSelect(chk) {
    this.isNewCustomer = chk;
  }
    arrayData() {
        if (!ObjectUtil.isEmpty(this.incomeFromAccountDataResponse)) {
            const data = [];
            this.dataForEdit = JSON.parse(this.incomeFromAccountDataResponse.data);
            if (this.dataForEdit.incomeFromAccount) {
                this.dataForEdit.incomeFromAccount.forEach(item => {
                    data.push(item);
                });
            } else {
                data.push(this.dataForEdit);
            }
            this.setIncomeFromAccount(data);
        }
    }
    removeIncomeFromAccount(incomeIndex) {
        (this.incomeFormGroup.get('incomeFromAccount') as FormArray).removeAt(incomeIndex);
    }
    changeValidation(controls, newCustomer) {
        if (newCustomer === true) {
            controls.get('creditTransactionNumber').reset();
            controls.get('creditTransactionNumber').setValidators(null);
            controls.get('creditTransactionNumber').updateValueAndValidity();
            controls.get('creditTransactionValue').reset();
            controls.get('creditTransactionValue').setValidators(null);
            controls.get('creditTransactionValue').updateValueAndValidity();
            controls.get('debitTransactionNumber').reset();
            controls.get('debitTransactionNumber').setValidators(null);
            controls.get('debitTransactionNumber').updateValueAndValidity();
            controls.get('debitTransactionValue').reset();
            controls.get('debitTransactionValue').setValidators(null);
            controls.get('debitTransactionValue').updateValueAndValidity();
        } else {
            controls.get('creditTransactionNumber').setValidators([Validators.required, Validators.pattern(Pattern.NUMBER_DOUBLE)]);
            controls.get('creditTransactionNumber').updateValueAndValidity();
            controls.get('creditTransactionValue').setValidators([Validators.required, Validators.pattern(Pattern.NUMBER_DOUBLE)]);
            controls.get('creditTransactionValue').updateValueAndValidity();
            controls.get('debitTransactionNumber').setValidators([Validators.required, Validators.pattern(Pattern.NUMBER_DOUBLE)]);
            controls.get('debitTransactionNumber').updateValueAndValidity();
            controls.get('debitTransactionValue').setValidators([Validators.required, Validators.pattern(Pattern.NUMBER_DOUBLE)]);
            controls.get('debitTransactionValue').updateValueAndValidity();
        }
    }
}
