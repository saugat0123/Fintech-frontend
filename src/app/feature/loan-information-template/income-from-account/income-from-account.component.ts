import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IncomeFromAccount} from '../../admin/modal/incomeFromAccount';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {Pattern} from '../../../@core/utils/constants/pattern';
import {RepaymentTrackCurrentBank} from '../../admin/modal/crg/RepaymentTrackCurrentBank';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {AffiliateId} from '../../../@core/utils/constants/affiliateId';
import {environment} from '../../../../environments/environment';
import {CompanyInfo} from '../../admin/modal/company-info';
import {CustomerInfoData} from '../../loan/model/customerInfoData';

@Component({
  selector: 'app-income-from-account',
  templateUrl: './income-from-account.component.html',
  styleUrls: ['./income-from-account.component.scss']
})
export class IncomeFromAccountComponent implements OnInit {
  @Input() incomeFromAccountDataResponse: IncomeFromAccount;
  @Input() fromProfile;
  @Output() incomeFromAccountDataEmitter = new EventEmitter();
  @Input() customerInfo: CustomerInfoData;
  incomeDataObject = new IncomeFromAccount();
  incomeFormGroup: FormGroup;
  submitted = false;
  dataForEdit;
  isNewCustomer = false;
  pattern = Pattern;
  repaymentTrack = RepaymentTrackCurrentBank.enumObject();
  srdbAffiliatedId = false;
  individual = false;
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
    this.buildForm();
    if (LocalStorageUtil.getStorage().bankUtil.AFFILIATED_ID === AffiliateId.SRDB) {
      this.srdbAffiliatedId = true;
    }
    if (!ObjectUtil.isEmpty(this.customerInfo)) {
      if (this.customerInfo.customerType === 'INDIVIDUAL') {
        this.individual = true;
        this.incomeFormGroup.get('accountTransactionForm').enable();
      } else {
        this.incomeFormGroup.get('accountTransactionForm').disable();
      }
    }
    if (!ObjectUtil.isEmpty(this.incomeFromAccountDataResponse)) {
      this.dataForEdit = JSON.parse(this.incomeFromAccountDataResponse.data);
      this.incomeFormGroup.patchValue(this.dataForEdit);
      this.setGrossSubCategory(this.dataForEdit.grossSubCateGory);  // If add more feature is implemented
      if (!this.dataForEdit.newCustomerChecked && !ObjectUtil.isEmpty(this.dataForEdit.accountTransactionForm)) {
      this.incomeFormGroup.get('accountTransactionForm').patchValue(this.dataForEdit.accountTransactionForm);
      } else {
        this.incomeFormGroup.get('accountTransactionForm').disable();
      }
      this.setRiskBasedPrice(this.dataForEdit.riskBasedPrice);
    } else {
      this.addRiskBasedPrice();
    }
    this.checkIndividual();
  }

  buildForm() {
    this.incomeFormGroup = this.formBuilder.group({
      interestDuringReview: [undefined],
      interestAfterNextReview: [undefined],
      commissionDuringReview: [undefined],
      commissionAfterNextReview: [undefined],
      otherChargesDuringReview: [undefined],
      otherChargesAfterNextReview: [undefined],
      incomeFromTheAccount: [undefined],
      totalIncomeAfterNextReview: [undefined],
      totalIncomeDuringReview: [undefined],
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
      grossLastReview: [0],
      grossDuringReview: [0],
      grossNextReview: [0],
      overDraftLastReview: [undefined],
      overDraftDuringReview: [undefined],
      overDraftNextReview: [undefined],
      trLoanLastReview: [undefined],
      trLoanDuringReview: [undefined],
      trLoanNextReview: [undefined],
      demandLastReview: [undefined],
      demandDuringReview: [undefined],
      demandNextReview: [undefined],
      totalLastReview: [0],
      totalDuringReview: [0],
      totalNextReview: [0],
      interestIncome: [undefined],
      costBaseRate: [undefined],
      netInterestSurplus: [0],
      feeCommission: [undefined],
      otherIncome: [undefined],
      capitalCost: [undefined],
      economicProfit: [0],
      economicProfitPercentage: [undefined],
      grossSubCateGory: this.formBuilder.array([]),
      riskBasedPrice: this.formBuilder.array([]),
      earningRemarkIndividual: [undefined],
      earningRemarkInstitutional: [undefined],
      riskRemark: [undefined]
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
    this.incomeFormGroup.get('totalLastReview').patchValue(totalLastReview);
  }

  calculateGrossLastReview() {
    let totalGrossLastReview = 0;
    let grossLast = 0;
    const gross = this.incomeFormGroup.get('grossSubCateGory') as FormArray;
    gross['value'].forEach(g => {
      grossLast += Number(g['grossLast']);
    });
    totalGrossLastReview =
        (this.incomeFormGroup.get('demandLastReview').value +
        this.incomeFormGroup.get('trLoanLastReview').value +
        this.incomeFormGroup.get('overDraftLastReview').value +
            grossLast).toFixed(2);
    this.incomeFormGroup.get('grossLastReview').patchValue(totalGrossLastReview);
    this.calculateTotalLastReview();
  }

  calculateGrossNextReview() {
    let totalGrossNextReview = 0;
    let grossNext = 0;
    const gross = this.incomeFormGroup.get('grossSubCateGory') as FormArray;
    gross['value'].forEach(g => {
      grossNext += Number(g['grossNext']);
    });
    totalGrossNextReview =
        (this.incomeFormGroup.get('overDraftNextReview').value +
        this.incomeFormGroup.get('trLoanNextReview').value +
        this.incomeFormGroup.get('demandNextReview').value +
            grossNext).toFixed(2);
    this.incomeFormGroup.get('grossNextReview').patchValue(totalGrossNextReview);
    this.calculateTotalNextReview();
  }

  calculateGrossDuringReview() {
    let totalGrossDuringReView = 0;
    let grossDuring = 0;
    const gross = this.incomeFormGroup.get('grossSubCateGory') as FormArray;
    gross['value'].forEach(g => {
      grossDuring += Number(g['grossDuring']);
    });
    totalGrossDuringReView =
        (this.incomeFormGroup.get('overDraftDuringReview').value +
        this.incomeFormGroup.get('trLoanDuringReview').value +
        this.incomeFormGroup.get('demandDuringReview').value +
            grossDuring).toFixed(2);
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

  // Adding gross profit category
  addGrossProfitCategory(input) {
    const control = this.incomeFormGroup.get('grossSubCateGory') as FormArray;
    control.push(
        this.formBuilder.group({
          name: [input.value],
          grossLast: [0],
          grossDuring: [0],
          grossNext: [0]
        })
    );
    input.value = '';
  }

  removeGrossSubCategory(i) {
    (<FormArray>this.incomeFormGroup.get('grossSubCateGory')).removeAt(i);
    this.calculateGrossNextReview();
    this.calculateGrossDuringReview();
    this.calculateGrossLastReview();
  }

  // setting Ad more field value
  private setGrossSubCategory(grossSubCateGory) {
    const data = this.incomeFormGroup.get('grossSubCateGory') as FormArray;
    if (!ObjectUtil.isEmpty(grossSubCateGory)) {
      grossSubCateGory.forEach(d => {
        data.push(
            this.formBuilder.group({
              name: [d.name],
              grossLast: [d.grossLast],
              grossDuring: [d.grossDuring],
              grossNext: [d.grossNext]
            })
        );
      });
    }
  }

  controlValidation(controlNames: string[], validate) {
    controlNames.forEach(s => {
      if (validate) {
        this.incomeFormGroup.get(s).setValidators(Validators.required);
      } else {
        this.incomeFormGroup.get(s).clearValidators();
      }
      this.incomeFormGroup.get(s).updateValueAndValidity();
    });
  }

  checkIndividual() {
    const individualField = ['interestDuringReview', 'interestAfterNextReview', 'incomeFromTheAccount',
      'totalIncomeAfterNextReview', 'totalIncomeDuringReview'];
    if (this.individual) {
      this.controlValidation(individualField, true);
    } else {
      this.controlValidation(individualField, false);
    }
  }

  // Add risk based price
  addRiskBasedPrice() {
    const riskData = this.incomeFormGroup.get('riskBasedPrice') as FormArray;
    riskData.push(
        this.formBuilder.group({
          facility: [undefined],
          targetPricing: [undefined],
          exitingInterestRate: [undefined],
          difference: [undefined],
        })
    );
  }

  removeRiskBasedPrice(i) {
    (<FormArray>this.incomeFormGroup.get('riskBasedPrice')).removeAt(i);
  }

  calculateDifference(i) {
    const data = (this.incomeFormGroup.get(['riskBasedPrice', i, 'targetPricing']).value -
        this.incomeFormGroup.get(['riskBasedPrice', i, 'exitingInterestRate']).value).toFixed(2);
    this.incomeFormGroup.get(['riskBasedPrice', i, 'difference']).patchValue(data);
  }

  setRiskBasedPrice(data) {
    const riskData = this.incomeFormGroup.get('riskBasedPrice') as FormArray;
    if (!ObjectUtil.isEmpty(data)) {
      data.forEach(d => {
        riskData.push(this.formBuilder.group({
              facility: [d.facility],
              targetPricing: [d.targetPricing],
              exitingInterestRate: [d.exitingInterestRate],
              difference: [d.difference],
            })
        );
      });
    }
  }
}
