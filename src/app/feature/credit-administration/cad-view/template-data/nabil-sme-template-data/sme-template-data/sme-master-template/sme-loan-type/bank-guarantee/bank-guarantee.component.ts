import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngNepDatePipe} from 'nepali-patro';
import {DatePipe} from '@angular/common';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {SbTranslateService} from '../../../../../../../../../@core/service/sbtranslate.service';

@Component({
  selector: 'app-bank-guarantee',
  templateUrl: './bank-guarantee.component.html',
  styleUrls: ['./bank-guarantee.component.scss']
})
export class BankGuaranteeComponent implements OnInit {
  @Input() loanName;
  bankGuarantee: FormGroup;
  isComplimentryOtherLoan = false;
  loanDetails: any = [];
  translatedFormGroup: FormGroup;
  translatedValue: any;
  isCommission1Selected = false;
  isCommission2Selected = false;
  ADExpiry = false;
  BSExpiry = false;
  dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
  securityType = [
    {value: 'General Counter Guarantee'},
    {value: 'General Counter Guarantee and Hypothecation'},
    {value: 'Counter Guarantee of other bank'}
  ];
  guaranteeType = [
    {value: 'Cash Margin'},
    {value: 'APG/PFG/Bid Bond'},
  ];
  constructor(private formBuilder: FormBuilder,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepDatePipe: EngNepDatePipe,
              private datePipe: DatePipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatterPipe: CurrencyFormatterPipe,
              private translateService: SbTranslateService,
              private engToNepaliNumberPipe: EngToNepaliNumberPipe,
              ) { }

