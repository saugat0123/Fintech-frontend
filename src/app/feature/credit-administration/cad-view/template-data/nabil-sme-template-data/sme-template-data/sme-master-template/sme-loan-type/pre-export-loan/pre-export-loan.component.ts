import { Component, OnInit, Input } from '@angular/core';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {OfferDocument} from '../../../../../../../model/OfferDocument';
import {LoanNameConstant} from '../../../../sme-costant/loan-name-constant';

@Component({
  selector: 'app-pre-export-loan',
  templateUrl: './pre-export-loan.component.html',
  styleUrls: ['./pre-export-loan.component.scss']
})
export class PreExportLoanComponent implements OnInit {
  @Input() loanName;
  @Input() customerApprovedDoc;
  @Input() offerDocumentList: Array<OfferDocument>;
  @Input() cadDocAssignedLoan;
  initialInformation: any;
  preExportForm: FormGroup;
  isComplementaryOtherLoan = false;
  dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
  ADExpiry = false;
  BSExpiry = false;
  loanDetails: any = [];
  isMarketValue = false;
  isLetterOfCredit = false;
  termLoanNumber: Array<any> = new Array<any>();
  filteredList: any = [];
  loanNameConstant = LoanNameConstant;
  filteredLoanIdList: any = [];


  constructor(private formBuilder: FormBuilder,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatterPipe: CurrencyFormatterPipe,
              private datePipe: DatePipe,
              private engToNepDatePipe: EngNepDatePipe,
              private engToNepWord: NepaliCurrencyWordPipe) { }

