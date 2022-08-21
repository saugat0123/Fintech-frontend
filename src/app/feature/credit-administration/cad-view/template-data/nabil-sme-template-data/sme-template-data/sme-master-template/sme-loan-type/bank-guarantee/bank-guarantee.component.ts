import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngNepDatePipe} from 'nepali-patro';
import {DatePipe} from '@angular/common';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {SbTranslateService} from '../../../../../../../../../@core/service/sbtranslate.service';
import {OfferDocument} from '../../../../../../../model/OfferDocument';
import {LoanNameConstant} from '../../../../sme-costant/loan-name-constant';

@Component({
  selector: 'app-bank-guarantee',
  templateUrl: './bank-guarantee.component.html',
  styleUrls: ['./bank-guarantee.component.scss']
})
export class BankGuaranteeComponent implements OnInit {
  @Input() loanName;
  @Input() offerDocumentList: Array<OfferDocument>;
  @Input() cadDocAssignedLoan;
  initialInformation: any;
  bankGuarantee: FormGroup;
  isComplimentryOtherLoan = false;
  loanDetails: any = [];
  filteredList: any = [];
  loanNameConstant = LoanNameConstant;
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
  loanOptions = [
    {key: 'ONE_OFF_BASIS', value: 'One Off Basis'},
    {key: 'REGULAR', value: 'Regular'}
  ];
  filteredLoanIdList: any = [];
  constructor(private formBuilder: FormBuilder,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepDatePipe: EngNepDatePipe,
              private datePipe: DatePipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatterPipe: CurrencyFormatterPipe,
              private translateService: SbTranslateService,
              private engToNepaliNumberPipe: EngToNepaliNumberPipe,
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
        this.bankGuarantee.patchValue(this.initialInformation.bankGuarantee);
      }
      this.patchDate();
    }
    if (!ObjectUtil.isEmpty(this.filteredList)) {
      for (let val = 0; val < this.filteredList.length; val++) {
        const loanamountWords = this.engToNepWord.transform(this.filteredList[val].loanAmount.toFixed(2));
        this.bankGuarantee.get(['bankGuaranteeArray', val, 'loanAmount']).patchValue(
            this.filteredList[val] ? this.filteredList[val].loanAmount : '');
        this.bankGuarantee.get(['bankGuaranteeArray', val, 'loanAmountAmountWords']).patchValue(
            loanamountWords ? loanamountWords : '');
      }
    }
    this.setLoanId();
  }
  filterLoanDetails(loanDetails) {
    this.filteredList = loanDetails.filter(data => data.name === this.loanNameConstant.BANK_GUARANTEE);
    this.filteredList.forEach(value => {
      this.addLoanFormArr();
    });
  }
  patchDate() {
    for (let val = 0; val < this.initialInformation.bankGuarantee.bankGuaranteeArray.length; val++) {
      const dateOfExpiryType = this.initialInformation.bankGuarantee.bankGuaranteeArray[val].dateOfExpiryType;
      if (dateOfExpiryType === 'AD') {
        const dateOfExpiry = this.initialInformation.bankGuarantee.bankGuaranteeArray[val].dateOfExpiry;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.bankGuarantee.get(['bankGuaranteeArray', val, 'dateOfExpiry']).patchValue(new Date(dateOfExpiry));
        }
      } else if (dateOfExpiryType === 'BS') {
        const dateOfExpiry = this.initialInformation.bankGuarantee.bankGuaranteeArray[val].dateOfExpiryNepali;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.bankGuarantee.get(['bankGuaranteeArray', val, 'dateOfExpiryNepali']).patchValue(dateOfExpiry);
        }
      }
    }
  }
  buildForm() {
    this.bankGuarantee = this.formBuilder.group({
      bankGuaranteeArray: this.formBuilder.array([]),
    });
  }
  checkComplimetryOtherLoan(data, index) {
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'complementaryOther']).patchValue(data);
  }
  public checkDateOfExpiry(value): void {
    this.ADExpiry = value === 'AD';
    this.BSExpiry = value === 'BS';
  }
  public getNumAmountWord(numLabel, wordLabel, index, arrayName): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.bankGuarantee.get([arrayName, index, numLabel]).value);
    this.bankGuarantee.get([arrayName, index, wordLabel]).patchValue(transformValue);
  }
  setCommissionType(data) {
    const tempData = !ObjectUtil.isEmpty(data) ? data : '';
    this.isCommission1Selected = tempData === 'COMMISSION_TYPE_1';
    this.isCommission2Selected = tempData === 'COMMISSION_TYPE_2';
  }
  async translateAndSetVal(index) {
    const tempLoanOption = this.bankGuarantee.get(['bankGuaranteeArray', index, 'loanOption']).value;
    if (!ObjectUtil.isEmpty(tempLoanOption)) {
      this.bankGuarantee.get(['bankGuaranteeArray', index, 'loanOptionTrans']).patchValue(tempLoanOption);
    }
    const tempMultiLoan = this.bankGuarantee.get(['bankGuaranteeArray', index, 'multiLoanTrans']).value;
    if (!ObjectUtil.isEmpty(tempMultiLoan)) {
      this.bankGuarantee.get(['bankGuaranteeArray', index, 'multiLoanTrans']).patchValue('');
    }
    const tempComplemetry = this.bankGuarantee.get(['bankGuaranteeArray', index, 'complementaryOther']).value;
    if (!ObjectUtil.isEmpty(tempComplemetry)) {
      this.bankGuarantee.get(['bankGuaranteeArray', index, 'complementaryOtherTrans']).patchValue(tempComplemetry);
    }
    const tempCommissionType = this.bankGuarantee.get(['bankGuaranteeArray', index, 'commissionType']).value;
    if (!ObjectUtil.isEmpty(tempCommissionType)) {
      this.bankGuarantee.get(['bankGuaranteeArray', index, 'commissionTypeTrans']).patchValue(tempCommissionType);
    }
    /* SET TRANS VALUE FOR LOAN AMOUNT IN FIGURE AND LOAN AMOUNT IN WORDS */
    const tempLoanAmount = this.bankGuarantee.get(['bankGuaranteeArray', index, 'loanAmount']).value;
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'loanAmountTrans']).patchValue(convertNumber);

    this.bankGuarantee.get(['bankGuaranteeArray', index, 'loanAmountAmountWordsTrans']).patchValue(
        this.bankGuarantee.get(['bankGuaranteeArray', index, 'loanAmountAmountWords']).value
    );

    const tempComplimentaryLoanSelected = this.bankGuarantee.get(['bankGuaranteeArray', index, 'complimentaryLoanSelected']).value;
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'complimentaryLoanSelectedTrans']).patchValue(tempComplimentaryLoanSelected);
    // translated by google api
    const tempNameOfHoldingBank = !ObjectUtil.isEmpty(this.bankGuarantee.get(['bankGuaranteeArray', index, 'nameOfHoldingBank']).value) ?
        this.bankGuarantee.get(['bankGuaranteeArray', index, 'nameOfHoldingBank']).value : '';
    this.translatedFormGroup = this.formBuilder.group({
      nameOfHoldingBank: tempNameOfHoldingBank,
      // nameOfFDHolder: this.overdraftFixedForm.get('nameOfFDHolder').value,
      /*nameOfDepositors: this.overdraftFixedForm.get('nameOfDepositors').value,
      nameOfFacility: this.overdraftFixedForm.get('nameOfFacility').value,*/
    });
    this.translatedValue = await this.translateService.translateForm(this.translatedFormGroup);
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'nameOfHoldingBankTrans']).patchValue(this.translatedValue.nameOfHoldingBank);
    const convertMargin = this.convertNumbersToNepali(this.bankGuarantee.get(['bankGuaranteeArray', index, 'marginInPercentage']).value, false);
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'marginInPercentageTrans']).patchValue(convertMargin);
    const convertCommissionAPG = this.convertNumbersToNepali(this.bankGuarantee.get(['bankGuaranteeArray', index, 'commissionInPercentageAPG']).value, false);
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'commissionInPercentageAPGTrans']).patchValue(convertCommissionAPG);
    const convertCommission2APG = this.convertNumbersToNepali(this.bankGuarantee.get(['bankGuaranteeArray', index, 'commissionInPercentage2APG']).value, false);
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'commissionInPercentage2APGTrans']).patchValue(convertCommission2APG);
    const convertCommissionBidBond = this.convertNumbersToNepali(this.bankGuarantee.get(['bankGuaranteeArray', index, 'commissionInPercentageBidBond']).value, false);
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'commissionInPercentageBidBondTrans']).patchValue(convertCommissionBidBond);
    const convertCommission2BidBond = this.convertNumbersToNepali(this.bankGuarantee.get(['bankGuaranteeArray', index, 'commissionInPercentage2BidBond']).value, false);
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'commissionInPercentage2BidBondTrans']).patchValue(convertCommission2BidBond);
    const convertcommissionInPercentage2PFG = this.convertNumbersToNepali(this.bankGuarantee.get(['bankGuaranteeArray', index, 'commissionInPercentage2PFG']).value, false);
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'commissionInPercentage2PFGTrans']).patchValue(convertcommissionInPercentage2PFG);
    const convertmarginInPercentagePFG = this.convertNumbersToNepali(this.bankGuarantee.get(['bankGuaranteeArray', index, 'marginInPercentagePFG']).value, false);
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'marginInPercentagePFGTrans']).patchValue(convertmarginInPercentagePFG);
    const serviceChargeInPercent = this.bankGuarantee.get(['bankGuaranteeArray', index, 'serviceChargeInPercent']).value;
    if (!ObjectUtil.isEmpty(serviceChargeInPercent)) {
      // tslint:disable-next-line:max-line-length
      this.bankGuarantee.get(['bankGuaranteeArray', index, 'serviceChargeInPercentTrans']).patchValue(this.engToNepaliNumberPipe.transform(serviceChargeInPercent.toString()));
      // tslint:disable-next-line:max-line-length
      this.bankGuarantee.get(['bankGuaranteeArray', index, 'serviceChargeInPercentCT']).patchValue(this.engToNepaliNumberPipe.transform(serviceChargeInPercent.toString()));
    }
    const minServiceChargeInFigure1 = this.bankGuarantee.get(['bankGuaranteeArray', index, 'minServiceChargeInFigure1']).value;
    if (!ObjectUtil.isEmpty(minServiceChargeInFigure1)) {
      // tslint:disable-next-line:max-line-length
      this.bankGuarantee.get(['bankGuaranteeArray', index, 'minServiceChargeInFigure1Trans']).patchValue(this.engToNepaliNumberPipe.transform(minServiceChargeInFigure1.toString()));
      // tslint:disable-next-line:max-line-length
      this.bankGuarantee.get(['bankGuaranteeArray', index, 'minServiceChargeInFigure1CT']).patchValue(this.engToNepaliNumberPipe.transform(minServiceChargeInFigure1.toString()));
    }
    /* Converting value for date */
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'dateOfExpiryTypeTrans']).patchValue(
        this.bankGuarantee.get(['bankGuaranteeArray', index, 'dateOfExpiryType']).value
    );
    const tempDateOfExpType = this.bankGuarantee.get(['bankGuaranteeArray', index, 'dateOfExpiryType']).value;
    let tempExpDate;
    if (tempDateOfExpType === 'AD') {
      const tempEngExpDate = this.bankGuarantee.get(['bankGuaranteeArray', index, 'dateOfExpiry']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ? this.datePipe.transform(tempEngExpDate) : '';
      const finalExpDate = this.transformEnglishDate(tempExpDate);
      this.bankGuarantee.get(['bankGuaranteeArray', index, 'dateOfExpiryTrans']).patchValue(finalExpDate);
    } else {
      const tempDateOfExpNep = this.bankGuarantee.get(['bankGuaranteeArray', index, 'dateOfExpiryNepali']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.nDate : '';
      this.bankGuarantee.get(['bankGuaranteeArray', index, 'dateOfExpiryTrans']).patchValue(tempExpDate);
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
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'complimentaryLoanSelectedCT']).patchValue(
        this.bankGuarantee.get(['bankGuaranteeArray', index, 'complimentaryLoanSelectedTrans']).value
    );
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'loanAmountCT']).patchValue(
        this.bankGuarantee.get(['bankGuaranteeArray', index, 'loanAmountTrans']).value
    );
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'loanOptionCT']).patchValue(
        this.bankGuarantee.get(['bankGuaranteeArray', index, 'loanOptionTrans']).value
    );
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'multiLoanCT']).patchValue(
        this.bankGuarantee.get(['bankGuaranteeArray', index, 'multiLoanTrans']).value
    );
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'complementaryOtherCT']).patchValue(
        this.bankGuarantee.get(['bankGuaranteeArray', index, 'complementaryOtherTrans']).value
    );
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'loanAmountAmountWordsCT']).patchValue(
        this.bankGuarantee.get(['bankGuaranteeArray', index, 'loanAmountAmountWordsTrans']).value
    );
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'nameOfHoldingBankCT']).patchValue(
        this.translatedValue.nameOfHoldingBank
    );
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'marginInPercentageCT']).patchValue(
        this.bankGuarantee.get(['bankGuaranteeArray', index, 'marginInPercentageTrans']).value
    );
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'commissionInPercentageAPGCT']).patchValue(
        this.bankGuarantee.get(['bankGuaranteeArray', index, 'commissionInPercentageAPGTrans']).value
    );
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'commissionInPercentage2APGCT']).patchValue(
        this.bankGuarantee.get(['bankGuaranteeArray', index, 'commissionInPercentage2APGTrans']).value
    );
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'commissionInPercentageBidBondCT']).patchValue(
        this.bankGuarantee.get(['bankGuaranteeArray', index, 'commissionInPercentageBidBondTrans']).value
    );
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'commissionInPercentage2BidBondCT']).patchValue(
        this.bankGuarantee.get(['bankGuaranteeArray', index, 'commissionInPercentage2BidBondTrans']).value
    );
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'commissionTypeCT']).patchValue(
        this.bankGuarantee.get(['bankGuaranteeArray', index, 'commissionTypeTrans']).value
    );
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'dateOfExpiryTypeCT']).patchValue(
        this.bankGuarantee.get(['bankGuaranteeArray', index, 'dateOfExpiryTypeTrans']).value
    );
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'dateOfExpiryNepaliCT']).patchValue(
        this.bankGuarantee.get(['bankGuaranteeArray', index, 'dateOfExpiryNepaliTrans']).value
    );
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'dateOfExpiryCT']).patchValue(
        this.bankGuarantee.get(['bankGuaranteeArray', index, 'dateOfExpiryTrans']).value
    );
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'commissionInPercentage2PFGCT']).patchValue(
        this.bankGuarantee.get(['bankGuaranteeArray', index, 'commissionInPercentage2PFGTrans']).value
    );
    this.bankGuarantee.get(['bankGuaranteeArray', index, 'marginInPercentagePFGCT']).patchValue(
        this.bankGuarantee.get(['bankGuaranteeArray', index, 'marginInPercentagePFGTrans']).value
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
      complementaryOther: [false],
      loanOption: [undefined],
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
      // FOR TRANSLATED DATA
      complementaryOtherTrans: [false],
      loanOptionTrans: [undefined],
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
      // FOR CORRECTED DATA
      complementaryOtherCT: [false],
      loanOptionCT: [undefined],
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
      complimentaryLoanSelected: [undefined],
      complimentaryLoanSelectedTrans: [undefined],
      complimentaryLoanSelectedCT: [undefined],
      commissionInPercentage2PFG: [undefined],
      commissionInPercentage2PFGTrans: [undefined],
      commissionInPercentage2PFGCT: [undefined],
      marginInPercentagePFG: [undefined],
      marginInPercentagePFGTrans: [undefined],
      marginInPercentagePFGCT: [undefined],
      loanId: [undefined],
    });
  }
  addLoanFormArr() {
    (this.bankGuarantee.get('bankGuaranteeArray') as FormArray).push(this.buildLoanForm());
  }

  setLoanId() {
    this.filteredLoanIdList = this.cadDocAssignedLoan.filter(data =>
        data.loan.name === this.loanNameConstant.BANK_GUARANTEE);
    this.filteredList.forEach((val, i) => {
      this.bankGuarantee.get(['bankGuaranteeArray', i, 'loanId']).patchValue(
          this.filteredLoanIdList[i].proposal.id);
    });
  }
}
