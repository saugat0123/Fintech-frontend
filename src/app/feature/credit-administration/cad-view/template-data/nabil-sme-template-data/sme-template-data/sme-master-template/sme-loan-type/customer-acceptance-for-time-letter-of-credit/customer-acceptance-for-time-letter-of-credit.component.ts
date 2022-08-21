import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {OfferDocument} from '../../../../../../../model/OfferDocument';
import {LoanNameConstant} from '../../../../sme-costant/loan-name-constant';

@Component({
  selector: 'app-customer-acceptance-for-time-letter-of-credit',
  templateUrl: './customer-acceptance-for-time-letter-of-credit.component.html',
  styleUrls: ['./customer-acceptance-for-time-letter-of-credit.component.scss']
})
export class CustomerAcceptanceForTimeLetterOfCreditComponent implements OnInit {
  @Input() loanName;
  @Input() offerDocumentList: Array<OfferDocument>;
  @Input() cadDocAssignedLoan;
  initialInformation: any;
  timeLetterCreditForm: FormGroup;
  isComplimentryOtherLoan = false;
  dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
  ADExpiry = false;
  BSExpiry = false;
  loanDetails: any = [];
  isOnOffSelected = false;
  isRegularSelected = false;
  loanNameConstant = LoanNameConstant;
  filteredList: any = [];
  filteredLoanIdList: any = [];
  constructor(private formBuilder: FormBuilder,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatterPipe: CurrencyFormatterPipe,
              private datePipe: DatePipe,
              private engToNepWord: NepaliCurrencyWordPipe,
  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.loanName)) {
      this.loanDetails = this.loanName;
      this.
      filteredListDetails(this.loanDetails);
    }
    if (this.offerDocumentList.length > 0) {
      this.offerDocumentList.forEach(offerLetter => {
        this.initialInformation = JSON.parse(offerLetter.initialInformation);
      });
      if (!ObjectUtil.isEmpty(this.initialInformation)) {
        this.timeLetterCreditForm.patchValue(this.initialInformation.timeLetterCreditForm);
      }
      this.patchDate();
    }

    if (!ObjectUtil.isEmpty(this.filteredList)) {
      for (let val = 0; val < this.filteredList.length; val++) {
        const loanamountWords = this.engToNepWord.transform(this.filteredList[val].loanAmount.toFixed(2));
        this.timeLetterCreditForm.get(['timeLetterCreditFormArray', val, 'loanAmount']).patchValue(
            this.filteredList[val] ? this.filteredList[val].loanAmount : '');
        this.timeLetterCreditForm.get(['timeLetterCreditFormArray', val, 'loanAmountWords']).patchValue(
            loanamountWords ? loanamountWords : '');
      }
    }
    this.setLoanId();
  }
  patchDate() {
    for (let val = 0; val < this.initialInformation.timeLetterCreditForm.timeLetterCreditFormArray.length; val++) {
      const dateOfExpiryType = this.initialInformation.timeLetterCreditForm.timeLetterCreditFormArray[val].dateOfExpiryType;
      if (dateOfExpiryType === 'AD') {
        const dateOfExpiry = this.initialInformation.timeLetterCreditForm.timeLetterCreditFormArray[val].dateOfExpiry;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.timeLetterCreditForm.get(['timeLetterCreditFormArray', val, 'dateOfExpiry']).patchValue(new Date(dateOfExpiry));
        }
      } else if (dateOfExpiryType === 'BS') {
        const dateOfExpiry = this.initialInformation.timeLetterCreditForm.timeLetterCreditFormArray[val].dateOfExpiryNepali;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.timeLetterCreditForm.get(['timeLetterCreditFormArray', val, 'dateOfExpiryNepali']).patchValue(dateOfExpiry);
        }
      }
    }
  }
  buildForm() {
    this.timeLetterCreditForm = this.formBuilder.group({
      timeLetterCreditFormArray: this.formBuilder.array([]),
    });
  }

  checkComplimetryOtherLoan(data, i) {
    this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'complementaryOther']).patchValue(data);
  }

  public checkDateOfExpiry(value): void {
    this.ADExpiry = value === 'AD';
    this.BSExpiry = value === 'BS';
  }

  public getNumAmountWord(numLabel, wordLabel, index, arrayName): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.timeLetterCreditForm.get([arrayName, index, numLabel]).value);
    this.timeLetterCreditForm.get([arrayName, index, wordLabel]).patchValue(transformValue);
  }

  async translateAndSetVal(i) {

    /* SET TRANS VALUE FOR CONDITIONS */
    const tempLoanOptions = this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'loanOption']).value;
    if (!ObjectUtil.isEmpty(tempLoanOptions)) {
      this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'loanOptionTrans']).patchValue('');
    }

    const tempComplimentaryLoan = this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'complimentaryLoanSelected']).value;
    if (!ObjectUtil.isEmpty(tempComplimentaryLoan)) {
      this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'complimentaryLoanSelectedTrans']).patchValue(tempComplimentaryLoan);
    }

    const tempComplemetry = this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'complementaryOther']).value;
    if (!ObjectUtil.isEmpty(tempComplemetry)) {
      this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'complementaryOtherTrans']).patchValue(tempComplemetry);
    }

    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    const tempLoanAmount = this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'loanAmount']).value;
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'loanAmountTrans']).patchValue(convertNumber);

    this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'loanAmountWordsTrans']).patchValue(
        this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'loanAmountWords']).value
    );
    const convertMargin = this.convertNumbersToNepali(this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'marginInPercentage']).value, false);
    this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'marginInPercentageTrans']).patchValue(convertMargin);
    const convertCommissionRate = this.convertNumbersToNepali(this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'commissionRate']).value, false);
    this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'commissionRateTrans']).patchValue(convertCommissionRate);
    const convertMinimumCommission = this.convertNumbersToNepali(this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'minimumCommissionAmount']).value, false);
    this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'minimumCommissionAmountTrans']).patchValue(convertMinimumCommission);

    /* Converting value for date */
    this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'dateOfExpiryTypeTrans']).patchValue(
        this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'dateOfExpiryType']).value
    );
    const tempDateOfExpType = this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'dateOfExpiryType']).value;
    let tempExpDate;
    if (tempDateOfExpType === 'AD') {
      const tempEngExpDate = this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'dateOfExpiry']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ? this.datePipe.transform(tempEngExpDate) : '';
      if (!ObjectUtil.isEmpty(tempExpDate)) {
        const finalExpDate = this.transformEnglishDate(tempExpDate);
        this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'dateOfExpiryTrans']).patchValue(finalExpDate);
      }
    } else {
      const tempDateOfExpNep = this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'dateOfExpiryNepali']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.nDate : '';
      this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'dateOfExpiryTrans']).patchValue(tempExpDate);
    }
    this.setCTValue(i);
  }
  transformEnglishDate(date) {
    let transformedDate;
    let monthName;
    const dateArray = [];
    const splittedDate = date.split(' ');
    if (splittedDate[0] === 'Jan') {
      monthName = 'जनवरी';
    } else if (splittedDate[0] === 'Feb') {
      monthName = 'फेब्रुअरी';
    } else if (splittedDate[0] === 'Mar') {
      monthName = 'मार्च';
    } else if (splittedDate[0] === 'Apr') {
      monthName = 'अप्रिल';
    } else if (splittedDate[0] === 'May') {
      monthName = 'मे';
    } else if (splittedDate[0] === 'Jun') {
      monthName = 'जुन';
    } else if (splittedDate[0] === 'Jul') {
      monthName = 'जुलाई';
    } else if (splittedDate[0] === 'Aug') {
      monthName = 'अगष्ट';
    } else if (splittedDate[0] === 'Sep') {
      monthName = 'सेप्टेम्बर';
    } else if (splittedDate[0] === 'Oct') {
      monthName = 'अक्टुबर';
    } else if (splittedDate[0] === 'Nov') {
      monthName = 'नोभेम्बर';
    } else {
      monthName = 'डिसेम्बर';
    }
    dateArray.push(this.engToNepNumberPipe.transform(splittedDate[1].slice(0, -1)));
    dateArray.push(monthName + ',');
    dateArray.push(this.engToNepNumberPipe.transform(splittedDate[2]));
    transformedDate = dateArray.join(' ');
    return transformedDate;
  }

  setCTValue(i) {
    this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'loanOptionCT']).patchValue(
        this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'loanOptionTrans']).value
    );
    this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'complimentaryLoanSelectedCT']).patchValue(
        this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'complimentaryLoanSelectedTrans']).value
    );
    this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'complementaryOtherCT']).patchValue(
        this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'complementaryOtherTrans']).value
    );
    this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'loanAmountCT']).patchValue(
        this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'loanAmountTrans']).value
    );
    this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'loanAmountWordsCT']).patchValue(
        this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'loanAmountWordsTrans']).value
    );
    this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'marginInPercentageCT']).patchValue(
        this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'marginInPercentageTrans']).value
    );
    this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'commissionRateCT']).patchValue(
        this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'commissionRateTrans']).value
    );
    this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'minimumCommissionAmountCT']).patchValue(
        this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'minimumCommissionAmountTrans']).value
    );
    this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'dateOfExpiryTypeCT']).patchValue(
        this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'dateOfExpiryTypeTrans']).value
    );
    this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'dateOfExpiryNepaliCT']).patchValue(
        this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'dateOfExpiryNepaliTrans']).value
    );
    this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'dateOfExpiryCT']).patchValue(
        this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'dateOfExpiryTrans']).value
    );
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

  setLoanOption(data) {
    const tempData = !ObjectUtil.isEmpty(data) ? data : '';
    this.isOnOffSelected = tempData === 'ONE_OFF_BASIS';
    this.isRegularSelected = tempData === 'REGULAR';
  }

  filteredListDetails(loanDetails) {
    this.filteredList = loanDetails.filter(data => data.name === this.loanNameConstant.CUSTOMER_ACCEPTANCE_FOR_TIME_LETTER_OF_CREDIT);
    this.filteredList.forEach(value => {
      this.addLoanFormArr();
    });
  }

  addLoanFormArr() {
    (this.timeLetterCreditForm.get('timeLetterCreditFormArray') as FormArray).push(this.buildLoanForm());
  }

  buildLoanForm() {
    return this.formBuilder.group({
      // form data
      loanOption: [undefined],
      complimentaryLoanSelected: [undefined],
      complementaryOther: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      marginInPercentage: [undefined],
      commissionRate: [undefined],
      minimumCommissionAmount: [undefined],
      dateOfExpiryType: [undefined],
      dateOfExpiryNepali: [undefined],
      dateOfExpiry: [undefined],

      // translated data
      loanOptionTrans: [undefined],
      complimentaryLoanSelectedTrans: [undefined],
      complementaryOtherTrans: [undefined],
      loanAmountTrans: [undefined],
      loanAmountWordsTrans: [undefined],
      marginInPercentageTrans: [undefined],
      commissionRateTrans: [undefined],
      minimumCommissionAmountTrans: [undefined],
      dateOfExpiryTypeTrans: [undefined],
      dateOfExpiryNepaliTrans: [undefined],
      dateOfExpiryTrans: [undefined],

      // for corrected data
      loanOptionCT: [undefined],
      complimentaryLoanSelectedCT: [undefined],
      complementaryOtherCT: [undefined],
      loanAmountCT: [undefined],
      loanAmountWordsCT: [undefined],
      marginInPercentageCT: [undefined],
      commissionRateCT: [undefined],
      minimumCommissionAmountCT: [undefined],
      dateOfExpiryTypeCT: [undefined],
      dateOfExpiryNepaliCT: [undefined],
      dateOfExpiryCT: [undefined],

      loanId: [undefined],
    });
  }

  setLoanId() {
    this.filteredLoanIdList = this.cadDocAssignedLoan.filter(data =>
        data.loan.name === this.loanNameConstant.CUSTOMER_ACCEPTANCE_FOR_TIME_LETTER_OF_CREDIT);
    this.filteredList.forEach((val, i) => {
      this.timeLetterCreditForm.get(['timeLetterCreditFormArray', i, 'loanId']).patchValue(
          this.filteredLoanIdList[i].proposal.id);
    });
  }
}
