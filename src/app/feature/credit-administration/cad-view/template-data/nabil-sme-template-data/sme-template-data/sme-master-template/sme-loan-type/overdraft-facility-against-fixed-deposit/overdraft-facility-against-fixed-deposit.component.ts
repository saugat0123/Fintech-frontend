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
  @Input() isEdit;
  @Input() cadDocAssignedLoan;
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
  filteredListLien: any = [];
  filteredListStl: any = [];
  filteredListStlLien: any = [];
  filteredListDL: any = [];
  filteredListDlLien: any = [];
  initialData;
  filteredLoanIdList: any = [];
  filteredLoanLienIdList: any = [];
  filteredLoanStlIdList: any = [];
  filteredLoanStlLienIdList: any = [];
  filteredLoanDLIdList: any = [];
  filteredLoanDlLienIdList: any = [];

  constructor(private formBuilder: FormBuilder,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepDatePipe: EngNepDatePipe,
              private datePipe: DatePipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatterPipe: CurrencyFormatterPipe,
              private translateService: SbTranslateService,
              private translatedService: SbTranslateService,
              private engToNepWord: NepaliCurrencyWordPipe) { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerApprovedDoc) && this.offerDocumentList.length > 0) {
      this.initialData = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].initialInformation);
    }
    this.overdraftLoanNumber = this.customerApprovedDoc.assignedLoan.filter(val =>
        val.loan.name === 'OVERDRAFT FACILITY FIXED DEPOSIT');
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
        this.overdraftFixedForm.patchValue(this.initialInformation.overdraftFixedForm);
      }
      Object.keys(this.initialInformation.overdraftFixedForm).forEach((val) => {
        this.patchDate(val);
      });
    }
    if (!ObjectUtil.isEmpty(this.filteredList)) {
      this.loanAmountPatch(this.filteredList, 'odFdFormArray');
    }
    if (!ObjectUtil.isEmpty(this.filteredListLien)) {
      this.loanAmountPatch(this.filteredListLien, 'overdraftLienOnDepositFormArray');
    }
    if (!ObjectUtil.isEmpty(this.filteredListStl)) {
      this.loanAmountPatch(this.filteredListStl, 'stlAgainstFixedDepositFormArray');
    }
    if (!ObjectUtil.isEmpty(this.filteredListStlLien)) {
      this.loanAmountPatch(this.filteredListStlLien, 'stlLienOnDepositFormArray');
    }
    if (!ObjectUtil.isEmpty(this.filteredListDL)) {
      this.loanAmountPatch(this.filteredListDL, 'dlAgainstFixedDepositFormArray');
    }
    if (!ObjectUtil.isEmpty(this.filteredListDlLien)) {
      this.loanAmountPatch(this.filteredListDlLien, 'dlAgainstLienOnDepositFormArray');
    }
    this.setLoanId();
  }
  loanAmountPatch(array, formArray) {
    for (let val = 0; val < array.length; val++) {
      const loanamountWords = this.engToNepWord.transform(array[val].loanAmount);
      this.overdraftFixedForm.get([formArray, val, 'loanAmount']).patchValue(
          array[val] ? array[val].loanAmount : '');
      this.overdraftFixedForm.get([formArray, val, 'loanAmountWords']).patchValue(
          loanamountWords ? loanamountWords : '');
    }
  }
  filterLoanDetails(loanDetails) {
    this.filteredList = loanDetails.filter(data => data.name === this.loanNameConstant.OVERDRAFT_FACILITY_FIXED_DEPOSIT);
    this.filteredListLien = loanDetails.filter(data => data.name === this.loanNameConstant.OVERDRAFT_FACILITY_LIEN_ON_DEPOSIT_ACCOUNT);
    this.filteredListStl = loanDetails.filter(data => data.name === this.loanNameConstant.STL_AGAINST_FIXED_DEPOSIT);
    this.filteredListStlLien = loanDetails.filter(data => data.name === this.loanNameConstant.STL_LIEN_ON_DEPOSIT_ACCOUNT);
    this.filteredListDL = loanDetails.filter(data => data.name === this.loanNameConstant.DL_AGAINST_FIXED_DEPOSIT);
    this.filteredListDlLien = loanDetails.filter(data => data.name === this.loanNameConstant.DL_LIEN_ON_DEPOSIT_ACCOUNT);
    this.filteredList.forEach((value, i) => {
      this.setTermLoanForm();
      if (this.isEdit) {
        this.setFixedDepositors('odFdFormArray', i, this.initialData.overdraftFixedForm.odFdFormArray[i].fdHolderDetails);
      }
    });
    this.filteredListLien.forEach((value, i) => {
      this.setOverdraftLienLoanForm();
      if (this.isEdit) {
        this.setDepositors('overdraftLienOnDepositFormArray', i, this.initialData.overdraftFixedForm.overdraftLienOnDepositFormArray[i].depositorDetails);
      }
    });
    this.filteredListStl.forEach((value, i) => {
      this.setStlLoanForm();
      if (this.isEdit) {
        this.setFixedDepositors('stlAgainstFixedDepositFormArray', i, this.initialData.overdraftFixedForm.stlAgainstFixedDepositFormArray[i].fdHolderDetails);
      }
    });
    this.filteredListStlLien.forEach((value, i) => {
      this.setStlLienLoanForm();
      if (this.isEdit) {
        this.setDepositors('stlLienOnDepositFormArray', i, this.initialData.overdraftFixedForm.stlLienOnDepositFormArray[i].depositorDetails);
      }
    });
    this.filteredListDL.forEach((value, i) => {
      this.setDlLoanForm();
      if (this.isEdit) {
        this.setFixedDepositors('dlAgainstFixedDepositFormArray', i, this.initialData.overdraftFixedForm.dlAgainstFixedDepositFormArray[i].fdHolderDetails);
      }
    });
    this.filteredListDlLien.forEach((value, i) => {
      this.setDlLienLoanForm();
      if (this.isEdit) {
        this.setDepositors('dlAgainstLienOnDepositFormArray', i, this.initialData.overdraftFixedForm.dlAgainstLienOnDepositFormArray[i].depositorDetails);
      }
    });
  }
  setFixedDepositors(patchingArray, ind, nestArray) {
    if (nestArray.length > 0) {
      for (let a = 0; a < nestArray.length; a++) {
        (this.overdraftFixedForm.get([patchingArray, ind, 'fdHolderDetails']) as FormArray).push(
            this.formBuilder.group({
              nameOfFDHolder: [undefined],
              nameOfFDHolderTrans: [undefined],
              nameOfFDHolderCT: [undefined],
            })
        );
      }
    }
  }
  setDepositors(patchingArray, ind, nestArray) {
    if (nestArray.length > 0) {
      for (let a = 0; a < nestArray.length; a++) {
        (this.overdraftFixedForm.get([patchingArray, ind, 'depositorDetails']) as FormArray).push(
            this.formBuilder.group({
              nameOfDepositors: [undefined],
              nameOfDepositorsTrans: [undefined],
              nameOfDepositorsCT: [undefined],
            })
        );
      }
    }
  }
  patchDate(mainArray) {
    for (let val = 0; val < mainArray.length; val++) {
      const dateOfExpiryType = mainArray[val].dateOfExpiryType;
      if (dateOfExpiryType === 'AD') {
        const dateOfExpiry = mainArray[val].dateOfExpiry;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.overdraftFixedForm.get([mainArray, val, 'dateOfExpiry']).patchValue(new Date(dateOfExpiry));
        }
      } else if (dateOfExpiryType === 'BS') {
        const dateOfExpiry = mainArray[val].dateOfExpiryNepali;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.overdraftFixedForm.get([mainArray, val, 'dateOfExpiryNepali']).patchValue(dateOfExpiry);
        }
      }
    }
  }
  buildForm() {
    this.overdraftFixedForm = this.formBuilder.group({
      odFdFormArray: this.formBuilder.array([]),
      overdraftLienOnDepositFormArray: this.formBuilder.array([]),
      stlAgainstFixedDepositFormArray: this.formBuilder.array([]),
      stlLienOnDepositFormArray: this.formBuilder.array([]),
      dlAgainstFixedDepositFormArray: this.formBuilder.array([]),
      dlAgainstLienOnDepositFormArray: this.formBuilder.array([]),
    });
  }
  buildLoanForm() {
    return this.formBuilder.group({
      // For Form Data
      additionalPremiumRateReq: [undefined],
      subLoanOption: [undefined],
      letterOfSetOff: [undefined],
      interestRateType: [undefined],
      subsidyOrAgricultureLoan: [undefined],
      checkAdditionalPremiumRate: [false],
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
      checkAdditionalPremiumRateTrans: [false],
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
      checkAdditionalPremiumRateCT: [false],
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
      loanId: [undefined],
    });
  }
  setTermLoanForm() {
    (this.overdraftFixedForm.get('odFdFormArray') as FormArray).push(this.buildLoanForm());
  }
  setOverdraftLienLoanForm() {
    (this.overdraftFixedForm.get('overdraftLienOnDepositFormArray') as FormArray).push(this.buildLoanForm());
  }
  setStlLoanForm() {
    (this.overdraftFixedForm.get('stlAgainstFixedDepositFormArray') as FormArray).push(this.buildLoanForm());
  }
  setStlLienLoanForm() {
    (this.overdraftFixedForm.get('stlLienOnDepositFormArray') as FormArray).push(this.buildLoanForm());
  }
  setDlLoanForm() {
    (this.overdraftFixedForm.get('dlAgainstFixedDepositFormArray') as FormArray).push(this.buildLoanForm());
  }
  setDlLienLoanForm() {
    (this.overdraftFixedForm.get('dlAgainstLienOnDepositFormArray') as FormArray).push(this.buildLoanForm());
  }

  subLoanOption(data, i, mainArray) {
    const tempData = !ObjectUtil.isEmpty(data) ? data : '';
    this.isFixedDeposit = tempData === 'AGAINST_FIXED_DEPOSIT';
    this.isDepositAccount = tempData === 'AGAINST_DEPOSIT_ACCOUNT';
  }

  letterOfSetOff(data) {
    const tempData = !ObjectUtil.isEmpty(data) ? data : '';
    this.isNew = tempData === 'NEW';
    this.isExisting = tempData === 'EXISTING';
  }

  changeInterestRateType(data, mainArray) {
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
  calInterestRate(i, mainArray) {
    const baseRate = this.overdraftFixedForm.get([mainArray, i, 'baseRate']).value;
    const premiumRate = this.overdraftFixedForm.get([mainArray, i, 'premiumRate']).value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.overdraftFixedForm.get([mainArray, i, 'interestRate']).patchValue(sum.toFixed(2));
}

  public checkDateOfExpiry(value): void {
    this.ADExpiry = value === 'AD';
    this.BSExpiry = value === 'BS';
  }

  async translateAndSetVal(index, mainArray) {

    /* SET TRANS VALUE FOR CONDITIONS */
    const tempLoanOptions = this.overdraftFixedForm.get([mainArray, index, 'subLoanOption']).value;
    if (!ObjectUtil.isEmpty(tempLoanOptions)) {
      this.overdraftFixedForm.get([mainArray, index, 'subLoanOptionTrans']).patchValue(tempLoanOptions);
    }

    const templetterOfSetOff = this.overdraftFixedForm.get([mainArray, index, 'letterOfSetOff']).value;
    if (!ObjectUtil.isEmpty(templetterOfSetOff)) {
      this.overdraftFixedForm.get([mainArray, index, 'letterOfSetOffTrans']).patchValue(templetterOfSetOff);
    }

    const tempinterestRateType = this.overdraftFixedForm.get([mainArray, index, 'interestRateType']).value;
    if (!ObjectUtil.isEmpty(tempinterestRateType)) {
      this.overdraftFixedForm.get([mainArray, index, 'interestRateTypeTrans']).patchValue(tempinterestRateType);
    }
    const tempComplementary = this.overdraftFixedForm.get([mainArray, index, 'additionalPremiumRate']).value;
    if (!ObjectUtil.isEmpty(tempComplementary)) {
      this.overdraftFixedForm.get([mainArray, index, 'additionalPremiumRateTrans']).patchValue(tempComplementary);
    }
    const tempadditionalPremiumRate = this.overdraftFixedForm.get([mainArray, index, 'checkAdditionalPremiumRate']).value;
    if (!ObjectUtil.isEmpty(tempadditionalPremiumRate)) {
      this.overdraftFixedForm.get([mainArray, index, 'checkAdditionalPremiumRateTrans']).patchValue(tempadditionalPremiumRate);
    }

    const tempholdingBank = this.overdraftFixedForm.get([mainArray, index, 'holdingBank']).value;
    if (!ObjectUtil.isEmpty(tempholdingBank)) {
      this.overdraftFixedForm.get([mainArray, index, 'holdingBankTrans']).patchValue(tempholdingBank);
    }

    const tempaccountType = this.overdraftFixedForm.get([mainArray, index, 'accountType']).value;
    if (!ObjectUtil.isEmpty(tempaccountType)) {
      this.overdraftFixedForm.get([mainArray, index, 'accountTypeTrans']).patchValue(tempaccountType);
    }

    /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
    const tempLoanAmount = this.overdraftFixedForm.get([mainArray, index, 'loanAmount']).value;
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.overdraftFixedForm.get([mainArray, index, 'loanAmountTrans']).patchValue(convertNumber);

    this.overdraftFixedForm.get([mainArray, index, 'loanAmountWordsTrans']).patchValue(
        this.overdraftFixedForm.get([mainArray, index, 'loanAmountWords']).value
    );

    const tempFDAmount = this.overdraftFixedForm.get([mainArray, index, 'FdAmountInFigure']).value;
    const convertNumber1 = !ObjectUtil.isEmpty(tempFDAmount) ?
        this.convertNumbersToNepali(tempFDAmount, true) : '';
    this.overdraftFixedForm.get([mainArray, index, 'FdAmountInFigureTrans']).patchValue(convertNumber1);

    const tempAmount = this.overdraftFixedForm.get([mainArray, index, 'amountInFigure']).value;
    const convertNumber2 = !ObjectUtil.isEmpty(tempAmount) ?
        this.convertNumbersToNepali(tempAmount, true) : '';
    this.overdraftFixedForm.get([mainArray, index, 'amountInFigureTrans']).patchValue(convertNumber2);

    const convertaccountNumber = this.convertNumbersToNepali(this.overdraftFixedForm.get([mainArray, index, 'accountNumber']).value, false);
    this.overdraftFixedForm.get([mainArray, index, 'accountNumberTrans']).patchValue(convertaccountNumber);
    const convertdrawingPower = this.convertNumbersToNepali(this.overdraftFixedForm.get([mainArray, index, 'drawingPower']).value, false);
    this.overdraftFixedForm.get([mainArray, index, 'drawingPowerTrans']).patchValue(convertdrawingPower);
    const converttotalInterestRate = this.convertNumbersToNepali(this.overdraftFixedForm.get([mainArray, index, 'totalInterestRate']).value, false);
    this.overdraftFixedForm.get([mainArray, index, 'totalInterestRateTrans']).patchValue(converttotalInterestRate);
    const convertadditionalPremiumRate = this.convertNumbersToNepali(this.overdraftFixedForm.get([mainArray, index, 'additionalPremiumRate']).value, false);
    this.overdraftFixedForm.get([mainArray, index, 'additionalPremiumRateTrans']).patchValue(convertadditionalPremiumRate);
    // const convertbaseRate = this.convertNumbersToNepali(this.overdraftFixedForm.get([mainArray, index, 'baseRate']).value ? this.overdraftFixedForm.get([mainArray, index, 'baseRate']).value.toFixed(2) : '', false);
    // this.overdraftFixedForm.get([mainArray, index, 'baseRateTrans']).patchValue(convertbaseRate);
    // const convertpremiumRate = this.convertNumbersToNepali(this.overdraftFixedForm.get([mainArray, index, 'premiumRate']).value ? this.overdraftFixedForm.get([mainArray, index, 'premiumRate']).value.toFixed(2) : '', false);
    // this.overdraftFixedForm.get([mainArray, index, 'premiumRateTrans']).patchValue(convertpremiumRate);
    // const convertinterestRate = this.convertNumbersToNepali(this.overdraftFixedForm.get([mainArray, index, 'interestRate']).value, false);
    // this.overdraftFixedForm.get([mainArray, index, 'interestRateTrans']).patchValue(convertinterestRate);
    if (this.overdraftFixedForm.get([mainArray, index, 'interestRateType']).value === 'BASE_RATE_FINANCING'){
      const convertbaseRate = this.convertNumbersToNepali(this.overdraftFixedForm.get([mainArray, index, 'baseRate']).value ? this.overdraftFixedForm.get([mainArray, index, 'baseRate']).value.toFixed(2) : 0, false);
      this.overdraftFixedForm.get([mainArray, index, 'baseRateTrans']).patchValue(convertbaseRate);
      const convertpremiumRate = this.convertNumbersToNepali(this.overdraftFixedForm.get([mainArray, index, 'premiumRate']).value ? this.overdraftFixedForm.get([mainArray, index, 'premiumRate']).value.toFixed(2) : 0, false);
      this.overdraftFixedForm.get([mainArray, index, 'premiumRateTrans']).patchValue(convertpremiumRate);
      const convertinterestRate = this.convertNumbersToNepali(this.overdraftFixedForm.get([mainArray, index, 'interestRate']).value, false);
      this.overdraftFixedForm.get([mainArray, index, 'interestRateTrans']).patchValue(convertinterestRate);
    }
    /* Converting value for date */
    this.overdraftFixedForm.get([mainArray, index, 'dateOfExpiryTypeTrans']).patchValue(
        this.overdraftFixedForm.get([mainArray, index, 'dateOfExpiryType']).value
    );
    const tempDateOfExpType = this.overdraftFixedForm.get([mainArray, index, 'dateOfExpiryType']).value;
    let tempExpDate;
    if (tempDateOfExpType === 'AD') {
      const tempEngExpDate = this.overdraftFixedForm.get([mainArray, index, 'dateOfExpiry']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ? this.datePipe.transform(tempEngExpDate) : '';
      const finalExpDate = this.transformEnglishDate(tempExpDate);
      this.overdraftFixedForm.get([mainArray, index, 'dateOfExpiryTrans']).patchValue(finalExpDate);
    } else {
      const tempDateOfExpNep = this.overdraftFixedForm.get([mainArray, index, 'dateOfExpiryNepali']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.nDate : '';
      this.overdraftFixedForm.get([mainArray, index, 'dateOfExpiryTrans']).patchValue(tempExpDate);
    }

    // translated by google api
    this.translatedFormGroup = this.formBuilder.group({
      nameOfHoldingBank: this.overdraftFixedForm.get([mainArray, index, 'nameOfHoldingBank']).value,
      // nameOfFDHolder: this.overdraftFixedForm.get('nameOfFDHolder').value,
      nameOfDepositors: this.overdraftFixedForm.get([mainArray, index, 'nameOfDepositors']).value,
      nameOfFacility: this.overdraftFixedForm.get([mainArray, index, 'nameOfFacility']).value,
    });

    this.translatedValue =  await this.translateService.translateForm(this.translatedFormGroup);

    this.overdraftFixedForm.get([mainArray, index, 'nameOfHoldingBankTrans']).patchValue(this.translatedValue.nameOfHoldingBank);
    // this.overdraftFixedForm.get().patchValue(this.translatedValue.nameOfFDHolder);
    this.overdraftFixedForm.get([mainArray, index, 'nameOfDepositorsTrans']).patchValue(this.translatedValue.nameOfDepositors);
    this.overdraftFixedForm.get([mainArray, index, 'nameOfFacilityTrans']).patchValue(this.translatedValue.nameOfFacility);

    this.setCTValue(index, mainArray);
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

  setCTValue(index, mainArray) {
    this.overdraftFixedForm.get([mainArray, index, 'subLoanOptionCT']).patchValue(
        this.overdraftFixedForm.get([mainArray, index, 'subLoanOptionTrans']).value
    );
    this.overdraftFixedForm.get([mainArray, index, 'letterOfSetOffCT']).patchValue(
        this.overdraftFixedForm.get([mainArray, index, 'letterOfSetOffTrans']).value
    );
    this.overdraftFixedForm.get([mainArray, index, 'interestRateTypeCT']).patchValue(
        this.overdraftFixedForm.get([mainArray, index, 'interestRateTypeTrans']).value
    );
    this.overdraftFixedForm.get([mainArray, index, 'checkAdditionalPremiumRateCT']).patchValue(
        this.overdraftFixedForm.get([mainArray, index, 'checkAdditionalPremiumRateTrans']).value
    );
    this.overdraftFixedForm.get([mainArray, index, 'holdingBankCT']).patchValue(
        this.overdraftFixedForm.get([mainArray, index, 'holdingBankTrans']).value
    );
    this.overdraftFixedForm.get([mainArray, index, 'accountTypeCT']).patchValue(
        this.overdraftFixedForm.get([mainArray, index, 'accountTypeTrans']).value
    );
    this.overdraftFixedForm.get([mainArray, index, 'loanAmountCT']).patchValue(
        this.overdraftFixedForm.get([mainArray, index, 'loanAmountTrans']).value
    );
    this.overdraftFixedForm.get([mainArray, index, 'loanAmountWordsCT']).patchValue(
        this.overdraftFixedForm.get([mainArray, index, 'loanAmountWordsTrans']).value
    );
    this.overdraftFixedForm.get([mainArray, index, 'FdAmountInFigureCT']).patchValue(
        this.overdraftFixedForm.get([mainArray, index, 'FdAmountInFigureTrans']).value
    );
    this.overdraftFixedForm.get([mainArray, index, 'amountInFigureCT']).patchValue(
        this.overdraftFixedForm.get([mainArray, index, 'amountInFigureTrans']).value
    );
    this.overdraftFixedForm.get([mainArray, index, 'accountNumberCT']).patchValue(
        this.overdraftFixedForm.get([mainArray, index, 'accountNumberTrans']).value
    );
    this.overdraftFixedForm.get([mainArray, index, 'drawingPowerCT']).patchValue(
        this.overdraftFixedForm.get([mainArray, index, 'drawingPowerTrans']).value
    );
    this.overdraftFixedForm.get([mainArray, index, 'totalInterestRateCT']).patchValue(
        this.overdraftFixedForm.get([mainArray, index, 'totalInterestRateTrans']).value
    );
    this.overdraftFixedForm.get([mainArray, index, 'additionalPremiumRateCT']).patchValue(
        this.overdraftFixedForm.get([mainArray, index, 'additionalPremiumRateTrans']).value
    );
    this.overdraftFixedForm.get([mainArray, index, 'baseRateCT']).patchValue(
        this.overdraftFixedForm.get([mainArray, index, 'baseRateTrans']).value
    );
    this.overdraftFixedForm.get([mainArray, index, 'premiumRateCT']).patchValue(
        this.overdraftFixedForm.get([mainArray, index, 'premiumRateTrans']).value
    );
    this.overdraftFixedForm.get([mainArray, index, 'interestRateCT']).patchValue(
        this.overdraftFixedForm.get([mainArray, index, 'interestRateTrans']).value
    );
    this.overdraftFixedForm.get([mainArray, index, 'dateOfExpiryTypeCT']).patchValue(
        this.overdraftFixedForm.get([mainArray, index, 'dateOfExpiryTypeTrans']).value
    );
    this.overdraftFixedForm.get([mainArray, index, 'dateOfExpiryCT']).patchValue(
        this.overdraftFixedForm.get([mainArray, index, 'dateOfExpiryTrans']).value
    );
    this.overdraftFixedForm.get([mainArray, index, 'nameOfHoldingBankCT']).patchValue(
        this.translatedValue.nameOfHoldingBank
    );
    // this.overdraftFixedForm.get('nameOfFDHolderCT').patchValue(
    //     this.translatedValue.nameOfFDHolder
    // );
    this.overdraftFixedForm.get([mainArray, index, 'nameOfDepositorsCT']).patchValue(
        this.translatedValue.nameOfDepositors
    );
    this.overdraftFixedForm.get([mainArray, index, 'nameOfFacilityCT']).patchValue(
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

  addDepositorDetails(i, mainArray) {
    (this.overdraftFixedForm.get([mainArray, i, 'depositorDetails']) as FormArray).push(
        this.formBuilder.group({
          nameOfDepositors: [undefined],
          nameOfDepositorsTrans: [undefined],
          nameOfDepositorsCT: [undefined],
        })
    );
  }

  removeDepositorDetails(i, index, mainArray) {
    (this.overdraftFixedForm.get([mainArray, i, 'depositorDetails']) as FormArray).removeAt(index);
  }

  addFDHolderDetails(i, mainArray) {
    (this.overdraftFixedForm.get([mainArray, i, 'fdHolderDetails']) as FormArray).push(
        this.formBuilder.group({
          nameOfFDHolder: [undefined],
          nameOfFDHolderTrans: [undefined],
          nameOfFDHolderCT: [undefined],
        })
    );
  }

  removeFDHolderDetails(i, index, mainArray) {
    (this.overdraftFixedForm.get([mainArray, i, 'fdHolderDetails']) as FormArray).removeAt(index);
  }

  async onChangeTranslateSecurity(arrName, source, index, target, i, mainArray) {
    this.arrayForm = this.formBuilder.group({
        formValue: this.overdraftFixedForm.get([String(mainArray), i, String(arrName), index, String(source)]).value
    });
    const sourceResponse = await this.translatedService.translateForm(this.arrayForm);
    this.overdraftFixedForm.get([String(mainArray), i, String(arrName), index, String(target)]).patchValue(sourceResponse.formValue);
    this.overdraftFixedForm.get([String(mainArray), i, String(arrName), index, String(source + 'CT')]).patchValue(sourceResponse.formValue);
  }
  setLoanId() {
    this.filteredLoanIdList = this.cadDocAssignedLoan.filter(data =>
        data.loan.name === this.loanNameConstant.OVERDRAFT_FACILITY_FIXED_DEPOSIT);
    this.filteredLoanLienIdList = this.cadDocAssignedLoan.filter(data =>
        data.loan.name === this.loanNameConstant.OVERDRAFT_FACILITY_LIEN_ON_DEPOSIT_ACCOUNT);
    this.filteredLoanStlIdList = this.cadDocAssignedLoan.filter(data =>
        data.loan.name === this.loanNameConstant.STL_AGAINST_FIXED_DEPOSIT);
    this.filteredLoanStlLienIdList = this.cadDocAssignedLoan.filter(data =>
        data.loan.name === this.loanNameConstant.STL_LIEN_ON_DEPOSIT_ACCOUNT);
    this.filteredLoanDLIdList = this.cadDocAssignedLoan.filter(data =>
        data.loan.name === this.loanNameConstant.DL_AGAINST_FIXED_DEPOSIT);
    this.filteredLoanDlLienIdList = this.cadDocAssignedLoan.filter(data =>
        data.loan.name === this.loanNameConstant.DL_LIEN_ON_DEPOSIT_ACCOUNT);
    if (!ObjectUtil.isEmpty(this.filteredList)) {
      this.filteredList.forEach((val, i) => {
        this.overdraftFixedForm.get(['odFdFormArray', i, 'loanId']).patchValue(
            this.filteredLoanIdList[i].proposal.id);
      });
    }
    if (!ObjectUtil.isEmpty(this.filteredListLien)) {
      this.filteredListLien.forEach((val, i) => {
        this.overdraftFixedForm.get(['overdraftLienOnDepositFormArray', i, 'loanId']).patchValue(
            this.filteredLoanLienIdList[i].proposal.id);
      });
    }
    if (!ObjectUtil.isEmpty(this.filteredListStl)) {
      this.filteredListStl.forEach((val, i) => {
        this.overdraftFixedForm.get(['stlAgainstFixedDepositFormArray', i, 'loanId']).patchValue(
            this.filteredLoanStlIdList[i].proposal.id);
      });
    }
    if (!ObjectUtil.isEmpty(this.filteredListStlLien)) {
      this.filteredListStlLien.forEach((val, i) => {
        this.overdraftFixedForm.get(['stlLienOnDepositFormArray', i, 'loanId']).patchValue(
            this.filteredLoanStlLienIdList[i].proposal.id);
      });
    }
    if (!ObjectUtil.isEmpty(this.filteredListDL)) {
      this.filteredListDL.forEach((val, i) => {
        this.overdraftFixedForm.get(['dlAgainstFixedDepositFormArray', i, 'loanId']).patchValue(
            this.filteredLoanDLIdList[i].proposal.id);
      });
    }
    if (!ObjectUtil.isEmpty(this.filteredListDlLien)) {
      this.filteredListDlLien.forEach((val, i) => {
        this.overdraftFixedForm.get(['dlAgainstLienOnDepositFormArray', i, 'loanId']).patchValue(
            this.filteredLoanDlLienIdList[i].proposal.id);
      });
    }
  }

}
