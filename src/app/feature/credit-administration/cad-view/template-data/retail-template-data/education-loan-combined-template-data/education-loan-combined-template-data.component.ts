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
  selector: 'app-education-loan-combined-template-data',
  templateUrl: './education-loan-combined-template-data.component.html',
  styleUrls: ['./education-loan-combined-template-data.component.scss']
})
export class EducationLoanCombinedTemplateDataComponent implements OnInit {
  @Input() loanName;
  @Input() cadDocAssignedLoan;
  @Input() offerDocumentList;
  @Input() globalBaseRate;
  educationLoanCombinedForm: FormGroup;
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
        this.educationLoanCombinedForm.patchValue(this.initialInformation.educationLoanForm);
      }
    }
    if (!ObjectUtil.isEmpty(this.filteredList)) {
      for (let val = 0; val < this.filteredList.length; val++) {
        const loanamountWords = this.engToNepWord.transform(this.filteredList[val].loanAmount);
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', val, 'loanAmountInFigure']).patchValue(
            this.filteredList[val] ? this.filteredList[val].loanAmount : '');
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', val, 'loanAmountInWords']).patchValue(
            loanamountWords ? loanamountWords : '');
      }
    }
    this.setLoanId();
  }
  setLoanId() {
    this.filteredLoanIdList = this.cadDocAssignedLoan.filter(data =>
        data.loan.name === 'EDUCATION LOAN COMBINED');
    this.filteredList.forEach((val, i) => {
      this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'loanId']).patchValue(
          this.filteredLoanIdList[i].proposal.id);
    });
  }
  buildForm() {
    this.educationLoanCombinedForm = this.formBuilder.group({
      educationLoanCombinedFormArray: this.formBuilder.array([])
    });
  }
  filteredListDetails(loanDetails) {
    this.filteredList = loanDetails.filter(data => data.name === 'EDUCATION LOAN COMBINED');
    this.filteredList.forEach(value => {
      this.addLoanFormArr();
    });
  }
  addLoanFormArr() {
    (this.educationLoanCombinedForm.get('educationLoanCombinedFormArray') as FormArray).push(this.buildFormArray());
  }
  buildFormArray() {
    return this.formBuilder.group({
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined],
      purposeOfLoan: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      interestRate: [undefined],
      marginInPercentage: [undefined],
      loanAdminFeeInFigure: [undefined],
      loanAdminFeeInWords: [undefined],
      EMIAmountInFigure: [undefined],
      EMIAmountInWords: [undefined],
      totalNumberOfInstallments: [undefined],
      moratoriumPeriod: [undefined],
      FDAmountInFigure: [undefined],
      FDAmountInWords: [undefined],
      FDNumber: [undefined],

      loanAmountInFigureTrans: [undefined],
      loanAmountInWordsTrans: [undefined],
      purposeOfLoanTrans: [undefined],
      baseRateTrans: [undefined],
      premiumRateTrans: [undefined],
      interestRateTrans: [undefined],
      marginInPercentageTrans: [undefined],
      loanAdminFeeInFigureTrans: [undefined],
      loanAdminFeeInWordsTrans: [undefined],
      EMIAmountInFigureTrans: [undefined],
      EMIAmountInWordsTrans: [undefined],
      totalNumberOfInstallmentsTrans: [undefined],
      moratoriumPeriodTrans: [undefined],
      FDAmountInFigureTrans: [undefined],
      FDAmountInWordsTrans: [undefined],
      FDNumberTrans: [undefined],

      loanAmountInFigureCT: [undefined],
      loanAmountInWordsCT: [undefined],
      purposeOfLoanCT: [undefined],
      baseRateCT: [undefined],
      premiumRateCT: [undefined],
      interestRateCT: [undefined],
      marginInPercentageCT: [undefined],
      loanAdminFeeInFigureCT: [undefined],
      loanAdminFeeInWordsCT: [undefined],
      EMIAmountInFigureCT: [undefined],
      EMIAmountInWordsCT: [undefined],
      totalNumberOfInstallmentsCT: [undefined],
      moratoriumPeriodCT: [undefined],
      FDAmountInFigureCT: [undefined],
      FDAmountInWordsCT: [undefined],
      FDNumberCT: [undefined],

      countryName: [undefined],
      securityType: [undefined],
      interestRateType: [undefined],
      moratoriumPeriodCheck: [undefined],

      loanId: [undefined]
    });
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
    if (this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'securityType']).value === 'TD') {
      baseRate = this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'baseRate']).value ?
          this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'baseRate']).value : '';
    }
    if (this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'securityType']).value !== 'TD') {
      if (!ObjectUtil.isEmpty(this.globalBaseRate)) {
        baseRate = this.globalBaseRate;
      } else {
        baseRate = (!ObjectUtil.isEmpty(this.initialInformation) && !ObjectUtil.isEmpty(this.initialInformation.retailGlobalForm) &&
            !ObjectUtil.isEmpty(this.initialInformation.retailGlobalForm.baseRate)) ?
            this.initialInformation.retailGlobalForm.baseRate : 0;
      }
    }
    const premiumRate =  this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'premiumRate']).value ?
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'premiumRate']).value : '';
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'interestRate']).patchValue(sum);
  }
  moratoriumCheckFunc(data, i) {
    console.log('Moratorium Check?', data);
  }
  public getNumAmountWord(numLabel, wordLabel, index, arrayName): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.educationLoanCombinedForm.get(
        [arrayName, index, numLabel]).value);
    this.educationLoanCombinedForm.get([arrayName, index, wordLabel]).patchValue(transformValue);
  }

  async translateAndSetVal(i) {
    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    const tempLoanAmount = this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'loanAmountInFigure']).value ?
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'loanAmountInFigure']).value.toFixed(2) : '';
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'loanAmountInFigureTrans']).patchValue(convertNumber);
    this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'loanAmountInFigureCT']).patchValue(
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'loanAmountInFigureTrans']).value);

    this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'loanAmountInWordsTrans']).patchValue(
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'loanAmountInWords']).value);
    this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'loanAmountInWordsCT']).patchValue(
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'loanAmountInWordsTrans']).value);

    const tempWord = this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'purposeOfLoan']).value;
    if (!ObjectUtil.isEmpty(tempWord)) {
      this.translatedFormGroup = this.formBuilder.group({
        purposeOfLoan: tempWord,
      });
      const translatedValue =  await this.translateService.translateForm(this.translatedFormGroup);
      if (!ObjectUtil.isEmpty(translatedValue)) {
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'purposeOfLoanTrans']).patchValue(
            translatedValue.purposeOfLoan);
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'purposeOfLoanCT']).patchValue(
            translatedValue.purposeOfLoan);
      }
    }

    const convertMargin = this.convertNumbersToNepali(this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'marginInPercentage']).value ?
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'marginInPercentage']).value.
        toFixed(2) : '', false);
    if (!ObjectUtil.isEmpty(convertMargin)) {
      this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'marginInPercentageTrans']).patchValue(
          convertMargin);
      this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'marginInPercentageCT']).patchValue(
          this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'marginInPercentageTrans']).value);
    }

    const convertBaseRate = this.convertNumbersToNepali(this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'baseRate']).value ?
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'baseRate']).value.toFixed(2) : '', false);
    if (!ObjectUtil.isEmpty(convertBaseRate)) {
      this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'baseRateTrans']).patchValue(convertBaseRate);
      this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'baseRateCT']).patchValue(
          this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'baseRateTrans']).value);
    }
    const convertPremiumRate = this.convertNumbersToNepali(this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'premiumRate']).value ?
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'premiumRate']).value.toFixed(2) : '', false);
    if (!ObjectUtil.isEmpty(convertPremiumRate)) {
      this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'premiumRateTrans']).patchValue(convertPremiumRate);
      this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'premiumRateCT']).patchValue(
          this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'premiumRateTrans']).value);
    }

    const convertInterestRate = this.convertNumbersToNepali(this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'interestRate']).value ?
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'interestRate']).value.toFixed(2) : '', false);
    if (!ObjectUtil.isEmpty(convertInterestRate)) {
      this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'interestRateTrans']).patchValue(
          convertInterestRate);
      this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'interestRateCT']).patchValue(
          this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'interestRateTrans']).value);
    }

    const convertMarginPercent = this.convertNumbersToNepali(this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'marginInPercentage']).value ?
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'marginInPercentage']).value.toFixed(2) : '', false);
    if (!ObjectUtil.isEmpty(convertMarginPercent)) {
      this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'marginInPercentageTrans']).patchValue(convertMarginPercent);
      this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'marginInPercentageCT']).patchValue(
          this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'marginInPercentageTrans']).value);
    }

    const tempLoanAdminFee = this.educationLoanCombinedForm.get(
        ['educationLoanCombinedFormArray', i, 'loanAdminFeeInFigure']).value ?
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'loanAdminFeeInFigure']).value.toFixed(2) : '';
    const convertLoanAdminFee = !ObjectUtil.isEmpty(tempLoanAdminFee) ?
        this.convertNumbersToNepali(tempLoanAdminFee, true) : '';
    this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'loanAdminFeeInFigureTrans']).patchValue(
        convertLoanAdminFee);
    this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'loanAdminFeeInFigureCT']).patchValue(
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'loanAdminFeeInFigureTrans']).value);

    this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'loanAdminFeeInWordsTrans']).patchValue(
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'loanAdminFeeInWords']).value);
    this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'loanAdminFeeInWordsCT']).patchValue(
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'loanAdminFeeInWordsTrans']).value);

    const tempEMIAmount = this.educationLoanCombinedForm.get(
        ['educationLoanCombinedFormArray', i, 'EMIAmountInFigure']).value ?
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'EMIAmountInFigure']).value.toFixed(2) : '';
    const convertEMIAMount = !ObjectUtil.isEmpty(tempEMIAmount) ?
        this.convertNumbersToNepali(tempEMIAmount, true) : '';
    this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'EMIAmountInFigureTrans']).patchValue(
        convertEMIAMount);
    this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'EMIAmountInFigureCT']).patchValue(
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'EMIAmountInFigureTrans']).value);

    this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'EMIAmountInWordsTrans']).patchValue(
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'EMIAmountInWords']).value);
    this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'EMIAmountInWordsCT']).patchValue(
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'EMIAmountInWordsTrans']).value);

    const convertTotalInstallment = this.convertNumbersToNepali(this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'totalNumberOfInstallments']).value ?
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'totalNumberOfInstallments']).value : '', false);
    if (!ObjectUtil.isEmpty(convertTotalInstallment)) {
      this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'totalNumberOfInstallmentsTrans']).patchValue(
          convertTotalInstallment);
      this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'totalNumberOfInstallmentsCT']).patchValue(
          this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'totalNumberOfInstallmentsTrans']).value);
    }

    const convertMoratorium = this.convertNumbersToNepali(this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'moratoriumPeriod']).value ?
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'moratoriumPeriod']).value : '', false);
    if (!ObjectUtil.isEmpty(convertMoratorium)) {
      this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'moratoriumPeriodTrans']).patchValue(convertMoratorium);
      this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'moratoriumPeriodCT']).patchValue(
          this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'moratoriumPeriodTrans']).value);
    }

    const tempFDAmount = this.educationLoanCombinedForm.get(
        ['educationLoanCombinedFormArray', i, 'FDAmountInFigure']).value ?
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'FDAmountInFigure']).value.toFixed(2) : '';
    const convertFDAmount = !ObjectUtil.isEmpty(tempFDAmount) ?
        this.convertNumbersToNepali(tempFDAmount, true) : '';
    this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'FDAmountInFigureTrans']).patchValue(
        convertFDAmount);
    this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'FDAmountInFigureCT']).patchValue(
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'FDAmountInFigureTrans']).value);

    this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'FDAmountInWordsTrans']).patchValue(
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'FDAmountInWords']).value);
    this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'FDAmountInWordsCT']).patchValue(
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'FDAmountInWordsTrans']).value);

    const convertTDNumber = this.convertNumbersToNepali(
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'FDNumber']).value ?
        this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'FDNumber']).value : '', false);
    if (!ObjectUtil.isEmpty(convertTDNumber)) {
      this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'FDNumberTrans']).patchValue(convertTDNumber);
      this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'FDNumberCT']).patchValue(
          this.educationLoanCombinedForm.get(['educationLoanCombinedFormArray', i, 'FDNumberTrans']).value);
    }
  }
}
