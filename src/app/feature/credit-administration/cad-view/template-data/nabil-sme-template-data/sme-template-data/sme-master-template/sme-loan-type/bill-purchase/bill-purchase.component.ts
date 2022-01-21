import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {OfferDocument} from '../../../../../../../model/OfferDocument';

@Component({
  selector: 'app-bill-purchase',
  templateUrl: './bill-purchase.component.html',
  styleUrls: ['./bill-purchase.component.scss']
})
export class BillPurchaseComponent implements OnInit {
  @Input() loanName;
  @Input() offerDocumentList: Array<OfferDocument>;
  initialInformation: any;
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
    if (this.offerDocumentList.length > 0) {
      this.offerDocumentList.forEach(offerLetter => {
        this.initialInformation = JSON.parse(offerLetter.initialInformation);
      });
      if (!ObjectUtil.isEmpty(this.initialInformation)) {
        this.billPurchaseForm.patchValue(this.initialInformation.billPurchaseForm);
      }
      const dateOfExpiryType = this.initialInformation.billPurchaseForm.dateOfExpiryType;
      if (dateOfExpiryType === 'AD') {
        const dateOfExpiry = this.initialInformation.billPurchaseForm.dateOfExpiry;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.billPurchaseForm.get('dateOfExpiry').patchValue(new Date(dateOfExpiry));
        }
      } else if (dateOfExpiryType === 'BS') {
        const dateOfExpiry = this.initialInformation.billPurchaseForm.dateOfExpiryNepali;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.billPurchaseForm.get('dateOfExpiryNepali').patchValue(dateOfExpiry);
        }
      }
    }
  }
  buildForm() {
    this.billPurchaseForm = this.formBuilder.group({
      // for from data
      complementryOther: [undefined],
      complimentaryLoanSelected: [undefined],
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
      complimentaryLoanSelectedTrans: [undefined],
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
      complimentaryLoanSelectedCT: [undefined],
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
    this.billPurchaseForm.get('complementryOther').patchValue(this.isComplimentryOtherLoan);
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
    const tempComplemetry = this.billPurchaseForm.get('complementryOther').value;
    if (!ObjectUtil.isEmpty(tempComplemetry)) {
      this.billPurchaseForm.get('complementryOtherTrans').patchValue(tempComplemetry);
    }

    const tempComplimentaryLoanSelected = this.billPurchaseForm.get('complimentaryLoanSelected').value;
    this.billPurchaseForm.get('complimentaryLoanSelectedTrans').patchValue(tempComplimentaryLoanSelected);

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
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ? this.datePipe.transform(tempEngExpDate) : '';
      const finalExpDate = this.transformEnglishDate(tempExpDate);
      this.billPurchaseForm.get('dateOfExpiryTrans').patchValue(finalExpDate);
    } else {
      const tempDateOfExpNep = this.billPurchaseForm.get('dateOfExpiryNepali').value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.nDate : '';
      this.billPurchaseForm.get('dateOfExpiryTrans').patchValue(tempExpDate);
    }
    this.setCTValue();
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
  setCTValue() {
    this.billPurchaseForm.get('complementryOtherCT').patchValue(
        this.billPurchaseForm.get('complementryOtherTrans').value
    );
    this.billPurchaseForm.get('complimentaryLoanSelectedCT').patchValue(
        this.billPurchaseForm.get('complimentaryLoanSelectedTrans').value
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
