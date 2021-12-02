import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from "../../../../../../../../../@core/utils/ObjectUtil";
import {FormBuilder, FormGroup} from "@angular/forms";
import {NepaliCurrencyWordPipe} from "../../../../../../../../../@core/pipe/nepali-currency-word.pipe";
import {EngNepDatePipe} from "nepali-patro";
import {DatePipe} from "@angular/common";
import {EngToNepaliNumberPipe} from "../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe";
import {CurrencyFormatterPipe} from "../../../../../../../../../@core/pipe/currency-formatter.pipe";
import {SbTranslateService} from "../../../../../../../../../@core/service/sbtranslate.service";

@Component({
  selector: 'app-overdraft-facility-against-fixed-deposit',
  templateUrl: './overdraft-facility-against-fixed-deposit.component.html',
  styleUrls: ['./overdraft-facility-against-fixed-deposit.component.scss']
})
export class OverdraftFacilityAgainstFixedDepositComponent implements OnInit {
  @Input() loanName;
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

  constructor(private formBuilder: FormBuilder,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepDatePipe: EngNepDatePipe,
              private datePipe: DatePipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatterPipe: CurrencyFormatterPipe,
              private translateService: SbTranslateService,) { }

  ngOnInit() {
   this.buildForm();
   if(!ObjectUtil.isEmpty(this.loanName)) {
     this.loanDetails = this.loanName;
   }
  }

  buildForm() {
    this.overdraftFixedForm = this.formBuilder.group({
      //For Form Data
      subLoanOption: [undefined],
      letterOfSetOff: [undefined],
      interestRateType: [undefined],
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

      //For Translated Data
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

      //For Corrected Data
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

    })
  }

  subLoanOption(data) {
    const tempData = !ObjectUtil.isEmpty(data) ? data : '';
    console.log('Tempdata:', tempData);
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

  checkadditionalPremiumRate(data) {
      this.isAdditionalPremiumRate = data;
      this.overdraftFixedForm.get('checkAdditionalPremiumRate').patchValue(this.isAdditionalPremiumRate);
  }

  public getNumAmountWord(numLabel, wordLabel): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.overdraftFixedForm.get(numLabel).value);
    this.overdraftFixedForm.get(wordLabel).patchValue(transformValue);
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

  calInterestRate() {
    const baseRate = this.overdraftFixedForm.get('baseRate').value;
    const premiumRate = this.overdraftFixedForm.get('premiumRate').value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.overdraftFixedForm.get('interestRate').patchValue(sum);
  }

  public checkDateOfExpiry(value): void {
    this.ADExpiry = value === 'AD';
    this.BSExpiry = value === 'BS';
  }

