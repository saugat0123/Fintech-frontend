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
  selector: 'app-nabil-share-loan-pod-template-data',
  templateUrl: './nabil-share-loan-pod-template-data.component.html',
  styleUrls: ['./nabil-share-loan-pod-template-data.component.scss']
})
export class NabilShareLoanPodTemplateDataComponent implements OnInit {
  @Input() loanName;
  @Input() cadDocAssignedLoan;
  @Input() offerDocumentList;
  @Input() globalBaseRate;
  nabilShareLoanPODForm: FormGroup;
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
        this.nabilShareLoanPODForm.patchValue(this.initialInformation.nabilShareLoanPODForm);
      }
      this.patchDate();
    }
    if (!ObjectUtil.isEmpty(this.filteredList)) {
      for (let val = 0; val < this.filteredList.length; val++) {
        const loanamountWords = this.engToNepWord.transform(this.filteredList[val].loanAmount);
        this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', val, 'loanAmountInFigure']).patchValue(
            this.filteredList[val] ? this.filteredList[val].loanAmount : '');
        this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', val, 'loanAmountInWords']).patchValue(
            loanamountWords ? loanamountWords : '');
      }
    }
    this.setLoanId();
  }

  patchDate() {
    for (let val = 0; val < this.initialInformation.nabilShareLoanPODForm.nabilShareLoanPODFormArray.length; val++) {
      const loanExpiryDateType = this.initialInformation.nabilShareLoanPODForm.nabilShareLoanPODFormArray[val].
          loanExpiryDateType;
      if (loanExpiryDateType === 'AD') {
        const loanExpiryDate = this.initialInformation.nabilShareLoanPODForm.nabilShareLoanPODFormArray[val].loanExpiryDate;
        if (!ObjectUtil.isEmpty(loanExpiryDate)) {
          this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', val, 'loanExpiryDate']).patchValue(
              new Date(loanExpiryDate));
        }
      } else if (loanExpiryDateType === 'BS') {
        const loanExpiryDate = this.initialInformation.nabilShareLoanPODForm.nabilShareLoanPODFormArray[val].
            loanExpiryDateNepali;
        if (!ObjectUtil.isEmpty(loanExpiryDate)) {
          this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', val, 'loanExpiryDateNepali']).patchValue(
              loanExpiryDate);
        }
      }
    }
  }
  filteredListDetails(loanDetails) {
    this.filteredList = loanDetails.filter(data => data.name === 'NABIL SHARE LOAN POD COMBINED');
    this.filteredList.forEach(value => {
      this.addLoanFormArr();
    });
  }
  buildForm() {
    this.nabilShareLoanPODForm = this.formBuilder.group({
      nabilShareLoanPODFormArray: this.formBuilder.array([])
    });
  }

  addLoanFormArr() {
    (this.nabilShareLoanPODForm.get('nabilShareLoanPODFormArray') as FormArray).push(this.buildLoanForm());
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
      loanName: [undefined],
      loanNameNepali: [undefined]
    });
  }

  setLoanId() {
    this.filteredLoanIdList = this.cadDocAssignedLoan.filter(data =>
        data.loan.name === 'NABIL SHARE LOAN POD COMBINED');
    this.filteredList.forEach((val, i) => {
      this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanId']).patchValue(
          this.filteredLoanIdList[i].proposal.id);
      this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanName']).patchValue(
          this.filteredLoanIdList[i].loan.name);
      this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanNameNepali']).patchValue(
          this.filteredLoanIdList[i].loan.nepaliName);
    });
  }
  renewalCheckFunc(boolVal, i) {
    this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'isRenewal']).patchValue(boolVal);
  }
  setInterestRateType(data) {
    console.log('Data:', data);
  }
  public getNumAmountWord(numLabel, wordLabel, index, arrayName): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.nabilShareLoanPODForm.get(
        [arrayName, index, numLabel]).value);
    this.nabilShareLoanPODForm.get([arrayName, index, wordLabel]).patchValue(transformValue);
  }

  async translateAndSetVal(i) {

    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    const tempLoanAmount = this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanAmountInFigure']).value ?
        this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanAmountInFigure']).value.toFixed(2) : '';
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanAmountInFigureTrans']).patchValue(convertNumber);
    this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanAmountInFigureCT']).patchValue(
        this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanAmountInFigureTrans']).value);

    this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanAmountInWordsTrans']).patchValue(
        this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanAmountInWords']).value);
    this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanAmountInWordsCT']).patchValue(
        this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanAmountInWordsTrans']).value);

    const tempWord = this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'purposeOfLoan']).value;
    if (!ObjectUtil.isEmpty(tempWord)) {
      this.translatedFormGroup = this.formBuilder.group({
        purposeOfLoan: tempWord,
      });
      const translatedValue =  await this.translateService.translateForm(this.translatedFormGroup);
      if (!ObjectUtil.isEmpty(translatedValue)) {
        this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'purposeOfLoanTrans']).patchValue(
            translatedValue.purposeOfLoan);
        this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'purposeOfLoanCT']).patchValue(
            translatedValue.purposeOfLoan);
      }
    }

    const convertPremiumRate = this.convertNumbersToNepali(this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'premiumRate']).value ?
        this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'premiumRate']).value.toFixed(2) : '', false);
    if (!ObjectUtil.isEmpty(convertPremiumRate)) {
      this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'premiumRateTrans']).patchValue(convertPremiumRate);
      this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'premiumRateCT']).patchValue(
          this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'premiumRateTrans']).value);
    }

    const convertInterestRate = this.convertNumbersToNepali(this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'interestRate']).value ?
        this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'interestRate']).value.toFixed(2) : '', false);
    if (!ObjectUtil.isEmpty(convertInterestRate)) {
      this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'interestRateTrans']).patchValue(
          convertInterestRate);
      this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'interestRateCT']).patchValue(
          this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'interestRateTrans']).value);
    }

    const tempLoanAdminFee = this.nabilShareLoanPODForm.get(
        ['nabilShareLoanPODFormArray', i, 'loanAdminFeeInFigure']).value ?
        this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanAdminFeeInFigure']).value.toFixed(2) : '';
    const convertLoanAdminFee = !ObjectUtil.isEmpty(tempLoanAdminFee) ?
        this.convertNumbersToNepali(tempLoanAdminFee, true) : '';
    this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanAdminFeeInFigureTrans']).patchValue(
        convertLoanAdminFee);
    this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanAdminFeeInFigureCT']).patchValue(
        this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanAdminFeeInFigureTrans']).value);

    this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanAdminFeeInWordsTrans']).patchValue(
        this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanAdminFeeInWords']).value);
    this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanAdminFeeInWordsCT']).patchValue(
        this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanAdminFeeInWordsTrans']).value);
    /* Converting value for date */
    this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanExpiryDateTypeTrans']).patchValue(
        this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanExpiryDateType']).value
    );
    this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanExpiryDateTypeCT']).patchValue(
        this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanExpiryDateTypeTrans']).value
    );
    const tempDateOfExpType = this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanExpiryDateType']).value;
    let tempExpDate;
    if (tempDateOfExpType === 'AD') {
      const tempEngExpDate = this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanExpiryDate']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ? this.datePipe.transform(tempEngExpDate) : '';
      if (!ObjectUtil.isEmpty(tempExpDate)) {
        const finalExpDate = this.englishCalenderPipe.transform(tempExpDate);
        this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanExpiryDateTrans']).patchValue(finalExpDate);
        this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanExpiryDateCT']).patchValue(
            this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanExpiryDateTrans']).value
        );
      }
    } else {
      const tempDateOfExpNep = this.nabilShareLoanPODForm.get(
          ['nabilShareLoanPODFormArray', i, 'loanExpiryDateNepali']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.nDate : '';
      this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanExpiryDateNepaliTrans']).patchValue(
          tempExpDate);
      this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanExpiryDateNepaliCT']).patchValue(
          this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'loanExpiryDateNepaliTrans']).value
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
    const premiumRate =  this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'premiumRate']).value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.nabilShareLoanPODForm.get(['nabilShareLoanPODFormArray', i, 'interestRate']).patchValue(sum);
  }

}
