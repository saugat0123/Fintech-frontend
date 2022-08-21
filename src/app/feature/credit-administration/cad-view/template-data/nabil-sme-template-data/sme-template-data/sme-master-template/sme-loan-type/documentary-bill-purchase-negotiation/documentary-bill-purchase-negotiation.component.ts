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
  selector: 'app-documentary-bill-purchase-negotiation',
  templateUrl: './documentary-bill-purchase-negotiation.component.html',
  styleUrls: ['./documentary-bill-purchase-negotiation.component.scss']
})
export class DocumentaryBillPurchaseNegotiationComponent implements OnInit {
  @Input() loanName;
  @Input() offerDocumentList: Array<OfferDocument>;
  @Input() cadDocAssignedLoan;
  initialInformation: any;
  documentaryBillPurchase: FormGroup;
  isComplimentryOtherLoan = false;
  dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
  ADExpiry = false;
  BSExpiry = false;
  loanDetails: any = [];
  isMarketValue = false;
  filteredList: any = [];
  loanNameConstant = LoanNameConstant;
  filteredLoanIdList: any = [];
  constructor(
      private formBuilder: FormBuilder,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private engToNepNumberPipe: EngToNepaliNumberPipe,
      private currencyFormatterPipe: CurrencyFormatterPipe,
      private datePipe: DatePipe,
      private engToNepDatePipe: EngNepDatePipe,
      private engToNepWord: NepaliCurrencyWordPipe
  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.loanName)) {
      this.loanDetails = this.loanName;
      this.filterLoanDetails(this.loanDetails);
    }
    if (this.offerDocumentList.length > 0) {
      this.offerDocumentList.forEach(offerLetter => {
        this.initialInformation = JSON.parse(offerLetter.initialInformation);
      });
      if (!ObjectUtil.isEmpty(this.initialInformation)) {
        this.documentaryBillPurchase.patchValue(this.initialInformation.documentaryBillPurchase);
      }
      this.patchDate();
    }
    if (!ObjectUtil.isEmpty(this.filteredList)) {
      for (let val = 0; val < this.filteredList.length; val++) {
        const loanamountWords = this.engToNepWord.transform(this.filteredList[val].loanAmount.toFixed(2));
        this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', val, 'loanAmount']).patchValue(
            this.filteredList[val] ? this.filteredList[val].loanAmount : '');
        this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', val, 'loanAmountWords']).patchValue(
            loanamountWords ? loanamountWords : '');
      }
    }
    this.setLoanId();
  }
  patchDate() {
    for (let val = 0; val < this.initialInformation.documentaryBillPurchase.documentaryBillPurchaseFormArray.length; val++) {
      const dateOfExpiryType = this.initialInformation.documentaryBillPurchase.documentaryBillPurchaseFormArray[val].dateOfExpiryType;
      if (dateOfExpiryType === 'AD') {
        const dateOfExpiry = this.initialInformation.documentaryBillPurchase.documentaryBillPurchaseFormArray[val].dateOfExpiry;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', val, 'dateOfExpiry']).patchValue(new Date(dateOfExpiry));
        }
      } else if (dateOfExpiryType === 'BS') {
        const dateOfExpiry = this.initialInformation.documentaryBillPurchase.documentaryBillPurchaseFormArray[val].dateOfExpiryNepali;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', val, 'dateOfExpiryNepali']).patchValue(dateOfExpiry);
        }
      }
    }
  }
  buildForm() {
    this.documentaryBillPurchase = this.formBuilder.group({
      documentaryBillPurchaseFormArray: this.formBuilder.array([]),
      });
  }
  checkComplimetryOtherLoan(data, index) {
    this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', index, 'complementaryOther']).patchValue(data);
  }

  public checkDateOfExpiry(value): void {
    this.ADExpiry = value === 'AD';
    this.BSExpiry = value === 'BS';
  }

  public getNumAmountWord(numLabel, wordLabel, index, arrayName): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.documentaryBillPurchase.get([arrayName, index, numLabel]).value);
    this.documentaryBillPurchase.get([arrayName, index, wordLabel]).patchValue(transformValue);
  }
  async translateAndSetVal(i) {
    /* SET TRANS VALUE FOR CONDITIONS */
    const tempComplemetry = this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'complementaryOther']).value;
    if (!ObjectUtil.isEmpty(tempComplemetry)) {
      this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'complementaryOtherTrans']).patchValue(tempComplemetry);
    }
    const tempComplimentaryLoanSelected = this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'complimentaryLoanSelected']).value;
    if (!ObjectUtil.isEmpty(tempComplimentaryLoanSelected)) {
      this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'complimentaryLoanSelectedTrans']).patchValue(
          tempComplimentaryLoanSelected
      );
    }

    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    const tempLoanAmount = this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'loanAmount']).value;
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'loanAmountTrans']).patchValue(convertNumber);

    this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'loanAmountWordsTrans']).patchValue(
        this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'loanAmountWords']).value
    );
    const convertMargin = this.convertNumbersToNepali(this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'marginInPercentage']).value, false);
    this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'marginInPercentageTrans']).patchValue(convertMargin);
    const drawingPower = this.convertNumbersToNepali(this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'drawingPower']).value, false);
    this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'drawingPowerTrans']).patchValue(drawingPower);

    /* Converting value for date */
    this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'dateOfExpiryTypeTrans']).patchValue(
        this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'dateOfExpiryType']).value
    );
    const tempDateOfExpType = this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'dateOfExpiryType']).value;
    let tempExpDate;
    if (tempDateOfExpType === 'AD') {
      const tempEngExpDate = this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'dateOfExpiry']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ? this.datePipe.transform(tempEngExpDate) : '';
      const finalExpDate = this.transformEnglishDate(tempExpDate);
      this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'dateOfExpiryTrans']).patchValue(finalExpDate);
    } else {
      const tempDateOfExpNep = this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'dateOfExpiryNepali']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.nDate : '';
      this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'dateOfExpiryTrans']).patchValue(tempExpDate);
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
    this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'complementaryOtherCT']).patchValue(
        this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'complementaryOtherTrans']).value
    );
    this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'complimentaryLoanSelectedCT']).patchValue(
        this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'complimentaryLoanSelectedTrans']).value
    );
    this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'loanAmountCT']).patchValue(
        this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'loanAmountTrans']).value
    );
    this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'loanAmountWordsCT']).patchValue(
        this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'loanAmountWordsTrans']).value
    );
    this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'marginInPercentageCT']).patchValue(
        this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'marginInPercentageTrans']).value
    );
    this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'drawingPowerCT']).patchValue(
        this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'drawingPowerTrans']).value
    );
    this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'dateOfExpiryTypeCT']).patchValue(
        this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'dateOfExpiryTypeTrans']).value
    );
    this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'dateOfExpiryNepaliCT']).patchValue(
        this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'dateOfExpiryNepaliTrans']).value
    );
    this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'dateOfExpiryCT']).patchValue(
        this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'dateOfExpiryTrans']).value
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

  filterLoanDetails(loanDetails) {
    this.filteredList = loanDetails.filter(data => data.name === this.loanNameConstant.DOCUMENTARY_BILL_PURCHASE_NEGOTIATION);
    this.filteredList.forEach(value => {
      this.addLoanFormArr();
    });
  }

  addLoanFormArr() {
    (this.documentaryBillPurchase.get('documentaryBillPurchaseFormArray') as FormArray).push(this.buildLoanForm());
  }

  buildLoanForm() {
    return this.formBuilder.group({
        // for form data
        complementaryOther: [undefined],
        complimentaryLoanSelected: [undefined],
        loanAmount: [undefined],
        loanAmountWords: [undefined],
        marginInPercentage: [undefined],
        drawingPower: [undefined],
        dateOfExpiryType: [undefined],
        dateOfExpiryNepali: [undefined],
        dateOfExpiry: [undefined],
        // for translated data
        complementaryOtherTrans: [undefined],
        complimentaryLoanSelectedTrans: [undefined],
        loanAmountTrans: [undefined],
        loanAmountWordsTrans: [undefined],
        marginInPercentageTrans: [undefined],
        drawingPowerTrans: [undefined],
        dateOfExpiryTypeTrans: [undefined],
        dateOfExpiryNepaliTrans: [undefined],
        dateOfExpiryTrans: [undefined],
        // for corrected data
        complementaryOtherCT: [undefined],
        complimentaryLoanSelectedCT: [undefined],
        loanAmountCT: [undefined],
        loanAmountWordsCT: [undefined],
        marginInPercentageCT: [undefined],
        drawingPowerCT: [undefined],
        dateOfExpiryTypeCT: [undefined],
        dateOfExpiryNepaliCT: [undefined],
        dateOfExpiryCT: [undefined],
        loanId: [undefined],
    });
  }

  setLoanId() {
    this.filteredLoanIdList = this.cadDocAssignedLoan.filter(data =>
        data.loan.name === this.loanNameConstant.DOCUMENTARY_BILL_PURCHASE_NEGOTIATION);
    this.filteredList.forEach((val, i) => {
      this.documentaryBillPurchase.get(['documentaryBillPurchaseFormArray', i, 'loanId']).patchValue(
          this.filteredLoanIdList[i].proposal.id);
    });
  }
}
