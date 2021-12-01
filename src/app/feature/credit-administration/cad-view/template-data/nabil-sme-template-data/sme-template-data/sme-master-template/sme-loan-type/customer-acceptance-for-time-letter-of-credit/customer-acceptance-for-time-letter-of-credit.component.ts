import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {NepaliCurrencyWordPipe} from "../../../../../../../../../@core/pipe/nepali-currency-word.pipe";
import {EngToNepaliNumberPipe} from "../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe";
import {CurrencyFormatterPipe} from "../../../../../../../../../@core/pipe/currency-formatter.pipe";
import {DatePipe} from "@angular/common";
import {EngNepDatePipe} from "nepali-patro";
import {ObjectUtil} from "../../../../../../../../../@core/utils/ObjectUtil";

@Component({
  selector: 'app-customer-acceptance-for-time-letter-of-credit',
  templateUrl: './customer-acceptance-for-time-letter-of-credit.component.html',
  styleUrls: ['./customer-acceptance-for-time-letter-of-credit.component.scss']
})
export class CustomerAcceptanceForTimeLetterOfCreditComponent implements OnInit {
  @Input() loanName;
  timeLetterCredit: FormGroup;
  isComplimentryOtherLoan = false;
  dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
  ADExpiry = false;
  BSExpiry = false;
  loanDetails: any = [];
  isOnOffSelected = false;
  isRegularSelected = false;

