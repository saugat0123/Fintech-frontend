import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngNepDatePipe} from 'nepali-patro';
import {DatePipe} from '@angular/common';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {SbTranslateService} from '../../../../../../../../../@core/service/sbtranslate.service';
import {OfferDocument} from '../../../../../../../model/OfferDocument';
import {LoanNameConstant} from '../../../../sme-costant/loan-name-constant';

@Component({
  selector: 'app-overdraft-facility-against-fixed-deposit',
  templateUrl: './overdraft-facility-against-fixed-deposit.component.html',
  styleUrls: ['./overdraft-facility-against-fixed-deposit.component.scss']
})
export class OverdraftFacilityAgainstFixedDepositComponent implements OnInit {
  @Input() loanName;
  @Input() customerApprovedDoc;
  @Input() offerDocumentList: Array<OfferDocument>;
  initialInformation: any;
  overdraftFixedForm: FormGroup;
  loanDetails: any = [];
  isFixedDeposit = false;
  isDepositAccount = false;
  isNew = false;
  isExisting = false;
  isCoupenRate = false;
  isBaseRate = false;
  isAdditionalPremiumRate = false;
  isNabil = false;
  isOther = false;
  isCurrent = false;
  isSaving = false;
  isCall = false;
  ADExpiry = false;
  BSExpiry = false;
  dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
  translatedFormGroup: FormGroup;
  translatedValue: any;
  arrayForm: any = {};
  yesNoOptions = [
    {value: 'Yes'},
    {value: 'No'}
  ];
  filteredList: any = [];
  loanNameConstant = LoanNameConstant;
  overdraftLoanNumber: Array<any> = new Array<any>();


  constructor(private formBuilder: FormBuilder,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepDatePipe: EngNepDatePipe,
              private datePipe: DatePipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatterPipe: CurrencyFormatterPipe,
              private translateService: SbTranslateService,
              private translatedService: SbTranslateService ) { }

