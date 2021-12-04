import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ObjectUtil} from "../../../../../../../../../@core/utils/ObjectUtil";
import {NepaliCurrencyWordPipe} from "../../../../../../../../../@core/pipe/nepali-currency-word.pipe";
import {CurrencyFormatterPipe} from "../../../../../../../../../@core/pipe/currency-formatter.pipe";
import {EngToNepaliNumberPipe} from "../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe";
import {SbTranslateService} from "../../../../../../../../../@core/service/sbtranslate.service";
import {DatePipe} from "@angular/common";
import {EngNepDatePipe} from "nepali-patro";

@Component({
  selector: 'app-term-loan-to-or-for',
  templateUrl: './term-loan-to-or-for.component.html',
  styleUrls: ['./term-loan-to-or-for.component.scss']
})
export class TermLoanToOrForComponent implements OnInit {
  @Input() loanName;
  termLoanForm: FormGroup;
  loanDetails: any = [];
  isComplementaryOtherLoan = false;
  isVehicleSelected = false;
  isOtherSelected = false;
  isNewEMI = false;
  isEMIAnnual = false;
  isNewInstallment = false;
  isInstallmentAnnual = false;
  isSubsequent = false;
  isEvery = false;
  ADExpiry = false;
  BSExpiry = false;
  isYearly = false;
  isSemiYearly = false;
  isQuarterly = false;
  isMonthly = false;
  translatedFormGroup: FormGroup;
  translatedValue: any;
  dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];

  constructor(private formBuilder: FormBuilder,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private currencyFormatterPipe: CurrencyFormatterPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private translateService: SbTranslateService,
              private engToNepDatePipe: EngNepDatePipe,
              private datePipe: DatePipe) { }

  ngOnInit() {
    this.buildForm();
    if(!ObjectUtil.isEmpty(this.loanName)) {
      this.loanDetails = this.loanName;
    }
  }

  buildForm() {
    this.termLoanForm = this.formBuilder.group({
      //For Form Data
      complementaryOther: [undefined],
      multiLoan: [undefined],
      termLoanFor: [undefined],
      termLoanType: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      purposeOfLoan: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      interestRate: [undefined],
      emiPaymentType: [undefined],
      emiInfigure: [undefined],
      emiInWords: [undefined],
      numberOfInstallment: [undefined],
      serviceCharge: [undefined],
      tenureOfLoan: [undefined],
      dateOfExpiryType: [undefined],
      dateOfExpiryNepali: [undefined],
      dateOfExpiry: [undefined],
      subsidyInterestRate: [undefined],
      paymentTerms: [undefined],
      paymentAmountFigure: [undefined],
      paymentAmountWords: [undefined],
      numberOfPayments: [undefined],

      //For Translated Data
      complementaryOtherTrans: [undefined],
      multiLoanTrans: [undefined],
      termLoanForTrans: [undefined],
      termLoanTypeTrans: [undefined],
      loanAmountTrans: [undefined],
      loanAmountWordsTrans: [undefined],
      purposeOfLoanTrans: [undefined],
      baseRateTrans: [undefined],
      premiumRateTrans: [undefined],
      interestRateTrans: [undefined],
      emiPaymentTypeTrans: [undefined],
      emiInfigureTrans: [undefined],
      emiInWordsTrans: [undefined],
      numberOfInstallmentTrans: [undefined],
      serviceChargeTrans: [undefined],
      tenureOfLoanTrans: [undefined],
      dateOfExpiryTypeTrans: [undefined],
      dateOfExpiryNepaliTrans: [undefined],
      dateOfExpiryTrans: [undefined],
      subsidyInterestRateTrans: [undefined],
      paymentTermsTrans: [undefined],
      paymentAmountFigureTrans: [undefined],
      paymentAmountWordsTrans: [undefined],
      numberOfPaymentsTrans: [undefined],

      //For Corrected Data
      complementaryOtherCT: [undefined],
      multiLoanCT: [undefined],
      termLoanForCT: [undefined],
      termLoanTypeCT: [undefined],
      loanAmountCT: [undefined],
      loanAmountWordsCT: [undefined],
      purposeOfLoanCT: [undefined],
      baseRateCT: [undefined],
      premiumRateCT: [undefined],
      interestRateCT: [undefined],
      emiPaymentTypeCT: [undefined],
      emiInfigureCT: [undefined],
      emiInWordsCT: [undefined],
      numberOfInstallmentCT: [undefined],
      serviceChargeCT: [undefined],
      tenureOfLoanCT: [undefined],
      dateOfExpiryTypeCT: [undefined],
      dateOfExpiryNepaliCT: [undefined],
      dateOfExpiryCT: [undefined],
      subsidyInterestRateCT: [undefined],
      paymentTermsCT: [undefined],
      paymentAmountFigureCT: [undefined],
      paymentAmountWordsCT: [undefined],
      numberOfPaymentsCT: [undefined],

    })
  }

  checkComplimetryOtherLoan(data) {
    this.isComplementaryOtherLoan = data;
    this.termLoanForm.get('complementaryOther').patchValue(this.isComplementaryOtherLoan);
  }

  setTermLoan(data) {
    const tempData = !ObjectUtil.isEmpty(data) ? data : '';
    this.isVehicleSelected = tempData === 'VEHICLE';
    this.isOtherSelected = tempData === 'OTHER';
  }

  setTermLoanType(data) {
    const tempData = !ObjectUtil.isEmpty(data) ? data : '';
    this.isNewEMI = tempData === 'NEW_EMI';
    this.isEMIAnnual = tempData === 'NEW_ANNUAL_REVIEW';
    this.isNewInstallment = tempData === 'NEW_INSTALLMENT_BASIS';
    this.isInstallmentAnnual = tempData === 'INSTALLMENT_ANNUAL_REVIEW';
  }

  public getNumAmountWord(numLabel, wordLabel): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.termLoanForm.get(numLabel).value);
    this.termLoanForm.get(wordLabel).patchValue(transformValue);
  }

  calInterestRate() {
    const baseRate = this.termLoanForm.get('baseRate').value;
    const premiumRate = this.termLoanForm.get('premiumRate').value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.termLoanForm.get('interestRate').patchValue(sum);
  }

  setEMIPaymentType(data) {
    const tempData = !ObjectUtil.isEmpty(data) ? data : '';
    this.isSubsequent = tempData === 'SUBSEQUENT_MONTH';
    this.isEvery = tempData === 'EVERY_20TH';
  }

  public checkDateOfExpiry(value): void {
    this.ADExpiry = value === 'AD';
    this.BSExpiry = value === 'BS';
  }

  setPaymentTerms(data) {
    const tempData = !ObjectUtil.isEmpty(data) ? data : '';
    this.isYearly = tempData === 'YEARLY';
    this.isSemiYearly = tempData === 'SEMI_YEARLY';
    this.isQuarterly = tempData === 'QUARTERLY';
    this.isMonthly = tempData === 'MONTHLY';
  }

  async translateAndSetVal() {
    this.termLoanForm.get('complementaryOther').patchValue(this.isComplementaryOtherLoan);
    const tempComplementary = this.termLoanForm.get('complementaryOther').value;
    if (!ObjectUtil.isEmpty(tempComplementary)) {
      this.termLoanForm.get('complementaryOtherTrans').patchValue(tempComplementary);
    }

    const tempMultiLoan = this.termLoanForm.get('multiLoan').value;
    if (!ObjectUtil.isEmpty(tempMultiLoan)) {
      this.termLoanForm.get('multiLoanTrans').patchValue(tempMultiLoan);
    }

    const tempTermLoanFor = this.termLoanForm.get('termLoanFor').value;
    if (!ObjectUtil.isEmpty(tempTermLoanFor)) {
      this.termLoanForm.get('termLoanForTrans').patchValue(tempTermLoanFor);
    }

    const tempTermLoanType = this.termLoanForm.get('termLoanType').value;
    if (!ObjectUtil.isEmpty(tempTermLoanType)) {
      this.termLoanForm.get('termLoanTypeTrans').patchValue(tempTermLoanType);
    }

    const tempEMIPaymentType = this.termLoanForm.get('emiPaymentType').value;
    if (!ObjectUtil.isEmpty(tempEMIPaymentType)) {
      this.termLoanForm.get('emiPaymentTypeTrans').patchValue(tempEMIPaymentType);
    }

    const tempPaymentTerms = this.termLoanForm.get('paymentTerms').value;
    if (!ObjectUtil.isEmpty(tempPaymentTerms)) {
      this.termLoanForm.get('paymentTermsTrans').patchValue(tempPaymentTerms);
    }

    //Translation for Numbers
    const tempLoanAmount = this.termLoanForm.get('loanAmount').value;
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.termLoanForm.get('loanAmountTrans').patchValue(convertNumber);

    this.termLoanForm.get('loanAmountWordsTrans').patchValue(
        this.termLoanForm.get('loanAmountWords').value
    );

    const tempEMIAmount = this.termLoanForm.get('emiInfigure').value;
    const convertNumber1 = !ObjectUtil.isEmpty(tempEMIAmount) ?
        this.convertNumbersToNepali(tempEMIAmount, true) : '';
    this.termLoanForm.get('emiInfigureTrans').patchValue(convertNumber1);

    this.termLoanForm.get('emiInWordsTrans').patchValue(
        this.termLoanForm.get('emiInWords').value
    );

    const tempPaymentAmount = this.termLoanForm.get('paymentAmountFigure').value;
    const convertNumber2 = !ObjectUtil.isEmpty(tempPaymentAmount) ?
        this.convertNumbersToNepali(tempPaymentAmount, true) : '';
    this.termLoanForm.get('paymentAmountFigureTrans').patchValue(convertNumber2);

    this.termLoanForm.get('paymentAmountWordsTrans').patchValue(
        this.termLoanForm.get('paymentAmountWords').value
    );

    const tempPurposeOfLoan = this.convertNumbersToNepali(this.termLoanForm.get('purposeOfLoan').value, false);
    this.termLoanForm.get('purposeOfLoanTrans').patchValue(tempPurposeOfLoan);
    const tempBaseRate = this.convertNumbersToNepali(this.termLoanForm.get('baseRate').value, false);
    this.termLoanForm.get('baseRateTrans').patchValue(tempBaseRate);
    const tempPremiumRate = this.convertNumbersToNepali(this.termLoanForm.get('premiumRate').value, false);
    this.termLoanForm.get('premiumRateTrans').patchValue(tempPremiumRate);
    const tempInterestRate = this.convertNumbersToNepali(this.termLoanForm.get('interestRate').value, false);
    this.termLoanForm.get('interestRateTrans').patchValue(tempInterestRate);
    const tempNumberOfInstallment = this.convertNumbersToNepali(this.termLoanForm.get('numberOfInstallment').value, false);
    this.termLoanForm.get('numberOfInstallmentTrans').patchValue(tempNumberOfInstallment);
    const tempServiceCharge = this.convertNumbersToNepali(this.termLoanForm.get('serviceCharge').value, false);
    this.termLoanForm.get('serviceChargeTrans').patchValue(tempServiceCharge);
    const tempTenureOfLoan = this.convertNumbersToNepali(this.termLoanForm.get('tenureOfLoan').value, false);
    this.termLoanForm.get('tenureOfLoanTrans').patchValue(tempTenureOfLoan);
    const tempSubsidyInterestRate = this.convertNumbersToNepali(this.termLoanForm.get('subsidyInterestRate').value, false);
    this.termLoanForm.get('subsidyInterestRateTrans').patchValue(tempSubsidyInterestRate);
    const tempNumberOfPayments = this.convertNumbersToNepali(this.termLoanForm.get('numberOfPayments').value, false);
    this.termLoanForm.get('numberOfPaymentsTrans').patchValue(tempNumberOfPayments);

    /* Converting value for date */
    this.termLoanForm.get('dateOfExpiryTypeTrans').patchValue(
        this.termLoanForm.get('dateOfExpiryType').value
    );
    const tempDateOfExpType = this.termLoanForm.get('dateOfExpiryType').value;
    let tempExpDate;
    if (tempDateOfExpType === 'AD') {
      const tempEngExpDate = this.termLoanForm.get('dateOfExpiry').value;
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ?
          this.engToNepDatePipe.transform(this.datePipe.transform(tempEngExpDate), true) : '';
      this.termLoanForm.get('dateOfExpiryTrans').patchValue(tempExpDate);
    } else {
      const tempDateOfExpNep = this.termLoanForm.get('dateOfExpiryNepali').value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.nDate : '';
      this.termLoanForm.get('dateOfExpiryTrans').patchValue(tempExpDate);
    }

    // translated by google api
    this.translatedFormGroup = this.formBuilder.group({
      purposeOfLoan: !ObjectUtil.isEmpty(this.termLoanForm.get('purposeOfLoan').value) ? this.termLoanForm.get('purposeOfLoan').value : '',
    });

    this.translatedValue =  await this.translateService.translateForm(this.translatedFormGroup);

    this.termLoanForm.get('purposeOfLoanTrans').patchValue(this.translatedValue.purposeOfLoan);

    this.setCTValue();
  }

  setCTValue() {
    this.termLoanForm.get('complementaryOtherCT').patchValue(
        this.termLoanForm.get('complementaryOtherTrans').value
    );
    this.termLoanForm.get('multiLoanCT').patchValue(
        this.termLoanForm.get('multiLoanTrans').value
    );
    this.termLoanForm.get('termLoanForCT').patchValue(
        this.termLoanForm.get('termLoanForTrans').value
    );
    this.termLoanForm.get('termLoanTypeCT').patchValue(
        this.termLoanForm.get('termLoanTypeTrans').value
    );
    this.termLoanForm.get('loanAmountCT').patchValue(
        this.termLoanForm.get('loanAmountTrans').value
    );
    this.termLoanForm.get('loanAmountWordsCT').patchValue(
        this.termLoanForm.get('loanAmountWordsTrans').value
    );
    this.termLoanForm.get('loanAmountCT').patchValue(
        this.termLoanForm.get('loanAmountTrans').value
    );
    this.termLoanForm.get('loanAmountWordsCT').patchValue(
        this.termLoanForm.get('loanAmountWordsTrans').value
    );
    this.termLoanForm.get('purposeOfLoanCT').patchValue(
        this.translatedValue.purposeOfLoan
    );
    this.termLoanForm.get('baseRateCT').patchValue(
        this.termLoanForm.get('baseRateTrans').value
    );
    this.termLoanForm.get('premiumRateCT').patchValue(
        this.termLoanForm.get('premiumRateTrans').value
    );
    this.termLoanForm.get('interestRateCT').patchValue(
        this.termLoanForm.get('interestRateTrans').value
    );
    this.termLoanForm.get('emiPaymentTypeCT').patchValue(
        this.termLoanForm.get('emiPaymentTypeTrans').value
    );
    this.termLoanForm.get('emiInfigureCT').patchValue(
        this.termLoanForm.get('emiInfigureTrans').value
    );
    this.termLoanForm.get('emiInWordsCT').patchValue(
        this.termLoanForm.get('emiInWordsTrans').value
    );
    this.termLoanForm.get('numberOfInstallmentCT').patchValue(
        this.termLoanForm.get('numberOfInstallmentTrans').value
    );
    this.termLoanForm.get('serviceChargeCT').patchValue(
        this.termLoanForm.get('serviceChargeTrans').value
    );
    this.termLoanForm.get('tenureOfLoanCT').patchValue(
        this.termLoanForm.get('tenureOfLoanTrans').value
    );
    this.termLoanForm.get('dateOfExpiryTypeCT').patchValue(
        this.termLoanForm.get('dateOfExpiryTypeTrans').value
    );
    this.termLoanForm.get('dateOfExpiryNepaliCT').patchValue(
        this.termLoanForm.get('dateOfExpiryNepaliTrans').value
    );
    this.termLoanForm.get('dateOfExpiryCT').patchValue(
        this.termLoanForm.get('dateOfExpiryTrans').value
    );
    this.termLoanForm.get('subsidyInterestRateCT').patchValue(
        this.termLoanForm.get('subsidyInterestRateTrans').value
    );
    this.termLoanForm.get('paymentTermsCT').patchValue(
        this.termLoanForm.get('paymentTermsTrans').value
    );
    this.termLoanForm.get('paymentAmountFigureCT').patchValue(
        this.termLoanForm.get('paymentAmountFigureTrans').value
    );
    this.termLoanForm.get('paymentAmountWordsCT').patchValue(
        this.termLoanForm.get('paymentAmountWordsTrans').value
    );
    this.termLoanForm.get('numberOfPaymentsCT').patchValue(
        this.termLoanForm.get('numberOfPaymentsTrans').value
    );
    console.log(this.termLoanForm.value);
  }

  /* FOR CURRENCY FORMATTER IT TAKES PARAMETER TYPE TRUE*/
  convertNumbersToNepali(val, type: boolean) {
    let finalConvertedVal;
    if (!ObjectUtil.isEmpty(val)) {
      if (type) {
        finalConvertedVal = this.engToNepNumberPipe.transform(
            this.currencyFormatterPipe.transform(val.toString())
        );
      } else {
        finalConvertedVal = this.engToNepNumberPipe.transform(val.toString());
      }
    }
    return finalConvertedVal;
  }

}
