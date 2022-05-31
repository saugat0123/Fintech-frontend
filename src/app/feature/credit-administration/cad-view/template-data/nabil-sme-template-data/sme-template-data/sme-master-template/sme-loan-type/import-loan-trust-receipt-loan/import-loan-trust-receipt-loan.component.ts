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
  selector: 'app-import-loan-trust-receipt-loan',
  templateUrl: './import-loan-trust-receipt-loan.component.html',
  styleUrls: ['./import-loan-trust-receipt-loan.component.scss']
})
export class ImportLoanTrustReceiptLoanComponent implements OnInit {
  @Input() loanName;
  @Input() offerDocumentList: Array<OfferDocument>;
  @Input() cadDocAssignedLoan;
  initialInformation: any;
  importLoanTrust: FormGroup;
  isComplimentryOtherLoan = false;
  dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
  ADExpiry = false;
  BSExpiry = false;
  loanDetails: any = [];
  isOnOffSelected = false;
  isRegularSelected = false;
  yesNoOptions = [
    {value: 'Yes'},
    {value: 'No'}
  ];
  filteredList: any = [];
  loanNameConstant = LoanNameConstant;
  filteredLoanIdList: any = [];
  constructor(private formBuilder: FormBuilder,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatterPipe: CurrencyFormatterPipe,
              private datePipe: DatePipe,
              private engToNepDatePipe: EngNepDatePipe,
              private engToNepWord: NepaliCurrencyWordPipe) { }

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
        this.importLoanTrust.patchValue(this.initialInformation.importLoanTrust);
      }
      this.patchDate();
    }
    if (!ObjectUtil.isEmpty(this.filteredList)) {
      for (let val = 0; val < this.filteredList.length; val++) {
        const loanamountWords = this.engToNepWord.transform(this.filteredList[val].loanAmount);
        this.importLoanTrust.get(['importLoanTrustFormArray', val, 'loanAmount']).patchValue(
            this.filteredList[val] ? this.filteredList[val].loanAmount : '');
        this.importLoanTrust.get(['importLoanTrustFormArray', val, 'loanAmountWords']).patchValue(
            loanamountWords ? loanamountWords : '');
      }
    }
    this.setLoanId();
  }
  patchDate() {
    for (let val = 0; val < this.initialInformation.importLoanTrust.importLoanTrustFormArray.length; val++) {
      const dateOfExpiryType = this.initialInformation.importLoanTrust.importLoanTrustFormArray[val].dateOfExpiryType;
      if (dateOfExpiryType === 'AD') {
        const dateOfExpiry = this.initialInformation.importLoanTrust.importLoanTrustFormArray[val].dateOfExpiry;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.importLoanTrust.get(['importLoanTrustFormArray', val, 'dateOfExpiry']).patchValue(new Date(dateOfExpiry));
        }
      } else if (dateOfExpiryType === 'BS') {
        const dateOfExpiry = this.initialInformation.importLoanTrust.importLoanTrustFormArray[val].dateOfExpiryNepali;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.importLoanTrust.get(['importLoanTrustFormArray', val, 'dateOfExpiryNepali']).patchValue(dateOfExpiry);
        }
      }
    }
  }
  buildForm() {
    this.importLoanTrust = this.formBuilder.group({
      importLoanTrustFormArray: this.formBuilder.array([]),
    });
  }

  checkComplimetryOtherLoan(data, i) {
    if (!data) {
      this.importLoanTrust.get(['importLoanTrustFormArray', i, 'complementaryOther']).patchValue(data);
    }
  }

  public checkDateOfExpiry(value): void {
    this.ADExpiry = value === 'AD';
    this.BSExpiry = value === 'BS';
  }

  public getNumAmountWord(numLabel, wordLabel, index, arrayName): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.importLoanTrust.get([arrayName, index, numLabel]).value);
    this.importLoanTrust.get([arrayName, index, wordLabel]).patchValue(transformValue);
  }

  setLoanOption(data) {
    const tempData = !ObjectUtil.isEmpty(data) ? data : '';
    this.isOnOffSelected = tempData === 'ONE_OFF_BASIS';
    this.isRegularSelected = tempData === 'REGULAR';
  }

  async translateAndSetVal(i) {

    /* SET TRANS VALUE FOR CONDITIONS */
    const tempLoanOptions = this.importLoanTrust.get(['importLoanTrustFormArray', i, 'loanOption']).value;
    if (!ObjectUtil.isEmpty(tempLoanOptions)) {
      this.importLoanTrust.get(['importLoanTrustFormArray', i, 'loanOptionTrans']).patchValue('');
    }

    const tempComplimentaryLoan = this.importLoanTrust.get(['importLoanTrustFormArray', i, 'complimentaryLoanSelected']).value;
    if (!ObjectUtil.isEmpty(tempComplimentaryLoan)) {
      this.importLoanTrust.get(['importLoanTrustFormArray', i, 'complimentaryLoanSelectedTrans']).patchValue(tempComplimentaryLoan);
    }

    const tempComplemetry = this.importLoanTrust.get(['importLoanTrustFormArray', i, 'complementaryOther']).value;
    if (!ObjectUtil.isEmpty(tempComplemetry)) {
      this.importLoanTrust.get(['importLoanTrustFormArray', i, 'complementaryOtherTrans']).patchValue(tempComplemetry);
    }

    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    const tempLoanAmount = this.importLoanTrust.get(['importLoanTrustFormArray', i, 'loanAmount']).value;
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.importLoanTrust.get(['importLoanTrustFormArray', i, 'loanAmountTrans']).patchValue(convertNumber);

    this.importLoanTrust.get(['importLoanTrustFormArray', i, 'loanAmountWordsTrans']).patchValue(
        this.importLoanTrust.get(['importLoanTrustFormArray', i, 'loanAmountWords']).value
    );
    const drawingPower = this.convertNumbersToNepali(this.importLoanTrust.get(['importLoanTrustFormArray', i, 'drawingPower']).value, false);
    this.importLoanTrust.get(['importLoanTrustFormArray', i, 'drawingPowerTrans']).patchValue(drawingPower);
    const loanPeriod = this.convertNumbersToNepali(this.importLoanTrust.get(['importLoanTrustFormArray', i, 'loanPeriod']).value, false);
    this.importLoanTrust.get(['importLoanTrustFormArray', i, 'loanPeriodTrans']).patchValue(loanPeriod);
    const baseRate1 = this.convertNumbersToNepali(this.importLoanTrust.get(['importLoanTrustFormArray', i, 'baseRate']).value.toFixed(2), false);
    this.importLoanTrust.get(['importLoanTrustFormArray', i, 'baseRateTrans']).patchValue(baseRate1);
    const premiumRate1 = this.convertNumbersToNepali(this.importLoanTrust.get(['importLoanTrustFormArray', i, 'premiumRate']).value.toFixed(2), false);
    this.importLoanTrust.get(['importLoanTrustFormArray', i, 'premiumRateTrans']).patchValue(premiumRate1);
    const interestRate = this.convertNumbersToNepali(this.importLoanTrust.get(['importLoanTrustFormArray', i, 'interestRate']).value, false);
    this.importLoanTrust.get(['importLoanTrustFormArray', i, 'interestRateTrans']).patchValue(interestRate);

    /* Converting value for date */
    this.importLoanTrust.get(['importLoanTrustFormArray', i, 'dateOfExpiryTypeTrans']).patchValue(
        this.importLoanTrust.get(['importLoanTrustFormArray', i, 'dateOfExpiryType']).value
    );
    const tempDateOfExpType = this.importLoanTrust.get(['importLoanTrustFormArray', i, 'dateOfExpiryType']).value;
    let tempExpDate;
    if (tempDateOfExpType === 'AD') {
      const tempEngExpDate = this.importLoanTrust.get(['importLoanTrustFormArray', i, 'dateOfExpiry']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ? this.datePipe.transform(tempEngExpDate) : '';
      if (!ObjectUtil.isEmpty(tempExpDate)) {
        const finalExpDate = this.transformEnglishDate(tempExpDate);
        this.importLoanTrust.get(['importLoanTrustFormArray', i, 'dateOfExpiryTrans']).patchValue(finalExpDate);
      }
    } else {
      const tempDateOfExpNep = this.importLoanTrust.get(['importLoanTrustFormArray', i, 'dateOfExpiryNepali']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.nDate : '';
      this.importLoanTrust.get(['importLoanTrustFormArray', i, 'dateOfExpiryTrans']).patchValue(tempExpDate);
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
    this.importLoanTrust.get(['importLoanTrustFormArray', i, 'loanOptionCT']).patchValue(
        this.importLoanTrust.get(['importLoanTrustFormArray', i, 'loanOptionTrans']).value
    );
    this.importLoanTrust.get(['importLoanTrustFormArray', i, 'complimentaryLoanSelectedCT']).patchValue(
        this.importLoanTrust.get(['importLoanTrustFormArray', i, 'complimentaryLoanSelectedTrans']).value
    );
    this.importLoanTrust.get(['importLoanTrustFormArray', i, 'complementaryOtherCT']).patchValue(
        this.importLoanTrust.get(['importLoanTrustFormArray', i, 'complementaryOtherTrans']).value
    );
    this.importLoanTrust.get(['importLoanTrustFormArray', i, 'loanAmountCT']).patchValue(
        this.importLoanTrust.get(['importLoanTrustFormArray', i, 'loanAmountTrans']).value
    );
    this.importLoanTrust.get(['importLoanTrustFormArray', i, 'loanAmountWordsCT']).patchValue(
        this.importLoanTrust.get(['importLoanTrustFormArray', i, 'loanAmountWordsTrans']).value
    );
    this.importLoanTrust.get(['importLoanTrustFormArray', i, 'drawingPowerCT']).patchValue(
        this.importLoanTrust.get(['importLoanTrustFormArray', i, 'drawingPowerTrans']).value
    );
    this.importLoanTrust.get(['importLoanTrustFormArray', i, 'loanPeriodCT']).patchValue(
        this.importLoanTrust.get(['importLoanTrustFormArray', i, 'loanPeriodTrans']).value
    );
    this.importLoanTrust.get(['importLoanTrustFormArray', i, 'baseRateCT']).patchValue(
        this.importLoanTrust.get(['importLoanTrustFormArray', i, 'baseRateTrans']).value
    );
    this.importLoanTrust.get(['importLoanTrustFormArray', i, 'premiumRateCT']).patchValue(
        this.importLoanTrust.get(['importLoanTrustFormArray', i, 'premiumRateTrans']).value
    );
    this.importLoanTrust.get(['importLoanTrustFormArray', i, 'interestRateCT']).patchValue(
        this.importLoanTrust.get(['importLoanTrustFormArray', i, 'interestRateTrans']).value
    );
    this.importLoanTrust.get(['importLoanTrustFormArray', i, 'dateOfExpiryTypeCT']).patchValue(
        this.importLoanTrust.get(['importLoanTrustFormArray', i, 'dateOfExpiryTypeTrans']).value
    );
    this.importLoanTrust.get(['importLoanTrustFormArray', i, 'dateOfExpiryNepaliCT']).patchValue(
        this.importLoanTrust.get(['importLoanTrustFormArray', i, 'dateOfExpiryNepaliTrans']).value
    );
    this.importLoanTrust.get(['importLoanTrustFormArray', i, 'dateOfExpiryCT']).patchValue(
        this.importLoanTrust.get(['importLoanTrustFormArray', i, 'dateOfExpiryTrans']).value
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

  calInterestRate(i) {
    const baseRate = this.importLoanTrust.get(['importLoanTrustFormArray', i, 'baseRate']).value;
    const premiumRate = this.importLoanTrust.get(['importLoanTrustFormArray', i, 'premiumRate']).value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.importLoanTrust.get(['importLoanTrustFormArray', i, 'interestRate']).patchValue(sum.toFixed(2));
  }

  filteredListDetails(loanDetails) {
    this.filteredList = loanDetails.filter(data => data.name === this.loanNameConstant.IMPORT_LOAN_TRUST_RECEIPT_LOAN);
    this.filteredList.forEach(value => {
      this.addLoanFormArr();
    });
  }

  addLoanFormArr() {
    (this.importLoanTrust.get('importLoanTrustFormArray') as FormArray).push(this.buildLoanForm());
  }

  buildLoanForm() {
    return this.formBuilder.group({
      loanOption: [undefined],
      complimentaryLoanSelected: [undefined],
      subsidyOrAgricultureLoan: [undefined],
      complementaryOther: [undefined],
      loanPeriod: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      drawingPower: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      interestRate: [undefined],
      dateOfExpiryType: [undefined],
      dateOfExpiryNepali: [undefined],
      dateOfExpiry: [undefined],

      // for translated data
      loanOptionTrans: [undefined],
      complimentaryLoanSelectedTrans: [undefined],
      complementaryOtherTrans: [undefined],
      loanPeriodTrans: [undefined],
      loanAmountTrans: [undefined],
      loanAmountWordsTrans: [undefined],
      drawingPowerTrans: [undefined],
      baseRateTrans: [undefined],
      premiumRateTrans: [undefined],
      interestRateTrans: [undefined],
      dateOfExpiryTypeTrans: [undefined],
      dateOfExpiryNepaliTrans: [undefined],
      dateOfExpiryTrans: [undefined],

      // for corrected data
      loanOptionCT: [undefined],
      complimentaryLoanSelectedCT: [undefined],
      complementaryOtherCT: [undefined],
      loanPeriodCT: [undefined],
      loanAmountCT: [undefined],
      loanAmountWordsCT: [undefined],
      drawingPowerCT: [undefined],
      baseRateCT: [undefined],
      premiumRateCT: [undefined],
      interestRateCT: [undefined],
      dateOfExpiryTypeCT: [undefined],
      dateOfExpiryNepaliCT: [undefined],
      dateOfExpiryCT: [undefined],

      loanId: [undefined],
    });
  }

  setLoanId() {
    this.filteredLoanIdList = this.cadDocAssignedLoan.filter(data =>
        data.loan.name === this.loanNameConstant.IMPORT_LOAN_TRUST_RECEIPT_LOAN);
    this.filteredList.forEach((val, i) => {
      this.importLoanTrust.get(['importLoanTrustFormArray', i, 'loanId']).patchValue(
          this.filteredLoanIdList[i].proposal.id);
    });
  }
}