  ngOnInit() {
    this.buildForm();
    this.ADExpiry = true;
    if (!ObjectUtil.isEmpty(this.loanName)) {
      this.loanDetails = this.loanName;
    }
  }
  buildForm() {
    this.bankGuarantee = this.formBuilder.group({
      // FOR FORM DATA
      multiLoan: [undefined],
      securityType: [undefined],
      guaranteeType: [undefined],
      loanAmount: [undefined],
      loanAmountAmountWords: [undefined],
      nameOfHoldingBank: [undefined],
      marginInPercentage: [undefined],
      commissionInPercentageAPG: [undefined],
      commissionInPercentage2APG: [undefined],
      commissionInPercentageBidBond: [undefined],
      commissionInPercentage2BidBond: [undefined],
      commissionType: [undefined],
      serviceChargeInPercent: [undefined],
      minServiceChargeInFigure1: [undefined],
      dateOfExpiryType: ['AD'],
      dateOfExpiryNepali: [undefined],
      dateOfExpiry: [undefined],
      complementryOther: [undefined],
      // FOR TRANSLATED DATA
      multiLoanTrans: [undefined],
      loanAmountTrans: [undefined],
      loanAmountAmountWordsTrans: [undefined],
      nameOfHoldingBankTrans: [undefined],
      marginInPercentageTrans: [undefined],
      commissionInPercentageAPGTrans: [undefined],
      commissionInPercentage2APGTrans: [undefined],
      commissionInPercentageBidBondTrans: [undefined],
      commissionInPercentage2BidBondTrans: [undefined],
      commissionTypeTrans: [undefined],
      serviceChargeInPercentTrans: [undefined],
      minServiceChargeInFigure1Trans: [undefined],
      dateOfExpiryTypeTrans: [undefined],
      dateOfExpiryNepaliTrans: [undefined],
      dateOfExpiryTrans: [undefined],
      complementryOtherTrans: [undefined],
      // FOR CORRECTED DATA
      multiLoanCT: [undefined],
      loanAmountCT: [undefined],
      loanAmountAmountWordsCT: [undefined],
      nameOfHoldingBankCT: [undefined],
      marginInPercentageCT: [undefined],
      commissionInPercentageAPGCT: [undefined],
      commissionInPercentage2APGCT: [undefined],
      commissionInPercentageBidBondCT: [undefined],
      commissionInPercentage2BidBondCT: [undefined],
      commissionTypeCT: [undefined],
      serviceChargeInPercentCT: [undefined],
      minServiceChargeInFigure1CT: [undefined],
      dateOfExpiryTypeCT: [undefined],
      dateOfExpiryNepaliCT: [undefined],
      dateOfExpiryCT: [undefined],
      complementryOtherCT: [undefined],
    });
  }
  checkComplimetryOtherLoan(data) {
    this.isComplimentryOtherLoan = data;
    this.bankGuarantee.get('complementryOther').patchValue(this.isComplimentryOtherLoan);
  }
  public checkDateOfExpiry(value): void {
    this.ADExpiry = value === 'AD';
    this.BSExpiry = value === 'BS';
  }
  public getNumAmountWord(numLabel, wordLabel): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.bankGuarantee.get(numLabel).value);
    this.bankGuarantee.get(wordLabel).patchValue(transformValue);
  }
  setCommissionType(data) {
    const tempData = !ObjectUtil.isEmpty(data) ? data : '';
    this.isCommission1Selected = tempData === 'COMMISSION_TYPE_1';
    this.isCommission2Selected = tempData === 'COMMISSION_TYPE_2';
  }
  async translateAndSetVal() {
    const tempMultiLoan = this.bankGuarantee.get('multiLoanTrans').value;
    if (!ObjectUtil.isEmpty(tempMultiLoan)) {
      this.bankGuarantee.get('multiLoanTrans').patchValue('');
    }
    const tempComplemetry = this.bankGuarantee.get('complementryOther').value;
    if (!ObjectUtil.isEmpty(tempComplemetry)) {
      this.bankGuarantee.get('complementryOtherTrans').patchValue(tempComplemetry);
    }
    const tempCommissionType = this.bankGuarantee.get('commissionType').value;
    if (!ObjectUtil.isEmpty(tempCommissionType)) {
      this.bankGuarantee.get('commissionTypeTrans').patchValue(tempCommissionType);
    }
    /* SET TRANS VALUE FOR LOAN AMOUNT IN FIGURE AND LOAN AMOUNT IN WORDS */
    const tempLoanAmount = this.bankGuarantee.get('loanAmount').value;
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.bankGuarantee.get('loanAmountTrans').patchValue(convertNumber);

    this.bankGuarantee.get('loanAmountAmountWordsTrans').patchValue(
        this.bankGuarantee.get('loanAmountAmountWords').value
    );
    // translated by google api
    this.translatedFormGroup = this.formBuilder.group({
      nameOfHoldingBank: this.bankGuarantee.get('nameOfHoldingBank').value,
      // nameOfFDHolder: this.overdraftFixedForm.get('nameOfFDHolder').value,
      /*nameOfDepositors: this.overdraftFixedForm.get('nameOfDepositors').value,
      nameOfFacility: this.overdraftFixedForm.get('nameOfFacility').value,*/
    });
    this.translatedValue = await this.translateService.translateForm(this.translatedFormGroup);
    this.bankGuarantee.get('nameOfHoldingBankTrans').patchValue(this.translatedValue.nameOfHoldingBank);
    const convertMargin = this.convertNumbersToNepali(this.bankGuarantee.get('marginInPercentage').value, false);
    this.bankGuarantee.get('marginInPercentageTrans').patchValue(convertMargin);
    const convertCommissionAPG = this.convertNumbersToNepali(this.bankGuarantee.get('commissionInPercentageAPG').value, false);
    this.bankGuarantee.get('commissionInPercentageAPGTrans').patchValue(convertCommissionAPG);
    const convertCommission2APG = this.convertNumbersToNepali(this.bankGuarantee.get('commissionInPercentage2APG').value, false);
    this.bankGuarantee.get('commissionInPercentage2APGTrans').patchValue(convertCommission2APG);
    const convertCommissionBidBond = this.convertNumbersToNepali(this.bankGuarantee.get('commissionInPercentageBidBond').value, false);
    this.bankGuarantee.get('commissionInPercentageBidBondTrans').patchValue(convertCommissionBidBond);
    const convertCommission2BidBond = this.convertNumbersToNepali(this.bankGuarantee.get('commissionInPercentage2BidBond').value, false);
    this.bankGuarantee.get('commissionInPercentage2BidBondTrans').patchValue(convertCommissionBidBond);
    const serviceChargeInPercent = this.bankGuarantee.get('serviceChargeInPercent').value;
    if (!ObjectUtil.isEmpty(serviceChargeInPercent)) {
      // tslint:disable-next-line:max-line-length
      this.bankGuarantee.get('serviceChargeInPercentTrans').patchValue(this.engToNepaliNumberPipe.transform(serviceChargeInPercent.toString()));
      // tslint:disable-next-line:max-line-length
      this.bankGuarantee.get('serviceChargeInPercentCT').patchValue(this.engToNepaliNumberPipe.transform(serviceChargeInPercent.toString()));
    }
    const minServiceChargeInFigure1 = this.bankGuarantee.get('minServiceChargeInFigure1').value;
    if (!ObjectUtil.isEmpty(minServiceChargeInFigure1)) {
      // tslint:disable-next-line:max-line-length
      this.bankGuarantee.get('minServiceChargeInFigure1Trans').patchValue(this.engToNepaliNumberPipe.transform(minServiceChargeInFigure1.toString()));
      // tslint:disable-next-line:max-line-length
      this.bankGuarantee.get('minServiceChargeInFigure1CT').patchValue(this.engToNepaliNumberPipe.transform(minServiceChargeInFigure1.toString()));
    }
    /* Converting value for date */
    this.bankGuarantee.get('dateOfExpiryTypeTrans').patchValue(
        this.bankGuarantee.get('dateOfExpiryType').value
    );
    const tempDateOfExpType = this.bankGuarantee.get('dateOfExpiryType').value;
    let tempExpDate;
    if (tempDateOfExpType === 'AD') {
      const tempEngExpDate = this.bankGuarantee.get('dateOfExpiry').value;
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ?
          this.engToNepDatePipe.transform(this.datePipe.transform(tempEngExpDate), true) : '';
      this.bankGuarantee.get('dateOfExpiryTrans').patchValue(tempExpDate);
    } else {
      const tempDateOfExpNep = this.bankGuarantee.get('dateOfExpiryNepali').value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.nDate : '';
      this.bankGuarantee.get('dateOfExpiryTrans').patchValue(tempExpDate);
    }
    this.setCTValue();
  }
  setCTValue() {
    this.bankGuarantee.get('loanAmountCT').patchValue(
        this.bankGuarantee.get('loanAmountTrans').value
    );
    this.bankGuarantee.get('multiLoanCT').patchValue(
        this.bankGuarantee.get('multiLoanTrans').value
    );
    this.bankGuarantee.get('complementryOtherCT').patchValue(
        this.bankGuarantee.get('complementryOtherTrans').value
    );
    this.bankGuarantee.get('loanAmountAmountWordsCT').patchValue(
        this.bankGuarantee.get('loanAmountAmountWordsTrans').value
    );
    this.bankGuarantee.get('nameOfHoldingBankCT').patchValue(
        this.translatedValue.nameOfHoldingBank
    );
    this.bankGuarantee.get('marginInPercentageCT').patchValue(
        this.bankGuarantee.get('marginInPercentageTrans').value
    );
    this.bankGuarantee.get('commissionInPercentageAPGCT').patchValue(
        this.bankGuarantee.get('commissionInPercentageAPGTrans').value
    );
    this.bankGuarantee.get('commissionInPercentage2APGCT').patchValue(
        this.bankGuarantee.get('commissionInPercentage2APGTrans').value
    );
    this.bankGuarantee.get('commissionInPercentageBidBondCT').patchValue(
        this.bankGuarantee.get('commissionInPercentageBidBondTrans').value
    );
    this.bankGuarantee.get('commissionInPercentage2BidBondCT').patchValue(
        this.bankGuarantee.get('commissionInPercentage2BidBondTrans').value
    );
    this.bankGuarantee.get('commissionTypeCT').patchValue(
        this.bankGuarantee.get('commissionTypeTrans').value
    );
    this.bankGuarantee.get('dateOfExpiryTypeCT').patchValue(
        this.bankGuarantee.get('dateOfExpiryTypeTrans').value
    );
    this.bankGuarantee.get('dateOfExpiryNepaliCT').patchValue(
        this.bankGuarantee.get('dateOfExpiryNepaliTrans').value
    );
    this.bankGuarantee.get('dateOfExpiryCT').patchValue(
        this.bankGuarantee.get('dateOfExpiryTrans').value
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
