import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {OfferDocument} from '../../../../../../../model/OfferDocument';
import {LoanNameConstant} from '../../../../sme-costant/loan-name-constant';

@Component({
  selector: 'app-overdraft-loan-for-working-capital-requirement',
  templateUrl: './overdraft-loan-for-working-capital-requirement.component.html',
  styleUrls: ['./overdraft-loan-for-working-capital-requirement.component.scss']
})
export class OverdraftLoanForWorkingCapitalRequirementComponent implements OnInit {
  @Input() loanName;
  @Input() offerDocumentList: Array<OfferDocument>;
  @Input() cadDocAssignedLoan;
  initialInformation: any;
  overdraftLoanForm: FormGroup;
  translatedFormGroup: FormGroup;
  translatedValue: any;
  BSExpiry = false;
  ADExpiry = false;
  loanDetails: any = [];
  filteredList: any = [];
  loanNameConstant = LoanNameConstant;
  dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
  yesNoOptions = [
    {value: 'Yes'},
    {value: 'No'}
  ];
  filteredLoanIdList: any =[];

  constructor( private formBuilder: FormBuilder,
               private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
               private engToNepNumberPipe: EngToNepaliNumberPipe,
               private currencyFormatterPipe: CurrencyFormatterPipe,
               private datePipe: DatePipe,
               private engToNepDatePipe: EngNepDatePipe,
               private engToNepWord: NepaliCurrencyWordPipe) { }

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
        this.overdraftLoanForm.patchValue(this.initialInformation.overdraftLoanForm);
      }
      this.patchDate();
    }
    if (!ObjectUtil.isEmpty(this.filteredList)) {
      for (let val = 0; val < this.filteredList.length; val++) {
        const loanamountWords = this.engToNepWord.transform(this.filteredList[val].loanAmount.toFixed(2));
        this.overdraftLoanForm.get(['overdraftLoanFormArray', val, 'loanAmount']).patchValue(
            this.filteredList[val] ? this.filteredList[val].loanAmount : '');
        this.overdraftLoanForm.get(['overdraftLoanFormArray', val, 'loanAmountWords']).patchValue(
            loanamountWords ? loanamountWords : '');
      }
    }
    this.setLoanId();
  }
  filterLoanDetails(loanDetails) {
    this.filteredList = loanDetails.filter(data => data.name === this.loanNameConstant.OVERDRAFT_LOAN_FOR_WORKING_CAPITAL_REQUIREMENT);
    this.filteredList.forEach(value => {
      this.addLoanFormArr();
    });
  }
  patchDate() {
    for (let val = 0; val < this.initialInformation.overdraftLoanForm.overdraftLoanFormArray.length; val++) {
      const dateOfExpiryType = this.initialInformation.overdraftLoanForm.overdraftLoanFormArray[val].dateOfExpiryType;
      if (dateOfExpiryType === 'AD') {
        const dateOfExpiry = this.initialInformation.overdraftLoanForm.overdraftLoanFormArray[val].dateOfExpiry;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.overdraftLoanForm.get(['overdraftLoanFormArray', val, 'dateOfExpiry']).patchValue(new Date(dateOfExpiry));
        }
      } else if (dateOfExpiryType === 'BS') {
        const dateOfExpiry = this.initialInformation.overdraftLoanForm.overdraftLoanFormArray[val].dateOfExpiryNepali;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.overdraftLoanForm.get(['overdraftLoanFormArray', val, 'dateOfExpiryNepali']).patchValue(dateOfExpiry);
        }
      }
    }
  }
  buildForm() {
    this.overdraftLoanForm = this.formBuilder.group({
      overdraftLoanFormArray: this.formBuilder.array([]),
    });
  }

  public checkDateOfExpiry(value): void {
    this.ADExpiry = value === 'AD';
    this.BSExpiry = value === 'BS';
  }

  public getNumAmountWord(numLabel, wordLabel, index, arrayName): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.overdraftLoanForm.get([arrayName, index, numLabel]).value);
    this.overdraftLoanForm.get([arrayName, index, wordLabel]).patchValue(transformValue);
  }

  async translateAndSetVal(index) {

    // const temparFinancing = this.overdraftLoanForm.get('arFinancing').value;
    // if (!ObjectUtil.isEmpty(temparFinancing)) {
    //   this.overdraftLoanForm.get('arFinancingTrans').patchValue(temparFinancing);
    // }

    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    const tempComplemetry = this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'complementaryOther']).value;
    if (!ObjectUtil.isEmpty(tempComplemetry)) {
      this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'complementaryOtherTrans']).patchValue(tempComplemetry);
    }
    const tempComplimentaryLoan = this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'complimentaryLoanSelected']).value;
    if (!ObjectUtil.isEmpty(tempComplimentaryLoan)) {
      this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'complimentaryLoanSelectedTrans']).patchValue(tempComplimentaryLoan);
    }
    const tempLoanAmount = this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'loanAmount']).value;
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'loanAmountTrans']).patchValue(convertNumber);

    this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'loanAmountWordsTrans']).patchValue(
        this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'loanAmountWords']).value
    );
    const drawingPower = this.convertNumbersToNepali(this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'drawingPower']).value, false);
    this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'drawingPowerTrans']).patchValue(drawingPower);
    const arDays = this.convertNumbersToNepali(this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'arDays']).value, false);
    this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'arDaysTrans']).patchValue(arDays);
    const baseRate = this.convertNumbersToNepali(this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'baseRate']).value ? this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'baseRate']).value.toFixed(2) : '', false);
    this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'baseRateTrans']).patchValue(baseRate);
    const premiumRate = this.convertNumbersToNepali(this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'premiumRate']).value ? this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'premiumRate']).value.toFixed(2) : '', false);
    this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'premiumRateTrans']).patchValue(premiumRate);
    const interestRate = this.convertNumbersToNepali(this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'interestRate']).value, false);
    this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'interestRateTrans']).patchValue(interestRate);

    /* Converting value for date */
    this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'dateOfExpiryTypeTrans']).patchValue(
        this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'dateOfExpiryType']).value
    );
    const tempDateOfExpType = this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'dateOfExpiryType']).value;
    let tempExpDate;
    if (tempDateOfExpType === 'AD') {
      const tempEngExpDate = this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'dateOfExpiry']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ? this.datePipe.transform(tempEngExpDate) : '';
      const finalExpDate = this.transformEnglishDate(tempExpDate);
      this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'dateOfExpiryTrans']).patchValue(finalExpDate);
    } else {
      const tempDateOfExpNep = this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'dateOfExpiryNepali']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.nDate : '';
      this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'dateOfExpiryTrans']).patchValue(tempExpDate);
    }
    this.setCTValue(index);
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

  setCTValue(index) {
    // this.overdraftLoanForm.get('arFinancingCT').patchValue(
    //     this.overdraftLoanForm.get('arFinancingTrans').value
    // );
    this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'complementaryOtherCT']).patchValue(
        this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'complementaryOtherTrans']).value
    );
    this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'complimentaryLoanSelectedCT']).patchValue(
        this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'complimentaryLoanSelectedTrans']).value
    );
    this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'loanAmountCT']).patchValue(
        this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'loanAmountTrans']).value
    );
    this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'loanAmountWordsCT']).patchValue(
        this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'loanAmountWordsTrans']).value
    );
    this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'drawingPowerCT']).patchValue(
        this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'drawingPowerTrans']).value
    );
    this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'arDaysCT']).patchValue(
        this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'arDaysTrans']).value
    );
    this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'baseRateCT']).patchValue(
        this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'baseRateTrans']).value
    );
    this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'premiumRateCT']).patchValue(
        this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'premiumRateTrans']).value
    );
    this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'interestRateCT']).patchValue(
        this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'interestRateTrans']).value
    );
    this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'dateOfExpiryTypeCT']).patchValue(
        this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'dateOfExpiryTypeTrans']).value
    );
    this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'dateOfExpiryNepaliCT']).patchValue(
        this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'dateOfExpiryNepaliTrans']).value
    );
    this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'dateOfExpiryCT']).patchValue(
        this.overdraftLoanForm.get(['overdraftLoanFormArray', index, 'dateOfExpiryTrans']).value
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
  buildLoanForm() {
    return this.formBuilder.group({
      // For form Data
      // arFinancing: [undefined],
      complementaryOther: [undefined],
      complimentaryLoanSelected: [undefined],
      subsidyOrAgricultureLoan: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      arDays: [undefined],
      drawingPower: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      interestRate: [undefined],
      dateOfExpiryType: [undefined],
      dateOfExpiry: [undefined],
      dateOfExpiryNepali: [undefined],

      // For translated Data
      // arFinancingTrans: [undefined],
      complementaryOtherTrans: [undefined],
      complimentaryLoanSelectedTrans: [undefined],
      loanAmountTrans: [undefined],
      loanAmountWordsTrans: [undefined],
      arDaysTrans: [undefined],
      drawingPowerTrans: [undefined],
      baseRateTrans: [undefined],
      premiumRateTrans: [undefined],
      interestRateTrans: [undefined],
      dateOfExpiryTypeTrans: [undefined],
      dateOfExpiryTrans: [undefined],
      dateOfExpiryNepaliTrans: [undefined],

      // For corrected Data
      // arFinancingCT: [undefined],
      complementaryOtherCT: [undefined],
      complimentaryLoanSelectedCT: [undefined],
      loanAmountCT: [undefined],
      loanAmountWordsCT: [undefined],
      arDaysCT: [undefined],
      drawingPowerCT: [undefined],
      baseRateCT: [undefined],
      premiumRateCT: [undefined],
      interestRateCT: [undefined],
      dateOfExpiryTypeCT: [undefined],
      dateOfExpiryCT: [undefined],
      dateOfExpiryNepaliCT: [undefined],

      loanId: [undefined],
    });
  }
  addLoanFormArr() {
    (this.overdraftLoanForm.get('overdraftLoanFormArray') as FormArray).push(this.buildLoanForm());
  }
  calInterestRate(index, arrName) {
    const baseRate = this.overdraftLoanForm.get([arrName, index, 'baseRate']).value;
    const premiumRate = this.overdraftLoanForm.get([arrName, index, 'premiumRate']).value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.overdraftLoanForm.get([arrName, index, 'interestRate']).patchValue(sum.toFixed(2));
  }
  setLoanId() {
    this.filteredLoanIdList = this.cadDocAssignedLoan.filter(data =>
        data.loan.name === this.loanNameConstant.OVERDRAFT_LOAN_FOR_WORKING_CAPITAL_REQUIREMENT);
    this.filteredList.forEach((val, i) => {
      this.overdraftLoanForm.get(['overdraftLoanFormArray', i, 'loanId']).patchValue(
          this.filteredLoanIdList[i].proposal.id);
    });
  }

  checkComplimetryOtherLoan(data, i) {
    if (!data) {
      this.overdraftLoanForm.get(['overdraftLoanFormArray', i, 'complementaryOther']).patchValue(data);
    }
  }

}
