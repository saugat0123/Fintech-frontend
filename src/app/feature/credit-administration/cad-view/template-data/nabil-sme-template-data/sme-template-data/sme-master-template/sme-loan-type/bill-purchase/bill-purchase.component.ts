import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-bill-purchase',
  templateUrl: './bill-purchase.component.html',
  styleUrls: ['./bill-purchase.component.scss']
})
export class BillPurchaseComponent implements OnInit {
  @Input() loanName;
  billPurchaseForm: FormGroup;
  isComplimentryOtherLoan = false;
  dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
  ADExpiry = false;
  BSExpiry = false;
  loanDetails: any = [];
  isMarketValue = false;
  constructor(
      private formBuilder: FormBuilder,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private engToNepNumberPipe: EngToNepaliNumberPipe,
      private currencyFormatterPipe: CurrencyFormatterPipe,
      private datePipe: DatePipe,
      private engToNepDatePipe: EngNepDatePipe
  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.loanName)) {
      this.loanDetails = this.loanName;
    }
  }
  buildForm() {
    this.billPurchaseForm = this.formBuilder.group({
      // for from data
      ComplementaryOther: [undefined],
      multiLoan: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      marginInPercentage: [undefined],
      commission: [undefined],
      minCommissionAmountInFig: [undefined],
      dateOfExpiryType: [undefined],
      dateOfExpiryNepali: [undefined],
      dateOfExpiry: [undefined],
      // for translated data
      ComplementaryOtherTrans: [undefined],
      multiLoanTrans: [undefined],
      loanAmountTrans: [undefined],
      loanAmountWordsTrans: [undefined],
      marginInPercentageTrans: [undefined],
      commissionTrans: [undefined],
      minCommissionAmountInFigTrans: [undefined],
      dateOfExpiryTypeTrans: [undefined],
      dateOfExpiryNepaliTrans: [undefined],
      dateOfExpiryTrans: [undefined],
      // for corrected data
      ComplementaryOtherCT: [undefined],
      multiLoanCT: [undefined],
      loanAmountCT: [undefined],
      loanAmountWordsCT: [undefined],
      marginInPercentageCT: [undefined],
      commissionCT: [undefined],
      minCommissionAmountInFigCT: [undefined],
      dateOfExpiryTypeCT: [undefined],
      dateOfExpiryNepaliCT: [undefined],
      dateOfExpiryCT: [undefined],
    });
  }
  checkComplimetryOtherLoan(data) {
    this.isComplimentryOtherLoan = data;
    this.billPurchaseForm.get('ComplementaryOther').patchValue(this.isComplimentryOtherLoan);
  }

  public checkDateOfExpiry(value): void {
    this.ADExpiry = value === 'AD';
    this.BSExpiry = value === 'BS';
  }

  public getNumAmountWord(numLabel, wordLabel): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.billPurchaseForm.get(numLabel).value);
    this.billPurchaseForm.get(wordLabel).patchValue(transformValue);
  }
  translateAndSetVal() {
    /* SET TRANS VALUE FOR CONDITIONS */
    const tempComplemetry = this.billPurchaseForm.get('ComplementaryOther').value;
    if (!ObjectUtil.isEmpty(tempComplemetry)) {
      this.billPurchaseForm.get('ComplementaryOtherTrans').patchValue(tempComplemetry);
    }

    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    const tempLoanAmount = this.billPurchaseForm.get('loanAmount').value;
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.billPurchaseForm.get('loanAmountTrans').patchValue(convertNumber);

    this.billPurchaseForm.get('loanAmountWordsTrans').patchValue(
        this.billPurchaseForm.get('loanAmountWords').value
    );
    const convertMargin = this.convertNumbersToNepali(this.billPurchaseForm.get('marginInPercentage').value, false);
    this.billPurchaseForm.get('marginInPercentageTrans').patchValue(convertMargin);
    const commission = this.convertNumbersToNepali(this.billPurchaseForm.get('commission').value, false);
    this.billPurchaseForm.get('commissionTrans').patchValue(commission);
    const minCommissionAmountInFig = this.convertNumbersToNepali(this.billPurchaseForm.get('minCommissionAmountInFig').value, false);
    this.billPurchaseForm.get('minCommissionAmountInFigTrans').patchValue(minCommissionAmountInFig);

    /* Converting value for date */
    this.billPurchaseForm.get('dateOfExpiryTypeTrans').patchValue(
        this.billPurchaseForm.get('dateOfExpiryType').value
    );
    const tempDateOfExpType = this.billPurchaseForm.get('dateOfExpiryType').value;
    let tempExpDate;
    if (tempDateOfExpType === 'AD') {
      const tempEngExpDate = this.billPurchaseForm.get('dateOfExpiry').value;
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ?
          this.engToNepDatePipe.transform(this.datePipe.transform(tempEngExpDate), true) : '';
      this.billPurchaseForm.get('dateOfExpiryTrans').patchValue(tempExpDate);
    } else {
      const tempDateOfExpNep = this.billPurchaseForm.get('dateOfExpiryNepali').value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.nDate : '';
      this.billPurchaseForm.get('dateOfExpiryTrans').patchValue(tempExpDate);
    }
    this.setCTValue();
  }
  setCTValue() {
    this.billPurchaseForm.get('ComplementaryOtherCT').patchValue(
        this.billPurchaseForm.get('ComplementaryOtherTrans').value
    );
    this.billPurchaseForm.get('loanAmountCT').patchValue(
        this.billPurchaseForm.get('loanAmountTrans').value
    );
    this.billPurchaseForm.get('loanAmountWordsCT').patchValue(
        this.billPurchaseForm.get('loanAmountWordsTrans').value
    );
    this.billPurchaseForm.get('marginInPercentageCT').patchValue(
        this.billPurchaseForm.get('marginInPercentageTrans').value
    );
    this.billPurchaseForm.get('commissionCT').patchValue(
        this.billPurchaseForm.get('commissionTrans').value
    );
    this.billPurchaseForm.get('minCommissionAmountInFigCT').patchValue(
        this.billPurchaseForm.get('minCommissionAmountInFigTrans').value
    );
    this.billPurchaseForm.get('dateOfExpiryTypeCT').patchValue(
        this.billPurchaseForm.get('dateOfExpiryTypeTrans').value
    );
    this.billPurchaseForm.get('dateOfExpiryNepaliCT').patchValue(
        this.billPurchaseForm.get('dateOfExpiryNepaliTrans').value
    );
    this.billPurchaseForm.get('dateOfExpiryCT').patchValue(
        this.billPurchaseForm.get('dateOfExpiryTrans').value
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
}
