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
  selector: 'app-personal-overdraft-without-collateral-combined-template-data',
  templateUrl: './personal-overdraft-without-collateral-combined-template-data.component.html',
  styleUrls: ['./personal-overdraft-without-collateral-combined-template-data.component.scss']
})
export class PersonalOverdraftWithoutCollateralCombinedTemplateDataComponent implements OnInit {
  @Input() loanName;
  @Input() cadDocAssignedLoan;
  @Input() offerDocumentList;
  @Input() globalBaseRate;
  personalOverDraftWithoutCollateralCombinedForm: FormGroup;
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
        this.personalOverDraftWithoutCollateralCombinedForm.patchValue(
            this.initialInformation.personalOverDraftWithoutCollateralCombinedForm);
      }
      this.patchDate();
    }
    if (!ObjectUtil.isEmpty(this.filteredList)) {
      for (let val = 0; val < this.filteredList.length; val++) {
        const loanamountWords = this.engToNepWord.transform(this.filteredList[val].loanAmount);
        this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', val, 'loanAmountInFigure']).patchValue(
            this.filteredList[val] ? this.filteredList[val].loanAmount : '');
        this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', val, 'loanAmountInWords']).patchValue(
            loanamountWords ? loanamountWords : '');
      }
    }
    this.setLoanId();
  }

  patchDate() {
    // tslint:disable-next-line:max-line-length
    for (let val = 0; val < this.initialInformation.personalOverDraftWithoutCollateralCombinedForm.personalOverDraftWithoutCollateralCombinedFormArray.length; val++) {
      // tslint:disable-next-line:max-line-length
      const loanExpiryDateType = this.initialInformation.personalOverDraftWithoutCollateralCombinedForm.personalOverDraftWithoutCollateralCombinedFormArray[val].loanExpiryDateType;
      if (loanExpiryDateType === 'AD') {
        // tslint:disable-next-line:max-line-length
        const loanExpiryDate = this.initialInformation.personalOverDraftWithoutCollateralCombinedForm.personalOverDraftWithoutCollateralCombinedFormArray[val].loanExpiryDate;
        if (!ObjectUtil.isEmpty(loanExpiryDate)) {
          this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', val, 'loanExpiryDate']).patchValue(
              new Date(loanExpiryDate));
        }
      } else if (loanExpiryDateType === 'BS') {
        // tslint:disable-next-line:max-line-length
        const loanExpiryDate = this.initialInformation.personalOverDraftWithoutCollateralCombinedForm.personalOverDraftWithoutCollateralCombinedFormArray[val].loanExpiryDateNepali;
        if (!ObjectUtil.isEmpty(loanExpiryDate)) {
          this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', val, 'loanExpiryDateNepali']).patchValue(
              loanExpiryDate);
        }
      }
    }
  }

  filteredListDetails(loanDetails) {
    this.filteredList = loanDetails.filter(data => data.name === 'PERSONAL OVERDRAFT WITHOUT COLLATERAL COMBINED');
    this.filteredList.forEach(value => {
      this.addLoanFormArr();
    });
  }

  buildForm() {
    this.personalOverDraftWithoutCollateralCombinedForm = this.formBuilder.group({
      personalOverDraftWithoutCollateralCombinedFormArray: this.formBuilder.array([])
    });
  }

  addLoanFormArr() {
    // tslint:disable-next-line:max-line-length
    (this.personalOverDraftWithoutCollateralCombinedForm.get('personalOverDraftWithoutCollateralCombinedFormArray') as FormArray).push(this.buildLoanForm());
  }

  buildLoanForm() {
    return this.formBuilder.group({
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined],
      purposeOfLoan: [undefined],
      premiumRate: [undefined],
      interestRate: [undefined],
      nameOfCompany: [undefined],
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
      nameOfCompanyTrans: [undefined],
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
      nameOfCompanyCT: [undefined],
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
        data.loan.name === 'PERSONAL OVERDRAFT WITHOUT COLLATERAL COMBINED');
    this.filteredList.forEach((val, i) => {
      // tslint:disable-next-line:max-line-length
      this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanId']).patchValue(
          this.filteredLoanIdList[i].proposal.id);
    });
  }

  renewalCheckFunc(boolVal, i) {
    // tslint:disable-next-line:max-line-length
    this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'isRenewal']).patchValue(boolVal);
  }

  setInterestRateType(data) {
  }

  public getNumAmountWord(numLabel, wordLabel, index, arrayName): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.personalOverDraftWithoutCollateralCombinedForm.get(
        [arrayName, index, numLabel]).value);
    this.personalOverDraftWithoutCollateralCombinedForm.get([arrayName, index, wordLabel]).patchValue(transformValue);
  }

  async translateAndSetVal(i) {
    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    // tslint:disable-next-line:max-line-length
    const tempLoanAmount = this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanAmountInFigure']).value ?
        this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanAmountInFigure']).value.toFixed(2) : '';
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanAmountInFigureTrans']).patchValue(convertNumber);
    this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanAmountInFigureCT']).patchValue(
        this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanAmountInFigureTrans']).value);

    this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanAmountInWordsTrans']).patchValue(
        this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanAmountInWords']).value);
    // tslint:disable-next-line:max-line-length
    this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanAmountInWordsCT']).patchValue(
        this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanAmountInWordsTrans']).value);

    const tempWord = this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'purposeOfLoan']).value;
    if (!ObjectUtil.isEmpty(tempWord)) {
      this.translatedFormGroup = this.formBuilder.group({
        purposeOfLoan: tempWord,
      });
      const translatedValue = await this.translateService.translateForm(this.translatedFormGroup);
      if (!ObjectUtil.isEmpty(translatedValue)) {
        this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'purposeOfLoanTrans']).patchValue(
            translatedValue.purposeOfLoan);
        // tslint:disable-next-line:max-line-length
        this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'purposeOfLoanCT']).patchValue(
            translatedValue.purposeOfLoan);
      }
    }
    const tempCompanyNameWord = this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'nameOfCompany']).value;
    if (!ObjectUtil.isEmpty(tempCompanyNameWord)) {
      this.translatedFormGroup = this.formBuilder.group({
        nameOfCompany: tempCompanyNameWord,
      });
      const translatedValue = await this.translateService.translateForm(this.translatedFormGroup);
      if (!ObjectUtil.isEmpty(translatedValue)) {
        this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'nameOfCompanyTrans']).patchValue(
            translatedValue.nameOfCompany);
        // tslint:disable-next-line:max-line-length
        this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'nameOfCompanyCT']).patchValue(
            translatedValue.nameOfCompany);
      }
    }

    const convertPremiumRate = this.convertNumbersToNepali(this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'premiumRate']).value ?
        // tslint:disable-next-line:max-line-length
        this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'premiumRate']).value.toFixed(2) : '', false);
    if (!ObjectUtil.isEmpty(convertPremiumRate)) {
      // tslint:disable-next-line:max-line-length
      this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'premiumRateTrans']).patchValue(convertPremiumRate);
      // tslint:disable-next-line:max-line-length
      this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'premiumRateCT']).patchValue(
          this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'premiumRateTrans']).value);
    }

    const convertInterestRate = this.convertNumbersToNepali(this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'interestRate']).value ?
        // tslint:disable-next-line:max-line-length
        this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'interestRate']).value.toFixed(2) : '', false);
    if (!ObjectUtil.isEmpty(convertInterestRate)) {
      // tslint:disable-next-line:max-line-length
      this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'interestRateTrans']).patchValue(
          convertInterestRate);
      // tslint:disable-next-line:max-line-length
      this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'interestRateCT']).patchValue(
          this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'interestRateTrans']).value);
    }

    const tempLoanAdminFee = this.personalOverDraftWithoutCollateralCombinedForm.get(
        ['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanAdminFeeInFigure']).value ?
        this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanAdminFeeInFigure']).value.toFixed(2) : '';
    const convertLoanAdminFee = !ObjectUtil.isEmpty(tempLoanAdminFee) ?
        this.convertNumbersToNepali(tempLoanAdminFee, true) : '';
    this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanAdminFeeInFigureTrans']).patchValue(
        convertLoanAdminFee);
    this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanAdminFeeInFigureCT']).patchValue(
        this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanAdminFeeInFigureTrans']).value);

    this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanAdminFeeInWordsTrans']).patchValue(
        this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanAdminFeeInWords']).value);
    this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanAdminFeeInWordsCT']).patchValue(
        this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanAdminFeeInWordsTrans']).value);
    /* Converting value for date */
    this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanExpiryDateTypeTrans']).patchValue(
        this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanExpiryDateType']).value
    );
    this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanExpiryDateTypeCT']).patchValue(
        this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanExpiryDateTypeTrans']).value
    );
    // tslint:disable-next-line:max-line-length
    const tempDateOfExpType = this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanExpiryDateType']).value;
    let tempExpDate;
    if (tempDateOfExpType === 'AD') {
      // tslint:disable-next-line:max-line-length
      const tempEngExpDate = this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanExpiryDate']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ? this.datePipe.transform(tempEngExpDate) : '';
      if (!ObjectUtil.isEmpty(tempExpDate)) {
        const finalExpDate = this.englishCalenderPipe.transform(tempExpDate);
        this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanExpiryDateTrans']).patchValue(finalExpDate);
        this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanExpiryDateCT']).patchValue(
            this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanExpiryDateTrans']).value
        );
      }
    } else {
      const tempDateOfExpNep = this.personalOverDraftWithoutCollateralCombinedForm.get(
          ['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanExpiryDateNepali']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.nDate : '';
      this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanExpiryDateNepaliTrans']).patchValue(
          tempExpDate);
      this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanExpiryDateNepaliCT']).patchValue(
          this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'loanExpiryDateNepaliTrans']).value
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
      baseRate = this.initialInformation.retailGlobalForm.baseRate;
    }
    const premiumRate = this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'premiumRate']).value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    // tslint:disable-next-line:max-line-length
    this.personalOverDraftWithoutCollateralCombinedForm.get(['personalOverDraftWithoutCollateralCombinedFormArray', i, 'interestRate']).patchValue(sum);
  }

}
