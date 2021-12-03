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
  billPurchasecomponent: FormGroup;
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
    this.billPurchasecomponent = this.formBuilder.group({
      // for from data
      complementryOther: [undefined],
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
      complementryOtherTrans: [undefined],
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
      complementryOtherCT: [undefined],
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
    this.billPurchasecomponent.get('complementryOther').patchValue(this.isComplimentryOtherLoan);
  }

  public checkDateOfExpiry(value): void {
    this.ADExpiry = value === 'AD';
    this.BSExpiry = value === 'BS';
  }

  public getNumAmountWord(numLabel, wordLabel): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.billPurchasecomponent.get(numLabel).value);
    this.billPurchasecomponent.get(wordLabel).patchValue(transformValue);
  }
  translateAndSetVal() {
    /* SET TRANS VALUE FOR CONDITIONS */
    const tempComplemetry = this.billPurchasecomponent.get('complementryOther').value;
    if (!ObjectUtil.isEmpty(tempComplemetry)) {
      this.billPurchasecomponent.get('complementryOtherTrans').patchValue(tempComplemetry);
    }

    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    const tempLoanAmount = this.billPurchasecomponent.get('loanAmount').value;
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.billPurchasecomponent.get('loanAmountTrans').patchValue(convertNumber);

    this.billPurchasecomponent.get('loanAmountWordsTrans').patchValue(
        this.billPurchasecomponent.get('loanAmountWords').value
    );
    const convertMargin = this.convertNumbersToNepali(this.billPurchasecomponent.get('marginInPercentage').value, false);
    this.billPurchasecomponent.get('marginInPercentageTrans').patchValue(convertMargin);
    const commission = this.convertNumbersToNepali(this.billPurchasecomponent.get('commission').value, false);
    this.billPurchasecomponent.get('commissionTrans').patchValue(commission);
    const minCommissionAmountInFig = this.convertNumbersToNepali(this.billPurchasecomponent.get('minCommissionAmountInFig').value, false);
    this.billPurchasecomponent.get('minCommissionAmountInFigTrans').patchValue(minCommissionAmountInFig);

    /* Converting value for date */
    this.billPurchasecomponent.get('dateOfExpiryTypeTrans').patchValue(
        this.billPurchasecomponent.get('dateOfExpiryType').value
    );
    const tempDateOfExpType = this.billPurchasecomponent.get('dateOfExpiryType').value;
    let tempExpDate;
    if (tempDateOfExpType === 'AD') {
      const tempEngExpDate = this.billPurchasecomponent.get('dateOfExpiry').value;
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ?
          this.engToNepDatePipe.transform(this.datePipe.transform(tempEngExpDate), true) : '';
      this.billPurchasecomponent.get('dateOfExpiryTrans').patchValue(tempExpDate);
    } else {
      const tempDateOfExpNep = this.billPurchasecomponent.get('dateOfExpiryNepali').value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.nDate : '';
      this.billPurchasecomponent.get('dateOfExpiryTrans').patchValue(tempExpDate);
    }
    this.setCTValue();
  }
  setCTValue() {
    this.billPurchasecomponent.get('complementryOtherCT').patchValue(
        this.billPurchasecomponent.get('complementryOtherTrans').value
    );
    this.billPurchasecomponent.get('loanAmountCT').patchValue(
        this.billPurchasecomponent.get('loanAmountTrans').value
    );
    this.billPurchasecomponent.get('loanAmountWordsCT').patchValue(
        this.billPurchasecomponent.get('loanAmountWordsTrans').value
    );
    this.billPurchasecomponent.get('marginInPercentageCT').patchValue(
        this.billPurchasecomponent.get('marginInPercentageTrans').value
    );
    this.billPurchasecomponent.get('commissionCT').patchValue(
        this.billPurchasecomponent.get('commissionTrans').value
    );
    this.billPurchasecomponent.get('minCommissionAmountInFigCT').patchValue(
        this.billPurchasecomponent.get('minCommissionAmountInFigTrans').value
    );
    this.billPurchasecomponent.get('dateOfExpiryTypeCT').patchValue(
        this.billPurchasecomponent.get('dateOfExpiryTypeTrans').value
    );
    this.billPurchasecomponent.get('dateOfExpiryNepaliCT').patchValue(
        this.billPurchasecomponent.get('dateOfExpiryNepaliTrans').value
    );
    this.billPurchasecomponent.get('dateOfExpiryCT').patchValue(
        this.billPurchasecomponent.get('dateOfExpiryTrans').value
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