  ngOnInit() {
    this.termLoanNumber = this.customerApprovedDoc.assignedLoan.filter(val =>
        val.loan.name === 'PRE-EXPORT LOAN');
    console.log(this.customerApprovedDoc);
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
        this.preExportForm.patchValue(this.initialInformation.preExportForm);
      }
      const dateOfExpiryType = this.initialInformation.preExportForm.dateOfExpiryType;
      if (dateOfExpiryType === 'AD') {
        const dateOfExpiry = this.initialInformation.preExportForm.dateOfExpiry;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.preExportForm.get('dateOfExpiry').patchValue(new Date(dateOfExpiry));
        }
      } else if (dateOfExpiryType === 'BS') {
        const dateOfExpiry = this.initialInformation.preExportForm.dateOfExpiryNepali;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.preExportForm.get('dateOfExpiryNepali').patchValue(dateOfExpiry);
        }
      }
    }
    if (!ObjectUtil.isEmpty(this.filteredList)) {
      for (let val = 0; val < this.filteredList.length; val++) {
        const loanamountWords = this.engToNepWord.transform(this.filteredList[val].loanAmount);
        this.preExportForm.get(['termLoanDetails', val, 'loanAmount']).patchValue(
            this.filteredList[val] ? this.filteredList[val].loanAmount : '');
        this.preExportForm.get(['termLoanDetails', val, 'loanAmountWords']).patchValue(
            loanamountWords ? loanamountWords : '');
      }
    }
    this.setLoanId();
  }

  buildForm() {
    this.preExportForm = this.formBuilder.group({
      termLoanDetails: this.formBuilder.array([])
    });
    this.setTermLoanForm();
  }
  filterLoanDetails(loanDetails) {
    this.filteredList = loanDetails.filter(data => data.name === this.loanNameConstant.PRE_EXPORT_LOAN);
  }
  setFormArray() {
    return this.formBuilder.group({
      // for form data
      complementaryOther: [undefined],
      drawingBasis: [undefined],
      complementaryLoanSelected: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      drawingPower: [undefined],
      dateOfExpiryType: [undefined],
      dateOfExpiryNepali: [undefined],
      dateOfExpiry: [undefined],

      // for translated data
      complementaryOtherTrans: [undefined],
      drawingBasisTrans: [undefined],
      complementaryLoanSelectedTrans: [undefined],
      loanAmountTrans: [undefined],
      loanAmountWordsTrans: [undefined],
      drawingPowerTrans: [undefined],
      dateOfExpiryTypeTrans: [undefined],
      dateOfExpiryNepaliTrans: [undefined],
      dateOfExpiryTrans: [undefined],

      // for corrected data
      complementaryOtherCT: [undefined],
      drawingBasisCT: [undefined],
      complementaryLoanSelectedCT: [undefined],
      loanAmountCT: [undefined],
      loanAmountWordsCT: [undefined],
      drawingPowerCT: [undefined],
      dateOfExpiryTypeCT: [undefined],
      dateOfExpiryNepaliCT: [undefined],
      dateOfExpiryCT: [undefined],

      loanId: [undefined],
    });
  }

  setTermLoanForm() {
    for (let a = 0; a < this.termLoanNumber.length; a++) {
      (this.preExportForm.get('termLoanDetails') as FormArray).push(this.setFormArray());
    }
  }
  checkComplementaryOtherLoan(event, i) {
    if (!event) {
      this.preExportForm.get(['termLoanDetails', i, 'complementaryLoanSelected']).patchValue(null);
    }
  }

  public checkDateOfExpiry(value): void {
    this.ADExpiry = value === 'AD';
    this.BSExpiry = value === 'BS';
  }

  public getNumAmountWord(numLabel, wordLabel, i): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.preExportForm.get(['termLoanDetails', i,  numLabel]).value);
    this.preExportForm.get(['termLoanDetails', i, wordLabel]).patchValue(transformValue);
  }

  translateAndSetVal(i) {

    /* SET TRANS VALUE FOR CONDITIONS */
    const tempComplementaryLoanSelected = this.preExportForm.get(['termLoanDetails', i, 'complementaryLoanSelected']).value;
    if (!ObjectUtil.isEmpty(tempComplementaryLoanSelected)) {
      this.preExportForm.get(['termLoanDetails', i, 'complementaryLoanSelectedTrans']).patchValue(tempComplementaryLoanSelected);
    }

    const tempComplementary = this.preExportForm.get(['termLoanDetails', i, 'complementaryOther']).value;
    if (!ObjectUtil.isEmpty(tempComplementary)) {
      this.preExportForm.get(['termLoanDetails', i, 'complementaryOtherTrans']).patchValue(tempComplementary);
    }

    const tempDrawingBasis = this.preExportForm.get(['termLoanDetails', i, 'drawingBasis']).value;
    if (!ObjectUtil.isEmpty(tempDrawingBasis)) {
      this.preExportForm.get(['termLoanDetails', i, 'drawingBasisTrans']).patchValue(tempDrawingBasis);
    }

    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    const tempLoanAmount = this.preExportForm.get(['termLoanDetails', i, 'loanAmount']).value;
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.preExportForm.get(['termLoanDetails', i, 'loanAmountTrans']).patchValue(convertNumber);

    this.preExportForm.get(['termLoanDetails', i, 'loanAmountWordsTrans']).patchValue(
        this.preExportForm.get(['termLoanDetails', i, 'loanAmountWords']).value
    );
    const drawingPower = this.convertNumbersToNepali(this.preExportForm.get(['termLoanDetails', i, 'drawingPower']).value, false);
    this.preExportForm.get(['termLoanDetails', i, 'drawingPowerTrans']).patchValue(drawingPower);

    /* Converting value for date */
    this.preExportForm.get(['termLoanDetails', i, 'dateOfExpiryTypeTrans']).patchValue(
        this.preExportForm.get(['termLoanDetails', i, 'dateOfExpiryType']).value
    );
    const tempDateOfExpType = this.preExportForm.get(['termLoanDetails', i, 'dateOfExpiryType']).value;
    let tempExpDate;
    if (tempDateOfExpType === 'AD') {
      const tempEngExpDate = this.preExportForm.get(['termLoanDetails', i, 'dateOfExpiry']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ? this.datePipe.transform(tempEngExpDate) : '';
      const finalExpDate = this.transformEnglishDate(tempExpDate);
      this.preExportForm.get(['termLoanDetails', i, 'dateOfExpiryTrans']).patchValue(finalExpDate);
    } else {
      const tempDateOfExpNep = this.preExportForm.get(['termLoanDetails', i, 'dateOfExpiryNepali']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.nDate : '';
      this.preExportForm.get(['termLoanDetails', i, 'dateOfExpiryTrans']).patchValue(tempExpDate);
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
    this.preExportForm.get(['termLoanDetails', i, 'complementaryLoanSelectedCT']).patchValue(
        this.preExportForm.get(['termLoanDetails', i, 'complementaryLoanSelectedTrans']).value
    );
    this.preExportForm.get(['termLoanDetails', i, 'drawingBasisCT']).patchValue(
        this.preExportForm.get(['termLoanDetails', i, 'drawingBasisTrans']).value
    );
    this.preExportForm.get(['termLoanDetails', i, 'complementaryOtherCT']).patchValue(
        this.preExportForm.get(['termLoanDetails', i, 'complementaryOtherTrans']).value
    );
    this.preExportForm.get(['termLoanDetails', i, 'loanAmountCT']).patchValue(
        this.preExportForm.get(['termLoanDetails', i, 'loanAmountTrans']).value
    );
    this.preExportForm.get(['termLoanDetails', i, 'loanAmountWordsCT']).patchValue(
        this.preExportForm.get(['termLoanDetails', i, 'loanAmountWordsTrans']).value
    );
    this.preExportForm.get(['termLoanDetails', i, 'drawingPowerCT']).patchValue(
        this.preExportForm.get(['termLoanDetails', i, 'drawingPowerTrans']).value
    );
    this.preExportForm.get(['termLoanDetails', i, 'dateOfExpiryTypeCT']).patchValue(
        this.preExportForm.get(['termLoanDetails', i, 'dateOfExpiryTypeTrans']).value
    );
    this.preExportForm.get(['termLoanDetails', i, 'dateOfExpiryNepaliCT']).patchValue(
        this.preExportForm.get(['termLoanDetails', i, 'dateOfExpiryNepaliTrans']).value
    );
    this.preExportForm.get(['termLoanDetails', i, 'dateOfExpiryCT']).patchValue(
        this.preExportForm.get(['termLoanDetails', i, 'dateOfExpiryTrans']).value
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

  setDrawingBasis(data) {
    const tempData = !ObjectUtil.isEmpty(data) ? data : '';
    this.isMarketValue = tempData === 'MARKET_VALUE';
    this.isLetterOfCredit = tempData === 'LETTER_OF_CREDIT';
  }

  setLoanId() {
    this.filteredLoanIdList = this.cadDocAssignedLoan.filter(data =>
        data.loan.name === this.loanNameConstant.PRE_EXPORT_LOAN);
    this.filteredList.forEach((val, i) => {
      this.preExportForm.get(['termLoanDetails', i, 'loanId']).patchValue(
          this.filteredLoanIdList[i].proposal.id);
    });
  }
}
