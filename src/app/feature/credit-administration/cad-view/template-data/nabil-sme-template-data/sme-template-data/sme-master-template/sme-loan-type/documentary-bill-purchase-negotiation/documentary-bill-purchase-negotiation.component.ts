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
  selector: 'app-documentary-bill-purchase-negotiation',
  templateUrl: './documentary-bill-purchase-negotiation.component.html',
  styleUrls: ['./documentary-bill-purchase-negotiation.component.scss']
})
export class DocumentaryBillPurchaseNegotiationComponent implements OnInit {
  @Input() loanName;
  @Input() offerDocumentList: Array<OfferDocument>;
  initialInformation: any;
  documentaryBillPurchase: FormGroup;
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
        this.documentaryBillPurchase.patchValue(this.initialInformation.documentaryBillPurchase);
      }
      const dateOfExpiryType = this.initialInformation.documentaryBillPurchase.dateOfExpiryType;
      if (dateOfExpiryType === 'AD') {
        const dateOfExpiry = this.initialInformation.documentaryBillPurchase.dateOfExpiry;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.documentaryBillPurchase.get('dateOfExpiry').patchValue(new Date(dateOfExpiry));
        }
      } else if (dateOfExpiryType === 'BS') {
        const dateOfExpiry = this.initialInformation.documentaryBillPurchase.dateOfExpiryNepali;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.documentaryBillPurchase.get('dateOfExpiryNepali').patchValue(dateOfExpiry);
        }
      }
    }
  }
  buildForm() {
    this.documentaryBillPurchase = this.formBuilder.group({
      // for form data
      complementryOther: [undefined],
      complimentaryLoanSelected: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      marginInPercentage: [undefined],
      drawingPower: [undefined],
      dateOfExpiryType: [undefined],
      dateOfExpiryNepali: [undefined],
      dateOfExpiry: [undefined],
      // for translated data
      complementryOtherTrans: [undefined],
      complimentaryLoanSelectedTrans: [undefined],
      loanAmountTrans: [undefined],
      loanAmountWordsTrans: [undefined],
      marginInPercentageTrans: [undefined],
      drawingPowerTrans: [undefined],
      dateOfExpiryTypeTrans: [undefined],
      dateOfExpiryNepaliTrans: [undefined],
      dateOfExpiryTrans: [undefined],
      // for corrected data
      complementryOtherCT: [undefined],
      complimentaryLoanSelectedCT: [undefined],
      loanAmountCT: [undefined],
      loanAmountWordsCT: [undefined],
      marginInPercentageCT: [undefined],
      drawingPowerCT: [undefined],
      dateOfExpiryTypeCT: [undefined],
      dateOfExpiryNepaliCT: [undefined],
      dateOfExpiryCT: [undefined],
    });
  }
  checkComplimetryOtherLoan(data) {
    this.isComplimentryOtherLoan = data;
    this.documentaryBillPurchase.get('complementryOther').patchValue(this.isComplimentryOtherLoan);
  }

  public checkDateOfExpiry(value): void {
    this.ADExpiry = value === 'AD';
    this.BSExpiry = value === 'BS';
  }

  public getNumAmountWord(numLabel, wordLabel): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.documentaryBillPurchase.get(numLabel).value);
    this.documentaryBillPurchase.get(wordLabel).patchValue(transformValue);
  }
  translateAndSetVal() {
    /* SET TRANS VALUE FOR CONDITIONS */
    const tempComplemetry = this.documentaryBillPurchase.get('complementryOther').value;
    if (!ObjectUtil.isEmpty(tempComplemetry)) {
      this.documentaryBillPurchase.get('complementryOtherTrans').patchValue(tempComplemetry);
    }
    const tempComplimentaryLoanSelected = this.documentaryBillPurchase.get('complimentaryLoanSelected').value;
    if (!ObjectUtil.isEmpty(tempComplimentaryLoanSelected)) {
      this.documentaryBillPurchase.get('complimentaryLoanSelectedTrans').patchValue(
          tempComplimentaryLoanSelected
      );
    }

    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    const tempLoanAmount = this.documentaryBillPurchase.get('loanAmount').value;
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.documentaryBillPurchase.get('loanAmountTrans').patchValue(convertNumber);

    this.documentaryBillPurchase.get('loanAmountWordsTrans').patchValue(
        this.documentaryBillPurchase.get('loanAmountWords').value
    );
    const convertMargin = this.convertNumbersToNepali(this.documentaryBillPurchase.get('marginInPercentage').value, false);
    this.documentaryBillPurchase.get('marginInPercentageTrans').patchValue(convertMargin);
    const drawingPower = this.convertNumbersToNepali(this.documentaryBillPurchase.get('drawingPower').value, false);
    this.documentaryBillPurchase.get('drawingPowerTrans').patchValue(drawingPower);

    /* Converting value for date */
    this.documentaryBillPurchase.get('dateOfExpiryTypeTrans').patchValue(
        this.documentaryBillPurchase.get('dateOfExpiryType').value
    );
    const tempDateOfExpType = this.documentaryBillPurchase.get('dateOfExpiryType').value;
    let tempExpDate;
    if (tempDateOfExpType === 'AD') {
      const tempEngExpDate = this.documentaryBillPurchase.get('dateOfExpiry').value;
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ? this.datePipe.transform(tempEngExpDate) : '';
      const finalExpDate = this.transformEnglishDate(tempExpDate);
      this.documentaryBillPurchase.get('dateOfExpiryTrans').patchValue(finalExpDate);
    } else {
      const tempDateOfExpNep = this.documentaryBillPurchase.get('dateOfExpiryNepali').value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.nDate : '';
      this.documentaryBillPurchase.get('dateOfExpiryTrans').patchValue(tempExpDate);
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
    this.documentaryBillPurchase.get('complementryOtherCT').patchValue(
        this.documentaryBillPurchase.get('complementryOtherTrans').value
    );
    this.documentaryBillPurchase.get('complimentaryLoanSelectedCT').patchValue(
        this.documentaryBillPurchase.get('complimentaryLoanSelectedTrans').value
    );
    this.documentaryBillPurchase.get('loanAmountCT').patchValue(
        this.documentaryBillPurchase.get('loanAmountTrans').value
    );
    this.documentaryBillPurchase.get('loanAmountWordsCT').patchValue(
        this.documentaryBillPurchase.get('loanAmountWordsTrans').value
    );
    this.documentaryBillPurchase.get('marginInPercentageCT').patchValue(
        this.documentaryBillPurchase.get('marginInPercentageTrans').value
    );
    this.documentaryBillPurchase.get('drawingPowerCT').patchValue(
        this.documentaryBillPurchase.get('drawingPowerTrans').value
    );
    this.documentaryBillPurchase.get('dateOfExpiryTypeCT').patchValue(
        this.documentaryBillPurchase.get('dateOfExpiryTypeTrans').value
    );
    this.documentaryBillPurchase.get('dateOfExpiryNepaliCT').patchValue(
        this.documentaryBillPurchase.get('dateOfExpiryNepaliTrans').value
    );
    this.documentaryBillPurchase.get('dateOfExpiryCT').patchValue(
        this.documentaryBillPurchase.get('dateOfExpiryTrans').value
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
