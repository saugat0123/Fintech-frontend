import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {OfferDocument} from '../../../../../../../model/OfferDocument';
import {SbTranslateService} from '../../../../../../../../../@core/service/sbtranslate.service';
import {LoanNameConstant} from '../../../../sme-costant/loan-name-constant';

@Component({
  selector: 'app-demand-loan-for-working-capital',
  templateUrl: './demand-loan-for-working-capital.component.html',
  styleUrls: ['./demand-loan-for-working-capital.component.scss']
})
export class DemandLoanForWorkingCapitalComponent implements OnInit {
  @Input() loanName;
  @Input() offerDocumentList: Array<OfferDocument>;
  @Input() cadDocAssignedLoan;
  initialInformation: any;
  demandLoanForm: FormGroup;
  translatedFormGroup: FormGroup;
  translatedValue: any;
  isComplimentryOtherLoan = false;
  isARFinancing = false;
  dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
  ADExpiry = false;
  BSExpiry = false;
  loanDetails: any = [];
  filteredList: any = [];
  loanNameConstant = LoanNameConstant;
  yesNoOptions = [
    {value: 'Yes'},
    {value: 'No'}
  ];
  filteredLoanIdList: any = [];

  constructor(private formBuilder: FormBuilder,
              private translateService: SbTranslateService,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatterPipe: CurrencyFormatterPipe,
              private datePipe: DatePipe,
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
        this.demandLoanForm.patchValue(this.initialInformation.demandLoanForm);
      }
      this.patchDate();
    }
    if (!ObjectUtil.isEmpty(this.filteredList)) {
      for (let val = 0; val < this.filteredList.length; val++) {
        const loanamountWords = this.engToNepWord.transform(this.filteredList[val].loanAmount);
        this.demandLoanForm.get(['demandLoanFormArray', val, 'loanAmount']).patchValue(
            this.filteredList[val] ? this.filteredList[val].loanAmount : '');
        this.demandLoanForm.get(['demandLoanFormArray', val, 'loanAmountWords']).patchValue(
            loanamountWords ? loanamountWords : '');
      }
    }
    this.setLoanId();
  }
  patchDate() {
    for (let val = 0; val < this.initialInformation.demandLoanForm.demandLoanFormArray.length; val++) {
      const dateOfExpiryType = this.initialInformation.demandLoanForm.demandLoanFormArray[val].dateOfExpiryType;
      if (dateOfExpiryType === 'AD') {
        const dateOfExpiry = this.initialInformation.demandLoanForm.demandLoanFormArray[val].dateOfExpiry;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.demandLoanForm.get(['demandLoanFormArray', val, 'dateOfExpiry']).patchValue(new Date(dateOfExpiry));
        }
      } else if (dateOfExpiryType === 'BS') {
        const dateOfExpiry = this.initialInformation.demandLoanForm.demandLoanFormArray[val].dateOfExpiryNepali;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.demandLoanForm.get(['demandLoanFormArray', val, 'dateOfExpiryNepali']).patchValue(dateOfExpiry);
        }
      }
    }
  }

  buildForm() {
    this.demandLoanForm = this.formBuilder.group({
      demandLoanFormArray: this.formBuilder.array([]),
    });
  }

  checkComplimetryOtherLoan(data, index) {
    this.demandLoanForm.get(['demandLoanFormArray', index, 'complementaryOther']).patchValue(data);
  }

  /*checkARFinancing(data, index) {
    this.demandLoanForm.get(['demandLoanFormArray', index, 'arFinancing']).patchValue(data);
  }*/

  public getNumAmountWord(numLabel, wordLabel, index, arrayName): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.demandLoanForm.get([arrayName, index, numLabel]).value);
    this.demandLoanForm.get([arrayName, index, wordLabel]).patchValue(transformValue);
  }

  filterLoanDetails(loanDetails) {
    this.filteredList = loanDetails.filter(data => data.name === this.loanNameConstant.DEMAND_LOAN_FOR_WORKING_CAPITAL);
    this.filteredList.forEach(value => {
      this.addLoanFormArr();
    });
  }

  calInterestRate(index, arrName) {
    const baseRate = this.demandLoanForm.get([arrName, index, 'baseRate']).value;
    const premiumRate = this.demandLoanForm.get([arrName, index, 'premiumRate']).value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.demandLoanForm.get([arrName, index, 'interestRate']).patchValue(sum.toFixed(2));
  }

  public checkDateOfExpiry(value): void {
    this.ADExpiry = value === 'AD';
    this.BSExpiry = value === 'BS';
  }
  async translateAndSetVal(index) {
    /* SET TRANS VALUE FOR CONDITIONS */
    const tempComplemetry = this.demandLoanForm.get(['demandLoanFormArray', index, 'complementaryOther']).value;
    if (!ObjectUtil.isEmpty(tempComplemetry)) {
      this.demandLoanForm.get(['demandLoanFormArray', index, 'complementaryOtherTrans']).patchValue(tempComplemetry);
    }
    const tempComplimentaryLoanSelected = this.demandLoanForm.get(['demandLoanFormArray', index, 'complimentaryLoanSelected']).value;
    if (!ObjectUtil.isEmpty(tempComplimentaryLoanSelected)) {
      this.demandLoanForm.get(['demandLoanFormArray', index, 'complimentaryLoanSelectedTrans']).patchValue(tempComplimentaryLoanSelected);
    }
    /*const tempArFinancing = this.demandLoanForm.get(['demandLoanFormArray', index, 'arFinancing']).value;
    if (!ObjectUtil.isEmpty(tempArFinancing)) {
      this.demandLoanForm.get(['demandLoanFormArray', index, 'arFinancingTrans']).patchValue(tempArFinancing);
    }*/

    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    const tempLoanAmount = this.demandLoanForm.get(['demandLoanFormArray', index, 'loanAmount']).value;
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.demandLoanForm.get(['demandLoanFormArray', index, 'loanAmountTrans']).patchValue(convertNumber);

    this.demandLoanForm.get(['demandLoanFormArray', index, 'loanAmountWordsTrans']).patchValue(
        this.demandLoanForm.get(['demandLoanFormArray', index, 'loanAmountWords']).value
    );
    const drawingPower = this.convertNumbersToNepali(this.demandLoanForm.get(['demandLoanFormArray', index, 'drawingPower']).value, false);
    this.demandLoanForm.get(['demandLoanFormArray', index, 'drawingPowerTrans']).patchValue(drawingPower);
    const arDays = this.convertNumbersToNepali(this.demandLoanForm.get(['demandLoanFormArray', index, 'arDays']).value, false);
    this.demandLoanForm.get(['demandLoanFormArray', index, 'arDaysTrans']).patchValue(arDays);
    const baseRate = this.convertNumbersToNepali(this.demandLoanForm.get(['demandLoanFormArray', index, 'baseRate']).value.toFixed(2), false);
    this.demandLoanForm.get(['demandLoanFormArray', index, 'baseRateTrans']).patchValue(baseRate);
    const premiumRate = this.convertNumbersToNepali(this.demandLoanForm.get(['demandLoanFormArray', index, 'premiumRate']).value.toFixed(2), false);
    this.demandLoanForm.get(['demandLoanFormArray', index, 'premiumRateTrans']).patchValue(premiumRate);
    const interestRate = this.convertNumbersToNepali(this.demandLoanForm.get(['demandLoanFormArray', index, 'interestRate']).value, false);
    this.demandLoanForm.get(['demandLoanFormArray', index, 'interestRateTrans']).patchValue(interestRate);

    /* Converting value for date */
    this.demandLoanForm.get(['demandLoanFormArray', index, 'dateOfExpiryTypeTrans']).patchValue(
        this.demandLoanForm.get(['demandLoanFormArray', index, 'dateOfExpiryType']).value
    );
    const tempDateOfExpType = this.demandLoanForm.get(['demandLoanFormArray', index, 'dateOfExpiryType']).value;
    let tempExpDate;
    if (tempDateOfExpType === 'AD') {
      const tempEngExpDate = this.demandLoanForm.get(['demandLoanFormArray', index, 'dateOfExpiry']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ? this.datePipe.transform(tempEngExpDate) : '';
        const finalExpDate = this.transformEnglishDate(tempExpDate);
      this.demandLoanForm.get(['demandLoanFormArray', index, 'dateOfExpiryTrans']).patchValue(finalExpDate);
    } else {
      const tempDateOfExpNep = this.demandLoanForm.get(['demandLoanFormArray', index, 'dateOfExpiryNepali']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.nDate : '';
      this.demandLoanForm.get(['demandLoanFormArray', index, 'dateOfExpiryTrans']).patchValue(tempExpDate);
    }
    // translated date by google api
    // this.translatedFormGroup = this.formBuilder.group({
    //   dateOfExpiry: this.demandLoanForm.get('dateOfExpiry').value
    // });
    // this.translatedValue = this.translateService.translateForm(this.translatedFormGroup);
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
    this.demandLoanForm.get(['demandLoanFormArray', index, 'complementaryOtherCT']).patchValue(
        this.demandLoanForm.get(['demandLoanFormArray', index, 'complementaryOtherTrans']).value
    );
    this.demandLoanForm.get(['demandLoanFormArray', index, 'complimentaryLoanSelectedCT']).patchValue(
        this.demandLoanForm.get(['demandLoanFormArray', index, 'complimentaryLoanSelectedTrans']).value
    );
    /*this.demandLoanForm.get(['demandLoanFormArray', index, 'arFinancingCT']).patchValue(
        this.demandLoanForm.get(['demandLoanFormArray', index, 'arFinancingTrans']).value
    );*/
    this.demandLoanForm.get(['demandLoanFormArray', index, 'loanAmountCT']).patchValue(
        this.demandLoanForm.get(['demandLoanFormArray', index, 'loanAmountTrans']).value
    );
    this.demandLoanForm.get(['demandLoanFormArray', index, 'loanAmountWordsCT']).patchValue(
        this.demandLoanForm.get(['demandLoanFormArray', index, 'loanAmountWordsTrans']).value
    );
    this.demandLoanForm.get(['demandLoanFormArray', index, 'drawingPowerCT']).patchValue(
        this.demandLoanForm.get(['demandLoanFormArray', index, 'drawingPowerTrans']).value
    );
    this.demandLoanForm.get(['demandLoanFormArray', index, 'arDaysCT']).patchValue(
        this.demandLoanForm.get(['demandLoanFormArray', index, 'arDaysTrans']).value
    );
    this.demandLoanForm.get(['demandLoanFormArray', index, 'baseRateCT']).patchValue(
        this.demandLoanForm.get(['demandLoanFormArray', index, 'baseRateTrans']).value
    );
    this.demandLoanForm.get(['demandLoanFormArray', index, 'premiumRateCT']).patchValue(
        this.demandLoanForm.get(['demandLoanFormArray', index, 'premiumRateTrans']).value
    );
    this.demandLoanForm.get(['demandLoanFormArray', index, 'interestRateCT']).patchValue(
        this.demandLoanForm.get(['demandLoanFormArray', index, 'interestRateTrans']).value
    );
    this.demandLoanForm.get(['demandLoanFormArray', index, 'dateOfExpiryTypeCT']).patchValue(
        this.demandLoanForm.get(['demandLoanFormArray', index, 'dateOfExpiryTypeTrans']).value
    );
    this.demandLoanForm.get(['demandLoanFormArray', index, 'dateOfExpiryNepaliCT']).patchValue(
        this.demandLoanForm.get(['demandLoanFormArray', index, 'dateOfExpiryNepaliTrans']).value
    );
    this.demandLoanForm.get(['demandLoanFormArray', index, 'dateOfExpiryCT']).patchValue(
        this.demandLoanForm.get(['demandLoanFormArray', index, 'dateOfExpiryTrans']).value
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

      // for form data
      complementaryOther: [false],
      complimentaryLoanSelected: [undefined],
      /*arFinancing: [false],*/
      subsidyOrAgricultureLoan: [undefined],
      arDays: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      drawingPower: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      interestRate: [undefined],
      dateOfExpiryType: [undefined],
      dateOfExpiryNepali: [undefined],
      dateOfExpiry: [undefined],

      // for translated data
      complementaryOtherTrans: [false],
      complimentaryLoanSelectedTrans: [undefined],
     /* arFinancingTrans: [false],*/
      arDaysTrans: [undefined],
      loanAmountTrans: [undefined],
      loanAmountWordsTrans: [undefined],
      drawingPowerTrans: [undefined],
      baseRateTrans: [undefined],
      premiumRateTrans: [undefined],
      interestRateTrans: [undefined],
      dateOfExpiryTypeTrans: [undefined],
      dateOfExpiryNepaliTrans: [undefined],
      dateOfExpiryTrans: [undefined],

      // for corrected data
      complementaryOtherCT: [false],
      complimentaryLoanSelectedCT: [undefined],
      /*arFinancingCT: [false],*/
      arDaysCT: [undefined],
      loanAmountCT: [undefined],
      loanAmountWordsCT: [undefined],
      drawingPowerCT: [undefined],
      baseRateCT: [undefined],
      premiumRateCT: [undefined],
      interestRateCT: [undefined],
      dateOfExpiryTypeCT: [undefined],
      dateOfExpiryNepaliCT: [undefined],
      dateOfExpiryCT: [undefined],

      loanId: [undefined],
    });
  }
  addLoanFormArr() {
    (this.demandLoanForm.get('demandLoanFormArray') as FormArray).push(this.buildLoanForm());
  }

  setLoanId() {
    this.filteredLoanIdList = this.cadDocAssignedLoan.filter(data =>
        data.loan.name === this.loanNameConstant.DEMAND_LOAN_FOR_WORKING_CAPITAL);
    this.filteredList.forEach((val, i) => {
      this.demandLoanForm.get(['demandLoanFormArray', i, 'loanId']).patchValue(
          this.filteredLoanIdList[i].proposal.id);
    });
  }

}
