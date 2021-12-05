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
  timeLetterCreditForm: FormGroup;
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
    this.timeLetterCreditForm = this.formBuilder.group({
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
    this.timeLetterCreditForm.get('complementryOther').patchValue(this.isComplimentryOtherLoan);
  }

  public checkDateOfExpiry(value): void {
    this.ADExpiry = value === 'AD';
    this.BSExpiry = value === 'BS';
  }

  public getNumAmountWord(numLabel, wordLabel): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.timeLetterCreditForm.get(numLabel).value);
    this.timeLetterCreditForm.get(wordLabel).patchValue(transformValue);
  }

  translateAndSetVal() {

    /* SET TRANS VALUE FOR CONDITIONS */
    const tempLoanOptions = this.timeLetterCreditForm.get('loanOption').value;
    if (!ObjectUtil.isEmpty(tempLoanOptions)) {
      this.timeLetterCreditForm.get('loanOptionTrans').patchValue('');
    }

    const tempMultiLoan = this.timeLetterCreditForm.get('multiLoanTrans').value;
    if (!ObjectUtil.isEmpty(tempMultiLoan)) {
      this.timeLetterCreditForm.get('multiLoanTrans').patchValue('');
    }

    const tempComplemetry = this.timeLetterCreditForm.get('complementryOther').value;
    if (!ObjectUtil.isEmpty(tempComplemetry)) {
      this.timeLetterCreditForm.get('complementryOtherTrans').patchValue(tempComplemetry);
    }

    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    const tempLoanAmount = this.timeLetterCreditForm.get('loanAmount').value;
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.timeLetterCreditForm.get('loanAmountTrans').patchValue(convertNumber);

    this.timeLetterCreditForm.get('loanAmountAmountWordsTrans').patchValue(
        this.timeLetterCreditForm.get('loanAmountAmountWords').value
    );
    const convertMargin = this.convertNumbersToNepali(this.timeLetterCreditForm.get('marginInPercentage').value, false);
    this.timeLetterCreditForm.get('marginInPercentageTrans').patchValue(convertMargin);
    const convertCommissionRate = this.convertNumbersToNepali(this.timeLetterCreditForm.get('commissionRate').value, false);
    this.timeLetterCreditForm.get('commissionRateTrans').patchValue(convertCommissionRate);
    const convertMinimumCommission = this.convertNumbersToNepali(this.timeLetterCreditForm.get('minimumCommissionAmount').value, false);
    this.timeLetterCreditForm.get('minimumCommissionAmountTrans').patchValue(convertMinimumCommission);

    /* Converting value for date */
    this.timeLetterCreditForm.get('dateOfExpiryTypeTrans').patchValue(
        this.timeLetterCreditForm.get('dateOfExpiryType').value
    );
    const tempDateOfExpType = this.timeLetterCreditForm.get('dateOfExpiryType').value;
    let tempExpDate;
    if (tempDateOfExpType === 'AD') {
      const tempEngExpDate = this.timeLetterCreditForm.get('dateOfExpiry').value;
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ?
          this.engToNepDatePipe.transform(this.datePipe.transform(tempEngExpDate), true) : '';
      this.timeLetterCreditForm.get('dateOfExpiryTrans').patchValue(tempExpDate);
    } else {
      const tempDateOfExpNep = this.timeLetterCreditForm.get('dateOfExpiryNepali').value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.nDate : '';
      this.timeLetterCreditForm.get('dateOfExpiryTrans').patchValue(tempExpDate);
    }
    this.setCTValue();
  }

  setCTValue() {
    this.timeLetterCreditForm.get('loanOptionCT').patchValue(
        this.timeLetterCreditForm.get('loanOptionTrans').value
    );
    this.timeLetterCreditForm.get('multiLoanCT').patchValue(
        this.timeLetterCreditForm.get('multiLoanTrans').value
    );
    this.timeLetterCreditForm.get('complementryOtherCT').patchValue(
        this.timeLetterCreditForm.get('complementryOtherTrans').value
    );
    this.timeLetterCreditForm.get('loanAmountCT').patchValue(
        this.timeLetterCreditForm.get('loanAmountTrans').value
    );
    this.timeLetterCreditForm.get('loanAmountAmountWordsCT').patchValue(
        this.timeLetterCreditForm.get('loanAmountAmountWordsTrans').value
    );
    this.timeLetterCreditForm.get('marginInPercentageCT').patchValue(
        this.timeLetterCreditForm.get('marginInPercentageTrans').value
    );
    this.timeLetterCreditForm.get('commissionRateCT').patchValue(
        this.timeLetterCreditForm.get('commissionRateTrans').value
    );
    this.timeLetterCreditForm.get('minimumCommissionAmountCT').patchValue(
        this.timeLetterCreditForm.get('minimumCommissionAmountTrans').value
    );
    this.timeLetterCreditForm.get('dateOfExpiryTypeCT').patchValue(
        this.timeLetterCreditForm.get('dateOfExpiryTypeTrans').value
    );
    this.timeLetterCreditForm.get('dateOfExpiryNepaliCT').patchValue(
        this.timeLetterCreditForm.get('dateOfExpiryNepaliTrans').value
    );
    this.timeLetterCreditForm.get('dateOfExpiryCT').patchValue(
        this.timeLetterCreditForm.get('dateOfExpiryTrans').value
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
