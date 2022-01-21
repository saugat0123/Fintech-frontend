import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {OfferDocument} from '../../../../../../../model/OfferDocument';

@Component({
  selector: 'app-overdraft-loan-for-working-capital-requirement',
  templateUrl: './overdraft-loan-for-working-capital-requirement.component.html',
  styleUrls: ['./overdraft-loan-for-working-capital-requirement.component.scss']
})
export class OverdraftLoanForWorkingCapitalRequirementComponent implements OnInit {
  @Input() loanName;
  @Input() offerDocumentList: Array<OfferDocument>;
  initialInformation: any;
  overdraftLoanForm: FormGroup;
  BSExpiry = false;
  ADExpiry = false;
  loanDetails: any = [];
  dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
  yesNoOptions = [
    {value: 'Yes'},
    {value: 'No'}
  ];

  constructor( private formBuilder: FormBuilder,
               private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
               private engToNepNumberPipe: EngToNepaliNumberPipe,
               private currencyFormatterPipe: CurrencyFormatterPipe,
               private datePipe: DatePipe,
               private engToNepDatePipe: EngNepDatePipe) { }

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
        this.overdraftLoanForm.patchValue(this.initialInformation.overdraftLoanForm);
      }
      const dateOfExpiryType = this.initialInformation.overdraftLoanForm.dateOfExpiryType;
      if (dateOfExpiryType === 'AD') {
        const dateOfExpiry = this.initialInformation.overdraftLoanForm.dateOfExpiry;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.overdraftLoanForm.get('dateOfExpiry').patchValue(new Date(dateOfExpiry));
        }
      } else if (dateOfExpiryType === 'BS') {
        const dateOfExpiry = this.initialInformation.overdraftLoanForm.dateOfExpiryNepali;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.overdraftLoanForm.get('dateOfExpiryNepali').patchValue(dateOfExpiry);
        }
      }
    }
  }

  buildForm() {
    this.overdraftLoanForm = this.formBuilder.group({
      // For form Data
      // arFinancing: [undefined],
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
    });
  }

  public checkDateOfExpiry(value): void {
    this.ADExpiry = value === 'AD';
    this.BSExpiry = value === 'BS';
  }

  public getNumAmountWord(numLabel, wordLabel): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.overdraftLoanForm.get(numLabel).value);
    this.overdraftLoanForm.get(wordLabel).patchValue(transformValue);
  }

  translateAndSetVal() {

    // const temparFinancing = this.overdraftLoanForm.get('arFinancing').value;
    // if (!ObjectUtil.isEmpty(temparFinancing)) {
    //   this.overdraftLoanForm.get('arFinancingTrans').patchValue(temparFinancing);
    // }

    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    const tempLoanAmount = this.overdraftLoanForm.get('loanAmount').value;
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.overdraftLoanForm.get('loanAmountTrans').patchValue(convertNumber);

    this.overdraftLoanForm.get('loanAmountWordsTrans').patchValue(
        this.overdraftLoanForm.get('loanAmountWords').value
    );
    const drawingPower = this.convertNumbersToNepali(this.overdraftLoanForm.get('drawingPower').value, false);
    this.overdraftLoanForm.get('drawingPowerTrans').patchValue(drawingPower);
    const arDays = this.convertNumbersToNepali(this.overdraftLoanForm.get('arDays').value, false);
    this.overdraftLoanForm.get('arDaysTrans').patchValue(arDays);
    const baseRate1 = this.convertNumbersToNepali(this.overdraftLoanForm.get('baseRate').value, false);
    this.overdraftLoanForm.get('baseRateTrans').patchValue(baseRate1);
    const premiumRate1 = this.convertNumbersToNepali(this.overdraftLoanForm.get('premiumRate').value, false);
    this.overdraftLoanForm.get('premiumRateTrans').patchValue(premiumRate1);
    const interestRate = this.convertNumbersToNepali(this.overdraftLoanForm.get('interestRate').value, false);
    this.overdraftLoanForm.get('interestRateTrans').patchValue(interestRate);

    /* Converting value for date */
    this.overdraftLoanForm.get('dateOfExpiryTypeTrans').patchValue(
        this.overdraftLoanForm.get('dateOfExpiryType').value
    );
    const tempDateOfExpType = this.overdraftLoanForm.get('dateOfExpiryType').value;
    let tempExpDate;
    if (tempDateOfExpType === 'AD') {
      const tempEngExpDate = this.overdraftLoanForm.get('dateOfExpiry').value;
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ? this.datePipe.transform(tempEngExpDate) : '';
      const finalExpDate = this.transformEnglishDate(tempExpDate);
      this.overdraftLoanForm.get('dateOfExpiryTrans').patchValue(finalExpDate);
    } else {
      const tempDateOfExpNep = this.overdraftLoanForm.get('dateOfExpiryNepali').value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.nDate : '';
      this.overdraftLoanForm.get('dateOfExpiryTrans').patchValue(tempExpDate);
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
    // this.overdraftLoanForm.get('arFinancingCT').patchValue(
    //     this.overdraftLoanForm.get('arFinancingTrans').value
    // );
    this.overdraftLoanForm.get('loanAmountCT').patchValue(
        this.overdraftLoanForm.get('loanAmountTrans').value
    );
    this.overdraftLoanForm.get('loanAmountWordsCT').patchValue(
        this.overdraftLoanForm.get('loanAmountWordsTrans').value
    );
    this.overdraftLoanForm.get('drawingPowerCT').patchValue(
        this.overdraftLoanForm.get('drawingPowerTrans').value
    );
    this.overdraftLoanForm.get('arDaysCT').patchValue(
        this.overdraftLoanForm.get('arDaysTrans').value
    );
    this.overdraftLoanForm.get('baseRateCT').patchValue(
        this.overdraftLoanForm.get('baseRateTrans').value
    );
    this.overdraftLoanForm.get('premiumRateCT').patchValue(
        this.overdraftLoanForm.get('premiumRateTrans').value
    );
    this.overdraftLoanForm.get('interestRateCT').patchValue(
        this.overdraftLoanForm.get('interestRateTrans').value
    );
    this.overdraftLoanForm.get('dateOfExpiryTypeCT').patchValue(
        this.overdraftLoanForm.get('dateOfExpiryTypeTrans').value
    );
    this.overdraftLoanForm.get('dateOfExpiryNepaliCT').patchValue(
        this.overdraftLoanForm.get('dateOfExpiryNepaliTrans').value
    );
    this.overdraftLoanForm.get('dateOfExpiryCT').patchValue(
        this.overdraftLoanForm.get('dateOfExpiryTrans').value
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
    const baseRate = this.overdraftLoanForm.get('baseRate').value;
    const premiumRate = this.overdraftLoanForm.get('premiumRate').value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.overdraftLoanForm.get('interestRate').patchValue(sum);
  }

}
