import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {SbTranslateService} from '../../../../../../@core/service/sbtranslate.service';
import {EnglishDateTransformPipe} from '../../../../../../@core/pipe/english-date-transform.pipe';

@Component({
  selector: 'app-personal-loan-combined-template-data',
  templateUrl: './personal-loan-combined-template-data.component.html',
  styleUrls: ['./personal-loan-combined-template-data.component.scss']
})
export class PersonalLoanCombinedTemplateDataComponent implements OnInit {
  @Input() loanName;
  @Input() cadDocAssignedLoan;
  @Input() offerDocumentList;
  @Input() globalBaseRate;
  personalLoanCombinedForm: FormGroup;
  loanDetails: any = [];
  filteredList: any = [];
  filteredLoanIdList: any = [];
  initialInformation: any;
  dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
  translatedFormGroup: FormGroup;
  constructor(private formBuilder: FormBuilder,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatterPipe: CurrencyFormatterPipe,
              private datePipe: DatePipe,
              private engToNepDatePipe: EngNepDatePipe,
              private engToNepWord: NepaliCurrencyWordPipe,
              private translateService: SbTranslateService,
              private englishCalenderPipe: EnglishDateTransformPipe) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.loanName)) {
      this.loanDetails = this.loanName;
      this.filteredListDetails(this.loanDetails);
    }
    if (this.offerDocumentList.length > 0) {
      this.offerDocumentList.forEach(offerLetter => {
        this.initialInformation = JSON.parse(offerLetter.initialInformation);
      });
      if (!ObjectUtil.isEmpty(this.initialInformation)) {
        this.personalLoanCombinedForm.patchValue(this.initialInformation.personalLoanCombinedForm);
      }
    }
    if (!ObjectUtil.isEmpty(this.filteredList)) {
      for (let val = 0; val < this.filteredList.length; val++) {
        const loanamountWords = this.engToNepWord.transform(this.filteredList[val].loanAmount.toFixed(2));
        this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', val, 'loanAmountInFigure']).patchValue(
            this.filteredList[val] ? this.filteredList[val].loanAmount : '');
        this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', val, 'loanAmountInWords']).patchValue(
            loanamountWords ? loanamountWords : '');
      }
    }
    this.setLoanId();
  }
  buildForm() {
    this.personalLoanCombinedForm = this.formBuilder.group({
      personalLoanCombinedFormArray: this.formBuilder.array([])
    });
  }
  filteredListDetails(loanDetails) {
    this.filteredList = loanDetails.filter(data => data.name === 'PERSONAL LOAN COMBINED');
    this.filteredList.forEach(value => {
      this.addLoanFormArr();
    });
  }
  addLoanFormArr() {
    (this.personalLoanCombinedForm.get('personalLoanCombinedFormArray') as FormArray ).push(this.buildFormArray());
  }
  buildFormArray() {
    return this.formBuilder.group({
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined],
      purposeOfLoan: [undefined],
      premiumRate: [undefined],
      interestRate: [undefined],
      loanAdminFeeInFigure: [undefined],
      loanAdminFeeInWords: [undefined],
      EMIAmountInFigure: [undefined],
      EMIAmountInWords: [undefined],
      numberOfInstallments: [undefined],
      paymentDateType: [undefined],
      paymentDate: [undefined],
      paymentDateNepali: [undefined],
      nameOfCompany: [undefined],

      loanAmountInFigureTrans: [undefined],
      loanAmountInWordsTrans: [undefined],
      purposeOfLoanTrans: [undefined],
      premiumRateTrans: [undefined],
      interestRateTrans: [undefined],
      loanAdminFeeInFigureTrans: [undefined],
      loanAdminFeeInWordsTrans: [undefined],
      EMIAmountInFigureTrans: [undefined],
      EMIAmountInWordsTrans: [undefined],
      numberOfInstallmentsTrans: [undefined],
      paymentDateTypeTrans: [undefined],
      paymentDateTrans: [undefined],
      paymentDateNepaliTrans: [undefined],
      nameOfCompanyTrans: [undefined],

      loanAmountInFigureCT: [undefined],
      loanAmountInWordsCT: [undefined],
      purposeOfLoanCT: [undefined],
      premiumRateCT: [undefined],
      interestRateCT: [undefined],
      loanAdminFeeInFigureCT: [undefined],
      loanAdminFeeInWordsCT: [undefined],
      EMIAmountInFigureCT: [undefined],
      EMIAmountInWordsCT: [undefined],
      numberOfInstallmentsCT: [undefined],
      paymentDateTypeCT: [undefined],
      paymentDateCT: [undefined],
      paymentDateNepaliCT: [undefined],
      nameOfCompanyCT: [undefined],
      accNum: [undefined],
      accNumTrans: [undefined],
      accNumCT: [undefined],

      repaymentCase: [undefined],
      interestRateType: [undefined],
      loanId: [undefined],
      loanName: [undefined],
      loanNameNepali: [undefined]
    });
  }
  setLoanId() {
    this.filteredLoanIdList = this.cadDocAssignedLoan.filter(data =>
        data.loan.name === 'PERSONAL LOAN COMBINED');
    this.filteredList.forEach((val, i) => {
      this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'loanId']).patchValue(
          this.filteredLoanIdList[i].proposal.id);
      this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'loanName']).patchValue(
          this.filteredLoanIdList[i].loan.name);
      this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'loanNameNepali']).patchValue(
          this.filteredLoanIdList[i].loan.nepaliName);
    });
  }
  public getNumAmountWord(numLabel, wordLabel, index, arrayName): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.personalLoanCombinedForm.get(
        [arrayName, index, numLabel]).value ? this.personalLoanCombinedForm.get(
        [arrayName, index, numLabel]).value.toFixed(2) : '');
    this.personalLoanCombinedForm.get([arrayName, index, wordLabel]).patchValue(transformValue);
  }

  async translateAndSetVal(i) {

    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    const tempLoanAmount = this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'loanAmountInFigure']).value ?
        this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'loanAmountInFigure']).value.toFixed(2) : '';
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'loanAmountInFigureTrans']).patchValue(convertNumber);
    this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'loanAmountInFigureCT']).patchValue(
        this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'loanAmountInFigureTrans']).value);

    this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'loanAmountInWordsTrans']).patchValue(
        this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'loanAmountInWords']).value);
    this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'loanAmountInWordsCT']).patchValue(
        this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'loanAmountInWordsTrans']).value);
    // set value for account number
    const tempAccNum = this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'accNum']).value ?
        this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'accNum']).value : '';
    const convertAccNum = !ObjectUtil.isEmpty(tempAccNum) ? this.engToNepNumberPipe.transform(tempAccNum, true) : '';
    this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'accNumTrans']).patchValue(convertAccNum);
    this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'accNumCT']).patchValue(
        this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'accNumTrans']).value);
    this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'accNumCT']).patchValue(
        this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'accNumTrans']).value);

    this.translatedFormGroup = this.formBuilder.group({
      purposeOfLoan: this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'purposeOfLoan']).value ?
          this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'purposeOfLoan']).value : '',
      nameOfCompany: this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'nameOfCompany']).value ?
          this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'nameOfCompany']).value : '',
      paymentDateType: this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'paymentDateType']).value ?
          this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'paymentDateType']).value : ''
    });
    const translatedValue = await this.translateService.translateForm(this.translatedFormGroup);
    if (!ObjectUtil.isEmpty(translatedValue)) {
      this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'purposeOfLoanTrans']).patchValue(
          translatedValue.purposeOfLoan);
      this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'purposeOfLoanCT']).patchValue(
          translatedValue.purposeOfLoan);

      this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'nameOfCompanyTrans']).patchValue(
          translatedValue.nameOfCompany);
      this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'nameOfCompanyCT']).patchValue(
          translatedValue.nameOfCompany);

      this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'paymentDateTypeTrans']).patchValue(
          translatedValue.paymentDateType);
      this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'paymentDateTypeCT']).patchValue(
          translatedValue.paymentDateType);
    }

    const convertPremiumRate = this.convertNumbersToNepali(this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'premiumRate']).value ?
        this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'premiumRate']).value.toFixed(2) : '', false);
    if (!ObjectUtil.isEmpty(convertPremiumRate)) {
      this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'premiumRateTrans']).patchValue(convertPremiumRate);
      this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'premiumRateCT']).patchValue(
          this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'premiumRateTrans']).value);
    }

    const convertInterestRate = this.convertNumbersToNepali(this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'interestRate']).value ?
        this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'interestRate']).value.toFixed(2) : '', false);
    if (!ObjectUtil.isEmpty(convertInterestRate)) {
      this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'interestRateTrans']).patchValue(
          convertInterestRate);
      this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'interestRateCT']).patchValue(
          this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'interestRateTrans']).value);
    }

    const tempLoanAdminFee = this.personalLoanCombinedForm.get(
        ['personalLoanCombinedFormArray', i, 'loanAdminFeeInFigure']).value ?
        this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'loanAdminFeeInFigure']).value.toFixed(2) : '';
    const convertLoanAdminFee = !ObjectUtil.isEmpty(tempLoanAdminFee) ?
        this.convertNumbersToNepali(tempLoanAdminFee, true) : '';
    this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'loanAdminFeeInFigureTrans']).patchValue(
        convertLoanAdminFee);
    this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'loanAdminFeeInFigureCT']).patchValue(
        this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'loanAdminFeeInFigureTrans']).value);

    this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'loanAdminFeeInWordsTrans']).patchValue(
        this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'loanAdminFeeInWords']).value);
    this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'loanAdminFeeInWordsCT']).patchValue(
        this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'loanAdminFeeInWordsTrans']).value);

    const tempEMIAmount = this.personalLoanCombinedForm.get(
        ['personalLoanCombinedFormArray', i, 'EMIAmountInFigure']).value ?
        this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'EMIAmountInFigure']).value.toFixed(2) : '';
    const convertEMIAmount = !ObjectUtil.isEmpty(tempEMIAmount) ?
        this.convertNumbersToNepali(tempEMIAmount, true) : '';
    this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'EMIAmountInFigureTrans']).patchValue(
        convertEMIAmount);
    this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'EMIAmountInFigureCT']).patchValue(
        this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'EMIAmountInFigureTrans']).value);

    this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'EMIAmountInWordsTrans']).patchValue(
        this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'EMIAmountInWords']).value);
    this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'EMIAmountInWordsCT']).patchValue(
        this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'EMIAmountInWordsTrans']).value);

    const convertNumberOfInstallment = this.convertNumbersToNepali(this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'numberOfInstallments']).value ?
        this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'numberOfInstallments']).value.toFixed(2) : '', false);
    if (!ObjectUtil.isEmpty(convertNumberOfInstallment)) {
      this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'numberOfInstallmentsTrans']).patchValue(
          convertNumberOfInstallment);
      this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'numberOfInstallmentsCT']).patchValue(
          this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'numberOfInstallmentsTrans']).value);
    }
    const tempPaymentDate = this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'paymentDateType']).value;
    let tempPayment;
    if (tempPaymentDate === 'AD') {
      const tempEnglishPaymentDate = this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'paymentDate']).value;
      tempPayment = !ObjectUtil.isEmpty(tempEnglishPaymentDate) ? this.datePipe.transform(tempEnglishPaymentDate) : '';
      if (!ObjectUtil.isEmpty(tempPayment)) {
        const finalExpDate = this.englishCalenderPipe.transform(tempPayment);
        this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'paymentDateTrans']).patchValue(finalExpDate);
        this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'paymentDateCT']).patchValue(
            this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'paymentDateTrans']).value
        );
      }
    } else {
      const tempPaymentDateNepali = this.personalLoanCombinedForm.get(
          ['personalLoanCombinedFormArray', i, 'paymentDateNepali']).value;
      tempPayment = !ObjectUtil.isEmpty(tempPaymentDateNepali) ?
          tempPaymentDateNepali.nDate : '';
      this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'paymentDateNepaliTrans']).patchValue(
          tempPayment);
      this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'paymentDateNepaliCT']).patchValue(
          this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'paymentDateNepaliTrans']).value
      );
    }
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

  calInterestRate(i) {
    let baseRate;
    if (!ObjectUtil.isEmpty(this.globalBaseRate)) {
      baseRate = this.globalBaseRate;
    } else {
      baseRate = (!ObjectUtil.isEmpty(this.initialInformation) && !ObjectUtil.isEmpty(this.initialInformation.retailGlobalForm) &&
          !ObjectUtil.isEmpty(this.initialInformation.retailGlobalForm.baseRate)) ?
          this.initialInformation.retailGlobalForm.baseRate : 0;    }
    const premiumRate =  this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'premiumRate']).value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.personalLoanCombinedForm.get(['personalLoanCombinedFormArray', i, 'interestRate']).patchValue(sum);
  }
}