  async translateAndSetVal() {

    /* SET TRANS VALUE FOR CONDITIONS */
    const tempLoanOptions = this.overdraftFixedForm.get('subLoanOption').value;
    if (!ObjectUtil.isEmpty(tempLoanOptions)) {
      this.overdraftFixedForm.get('subLoanOptionTrans').patchValue(tempLoanOptions);
    }

    const templetterOfSetOff = this.overdraftFixedForm.get('letterOfSetOff').value;
    if (!ObjectUtil.isEmpty(templetterOfSetOff)) {
      this.overdraftFixedForm.get('letterOfSetOffTrans').patchValue(templetterOfSetOff);
    }

    const tempinterestRateType = this.overdraftFixedForm.get('interestRateType').value;
    if (!ObjectUtil.isEmpty(tempinterestRateType)) {
      this.overdraftFixedForm.get('interestRateTypeTrans').patchValue(tempinterestRateType);
    }

    const tempadditionalPremiumRate = this.overdraftFixedForm.get('checkAdditionalPremiumRate').value;
    if (!ObjectUtil.isEmpty(tempadditionalPremiumRate)) {
      this.overdraftFixedForm.get('checkAdditionalPremiumRateTrans').patchValue(tempadditionalPremiumRate);
    }

    const tempholdingBank = this.overdraftFixedForm.get('holdingBank').value;
    if (!ObjectUtil.isEmpty(tempholdingBank)) {
      this.overdraftFixedForm.get('holdingBankTrans').patchValue(tempholdingBank);
    }

    const tempaccountType = this.overdraftFixedForm.get('accountType').value;
    if (!ObjectUtil.isEmpty(tempaccountType)) {
      this.overdraftFixedForm.get('accountTypeTrans').patchValue(tempaccountType);
    }

    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    const tempLoanAmount = this.overdraftFixedForm.get('loanAmount').value;
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.overdraftFixedForm.get('loanAmountTrans').patchValue(convertNumber);

    this.overdraftFixedForm.get('loanAmountWordsTrans').patchValue(
        this.overdraftFixedForm.get('loanAmountWords').value
    );

    const tempFDAmount = this.overdraftFixedForm.get('FdAmountInFigure').value;
    const convertNumber1 = !ObjectUtil.isEmpty(tempFDAmount) ?
        this.convertNumbersToNepali(tempFDAmount, true) : '';
    this.overdraftFixedForm.get('FdAmountInFigureTrans').patchValue(convertNumber1);

    const tempAmount = this.overdraftFixedForm.get('amountInFigure').value;
    const convertNumber2 = !ObjectUtil.isEmpty(tempAmount) ?
        this.convertNumbersToNepali(tempAmount, true) : '';
    this.overdraftFixedForm.get('amountInFigureTrans').patchValue(convertNumber2);

    const convertaccountNumber = this.convertNumbersToNepali(this.overdraftFixedForm.get('accountNumber').value, false);
    this.overdraftFixedForm.get('accountNumberTrans').patchValue(convertaccountNumber);
    const convertdrawingPower = this.convertNumbersToNepali(this.overdraftFixedForm.get('drawingPower').value, false);
    this.overdraftFixedForm.get('drawingPowerTrans').patchValue(convertdrawingPower);
    const converttotalInterestRate = this.convertNumbersToNepali(this.overdraftFixedForm.get('totalInterestRate').value, false);
    this.overdraftFixedForm.get('totalInterestRateTrans').patchValue(converttotalInterestRate);
    const convertadditionalPremiumRate = this.convertNumbersToNepali(this.overdraftFixedForm.get('additionalPremiumRate').value, false);
    this.overdraftFixedForm.get('additionalPremiumRateTrans').patchValue(convertadditionalPremiumRate);
    const convertbaseRate = this.convertNumbersToNepali(this.overdraftFixedForm.get('baseRate').value, false);
    this.overdraftFixedForm.get('baseRateTrans').patchValue(convertbaseRate);
    const convertpremiumRate = this.convertNumbersToNepali(this.overdraftFixedForm.get('premiumRate').value, false);
    this.overdraftFixedForm.get('premiumRateTrans').patchValue(convertpremiumRate);
    const convertinterestRate = this.convertNumbersToNepali(this.overdraftFixedForm.get('interestRate').value, false);
    this.overdraftFixedForm.get('interestRateTrans').patchValue(convertinterestRate);

    /* Converting value for date */
    this.overdraftFixedForm.get('dateOfExpiryTypeTrans').patchValue(
        this.overdraftFixedForm.get('dateOfExpiryType').value
    );
    const tempDateOfExpType = this.overdraftFixedForm.get('dateOfExpiryType').value;
    let tempExpDate;
    if (tempDateOfExpType === 'AD') {
      const tempEngExpDate = this.overdraftFixedForm.get('dateOfExpiry').value;
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ?
          this.engToNepDatePipe.transform(this.datePipe.transform(tempEngExpDate), true) : '';
      this.overdraftFixedForm.get('dateOfExpiryTrans').patchValue(tempExpDate);
    } else {
      const tempDateOfExpNep = this.overdraftFixedForm.get('dateOfExpiryNepali').value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.nDate : '';
      this.overdraftFixedForm.get('dateOfExpiryTrans').patchValue(tempExpDate);
    }

    // translated by google api
    this.translatedFormGroup = this.formBuilder.group({
      nameOfHoldingBank: this.overdraftFixedForm.get('nameOfHoldingBank').value,
      nameOfFDHolder: this.overdraftFixedForm.get('nameOfFDHolder').value,
      nameOfDepositors: this.overdraftFixedForm.get('nameOfDepositors').value,
      nameOfFacility: this.overdraftFixedForm.get('nameOfFacility').value,
    });

    this.translatedValue =  await this.translateService.translateForm(this.translatedFormGroup);

    this.overdraftFixedForm.get('nameOfHoldingBankTrans').patchValue(this.translatedValue.nameOfHoldingBank);
    this.overdraftFixedForm.get('nameOfFDHolderTrans').patchValue(this.translatedValue.nameOfFDHolder);
    this.overdraftFixedForm.get('nameOfDepositorsTrans').patchValue(this.translatedValue.nameOfDepositors);
    this.overdraftFixedForm.get('nameOfFacilityTrans').patchValue(this.translatedValue.nameOfFacility);

    this.setCTValue();
  }