  ngOnInit() {
    this.overdraftLoanNumber = this.customerApprovedDoc.assignedLoan.filter(val =>
        val.loan.name === 'OVERDRAFT FACILITY FIXED DEPOSIT');
   this.buildForm();
    console.log(this.customerApprovedDoc);
   if (!ObjectUtil.isEmpty(this.loanName)) {
     this.loanDetails = this.loanName;
   }
    if (this.offerDocumentList.length > 0) {
      this.offerDocumentList.forEach(offerLetter => {
        this.initialInformation = JSON.parse(offerLetter.initialInformation);
      });
      if (!ObjectUtil.isEmpty(this.initialInformation)) {
        this.overdraftFixedForm.get('odFdFormArray').patchValue(this.initialInformation.overdraftFixedForm.odFdFormArray);
      }
/*      const dateOfExpiryType = this.initialInformation.overdraftFixedForm.dateOfExpiryType;
      if (dateOfExpiryType === 'AD') {
        const dateOfExpiry = this.initialInformation.overdraftFixedForm.dateOfExpiry;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.overdraftFixedForm.get('dateOfExpiry').patchValue(new Date(dateOfExpiry));
        }
      } else if (dateOfExpiryType === 'BS') {
        const dateOfExpiry = this.initialInformation.overdraftFixedForm.dateOfExpiryNepali;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.overdraftFixedForm.get('dateOfExpiryNepali').patchValue(dateOfExpiry);
        }
      }*/
      this.patchDate();
    }
  }
  patchDate() {
    for (let val = 0; val < this.initialInformation.overdraftFixedForm.odFdFormArray.length; val++) {
      const dateOfExpiryType = this.initialInformation.overdraftFixedForm.odFdFormArray[val].dateOfExpiryType;
      if (dateOfExpiryType === 'AD') {
        const dateOfExpiry = this.initialInformation.overdraftFixedForm.odFdFormArray[val].dateOfExpiry;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.overdraftFixedForm.get(['odFdFormArray', val, 'dateOfExpiry']).patchValue(new Date(dateOfExpiry));
        }
      } else if (dateOfExpiryType === 'BS') {
        const dateOfExpiry = this.initialInformation.overdraftFixedForm.odFdFormArray[val].dateOfExpiryNepali;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.overdraftFixedForm.get(['odFdFormArray', val, 'dateOfExpiryNepali']).patchValue(dateOfExpiry);
        }
      }
    }
  }
  buildForm() {
    this.overdraftFixedForm = this.formBuilder.group({
      odFdFormArray: this.formBuilder.array([])
    });
    this.setTermLoanForm();
  }
  buildLoanForm() {
    return this.formBuilder.group({
      // For Form Data
      additionalPremiumRateReq: [undefined],
      subLoanOption: [undefined],
      letterOfSetOff: [undefined],
      interestRateType: [undefined],
      subsidyOrAgricultureLoan: [undefined],
      checkAdditionalPremiumRate: [undefined],
      nameOfFacility: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      holdingBank: [undefined],
      nameOfHoldingBank: [undefined],
      nameOfFDHolder: [undefined],
      FdAmountInFigure: [undefined],
      nameOfDepositors: [undefined],
      accountType: [undefined],
      accountNumber: [undefined],
      amountInFigure: [undefined],
      drawingPower: [undefined],
      totalInterestRate: [undefined],
      additionalPremiumRate: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      interestRate: [undefined],
      dateOfExpiry: [undefined],
      dateOfExpiryNepali: [undefined],
      dateOfExpiryType: [undefined],

      // For Translated Data
      subLoanOptionTrans: [undefined],
      letterOfSetOffTrans: [undefined],
      interestRateTypeTrans: [undefined],
      checkAdditionalPremiumRateTrans: [undefined],
      nameOfFacilityTrans: [undefined],
      loanAmountTrans: [undefined],
      loanAmountWordsTrans: [undefined],
      holdingBankTrans: [undefined],
      nameOfHoldingBankTrans: [undefined],
      nameOfFDHolderTrans: [undefined],
      FdAmountInFigureTrans: [undefined],
      nameOfDepositorsTrans: [undefined],
      accountTypeTrans: [undefined],
      accountNumberTrans: [undefined],
      amountInFigureTrans: [undefined],
      drawingPowerTrans: [undefined],
      totalInterestRateTrans: [undefined],
      additionalPremiumRateTrans: [undefined],
      baseRateTrans: [undefined],
      premiumRateTrans: [undefined],
      interestRateTrans: [undefined],
      dateOfExpiryTrans: [undefined],
      dateOfExpiryNepaliTrans: [undefined],
      dateOfExpiryTypeTrans: [undefined],

      // For Corrected Data
      subLoanOptionCT: [undefined],
      letterOfSetOffCT: [undefined],
      interestRateTypeCT: [undefined],
      checkAdditionalPremiumRateCT: [undefined],
      nameOfFacilityCT: [undefined],
      loanAmountCT: [undefined],
      loanAmountWordsCT: [undefined],
      holdingBankCT: [undefined],
      nameOfHoldingBankCT: [undefined],
      nameOfFDHolderCT: [undefined],
      FdAmountInFigureCT: [undefined],
      nameOfDepositorsCT: [undefined],
      accountTypeCT: [undefined],
      accountNumberCT: [undefined],
      amountInFigureCT: [undefined],
      drawingPowerCT: [undefined],
      totalInterestRateCT: [undefined],
      additionalPremiumRateCT: [undefined],
      baseRateCT: [undefined],
      premiumRateCT: [undefined],
      interestRateCT: [undefined],
      dateOfExpiryCT: [undefined],
      dateOfExpiryNepaliCT: [undefined],
      dateOfExpiryTypeCT: [undefined],
      fdHolderDetails: this.formBuilder.array([]),
      depositorDetails: this.formBuilder.array([]),
    });
  }
  setTermLoanForm() {
    for (let a = 0; a < this.overdraftLoanNumber.length; a++) {
      (this.overdraftFixedForm.get('odFdFormArray') as FormArray).push(this.buildLoanForm());
    }
  }

  subLoanOption(data, i) {
    const tempData = !ObjectUtil.isEmpty(data) ? data : '';
    this.isFixedDeposit = tempData === 'AGAINST_FIXED_DEPOSIT';
    this.isDepositAccount = tempData === 'AGAINST_DEPOSIT_ACCOUNT';
  }

  letterOfSetOff(data) {
    const tempData = !ObjectUtil.isEmpty(data) ? data : '';
    this.isNew = tempData === 'NEW';
    this.isExisting = tempData === 'EXISTING';
  }

  changeInterestRateType(data) {
    const tempData = !ObjectUtil.isEmpty(data) ? data : '';
    this.isCoupenRate = tempData === 'COUPEN_RATE_FINANCING';
    this.isBaseRate = tempData === 'BASE_RATE_FINANCING';
  }

  checkadditionalPremiumRate1(event, i) {
    if (!event) {
      this.overdraftFixedForm.get(['odFdFormArray', i, 'additionalPremiumRate']).patchValue(null);
    }
  }

  public getNumAmountWord(numLabel, wordLabel, index): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.overdraftFixedForm.get(['odFdFormArray', index, numLabel]).value);
    this.overdraftFixedForm.get(['odFdFormArray', index, wordLabel]).patchValue(transformValue);
  }

  changeHoldingBank(data) {
    const tempData = !ObjectUtil.isEmpty(data) ? data : '';
    this.isNabil = tempData === 'NABIL';
    this.isOther = tempData === 'OTHER';
  }

  changeAccountType(data) {
    const tempData = !ObjectUtil.isEmpty(data) ? data : '';
    this.isCurrent = tempData === 'CURRENT_ACCOUNT';
    this.isSaving = tempData === 'SAVING_ACCOUNT';
    this.isCall = tempData === 'CALL_ACCOUNT';
  }

  // calInterestRate(index, arrName) {
  //   const baseRate = this.overdraftFixedForm.get([arrName, index, 'baseRate']).value;
  //   const premiumRate = this.overdraftFixedForm.get([arrName, index, 'premiumRate']).value;
  //   const sum = parseFloat(baseRate) + parseFloat(premiumRate);
  //   this.overdraftFixedForm.get([arrName, index, 'interestRate']).patchValue(sum);
  // }
  calInterestRate(i) {
    const baseRate = this.overdraftFixedForm.get(['odFdFormArray', i, 'baseRate']).value;
    const premiumRate = this.overdraftFixedForm.get(['odFdFormArray', i, 'premiumRate']).value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.overdraftFixedForm.get(['odFdFormArray', i, 'interestRate']).patchValue(sum.toFixed(3));
}

  public checkDateOfExpiry(value): void {
    this.ADExpiry = value === 'AD';
    this.BSExpiry = value === 'BS';
  }

  async translateAndSetVal(index) {

    /* SET TRANS VALUE FOR CONDITIONS */
    const tempLoanOptions = this.overdraftFixedForm.get(['odFdFormArray', index, 'subLoanOption']).value;
    if (!ObjectUtil.isEmpty(tempLoanOptions)) {
      this.overdraftFixedForm.get(['odFdFormArray', index, 'subLoanOptionTrans']).patchValue(tempLoanOptions);
    }

    const templetterOfSetOff = this.overdraftFixedForm.get(['odFdFormArray', index, 'letterOfSetOff']).value;
    if (!ObjectUtil.isEmpty(templetterOfSetOff)) {
      this.overdraftFixedForm.get(['odFdFormArray', index, 'letterOfSetOffTrans']).patchValue(templetterOfSetOff);
    }

    const tempinterestRateType = this.overdraftFixedForm.get(['odFdFormArray', index, 'interestRateType']).value;
    if (!ObjectUtil.isEmpty(tempinterestRateType)) {
      this.overdraftFixedForm.get(['odFdFormArray', index, 'interestRateTypeTrans']).patchValue(tempinterestRateType);
    }
    const tempComplementary = this.overdraftFixedForm.get(['odFdFormArray', index, 'additionalPremiumRate']).value;
    if (!ObjectUtil.isEmpty(tempComplementary)) {
      this.overdraftFixedForm.get(['odFdFormArray', index, 'additionalPremiumRateTrans']).patchValue(tempComplementary);
    }
    const tempadditionalPremiumRate = this.overdraftFixedForm.get(['odFdFormArray', index, 'checkAdditionalPremiumRate']).value;
    if (!ObjectUtil.isEmpty(tempadditionalPremiumRate)) {
      this.overdraftFixedForm.get(['odFdFormArray', index, 'checkAdditionalPremiumRateTrans']).patchValue(tempadditionalPremiumRate);
    }

    const tempholdingBank = this.overdraftFixedForm.get(['odFdFormArray', index, 'holdingBank']).value;
    if (!ObjectUtil.isEmpty(tempholdingBank)) {
      this.overdraftFixedForm.get(['odFdFormArray', index, 'holdingBankTrans']).patchValue(tempholdingBank);
    }

    const tempaccountType = this.overdraftFixedForm.get(['odFdFormArray', index, 'accountType']).value;
    if (!ObjectUtil.isEmpty(tempaccountType)) {
      this.overdraftFixedForm.get(['odFdFormArray', index, 'accountTypeTrans']).patchValue(tempaccountType);
    }

    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    const tempLoanAmount = this.overdraftFixedForm.get(['odFdFormArray', index, 'loanAmount']).value;
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.overdraftFixedForm.get(['odFdFormArray', index, 'loanAmountTrans']).patchValue(convertNumber);

    this.overdraftFixedForm.get(['odFdFormArray', index, 'loanAmountWordsTrans']).patchValue(
        this.overdraftFixedForm.get(['odFdFormArray', index, 'loanAmountWords']).value
    );

    const tempFDAmount = this.overdraftFixedForm.get(['odFdFormArray', index, 'FdAmountInFigure']).value;
    const convertNumber1 = !ObjectUtil.isEmpty(tempFDAmount) ?
        this.convertNumbersToNepali(tempFDAmount, true) : '';
    this.overdraftFixedForm.get(['odFdFormArray', index, 'FdAmountInFigureTrans']).patchValue(convertNumber1);

    const tempAmount = this.overdraftFixedForm.get(['odFdFormArray', index, 'amountInFigure']).value;
    const convertNumber2 = !ObjectUtil.isEmpty(tempAmount) ?
        this.convertNumbersToNepali(tempAmount, true) : '';
    this.overdraftFixedForm.get(['odFdFormArray', index, 'amountInFigureTrans']).patchValue(convertNumber2);

    const convertaccountNumber = this.convertNumbersToNepali(this.overdraftFixedForm.get(['odFdFormArray', index, 'accountNumber']).value, false);
    this.overdraftFixedForm.get(['odFdFormArray', index, 'accountNumberTrans']).patchValue(convertaccountNumber);
    const convertdrawingPower = this.convertNumbersToNepali(this.overdraftFixedForm.get(['odFdFormArray', index, 'drawingPower']).value, false);
    this.overdraftFixedForm.get(['odFdFormArray', index, 'drawingPowerTrans']).patchValue(convertdrawingPower);
    const converttotalInterestRate = this.convertNumbersToNepali(this.overdraftFixedForm.get(['odFdFormArray', index, 'totalInterestRate']).value, false);
    this.overdraftFixedForm.get(['odFdFormArray', index, 'totalInterestRateTrans']).patchValue(converttotalInterestRate);
    const convertadditionalPremiumRate = this.convertNumbersToNepali(this.overdraftFixedForm.get(['odFdFormArray', index, 'additionalPremiumRate']).value, false);
    this.overdraftFixedForm.get(['odFdFormArray', index, 'additionalPremiumRateTrans']).patchValue(convertadditionalPremiumRate);
    const convertbaseRate = this.convertNumbersToNepali(this.overdraftFixedForm.get(['odFdFormArray', index, 'baseRate']).value, false);
    this.overdraftFixedForm.get(['odFdFormArray', index, 'baseRateTrans']).patchValue(convertbaseRate);
    const convertpremiumRate = this.convertNumbersToNepali(this.overdraftFixedForm.get(['odFdFormArray', index, 'premiumRate']).value, false);
    this.overdraftFixedForm.get(['odFdFormArray', index, 'premiumRateTrans']).patchValue(convertpremiumRate);
    const convertinterestRate = this.convertNumbersToNepali(this.overdraftFixedForm.get(['odFdFormArray', index, 'interestRate']).value, false);
    this.overdraftFixedForm.get(['odFdFormArray', index, 'interestRateTrans']).patchValue(convertinterestRate);

    /* Converting value for date */
    this.overdraftFixedForm.get(['odFdFormArray', index, 'dateOfExpiryTypeTrans']).patchValue(
        this.overdraftFixedForm.get(['odFdFormArray', index, 'dateOfExpiryType']).value
    );
    const tempDateOfExpType = this.overdraftFixedForm.get(['odFdFormArray', index, 'dateOfExpiryType']).value;
    let tempExpDate;
    if (tempDateOfExpType === 'AD') {
      const tempEngExpDate = this.overdraftFixedForm.get(['odFdFormArray', index, 'dateOfExpiry']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ? this.datePipe.transform(tempEngExpDate) : '';
      const finalExpDate = this.transformEnglishDate(tempExpDate);
      this.overdraftFixedForm.get(['odFdFormArray', index, 'dateOfExpiryTrans']).patchValue(finalExpDate);
    } else {
      const tempDateOfExpNep = this.overdraftFixedForm.get(['odFdFormArray', index, 'dateOfExpiryNepali']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.nDate : '';
      this.overdraftFixedForm.get(['odFdFormArray', index, 'dateOfExpiryTrans']).patchValue(tempExpDate);
    }

    // translated by google api
    this.translatedFormGroup = this.formBuilder.group({
      nameOfHoldingBank: this.overdraftFixedForm.get(['odFdFormArray', index, 'nameOfHoldingBank']).value,
      // nameOfFDHolder: this.overdraftFixedForm.get('nameOfFDHolder').value,
      nameOfDepositors: this.overdraftFixedForm.get(['odFdFormArray', index, 'nameOfDepositors']).value,
      nameOfFacility: this.overdraftFixedForm.get(['odFdFormArray', index, 'nameOfFacility']).value,
    });

    this.translatedValue =  await this.translateService.translateForm(this.translatedFormGroup);

    this.overdraftFixedForm.get(['odFdFormArray', index, 'nameOfHoldingBankTrans']).patchValue(this.translatedValue.nameOfHoldingBank);
    // this.overdraftFixedForm.get().patchValue(this.translatedValue.nameOfFDHolder);
    this.overdraftFixedForm.get(['odFdFormArray', index, 'nameOfDepositorsTrans']).patchValue(this.translatedValue.nameOfDepositors);
    this.overdraftFixedForm.get(['odFdFormArray', index, 'nameOfFacilityTrans']).patchValue(this.translatedValue.nameOfFacility);

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
    this.overdraftFixedForm.get(['odFdFormArray', index, 'subLoanOptionCT']).patchValue(
        this.overdraftFixedForm.get(['odFdFormArray', index, 'subLoanOptionTrans']).value
    );
    this.overdraftFixedForm.get(['odFdFormArray', index, 'letterOfSetOffCT']).patchValue(
        this.overdraftFixedForm.get(['odFdFormArray', index, 'letterOfSetOffTrans']).value
    );
    this.overdraftFixedForm.get(['odFdFormArray', index, 'interestRateTypeCT']).patchValue(
        this.overdraftFixedForm.get(['odFdFormArray', index, 'interestRateTypeTrans']).value
    );
    this.overdraftFixedForm.get(['odFdFormArray', index, 'checkAdditionalPremiumRateCT']).patchValue(
        this.overdraftFixedForm.get(['odFdFormArray', index, 'checkAdditionalPremiumRateTrans']).value
    );
    this.overdraftFixedForm.get(['odFdFormArray', index, 'holdingBankCT']).patchValue(
        this.overdraftFixedForm.get(['odFdFormArray', index, 'holdingBankTrans']).value
    );
    this.overdraftFixedForm.get(['odFdFormArray', index, 'accountTypeCT']).patchValue(
        this.overdraftFixedForm.get(['odFdFormArray', index, 'accountTypeTrans']).value
    );
    this.overdraftFixedForm.get(['odFdFormArray', index, 'loanAmountCT']).patchValue(
        this.overdraftFixedForm.get(['odFdFormArray', index, 'loanAmountTrans']).value
    );
    this.overdraftFixedForm.get(['odFdFormArray', index, 'loanAmountWordsCT']).patchValue(
        this.overdraftFixedForm.get(['odFdFormArray', index, 'loanAmountWordsTrans']).value
    );
    this.overdraftFixedForm.get(['odFdFormArray', index, 'FdAmountInFigureCT']).patchValue(
        this.overdraftFixedForm.get(['odFdFormArray', index, 'FdAmountInFigureTrans']).value
    );
    this.overdraftFixedForm.get(['odFdFormArray', index, 'amountInFigureCT']).patchValue(
        this.overdraftFixedForm.get(['odFdFormArray', index, 'amountInFigureTrans']).value
    );
    this.overdraftFixedForm.get(['odFdFormArray', index, 'accountNumberCT']).patchValue(
        this.overdraftFixedForm.get(['odFdFormArray', index, 'accountNumberTrans']).value
    );
    this.overdraftFixedForm.get(['odFdFormArray', index, 'drawingPowerCT']).patchValue(
        this.overdraftFixedForm.get(['odFdFormArray', index, 'drawingPowerTrans']).value
    );
    this.overdraftFixedForm.get(['odFdFormArray', index, 'totalInterestRateCT']).patchValue(
        this.overdraftFixedForm.get(['odFdFormArray', index, 'totalInterestRateTrans']).value
    );
    this.overdraftFixedForm.get(['odFdFormArray', index, 'additionalPremiumRateCT']).patchValue(
        this.overdraftFixedForm.get(['odFdFormArray', index, 'additionalPremiumRateTrans']).value
    );
    this.overdraftFixedForm.get(['odFdFormArray', index, 'baseRateCT']).patchValue(
        this.overdraftFixedForm.get(['odFdFormArray', index, 'baseRateTrans']).value
    );
    this.overdraftFixedForm.get(['odFdFormArray', index, 'premiumRateCT']).patchValue(
        this.overdraftFixedForm.get(['odFdFormArray', index, 'premiumRateTrans']).value
    );
    this.overdraftFixedForm.get(['odFdFormArray', index, 'interestRateCT']).patchValue(
        this.overdraftFixedForm.get(['odFdFormArray', index, 'interestRateTrans']).value
    );
    this.overdraftFixedForm.get(['odFdFormArray', index, 'dateOfExpiryTypeCT']).patchValue(
        this.overdraftFixedForm.get(['odFdFormArray', index, 'dateOfExpiryTypeTrans']).value
    );
    this.overdraftFixedForm.get(['odFdFormArray', index, 'dateOfExpiryCT']).patchValue(
        this.overdraftFixedForm.get(['odFdFormArray', index, 'dateOfExpiryTrans']).value
    );
    this.overdraftFixedForm.get(['odFdFormArray', index, 'nameOfHoldingBankCT']).patchValue(
        this.translatedValue.nameOfHoldingBank
    );
    // this.overdraftFixedForm.get('nameOfFDHolderCT').patchValue(
    //     this.translatedValue.nameOfFDHolder
    // );
    this.overdraftFixedForm.get(['odFdFormArray', index, 'nameOfDepositorsCT']).patchValue(
        this.translatedValue.nameOfDepositors
    );
    this.overdraftFixedForm.get(['odFdFormArray', index, 'nameOfFacilityCT']).patchValue(
        this.translatedValue.nameOfFacility
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

  addDepositorDetails(i) {
    (this.overdraftFixedForm.get(['odFdFormArray', i, 'depositorDetails']) as FormArray).push(
        this.formBuilder.group({
          nameOfDepositors: [undefined],
          nameOfDepositorsTrans: [undefined],
          nameOfDepositorsCT: [undefined],
        })
    );
  }

  removeDepositorDetails(i, index) {
    (this.overdraftFixedForm.get(['odFdFormArray', i, 'depositorDetails']) as FormArray).removeAt(index);
  }

  addFDHolderDetails(i) {
    (this.overdraftFixedForm.get(['odFdFormArray', i, 'fdHolderDetails']) as FormArray).push(
        this.formBuilder.group({
          nameOfFDHolder: [undefined],
          nameOfFDHolderTrans: [undefined],
          nameOfFDHolderCT: [undefined],
        })
    );
  }

  removeFDHolderDetails(i, index) {
    (this.overdraftFixedForm.get(['odFdFormArray', i, 'fdHolderDetails']) as FormArray).removeAt(index);
  }

  async onChangeTranslateSecurity(arrName, source, index, target, i, mainArray) {
    this.arrayForm = this.formBuilder.group({
        formValue: this.overdraftFixedForm.get([String(mainArray), i, String(arrName), index, String(source)]).value
    });
    const sourceResponse = await this.translatedService.translateForm(this.arrayForm);
    this.overdraftFixedForm.get([String(mainArray), i, String(arrName), index, String(target)]).patchValue(sourceResponse.formValue);
    this.overdraftFixedForm.get([String(mainArray), i, String(arrName), index, String(source + 'CT')]).patchValue(sourceResponse.formValue);
}

}
