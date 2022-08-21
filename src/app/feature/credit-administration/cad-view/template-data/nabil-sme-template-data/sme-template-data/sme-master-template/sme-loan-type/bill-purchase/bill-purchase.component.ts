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
  selector: 'app-bill-purchase',
  templateUrl: './bill-purchase.component.html',
  styleUrls: ['./bill-purchase.component.scss']
})
export class BillPurchaseComponent implements OnInit {
  @Input() loanName;
  @Input() offerDocumentList: Array<OfferDocument>;
  @Input() cadDocAssignedLoan;
  initialInformation: any;
  billPurchaseForm: FormGroup;
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
      this.filteredListDetails(this.loanDetails);
    }
    if (this.offerDocumentList.length > 0) {
      this.offerDocumentList.forEach(offerLetter => {
        this.initialInformation = JSON.parse(offerLetter.initialInformation);
      });
      if (!ObjectUtil.isEmpty(this.initialInformation)) {
        this.billPurchaseForm.patchValue(this.initialInformation.billPurchaseForm);
      }
      this.patchDate();
    }
    if (!ObjectUtil.isEmpty(this.filteredList)) {
      for (let val = 0; val < this.filteredList.length; val++) {
        const loanamountWords = this.engToNepWord.transform(this.filteredList[val].loanAmount.toFixed(2));
        this.billPurchaseForm.get(['billPurchaseFormArray', val, 'loanAmount']).patchValue(
            this.filteredList[val] ? this.filteredList[val].loanAmount : '');
        this.billPurchaseForm.get(['billPurchaseFormArray', val, 'loanAmountWords']).patchValue(
            loanamountWords ? loanamountWords : '');
      }
    }
    this.setLoanId();
  }
  patchDate() {
    for (let val = 0; val < this.initialInformation.billPurchaseForm.billPurchaseFormArray.length; val++) {
      const dateOfExpiryType = this.initialInformation.billPurchaseForm.billPurchaseFormArray[val].dateOfExpiryType;
      if (dateOfExpiryType === 'AD') {
        const dateOfExpiry = this.initialInformation.billPurchaseForm.billPurchaseFormArray[val].dateOfExpiry;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.billPurchaseForm.get(['billPurchaseFormArray', val, 'dateOfExpiry']).patchValue(new Date(dateOfExpiry));
        }
      } else if (dateOfExpiryType === 'BS') {
        const dateOfExpiry = this.initialInformation.billPurchaseForm.billPurchaseFormArray[val].dateOfExpiryNepali;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.billPurchaseForm.get(['billPurchaseFormArray', val, 'dateOfExpiryNepali']).patchValue(dateOfExpiry);
        }
      }
    }
  }
  buildForm() {
    this.billPurchaseForm = this.formBuilder.group({
      billPurchaseFormArray: this.formBuilder.array([]),
    });
  }
  checkComplimetryOtherLoan(data, index) {
    // this.isComplimentryOtherLoan = data;
    if (!data) {
    this.billPurchaseForm.get(['billPurchaseFormArray', index,  'complementaryOther']).patchValue(data);
    }
  }

  public checkDateOfExpiry(value): void {
    this.ADExpiry = value === 'AD';
    this.BSExpiry = value === 'BS';
  }

  public getNumAmountWord(numLabel, wordLabel, index, arrayName): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.billPurchaseForm.get([arrayName, index, numLabel]).value);
    this.billPurchaseForm.get([arrayName, index, wordLabel]).patchValue(transformValue);
  }
  async translateAndSetVal(i) {
    /* SET TRANS VALUE FOR CONDITIONS */
    const tempComplemetry = this.billPurchaseForm.get(['billPurchaseFormArray', i, 'complementaryOther']).value;
    if (!ObjectUtil.isEmpty(tempComplemetry)) {
      this.billPurchaseForm.get(['billPurchaseFormArray', i, 'complementaryOtherTrans']).patchValue(tempComplemetry);
    }

    const tempComplimentaryLoanSelected = this.billPurchaseForm.get(['billPurchaseFormArray', i, 'complimentaryLoanSelected']).value;
    this.billPurchaseForm.get(['billPurchaseFormArray', i, 'complimentaryLoanSelectedTrans']).patchValue(tempComplimentaryLoanSelected);

    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    const tempLoanAmount = this.billPurchaseForm.get(['billPurchaseFormArray', i, 'loanAmount']).value;
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.billPurchaseForm.get(['billPurchaseFormArray', i, 'loanAmountTrans']).patchValue(convertNumber);

    this.billPurchaseForm.get(['billPurchaseFormArray', i, 'loanAmountWordsTrans']).patchValue(
        this.billPurchaseForm.get(['billPurchaseFormArray', i, 'loanAmountWords']).value
    );
    const convertMargin = this.convertNumbersToNepali(this.billPurchaseForm.get(['billPurchaseFormArray', i, 'marginInPercentage']).value, false);
    this.billPurchaseForm.get(['billPurchaseFormArray', i, 'marginInPercentageTrans']).patchValue(convertMargin);
    const commission = this.convertNumbersToNepali(this.billPurchaseForm.get(['billPurchaseFormArray', i, 'commission']).value, false);
    this.billPurchaseForm.get(['billPurchaseFormArray', i, 'commissionTrans']).patchValue(commission);
    const minCommissionAmountInFig = this.convertNumbersToNepali(this.billPurchaseForm.get(['billPurchaseFormArray', i, 'minCommissionAmountInFig']).value, false);
    this.billPurchaseForm.get(['billPurchaseFormArray', i, 'minCommissionAmountInFigTrans']).patchValue(minCommissionAmountInFig);

    /* Converting value for date */
    this.billPurchaseForm.get(['billPurchaseFormArray', i, 'dateOfExpiryTypeTrans']).patchValue(
        this.billPurchaseForm.get(['billPurchaseFormArray', i, 'dateOfExpiryType']).value
    );
    const tempDateOfExpType = this.billPurchaseForm.get(['billPurchaseFormArray', i, 'dateOfExpiryType']).value;
    let tempExpDate;
    if (tempDateOfExpType === 'AD') {
      const tempEngExpDate = this.billPurchaseForm.get(['billPurchaseFormArray', i, 'dateOfExpiry']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ? this.datePipe.transform(tempEngExpDate) : '';
      const finalExpDate = this.transformEnglishDate(tempExpDate);
      this.billPurchaseForm.get(['billPurchaseFormArray', i, 'dateOfExpiryTrans']).patchValue(finalExpDate);
    } else {
      const tempDateOfExpNep = this.billPurchaseForm.get(['billPurchaseFormArray', i, 'dateOfExpiryNepali']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.nDate : '';
      this.billPurchaseForm.get(['billPurchaseFormArray', i, 'dateOfExpiryTrans']).patchValue(tempExpDate);
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
    this.billPurchaseForm.get(['billPurchaseFormArray', i, 'complementaryOtherCT']).patchValue(
        this.billPurchaseForm.get(['billPurchaseFormArray', i, 'complementaryOtherTrans']).value
    );
    this.billPurchaseForm.get(['billPurchaseFormArray', i, 'complimentaryLoanSelectedCT']).patchValue(
        this.billPurchaseForm.get(['billPurchaseFormArray', i, 'complimentaryLoanSelectedTrans']).value
    );
    this.billPurchaseForm.get(['billPurchaseFormArray', i, 'loanAmountCT']).patchValue(
        this.billPurchaseForm.get(['billPurchaseFormArray', i, 'loanAmountTrans']).value
    );
    this.billPurchaseForm.get(['billPurchaseFormArray', i, 'loanAmountWordsCT']).patchValue(
        this.billPurchaseForm.get(['billPurchaseFormArray', i, 'loanAmountWordsTrans']).value
    );
    this.billPurchaseForm.get(['billPurchaseFormArray', i, 'loanAmountWordsCT']).patchValue(
        this.billPurchaseForm.get(['billPurchaseFormArray', i, 'loanAmountWordsTrans']).value
    );
    this.billPurchaseForm.get(['billPurchaseFormArray', i, 'marginInPercentageCT']).patchValue(
        this.billPurchaseForm.get(['billPurchaseFormArray', i, 'marginInPercentageTrans']).value
    );
    this.billPurchaseForm.get(['billPurchaseFormArray', i, 'commissionCT']).patchValue(
        this.billPurchaseForm.get(['billPurchaseFormArray', i, 'commissionTrans']).value
    );
    this.billPurchaseForm.get(['billPurchaseFormArray', i, 'minCommissionAmountInFigCT']).patchValue(
        this.billPurchaseForm.get(['billPurchaseFormArray', i, 'minCommissionAmountInFigTrans']).value
    );
    this.billPurchaseForm.get(['billPurchaseFormArray', i, 'dateOfExpiryTypeCT']).patchValue(
        this.billPurchaseForm.get(['billPurchaseFormArray', i, 'dateOfExpiryTypeTrans']).value
    );
    this.billPurchaseForm.get(['billPurchaseFormArray', i, 'dateOfExpiryNepaliCT']).patchValue(
        this.billPurchaseForm.get(['billPurchaseFormArray', i, 'dateOfExpiryNepaliTrans']).value
    );
    this.billPurchaseForm.get(['billPurchaseFormArray', i, 'dateOfExpiryCT']).patchValue(
        this.billPurchaseForm.get(['billPurchaseFormArray', i, 'dateOfExpiryTrans']).value
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

  filteredListDetails(loanDetails) {
    this.filteredList = loanDetails.filter(data => data.name === this.loanNameConstant.BILLS_PURCHASE);
    this.filteredList.forEach(value => {
      this.addLoanFormArr();
    });
  }

  addLoanFormArr() {
    (this.billPurchaseForm.get('billPurchaseFormArray') as FormArray).push(this.buildLoanForm());
  }

  private buildLoanForm() {
    return this.formBuilder.group({
        // for from data
        complementaryOther: [undefined],
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
        complementaryOtherTrans: [undefined],
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
        complementaryOtherCT: [undefined],
        complimentaryLoanSelectedCT: [undefined],
        loanAmountCT: [undefined],
        loanAmountWordsCT: [undefined],
        marginInPercentageCT: [undefined],
        commissionCT: [undefined],
        minCommissionAmountInFigCT: [undefined],
        dateOfExpiryTypeCT: [undefined],
        dateOfExpiryNepaliCT: [undefined],
        dateOfExpiryCT: [undefined],
        loanId: [undefined],
    });
  }

  setLoanId() {
    this.filteredLoanIdList = this.cadDocAssignedLoan.filter(data =>
        data.loan.name === this.loanNameConstant.BILLS_PURCHASE);
    this.filteredList.forEach((val, i) => {
      this.billPurchaseForm.get(['billPurchaseFormArray', i, 'loanId']).patchValue(
          this.filteredLoanIdList[i].proposal.id);
    });
  }

}
