import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IncomeFromAccount} from '../../admin/modal/incomeFromAccount';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {Pattern} from '../../../@core/utils/constants/pattern';
import {RepaymentTrackCurrentBank} from '../../admin/modal/crg/RepaymentTrackCurrentBank';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {AffiliateId} from '../../../@core/utils/constants/affiliateId';
import {environment} from '../../../../environments/environment';
import {CompanyInfo} from '../../admin/modal/company-info';

@Component({
  selector: 'app-income-from-account',
  templateUrl: './income-from-account.component.html',
  styleUrls: ['./income-from-account.component.scss']
})
export class IncomeFromAccountComponent implements OnInit {
  @Input() incomeFromAccountDataResponse: IncomeFromAccount;
  @Input() fromProfile;
  @Output() incomeFromAccountDataEmitter = new EventEmitter();
  @Input() companyInfo: CompanyInfo;
  incomeDataObject = new IncomeFromAccount();
  incomeFormGroup: FormGroup;
  submitted = false;
  dataForEdit;
  isNewCustomer = false;
  pattern = Pattern;
  repaymentTrack = RepaymentTrackCurrentBank.enumObject();
  srdbAffiliatedId = false;

  disabledLambda = environment.disableCrgLambda;
  disabledAlpha = environment.disableCrgAlpha;

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
    if (LocalStorageUtil.getStorage().bankUtil.AFFILIATED_ID === AffiliateId.SRDB) {
      this.srdbAffiliatedId = true;
    }
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.incomeFromAccountDataResponse)) {
      this.dataForEdit = JSON.parse(this.incomeFromAccountDataResponse.data);
      this.incomeFormGroup.patchValue(this.dataForEdit);
      if (!this.dataForEdit.newCustomerChecked && !ObjectUtil.isEmpty(this.dataForEdit.accountTransactionForm)) {
      this.incomeFormGroup.get('accountTransactionForm').patchValue(this.dataForEdit.accountTransactionForm);
      } else {
        this.incomeFormGroup.get('accountTransactionForm').disable();
      }
    }
    if (!this.isNewCustomer && !ObjectUtil.isEmpty(this.companyInfo)) {
      if (!ObjectUtil.isEmpty(this.companyInfo.accountNo)) {
        this.incomeFormGroup.patchValue({
          accountNo: this.companyInfo.accountNo
        });
      }
    }
  }

  buildForm() {
    this.incomeFormGroup = this.formBuilder.group({
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
      accountTransactionForm: this.buildAccountTransactionForm(),

      // Added new formControl
      processingLastReview: [undefined],
      processingDuringReview: [undefined],
      processingNextReview: [undefined],
      renewalLastReview: [undefined],
      renewalDuringReview: [undefined],
      renewalNextReview: [undefined],
      exchangeLastReview: [undefined],
      exchangeDuringReview: [undefined],
      exchangeNextReview: [undefined],
      feeCommissionLastReview: [undefined],
      feeCommissionDuringReview: [undefined],
      feeCommissionNextReview: [undefined],
      otherChargesLastReview: [undefined],
      otherChargesDuringReview1: [undefined],
      otherChargesNextReview: [undefined],
      grossLastReview: [undefined],
      grossDuringReview: [undefined],
      grossNextReview: [undefined],
      overDraftLastReview: [undefined],
      overDraftDuringReview: [undefined],
      overDraftNextReview: [undefined],
      trLoanLastReview: [undefined],
      trLoanDuringReview: [undefined],
      trLoanNextReview: [undefined],
      demandLastReview: [undefined],
      demandDuringReview: [undefined],
      demandNextReview: [undefined],
      totalLastReview: [undefined],
      totalDuringReview: [undefined],
      totalNextReview: [undefined],
      interestIncome: [undefined],
      costBaseRate: [undefined],
      netInterestSurplus: [undefined],
      feeCommission: [undefined],
      otherIncome: [undefined],
      capitalCost: [undefined],
      economicProfit: [undefined],
      economicProfitPercentage: [undefined],
    });
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
    totalIncomeDuringReview =
        (this.incomeFormGroup.get('interestDuringReview').value +
        this.incomeFormGroup.get('commissionDuringReview').value +
        this.incomeFormGroup.get('otherChargesDuringReview').value +
        this.incomeFormGroup.get('loanProcessingDuringReview').value +
        this.incomeFormGroup.get('lcCommissionDuringReview').value +
        this.incomeFormGroup.get('guaranteeCommissionDuringReview').value).toFixed(2);
    this.incomeFormGroup.get('totalIncomeDuringReview').setValue(totalIncomeDuringReview);
  }

  calculateTotalIncomeAfterReview() {
    let totalIncomeAfterNextReview = 0;
    totalIncomeAfterNextReview =
        (this.incomeFormGroup.get('interestAfterNextReview').value +
        this.incomeFormGroup.get('commissionAfterNextReview').value +
        this.incomeFormGroup.get('otherChargesAfterNextReview').value +
        this.incomeFormGroup.get('loanProcessingAfterNextReview').value +
        this.incomeFormGroup.get('lcCommissionAfterNextReview').value +
        this.incomeFormGroup.get('guaranteeCommissionAfterNextReview').value).toFixed(2);
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

  onAdditionalFieldSelect(chk) {
    if (chk) {
      this.incomeFormGroup.get('accountTransactionForm').disable();
    } else {
      this.incomeFormGroup.get('accountTransactionForm').enable();
    }
    this.isNewCustomer = chk;
  }

  calculateTotalDuringReview() {
    let totalDuringReview = 0;
    totalDuringReview =
        (this.incomeFormGroup.get('processingDuringReview').value +
            this.incomeFormGroup.get('renewalDuringReview').value +
            this.incomeFormGroup.get('exchangeDuringReview').value +
            this.incomeFormGroup.get('feeCommissionDuringReview').value +
            this.incomeFormGroup.get('otherChargesDuringReview1').value +
            Number(this.incomeFormGroup.get('grossDuringReview').value)).toFixed(2);
    this.incomeFormGroup.get('totalDuringReview').patchValue(totalDuringReview);
  }

  calculateTotalNextReview() {
    let totalNextReview = 0;
    totalNextReview =
        (this.incomeFormGroup.get('processingNextReview').value +
            this.incomeFormGroup.get('renewalNextReview').value +
            this.incomeFormGroup.get('exchangeNextReview').value +
            this.incomeFormGroup.get('feeCommissionNextReview').value +
            this.incomeFormGroup.get('otherChargesNextReview').value +
            Number(this.incomeFormGroup.get('grossNextReview').value)).toFixed(2);
    console.log('gross123',  Number(this.incomeFormGroup.get('grossNextReview').value));
    console.log('total', totalNextReview);
    this.incomeFormGroup.get('totalNextReview').patchValue(totalNextReview);
  }

  calculateTotalLastReview() {
    let totalLastReview = 0;
    totalLastReview =
        (this.incomeFormGroup.get('processingLastReview').value +
            this.incomeFormGroup.get('renewalLastReview').value +
            this.incomeFormGroup.get('exchangeLastReview').value +
            this.incomeFormGroup.get('feeCommissionLastReview').value +
            this.incomeFormGroup.get('otherChargesLastReview').value +
            Number(this.incomeFormGroup.get('grossLastReview').value)).toFixed(2);
    console.log('totalLastReview', totalLastReview);
    this.incomeFormGroup.get('totalLastReview').patchValue(totalLastReview);
  }

  calculateGrossLastReview() {
    let totalGrossLastReview = 0;
    totalGrossLastReview =
        (this.incomeFormGroup.get('demandLastReview').value +
        this.incomeFormGroup.get('trLoanLastReview').value +
        this.incomeFormGroup.get('overDraftLastReview').value).toFixed(2);
    console.log('totalGrossLastReview', totalGrossLastReview);
    this.incomeFormGroup.get('grossLastReview').patchValue(totalGrossLastReview);
    this.calculateTotalLastReview();
  }

  calculateGrossNextReview() {
    let totalGrossNextReview = 0;
    totalGrossNextReview =
        (this.incomeFormGroup.get('overDraftNextReview').value +
        this.incomeFormGroup.get('trLoanNextReview').value +
        this.incomeFormGroup.get('demandNextReview').value.toFixed(2));
    console.log('totalGrossNextReview', totalGrossNextReview.toFixed(2));
    this.incomeFormGroup.get('grossNextReview').patchValue(totalGrossNextReview.toFixed(2));
    this.calculateTotalLastReview();
  }

  calculateGrossDuringReview() {
    let totalGrossDuringReView = 0;
    totalGrossDuringReView =
        (this.incomeFormGroup.get('overDraftDuringReview').value +
        this.incomeFormGroup.get('trLoanDuringReview').value +
        this.incomeFormGroup.get('demandDuringReview').value).toFixed(2);
    console.log('totalGrossDuringReView', totalGrossDuringReView);
    this.incomeFormGroup.get('grossDuringReview').patchValue(totalGrossDuringReView);
    this.calculateTotalDuringReview();
  }

  calculateNetInterestSurplus() {
    let totalInterestSurplus = 0;
    totalInterestSurplus =
        Number((this.incomeFormGroup.get('costBaseRate').value -
            this.incomeFormGroup.get('interestIncome').value).toFixed(2));
    this.incomeFormGroup.get('netInterestSurplus').setValue(totalInterestSurplus);
  }

  calculateEconomicProfit() {
    let totalEconomicProfit = 0;
    totalEconomicProfit =
        Number((this.incomeFormGroup.get('netInterestSurplus').value +
        this.incomeFormGroup.get('feeCommission').value +
        this.incomeFormGroup.get('otherIncome').value -
        this.incomeFormGroup.get('capitalCost').value).toFixed(2));
    this.incomeFormGroup.get('economicProfit').patchValue(totalEconomicProfit);
  }

}
