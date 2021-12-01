import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {NepaliCurrencyWordPipe} from "../../../../../../../../../@core/pipe/nepali-currency-word.pipe";
import {EngToNepaliNumberPipe} from "../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe";
import {CurrencyFormatterPipe} from "../../../../../../../../../@core/pipe/currency-formatter.pipe";
import {DatePipe} from "@angular/common";
import {EngNepDatePipe} from "nepali-patro";
import {ObjectUtil} from "../../../../../../../../../@core/utils/ObjectUtil";

@Component({
  selector: 'app-import-loan-trust-receipt-loan',
  templateUrl: './import-loan-trust-receipt-loan.component.html',
  styleUrls: ['./import-loan-trust-receipt-loan.component.scss']
})
export class ImportLoanTrustReceiptLoanComponent implements OnInit {
  @Input() loanName;
  importLoanTrust: FormGroup;
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

  buildForm() {
    this.importLoanTrust = this.formBuilder.group({
      //for form data
      loanOption: [undefined],
      multiLoan: [undefined],
      complementryOther: [undefined],
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

      //for translated data
      loanOptionTrans: [undefined],
      multiLoanTrans: [undefined],
      complementryOtherTrans: [undefined],
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

      //for corrected data
      loanOptionCT: [undefined],
      multiLoanCT: [undefined],
      complementryOtherCT: [undefined],
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
    })
  }

  checkComplimetryOtherLoan(data) {
    this.isComplimentryOtherLoan = data;
    this.importLoanTrust.get('complementryOther').patchValue(this.isComplimentryOtherLoan);
  }

  public checkDateOfExpiry(value): void {
    this.ADExpiry = value === 'AD';
    this.BSExpiry = value === 'BS';
  }

  public getNumAmountWord(numLabel, wordLabel): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.importLoanTrust.get(numLabel).value);
    this.importLoanTrust.get(wordLabel).patchValue(transformValue);
  }

  setLoanOption(data) {
    const tempData = !ObjectUtil.isEmpty(data) ? data : '';
    this.isOnOffSelected = tempData === 'ONE_OFF_BASIS';
    this.isRegularSelected = tempData === 'REGULAR';
  }

  translateAndSetVal() {

    /* SET TRANS VALUE FOR CONDITIONS */
    const tempLoanOptions = this.importLoanTrust.get('loanOption').value;
    if (!ObjectUtil.isEmpty(tempLoanOptions)) {
      this.importLoanTrust.get('loanOptionTrans').patchValue('');
    }

    const tempMultiLoan = this.importLoanTrust.get('multiLoanTrans').value;
    if (!ObjectUtil.isEmpty(tempMultiLoan)) {
      this.importLoanTrust.get('multiLoanTrans').patchValue('');
    }

    const tempComplemetry = this.importLoanTrust.get('complementryOther').value;
    if (!ObjectUtil.isEmpty(tempComplemetry)) {
      this.importLoanTrust.get('complementryOtherTrans').patchValue(tempComplemetry);
    }

    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    const tempLoanAmount = this.importLoanTrust.get('loanAmount').value;
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.importLoanTrust.get('loanAmountTrans').patchValue(convertNumber);

    this.importLoanTrust.get('loanAmountWordsTrans').patchValue(
        this.importLoanTrust.get('loanAmountWords').value
    );
    const drawingPower = this.convertNumbersToNepali(this.importLoanTrust.get('drawingPower').value, false);
    this.importLoanTrust.get('drawingPowerTrans').patchValue(drawingPower);
    const loanPeriod = this.convertNumbersToNepali(this.importLoanTrust.get('loanPeriod').value, false);
    this.importLoanTrust.get('loanPeriodTrans').patchValue(loanPeriod);
    const baseRate1 = this.convertNumbersToNepali(this.importLoanTrust.get('baseRate').value, false);
    this.importLoanTrust.get('baseRateTrans').patchValue(baseRate1);
    const premiumRate1 = this.convertNumbersToNepali(this.importLoanTrust.get('premiumRate').value, false);
    this.importLoanTrust.get('premiumRateTrans').patchValue(premiumRate1);
    const interestRate = this.convertNumbersToNepali(this.importLoanTrust.get('interestRate').value, false);
    this.importLoanTrust.get('interestRateTrans').patchValue(interestRate);

    /* Converting value for date */
    this.importLoanTrust.get('dateOfExpiryTypeTrans').patchValue(
        this.importLoanTrust.get('dateOfExpiryType').value
    );
    const tempDateOfExpType = this.importLoanTrust.get('dateOfExpiryType').value;
    let tempExpDate;
    if (tempDateOfExpType === 'AD') {
      const tempEngExpDate = this.importLoanTrust.get('dateOfExpiry').value;
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ?
          this.engToNepDatePipe.transform(this.datePipe.transform(tempEngExpDate), true) : '';
      this.importLoanTrust.get('dateOfExpiryTrans').patchValue(tempExpDate);
    } else {
      const tempDateOfExpNep = this.importLoanTrust.get('dateOfExpiryNepali').value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.nDate : '';
      this.importLoanTrust.get('dateOfExpiryTrans').patchValue(tempExpDate);
    }
    this.setCTValue();
  }

  setCTValue() {
    this.importLoanTrust.get('loanOptionCT').patchValue(
        this.importLoanTrust.get('loanOptionTrans').value
    );
    this.importLoanTrust.get('multiLoanCT').patchValue(
        this.importLoanTrust.get('multiLoanTrans').value
    );
    this.importLoanTrust.get('complementryOtherCT').patchValue(
        this.importLoanTrust.get('complementryOtherTrans').value
    );
    this.importLoanTrust.get('loanAmountCT').patchValue(
        this.importLoanTrust.get('loanAmountTrans').value
    );
    this.importLoanTrust.get('loanAmountWordsCT').patchValue(
        this.importLoanTrust.get('loanAmountWordsTrans').value
    );
    this.importLoanTrust.get('drawingPowerCT').patchValue(
        this.importLoanTrust.get('drawingPowerTrans').value
    );
    this.importLoanTrust.get('loanPeriodCT').patchValue(
        this.importLoanTrust.get('loanPeriodTrans').value
    );
    this.importLoanTrust.get('baseRateCT').patchValue(
        this.importLoanTrust.get('baseRateTrans').value
    );
    this.importLoanTrust.get('premiumRateCT').patchValue(
        this.importLoanTrust.get('premiumRateTrans').value
    );
    this.importLoanTrust.get('interestRateCT').patchValue(
        this.importLoanTrust.get('interestRateTrans').value
    );
    this.importLoanTrust.get('dateOfExpiryTypeCT').patchValue(
        this.importLoanTrust.get('dateOfExpiryTypeTrans').value
    );
    this.importLoanTrust.get('dateOfExpiryNepaliCT').patchValue(
        this.importLoanTrust.get('dateOfExpiryNepaliTrans').value
    );
    this.importLoanTrust.get('dateOfExpiryCT').patchValue(
        this.importLoanTrust.get('dateOfExpiryTrans').value
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

  calInterestRate() {
    const baseRate = this.importLoanTrust.get('baseRate').value;
    const premiumRate = this.importLoanTrust.get('premiumRate').value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.importLoanTrust.get('interestRate').patchValue(sum);
  }

}