  setCTValue() {
    this.overdraftFixedForm.get('subLoanOptionCT').patchValue(
        this.overdraftFixedForm.get('subLoanOptionTrans').value
    );
    this.overdraftFixedForm.get('letterOfSetOffCT').patchValue(
        this.overdraftFixedForm.get('letterOfSetOffTrans').value
    );
    this.overdraftFixedForm.get('interestRateTypeCT').patchValue(
        this.overdraftFixedForm.get('interestRateTypeTrans').value
    );
    this.overdraftFixedForm.get('checkAdditionalPremiumRateCT').patchValue(
        this.overdraftFixedForm.get('checkAdditionalPremiumRateTrans').value
    );
    this.overdraftFixedForm.get('holdingBankCT').patchValue(
        this.overdraftFixedForm.get('holdingBankTrans').value
    );
    this.overdraftFixedForm.get('accountTypeCT').patchValue(
        this.overdraftFixedForm.get('accountTypeTrans').value
    );
    this.overdraftFixedForm.get('loanAmountCT').patchValue(
        this.overdraftFixedForm.get('loanAmountTrans').value
    );
    this.overdraftFixedForm.get('loanAmountWordsCT').patchValue(
        this.overdraftFixedForm.get('loanAmountWordsTrans').value
    );
    this.overdraftFixedForm.get('FdAmountInFigureCT').patchValue(
        this.overdraftFixedForm.get('FdAmountInFigureTrans').value
    );
    this.overdraftFixedForm.get('amountInFigureCT').patchValue(
        this.overdraftFixedForm.get('amountInFigureTrans').value
    );
    this.overdraftFixedForm.get('accountNumberCT').patchValue(
        this.overdraftFixedForm.get('accountNumberTrans').value
    );
    this.overdraftFixedForm.get('drawingPowerCT').patchValue(
        this.overdraftFixedForm.get('drawingPowerTrans').value
    );
    this.overdraftFixedForm.get('totalInterestRateCT').patchValue(
        this.overdraftFixedForm.get('totalInterestRateTrans').value
    );
    this.overdraftFixedForm.get('additionalPremiumRateCT').patchValue(
        this.overdraftFixedForm.get('additionalPremiumRateTrans').value
    );
    this.overdraftFixedForm.get('baseRateCT').patchValue(
        this.overdraftFixedForm.get('baseRateTrans').value
    );
    this.overdraftFixedForm.get('premiumRateCT').patchValue(
        this.overdraftFixedForm.get('premiumRateTrans').value
    );
    this.overdraftFixedForm.get('interestRateCT').patchValue(
        this.overdraftFixedForm.get('interestRateTrans').value
    );
    this.overdraftFixedForm.get('dateOfExpiryTypeCT').patchValue(
        this.overdraftFixedForm.get('dateOfExpiryTypeTrans').value
    );
    this.overdraftFixedForm.get('dateOfExpiryCT').patchValue(
        this.overdraftFixedForm.get('dateOfExpiryTrans').value
    );
    this.overdraftFixedForm.get('dateOfExpiryNepaliCT').patchValue(
        this.overdraftFixedForm.get('dateOfExpiryNepaliTrans').value
    );
    this.overdraftFixedForm.get('nameOfHoldingBankCT').patchValue(
        this.translatedValue.nameOfHoldingBank
    );
    this.overdraftFixedForm.get('nameOfFDHolderCT').patchValue(
        this.translatedValue.nameOfFDHolder
    );
    this.overdraftFixedForm.get('nameOfDepositorsCT').patchValue(
        this.translatedValue.nameOfDepositors
    );
    this.overdraftFixedForm.get('nameOfFacilityCT').patchValue(
        this.translatedValue.nameOfFacility
    );
    console.log('Form Data:', this.overdraftFixedForm);
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