  constructor(private formBuilder: FormBuilder,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatterPipe: CurrencyFormatterPipe,
              private datePipe: DatePipe,
              private engToNepDatePipe: EngNepDatePipe) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.loanName)) {
      this.loanDetails = this.loanName;
    }
  }

  buildForm(){
    this.timeLetterCredit = this.formBuilder.group({
      //form data
      loanOption: [undefined],
      multiLoan: [undefined],
      complementryOther: [undefined],
      loanAmount: [undefined],
      loanAmountAmountWords: [undefined],
      marginInPercentage: [undefined],
      commissionRate: [undefined],
      minimumCommissionAmount: [undefined],
      dateOfExpiryType: [undefined],
      dateOfExpiryNepali: [undefined],
      dateOfExpiry: [undefined],

      //translated data
      loanOptionTrans: [undefined],
      multiLoanTrans: [undefined],
      complementryOtherTrans: [undefined],
      loanAmountTrans: [undefined],
      loanAmountAmountWordsTrans: [undefined],
      marginInPercentageTrans: [undefined],
      commissionRateTrans: [undefined],
      minimumCommissionAmountTrans: [undefined],
      dateOfExpiryTypeTrans: [undefined],
      dateOfExpiryNepaliTrans: [undefined],
      dateOfExpiryTrans: [undefined],

      //for corrected data
      loanOptionCT: [undefined],
      multiLoanCT: [undefined],
      complementryOtherCT: [undefined],
      loanAmountCT: [undefined],
      loanAmountAmountWordsCT: [undefined],
      marginInPercentageCT: [undefined],
      commissionRateCT: [undefined],
      minimumCommissionAmountCT: [undefined],
      dateOfExpiryTypeCT: [undefined],
      dateOfExpiryNepaliCT: [undefined],
      dateOfExpiryCT: [undefined],

    })
  }

  checkComplimetryOtherLoan(data) {
    this.isComplimentryOtherLoan = data;
    this.timeLetterCredit.get('complementryOther').patchValue(this.isComplimentryOtherLoan);
  }

  public checkDateOfExpiry(value): void {
    this.ADExpiry = value === 'AD';
    this.BSExpiry = value === 'BS';
  }

  public getNumAmountWord(numLabel, wordLabel): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.timeLetterCredit.get(numLabel).value);
    this.timeLetterCredit.get(wordLabel).patchValue(transformValue);
  }

  translateAndSetVal() {

    /* SET TRANS VALUE FOR CONDITIONS */
    const tempLoanOptions = this.timeLetterCredit.get('loanOption').value;
    if (!ObjectUtil.isEmpty(tempLoanOptions)) {
      this.timeLetterCredit.get('loanOptionTrans').patchValue('');
    }

    const tempMultiLoan = this.timeLetterCredit.get('multiLoanTrans').value;
    if (!ObjectUtil.isEmpty(tempMultiLoan)) {
      this.timeLetterCredit.get('multiLoanTrans').patchValue('');
    }

    const tempComplemetry = this.timeLetterCredit.get('complementryOther').value;
    if (!ObjectUtil.isEmpty(tempComplemetry)) {
      this.timeLetterCredit.get('complementryOtherTrans').patchValue(tempComplemetry);
    }

    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    const tempLoanAmount = this.timeLetterCredit.get('loanAmount').value;
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.timeLetterCredit.get('loanAmountTrans').patchValue(convertNumber);

    this.timeLetterCredit.get('loanAmountAmountWordsTrans').patchValue(
        this.timeLetterCredit.get('loanAmountAmountWords').value
    );
    const convertMargin = this.convertNumbersToNepali(this.timeLetterCredit.get('marginInPercentage').value, false);
    this.timeLetterCredit.get('marginInPercentageTrans').patchValue(convertMargin);
    const convertCommissionRate = this.convertNumbersToNepali(this.timeLetterCredit.get('commissionRate').value, false);
    this.timeLetterCredit.get('commissionRateTrans').patchValue(convertCommissionRate);
    const convertMinimumCommission = this.convertNumbersToNepali(this.timeLetterCredit.get('minimumCommissionAmount').value, false);
    this.timeLetterCredit.get('minimumCommissionAmountTrans').patchValue(convertMinimumCommission);

    /* Converting value for date */
    this.timeLetterCredit.get('dateOfExpiryTypeTrans').patchValue(
        this.timeLetterCredit.get('dateOfExpiryType').value
    );
    const tempDateOfExpType = this.timeLetterCredit.get('dateOfExpiryType').value;
    let tempExpDate;
    if (tempDateOfExpType === 'AD') {
      const tempEngExpDate = this.timeLetterCredit.get('dateOfExpiry').value;
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ?
          this.engToNepDatePipe.transform(this.datePipe.transform(tempEngExpDate), true) : '';
      this.timeLetterCredit.get('dateOfExpiryTrans').patchValue(tempExpDate);
    } else {
      const tempDateOfExpNep = this.timeLetterCredit.get('dateOfExpiryNepali').value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.nDate : '';
      this.timeLetterCredit.get('dateOfExpiryTrans').patchValue(tempExpDate);
    }
    this.setCTValue();
  }

  setCTValue() {
    this.timeLetterCredit.get('loanOptionCT').patchValue(
        this.timeLetterCredit.get('loanOptionTrans').value
    );
    this.timeLetterCredit.get('multiLoanCT').patchValue(
        this.timeLetterCredit.get('multiLoanTrans').value
    );
    this.timeLetterCredit.get('complementryOtherCT').patchValue(
        this.timeLetterCredit.get('complementryOtherTrans').value
    );
    this.timeLetterCredit.get('loanAmountCT').patchValue(
        this.timeLetterCredit.get('loanAmountTrans').value
    );
    this.timeLetterCredit.get('loanAmountAmountWordsCT').patchValue(
        this.timeLetterCredit.get('loanAmountAmountWordsTrans').value
    );
    this.timeLetterCredit.get('marginInPercentageCT').patchValue(
        this.timeLetterCredit.get('marginInPercentageTrans').value
    );
    this.timeLetterCredit.get('commissionRateCT').patchValue(
        this.timeLetterCredit.get('commissionRateTrans').value
    );
    this.timeLetterCredit.get('minimumCommissionAmountCT').patchValue(
        this.timeLetterCredit.get('minimumCommissionAmountTrans').value
    );
    this.timeLetterCredit.get('dateOfExpiryTypeCT').patchValue(
        this.timeLetterCredit.get('dateOfExpiryTypeTrans').value
    );
    this.timeLetterCredit.get('dateOfExpiryNepaliCT').patchValue(
        this.timeLetterCredit.get('dateOfExpiryNepaliTrans').value
    );
    this.timeLetterCredit.get('dateOfExpiryCT').patchValue(
        this.timeLetterCredit.get('dateOfExpiryTrans').value
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
}
