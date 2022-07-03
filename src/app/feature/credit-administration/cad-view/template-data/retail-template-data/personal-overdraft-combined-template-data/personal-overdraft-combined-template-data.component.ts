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
  selector: 'app-personal-overdraft-combined-template-data',
  templateUrl: './personal-overdraft-combined-template-data.component.html',
  styleUrls: ['./personal-overdraft-combined-template-data.component.scss']
})
export class PersonalOverdraftCombinedTemplateDataComponent implements OnInit {
  @Input() loanName;
  @Input() cadDocAssignedLoan;
  @Input() offerDocumentList;
  @Input() globalBaseRate;
  personalOverdraftCombinedForm: FormGroup;
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
        this.personalOverdraftCombinedForm.patchValue(this.initialInformation.personalOverdraftCombinedForm);
      }
      this.patchDate();
    }
    if (!ObjectUtil.isEmpty(this.filteredList)) {
      for (let val = 0; val < this.filteredList.length; val++) {
        const loanamountWords = this.engToNepWord.transform(this.filteredList[val].loanAmount);
        this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', val, 'loanAmountInFigure']).patchValue(
            this.filteredList[val] ? this.filteredList[val].loanAmount : '');
        this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', val, 'loanAmountInWords']).patchValue(
            loanamountWords ? loanamountWords : '');
      }
    }
    this.setLoanId();
  }
  patchDate() {
    for (let val = 0; val < this.initialInformation.personalOverdraftCombinedForm.personalOverdraftCombinedFormArray.length; val++) {
      const loanExpiryDateType = this.initialInformation.personalOverdraftCombinedForm.personalOverdraftCombinedFormArray[val].
          loanExpiryDateType;
      if (loanExpiryDateType === 'AD') {
        const loanExpiryDate = this.initialInformation.personalOverdraftCombinedForm.personalOverdraftCombinedFormArray[val].loanExpiryDate;
        if (!ObjectUtil.isEmpty(loanExpiryDate)) {
          this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', val, 'loanExpiryDate']).patchValue(
              new Date(loanExpiryDate));
        }
      } else if (loanExpiryDateType === 'BS') {
        const loanExpiryDate = this.initialInformation.personalOverdraftCombinedForm.personalOverdraftCombinedFormArray[val].
            loanExpiryDateNepali;
        if (!ObjectUtil.isEmpty(loanExpiryDate)) {
          this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', val, 'loanExpiryDateNepali']).patchValue(
              loanExpiryDate);
        }
      }
    }
  }
  filteredListDetails(loanDetails) {
    this.filteredList = loanDetails.filter(data => data.name === 'PERSONAL OVERDRAFT COMBINED');
    this.filteredList.forEach(value => {
      this.addLoanFormArr();
    });
  }
  buildForm() {
    this.personalOverdraftCombinedForm = this.formBuilder.group({
      personalOverdraftCombinedFormArray: this.formBuilder.array([]),
    });
  }

  addLoanFormArr() {
    (this.personalOverdraftCombinedForm.get('personalOverdraftCombinedFormArray') as FormArray).push(this.buildLoanForm());
  }

  buildLoanForm() {
    return this.formBuilder.group({
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined],
      purposeOfLoan: [undefined],
      premiumRate: [undefined],
      interestRate: [undefined],
      marginInPercentage: [undefined],
      loanAdminFeeInFigure: [undefined],
      loanAdminFeeInWords: [undefined],
      loanExpiryDateType: [undefined],
      loanExpiryDate: [undefined],
      loanExpiryDateNepali: [undefined],

      loanAmountInFigureTrans: [undefined],
      loanAmountInWordsTrans: [undefined],
      purposeOfLoanTrans: [undefined],
      premiumRateTrans: [undefined],
      interestRateTrans: [undefined],
      marginInPercentageTrans: [undefined],
      loanAdminFeeInFigureTrans: [undefined],
      loanAdminFeeInWordsTrans: [undefined],
      loanExpiryDateTypeTrans: [undefined],
      loanExpiryDateTrans: [undefined],
      loanExpiryDateNepaliTrans: [undefined],

      loanAmountInFigureCT: [undefined],
      loanAmountInWordsCT: [undefined],
      purposeOfLoanCT: [undefined],
      premiumRateCT: [undefined],
      interestRateCT: [undefined],
      marginInPercentageCT: [undefined],
      loanAdminFeeInFigureCT: [undefined],
      loanAdminFeeInWordsCT: [undefined],
      loanExpiryDateTypeCT: [undefined],
      loanExpiryDateCT: [undefined],
      loanExpiryDateNepaliCT: [undefined],

      interestRateType: [undefined],
      isRenewal: [undefined],
      loanId: [undefined],
      loanName: [undefined],
      loanNameNepali: [undefined]
    });
  }

  setLoanId() {
    this.filteredLoanIdList = this.cadDocAssignedLoan.filter(data =>
        data.loan.name === 'PERSONAL OVERDRAFT COMBINED');
    this.filteredList.forEach((val, i) => {
      this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanId']).patchValue(
          this.filteredLoanIdList[i].proposal.id);
      this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanName']).patchValue(
          this.filteredLoanIdList[i].loan.name);
      this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanNameNepali']).patchValue(
          this.filteredLoanIdList[i].loan.nepaliName);
    });
  }
  renewalCheckFunc(boolVal, i) {
    this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'isRenewal']).patchValue(boolVal);
  }
  setInterestRateType(data) {
    console.log('Data:', data);
  }
  public getNumAmountWord(numLabel, wordLabel, index, arrayName): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.personalOverdraftCombinedForm.get(
        [arrayName, index, numLabel]).value);
    this.personalOverdraftCombinedForm.get([arrayName, index, wordLabel]).patchValue(transformValue);
  }

  async translateAndSetVal(i) {

    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    const tempLoanAmount = this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanAmountInFigure']).value ?
        this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanAmountInFigure']).value.toFixed(2) : '';
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanAmountInFigureTrans']).patchValue(convertNumber);
    this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanAmountInFigureCT']).patchValue(
        this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanAmountInFigureTrans']).value);

    this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanAmountInWordsTrans']).patchValue(
        this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanAmountInWords']).value);
    this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanAmountInWordsCT']).patchValue(
        this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanAmountInWordsTrans']).value);

    const tempWord = this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'purposeOfLoan']).value;
    if (!ObjectUtil.isEmpty(tempWord)) {
      this.translatedFormGroup = this.formBuilder.group({
        purposeOfLoan: tempWord,
      });
      const translatedValue =  await this.translateService.translateForm(this.translatedFormGroup);
      if (!ObjectUtil.isEmpty(translatedValue)) {
        this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'purposeOfLoanTrans']).patchValue(
            translatedValue.purposeOfLoan);
        this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'purposeOfLoanCT']).patchValue(
            translatedValue.purposeOfLoan);
      }
    }

    const convertMargin = this.convertNumbersToNepali(this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'marginInPercentage']).value ?
        this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'marginInPercentage']).value.
        toFixed(2) : '', false);
    if (!ObjectUtil.isEmpty(convertMargin)) {
      this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'marginInPercentageTrans']).patchValue(
          convertMargin);
      this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'marginInPercentageCT']).patchValue(
          this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'marginInPercentageTrans']).value);
    }

    const convertPremiumRate = this.convertNumbersToNepali(this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'premiumRate']).value ?
        this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'premiumRate']).value.toFixed(2) : '', false);
    if (!ObjectUtil.isEmpty(convertPremiumRate)) {
      this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'premiumRateTrans']).patchValue(convertPremiumRate);
      this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'premiumRateCT']).patchValue(
          this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'premiumRateTrans']).value);
    }

    const convertInterestRate = this.convertNumbersToNepali(this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'interestRate']).value ?
        this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'interestRate']).value.toFixed(2) : '', false);
    if (!ObjectUtil.isEmpty(convertInterestRate)) {
      this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'interestRateTrans']).patchValue(
          convertInterestRate);
      this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'interestRateCT']).patchValue(
          this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'interestRateTrans']).value);
    }

    const tempLoanAdminFee = this.personalOverdraftCombinedForm.get(
        ['personalOverdraftCombinedFormArray', i, 'loanAdminFeeInFigure']).value ?
        this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanAdminFeeInFigure']).value.toFixed(2) : '';
    const convertLoanAdminFee = !ObjectUtil.isEmpty(tempLoanAdminFee) ?
        this.convertNumbersToNepali(tempLoanAdminFee, true) : '';
    this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanAdminFeeInFigureTrans']).patchValue(
        convertLoanAdminFee);
    this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanAdminFeeInFigureCT']).patchValue(
        this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanAdminFeeInFigureTrans']).value);

    this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanAdminFeeInWordsTrans']).patchValue(
        this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanAdminFeeInWords']).value);
    this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanAdminFeeInWordsCT']).patchValue(
        this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanAdminFeeInWordsTrans']).value);
    /* Converting value for date */
    this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanExpiryDateTypeTrans']).patchValue(
        this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanExpiryDateType']).value
    );
    this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanExpiryDateTypeCT']).patchValue(
        this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanExpiryDateTypeTrans']).value
    );
    const tempDateOfExpType = this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanExpiryDateType']).value;
    let tempExpDate;
    if (tempDateOfExpType === 'AD') {
      const tempEngExpDate = this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanExpiryDate']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ? this.datePipe.transform(tempEngExpDate) : '';
      if (!ObjectUtil.isEmpty(tempExpDate)) {
        const finalExpDate = this.englishCalenderPipe.transform(tempExpDate);
        this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanExpiryDateTrans']).patchValue(finalExpDate);
        this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanExpiryDateCT']).patchValue(
            this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanExpiryDateTrans']).value
        );
      }
    } else {
      const tempDateOfExpNep = this.personalOverdraftCombinedForm.get(
          ['personalOverdraftCombinedFormArray', i, 'loanExpiryDateNepali']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.nDate : '';
      this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanExpiryDateNepaliTrans']).patchValue(
          tempExpDate);
      this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanExpiryDateNepaliCT']).patchValue(
          this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'loanExpiryDateNepaliTrans']).value
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
    const premiumRate =  this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'premiumRate']).value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.personalOverdraftCombinedForm.get(['personalOverdraftCombinedFormArray', i, 'interestRate']).patchValue(sum);
  }

}
