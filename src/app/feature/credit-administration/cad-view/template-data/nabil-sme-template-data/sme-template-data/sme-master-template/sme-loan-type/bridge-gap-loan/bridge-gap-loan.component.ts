import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-bridge-gap-loan',
  templateUrl: './bridge-gap-loan.component.html',
  styleUrls: ['./bridge-gap-loan.component.scss']
})
export class BridgeGapLoanComponent implements OnInit {
  @Input() loanName;
  bridgeGapLoan: FormGroup;
  isComplimentryOtherLoan = false;
  isInterestSubsidy = false;
  loanDetails: any = [];

  constructor(
      private formBuilder: FormBuilder,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private engToNepNumberPipe: EngToNepaliNumberPipe,
      private currencyFormatterPipe: CurrencyFormatterPipe,
  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.loanName)) {
      this.loanDetails = this.loanName;
    }
  }
  buildForm() {
    this.bridgeGapLoan = this.formBuilder.group({
      // for form data
      complementryOther: [undefined],
      interestSubsidy: [undefined],
      multiLoan: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      interestRate: [undefined],
      totalInterestRate: [undefined],
      // for translated data
      complementryOtherTrans: [undefined],
      interestSubsidyTrans: [undefined],
      multiLoanTrans: [undefined],
      loanAmountTrans: [undefined],
      loanAmountWordsTrans: [undefined],
      baseRateTrans: [undefined],
      premiumRateTrans: [undefined],
      interestRateTrans: [undefined],
      totalInterestRateTrans: [undefined],
      // for corrected data
      complementryOtherCT: [undefined],
      interestSubsidyCT: [undefined],
      multiLoanCT: [undefined],
      loanAmountCT: [undefined],
      loanAmountWordsCT: [undefined],
      baseRateCT: [undefined],
      premiumRateCT: [undefined],
      interestRateCT: [undefined],
      totalInterestRateCT: [undefined],
    });
  }
  checkComplimetryOtherLoan(data) {
    this.isComplimentryOtherLoan = data;
    this.bridgeGapLoan.get('complementryOther').patchValue(this.isComplimentryOtherLoan);
  }
  interestSubsidyCheck(data) {
    this.isInterestSubsidy = data;
    this.bridgeGapLoan.get('interestSubsidy').patchValue(this.isInterestSubsidy);
  }
  public getNumAmountWord(numLabel, wordLabel): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.bridgeGapLoan.get(numLabel).value);
    this.bridgeGapLoan.get(wordLabel).patchValue(transformValue);
  }
  translateAndSetVal() {
    // set translate data for subsidy
    this.bridgeGapLoan.get('interestSubsidy').patchValue(this.isInterestSubsidy);
    /* SET TRANS VALUE FOR CONDITIONS */
    const tempComplemetry = this.bridgeGapLoan.get('complementryOther').value;
    if (!ObjectUtil.isEmpty(tempComplemetry)) {
      this.bridgeGapLoan.get('complementryOtherTrans').patchValue(tempComplemetry);
    }
    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    const tempLoanAmount = this.bridgeGapLoan.get('loanAmount').value;
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.bridgeGapLoan.get('loanAmountTrans').patchValue(convertNumber);

    this.bridgeGapLoan.get('loanAmountWordsTrans').patchValue(
        this.bridgeGapLoan.get('loanAmountWords').value
    );
    const baseRate1 = this.convertNumbersToNepali(this.bridgeGapLoan.get('baseRate').value, false);
    this.bridgeGapLoan.get('baseRateTrans').patchValue(baseRate1);
    const premiumRate1 = this.convertNumbersToNepali(this.bridgeGapLoan.get('premiumRate').value, false);
    this.bridgeGapLoan.get('premiumRateTrans').patchValue(premiumRate1);
    const interestRate = this.convertNumbersToNepali(this.bridgeGapLoan.get('interestRate').value, false);
    this.bridgeGapLoan.get('interestRateTrans').patchValue(interestRate);
    const totalinterestRate = this.convertNumbersToNepali(this.bridgeGapLoan.get('totalInterestRate').value, false);
    this.bridgeGapLoan.get('totalInterestRateTrans').patchValue(totalinterestRate);
    this.setCTValue();
  }
  setCTValue() {
    this.bridgeGapLoan.get('complementryOtherCT').patchValue(
        this.bridgeGapLoan.get('complementryOtherTrans').value
    );
    this.bridgeGapLoan.get('interestSubsidyCT').patchValue(
        this.bridgeGapLoan.get('interestSubsidy').value
    );
    this.bridgeGapLoan.get('loanAmountCT').patchValue(
        this.bridgeGapLoan.get('loanAmountTrans').value
    );
    this.bridgeGapLoan.get('loanAmountWordsCT').patchValue(
        this.bridgeGapLoan.get('loanAmountWordsTrans').value
    );
    this.bridgeGapLoan.get('baseRateCT').patchValue(
        this.bridgeGapLoan.get('baseRateTrans').value
    );
    this.bridgeGapLoan.get('premiumRateCT').patchValue(
        this.bridgeGapLoan.get('premiumRateTrans').value
    );
    this.bridgeGapLoan.get('interestRateCT').patchValue(
        this.bridgeGapLoan.get('interestRateTrans').value
    );
    this.bridgeGapLoan.get('totalInterestRateCT').patchValue(
        this.bridgeGapLoan.get('totalInterestRateTrans').value
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
    const baseRate = this.bridgeGapLoan.get('baseRate').value;
    const premiumRate = this.bridgeGapLoan.get('premiumRate').value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.bridgeGapLoan.get('interestRate').patchValue(sum);
  }
}
