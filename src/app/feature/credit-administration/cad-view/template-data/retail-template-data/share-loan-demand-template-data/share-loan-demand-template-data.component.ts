import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {SbTranslateService} from '../../../../../../@core/service/sbtranslate.service';
import {EnglishDateTransformPipe} from '../../../../../../@core/pipe/english-date-transform.pipe';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-share-loan-demand-template-data',
  templateUrl: './share-loan-demand-template-data.component.html',
  styleUrls: ['./share-loan-demand-template-data.component.scss']
})
export class ShareLoanDemandTemplateDataComponent implements OnInit {
  @Input() loanName;
  @Input() cadDocAssignedLoan;
  @Input() offerDocumentList;
  @Input() globalBaseRate;
  shareLoanDemandCombinedForm: FormGroup;
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
        this.shareLoanDemandCombinedForm.patchValue(this.initialInformation.shareLoanDemandCombinedForm);
      }
      this.patchDate();
    }
    if (!ObjectUtil.isEmpty(this.filteredList)) {
      for (let val = 0; val < this.filteredList.length; val++) {
        const loanamountWords = this.engToNepWord.transform(this.filteredList[val].loanAmount);
        this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', val, 'loanAmountInFigure']).patchValue(
            this.filteredList[val] ? this.filteredList[val].loanAmount : '');
        this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', val, 'loanAmountInWords']).patchValue(
            loanamountWords ? loanamountWords : '');
      }
    }
    this.setLoanId();
  }

  patchDate() {
    for (let val = 0; val < this.initialInformation.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray.length; val++) {
      const loanExpiryDateType = this.initialInformation.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray[val].
          loanExpiryDateType;
      if (loanExpiryDateType === 'AD') {
        const loanExpiryDate = this.initialInformation.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray[val].loanExpiryDate;
        if (!ObjectUtil.isEmpty(loanExpiryDate)) {
          this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', val, 'loanExpiryDate']).patchValue(
              new Date(loanExpiryDate));
        }
      } else if (loanExpiryDateType === 'BS') {
        const loanExpiryDate = this.initialInformation.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray[val].
            loanExpiryDateNepali;
        if (!ObjectUtil.isEmpty(loanExpiryDate)) {
          this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', val, 'loanExpiryDateNepali']).patchValue(
              loanExpiryDate);
        }
      }
    }
  }
  filteredListDetails(loanDetails) {
    this.filteredList = loanDetails.filter(data => data.name === 'SHARE LOAN DEMAND COMBINED');
    this.filteredList.forEach(value => {
      this.addLoanFormArr();
    });
  }
  buildForm() {
    this.shareLoanDemandCombinedForm = this.formBuilder.group({
      shareLoanDemandCombinedFormArray: this.formBuilder.array([])
    });
  }

  addLoanFormArr() {
    (this.shareLoanDemandCombinedForm.get('shareLoanDemandCombinedFormArray') as FormArray).push(this.buildLoanForm());
  }

  buildLoanForm() {
    return this.formBuilder.group({
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined],
      purposeOfLoan: [undefined],
      premiumRate: [undefined],
      interestRate: [undefined],
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
      loanAdminFeeInFigureCT: [undefined],
      loanAdminFeeInWordsCT: [undefined],
      loanExpiryDateTypeCT: [undefined],
      loanExpiryDateCT: [undefined],
      loanExpiryDateNepaliCT: [undefined],

      interestRateType: [undefined],
      isRenewal: [undefined],
      loanId: [undefined],
    });
  }

  setLoanId() {
    this.filteredLoanIdList = this.cadDocAssignedLoan.filter(data =>
        data.loan.name === 'SHARE LOAN DEMAND COMBINED');
    this.filteredList.forEach((val, i) => {
      this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanId']).patchValue(
          this.filteredLoanIdList[i].proposal.id);
    });
  }
  renewalCheckFunc(boolVal, i) {
    this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'isRenewal']).patchValue(boolVal);
  }
  setInterestRateType(data) {
    console.log('Data:', data);
  }
  public getNumAmountWord(numLabel, wordLabel, index, arrayName): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.shareLoanDemandCombinedForm.get(
        [arrayName, index, numLabel]).value);
    this.shareLoanDemandCombinedForm.get([arrayName, index, wordLabel]).patchValue(transformValue);
  }

  async translateAndSetVal(i) {

    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    const tempLoanAmount = this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanAmountInFigure']).value ?
        this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanAmountInFigure']).value.toFixed(2) : '';
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanAmountInFigureTrans']).patchValue(convertNumber);
    this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanAmountInFigureCT']).patchValue(
        this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanAmountInFigureTrans']).value);

    this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanAmountInWordsTrans']).patchValue(
        this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanAmountInWords']).value);
    this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanAmountInWordsCT']).patchValue(
        this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanAmountInWordsTrans']).value);

    const tempWord = this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'purposeOfLoan']).value;
    if (!ObjectUtil.isEmpty(tempWord)) {
      this.translatedFormGroup = this.formBuilder.group({
        purposeOfLoan: tempWord,
      });
      const translatedValue =  await this.translateService.translateForm(this.translatedFormGroup);
      if (!ObjectUtil.isEmpty(translatedValue)) {
        this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'purposeOfLoanTrans']).patchValue(
            translatedValue.purposeOfLoan);
        this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'purposeOfLoanCT']).patchValue(
            translatedValue.purposeOfLoan);
      }
    }

    const convertPremiumRate = this.convertNumbersToNepali(this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'premiumRate']).value ?
        this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'premiumRate']).value.toFixed(2) : '', false);
    if (!ObjectUtil.isEmpty(convertPremiumRate)) {
      this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'premiumRateTrans']).patchValue(convertPremiumRate);
      this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'premiumRateCT']).patchValue(
          this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'premiumRateTrans']).value);
    }

    const convertInterestRate = this.convertNumbersToNepali(this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'interestRate']).value ?
        this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'interestRate']).value.toFixed(2) : '', false);
    if (!ObjectUtil.isEmpty(convertInterestRate)) {
      this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'interestRateTrans']).patchValue(
          convertInterestRate);
      this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'interestRateCT']).patchValue(
          this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'interestRateTrans']).value);
    }

    const tempLoanAdminFee = this.shareLoanDemandCombinedForm.get(
        ['shareLoanDemandCombinedFormArray', i, 'loanAdminFeeInFigure']).value ?
        this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanAdminFeeInFigure']).value.toFixed(2) : '';
    const convertLoanAdminFee = !ObjectUtil.isEmpty(tempLoanAdminFee) ?
        this.convertNumbersToNepali(tempLoanAdminFee, true) : '';
    this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanAdminFeeInFigureTrans']).patchValue(
        convertLoanAdminFee);
    this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanAdminFeeInFigureCT']).patchValue(
        this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanAdminFeeInFigureTrans']).value);

    this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanAdminFeeInWordsTrans']).patchValue(
        this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanAdminFeeInWords']).value);
    this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanAdminFeeInWordsCT']).patchValue(
        this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanAdminFeeInWordsTrans']).value);
    /* Converting value for date */
    this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanExpiryDateTypeTrans']).patchValue(
        this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanExpiryDateType']).value
    );
    this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanExpiryDateTypeCT']).patchValue(
        this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanExpiryDateTypeTrans']).value
    );
    const tempDateOfExpType = this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanExpiryDateType']).value;
    let tempExpDate;
    if (tempDateOfExpType === 'AD') {
      const tempEngExpDate = this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanExpiryDate']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ? this.datePipe.transform(tempEngExpDate) : '';
      if (!ObjectUtil.isEmpty(tempExpDate)) {
        const finalExpDate = this.englishCalenderPipe.transform(tempExpDate);
        this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanExpiryDateTrans']).patchValue(finalExpDate);
        this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanExpiryDateCT']).patchValue(
            this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanExpiryDateTrans']).value
        );
      }
    } else {
      const tempDateOfExpNep = this.shareLoanDemandCombinedForm.get(
          ['shareLoanDemandCombinedFormArray', i, 'loanExpiryDateNepali']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.nDate : '';
      this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanExpiryDateNepaliTrans']).patchValue(
          tempExpDate);
      this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanExpiryDateNepaliCT']).patchValue(
          this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'loanExpiryDateNepaliTrans']).value
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
    const premiumRate =  this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'premiumRate']).value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.shareLoanDemandCombinedForm.get(['shareLoanDemandCombinedFormArray', i, 'interestRate']).patchValue(sum);
  }

}
