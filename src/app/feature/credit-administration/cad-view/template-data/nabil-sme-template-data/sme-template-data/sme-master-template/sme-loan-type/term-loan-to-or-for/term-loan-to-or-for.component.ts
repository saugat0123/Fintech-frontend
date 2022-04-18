import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {SbTranslateService} from '../../../../../../../../../@core/service/sbtranslate.service';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {OfferDocument} from '../../../../../../../model/OfferDocument';
import {LoanNameConstant} from '../../../../sme-costant/loan-name-constant';

@Component({
  selector: 'app-term-loan-to-or-for',
  templateUrl: './term-loan-to-or-for.component.html',
  styleUrls: ['./term-loan-to-or-for.component.scss']
})
export class TermLoanToOrForComponent implements OnInit {
  @Input() loanName;
  @Input() customerApprovedDoc;
  @Input() offerDocumentList: Array<OfferDocument>;
  @Input() isEdit = false;
  @Input() cadDocAssignedLoan;
  termLoanForm: FormGroup;
  loanDetails: any = [];
  isComplementaryOtherLoan = false;
  isVehicleSelected = false;
  isOtherSelected = false;
  isNewEMI = false;
  isEMIAnnual = false;
  isNewInstallment = false;
  isInstallmentAnnual = false;
  isSubsequent = false;
  isEvery = false;
  ADExpiry = false;
  BSExpiry = false;
  isYearly = false;
  isSemiYearly = false;
  isQuarterly = false;
  isMonthly = false;
  translatedFormGroup: FormGroup;
  translatedValue: any;
  dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
  yesNoOptions = [
    {value: 'Yes'},
    {value: 'No'}
  ];
  termLoanNumber: Array<any> = new Array<any>();
  isSubsidySelected = false;
  initialInformation: any;
  filteredList: any = [];
  loanNameConstant = LoanNameConstant;
  filteredLoanIdList: any = [];

  constructor(private formBuilder: FormBuilder,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private currencyFormatterPipe: CurrencyFormatterPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private translateService: SbTranslateService,
              private engToNepDatePipe: EngNepDatePipe,
              private datePipe: DatePipe,
              private engToNepWord: NepaliCurrencyWordPipe) { }

  ngOnInit() {
    this.termLoanNumber = this.customerApprovedDoc.assignedLoan.filter(val =>
        val.loan.name === 'TERM LOAN TO/FOR PURCHASE OF VEHICLE');
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.loanName)) {
      this.loanDetails = this.loanName;
      this.filteredListDetails(this.loanDetails);
    }
    if (this.isEdit) {
      if (this.offerDocumentList.length > 0) {
        this.offerDocumentList.forEach(offerLetter => {
          this.initialInformation = JSON.parse(offerLetter.initialInformation);
        });
      }
      if (!ObjectUtil.isEmpty(this.initialInformation)) {
        this.termLoanForm.get('termLoanDetails').patchValue(this.initialInformation.termLoanForm.termLoanDetails);
      }
      // Loan Application Date
      this.patchDate();
    }
    if (!ObjectUtil.isEmpty(this.filteredList)) {
      for (let val = 0; val < this.filteredList.length; val++) {
        const loanamountWords = this.engToNepWord.transform(this.filteredList[val].loanAmount);
        this.termLoanForm.get(['termLoanDetails', val, 'loanAmount']).patchValue(
            this.filteredList[val] ? this.filteredList[val].loanAmount : '');
        this.termLoanForm.get(['termLoanDetails', val, 'loanAmountWords']).patchValue(
            loanamountWords ? loanamountWords : '');
      }
    }
    this.setLoanId();
  }
  filteredListDetails(loanDetails) {
    this.filteredList = loanDetails.filter(data => data.name === this.loanNameConstant.TERM_LOAN_TO_FOR_PURCHASE_OF_VEHICLE);
  }

  patchDate() {
    for (let val = 0; val < this.initialInformation.termLoanForm.termLoanDetails.length; val++){
      const dateOfExpiryType = this.initialInformation.termLoanForm.termLoanDetails[val].dateOfExpiryType;
      if (dateOfExpiryType === 'AD') {
        const dateOfExpiry = this.initialInformation.termLoanForm.termLoanDetails[val].dateOfExpiry;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.termLoanForm.get(['termLoanDetails', val, 'dateOfExpiry']).patchValue(new Date(dateOfExpiry));
        }
      } else if (dateOfExpiryType === 'BS') {
        const dateOfExpiry = this.initialInformation.termLoanForm.termLoanDetails[val].dateOfExpiryNepali;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.termLoanForm.get(['termLoanDetails', val, 'dateOfExpiryNepali']).patchValue(dateOfExpiry);
        }
      }
    }
  }

  buildForm() {
    this.termLoanForm = this.formBuilder.group({
      termLoanDetails: this.formBuilder.array([]),
    });
    this.setTermLoanForm();
  }

  setTermLoanForm() {
    for (let a = 0; a < this.termLoanNumber.length; a++) {
      (this.termLoanForm.get('termLoanDetails') as FormArray).push(this.setFormArray());
    }
  }

  setFormArray() {
    return this.formBuilder.group({
      // For Form Data
      complementaryOther: [false],
      subsidyOrAgricultureLoan: [undefined],
      complimentaryLoanSelected: [undefined],
      termLoanFor: [undefined],
      termLoanType: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      purposeOfLoan: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      interestRate: [undefined],
      emiPaymentType: [undefined],
      emiInfigure: [undefined],
      emiInWords: [undefined],
      numberOfInstallment: [undefined],
      serviceCharge: [undefined],
      tenureOfLoan: [undefined],
      dateOfExpiryType: [undefined],
      dateOfExpiryNepali: [undefined],
      dateOfExpiry: [undefined],
      paymentTerms: [undefined],
      paymentAmountFigure: [undefined],
      paymentAmountWords: [undefined],
      numberOfPayments: [undefined],

      // For Translated Data
      complementaryOtherTrans: [false],
      complimentaryLoanSelectedTrans: [undefined],
      termLoanForTrans: [undefined],
      termLoanTypeTrans: [undefined],
      loanAmountTrans: [undefined],
      loanAmountWordsTrans: [undefined],
      purposeOfLoanTrans: [undefined],
      baseRateTrans: [undefined],
      premiumRateTrans: [undefined],
      interestRateTrans: [undefined],
      emiPaymentTypeTrans: [undefined],
      emiInfigureTrans: [undefined],
      emiInWordsTrans: [undefined],
      numberOfInstallmentTrans: [undefined],
      serviceChargeTrans: [undefined],
      tenureOfLoanTrans: [undefined],
      dateOfExpiryTypeTrans: [undefined],
      dateOfExpiryNepaliTrans: [undefined],
      dateOfExpiryTrans: [undefined],
      paymentTermsTrans: [undefined],
      paymentAmountFigureTrans: [undefined],
      paymentAmountWordsTrans: [undefined],
      numberOfPaymentsTrans: [undefined],

      // For Corrected Data
      complementaryOtherCT: [false],
      complimentaryLoanSelectedCT: [undefined],
      termLoanForCT: [undefined],
      termLoanTypeCT: [undefined],
      loanAmountCT: [undefined],
      loanAmountWordsCT: [undefined],
      purposeOfLoanCT: [undefined],
      baseRateCT: [undefined],
      premiumRateCT: [undefined],
      interestRateCT: [undefined],
      emiPaymentTypeCT: [undefined],
      emiInfigureCT: [undefined],
      emiInWordsCT: [undefined],
      numberOfInstallmentCT: [undefined],
      serviceChargeCT: [undefined],
      tenureOfLoanCT: [undefined],
      dateOfExpiryTypeCT: [undefined],
      dateOfExpiryNepaliCT: [undefined],
      dateOfExpiryCT: [undefined],
      paymentTermsCT: [undefined],
      paymentAmountFigureCT: [undefined],
      paymentAmountWordsCT: [undefined],
      numberOfPaymentsCT: [undefined],
      loanId: [undefined],
    });
  }

  checkComplimetryOtherLoan(event, i) {
    if (!event) {
      this.termLoanForm.get(['termLoanDetails', i, 'complimentaryLoanSelected']).patchValue(null);
    }
  }

  setSubsidyAgriculture(data, i) {
    const tempData = !ObjectUtil.isEmpty(data) ? data : '';
    this.isSubsidySelected = tempData === 'YES';
    this.isOtherSelected = tempData === 'NO';
  }

  setTermLoan(data, i) {
    const tempData = !ObjectUtil.isEmpty(data) ? data : '';
    this.isVehicleSelected = tempData === 'VEHICLE';
    this.isOtherSelected = tempData === 'OTHER';
  }

  setTermLoanType(data, i) {
    const tempData = !ObjectUtil.isEmpty(data) ? data : '';
    this.isNewEMI = tempData === 'NEW_EMI';
    this.isEMIAnnual = tempData === 'NEW_ANNUAL_REVIEW';
    this.isNewInstallment = tempData === 'NEW_INSTALLMENT_BASIS';
    this.isInstallmentAnnual = tempData === 'INSTALLMENT_ANNUAL_REVIEW';
  }

  public getNumAmountWord(numLabel, wordLabel, i): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.termLoanForm.get(['termLoanDetails', i,  numLabel]).value);
    this.termLoanForm.get(['termLoanDetails', i, wordLabel]).patchValue(transformValue);
  }

  calInterestRate(i) {
    const baseRate = this.termLoanForm.get(['termLoanDetails', i, 'baseRate']).value;
    const premiumRate = this.termLoanForm.get(['termLoanDetails', i, 'premiumRate']).value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.termLoanForm.get(['termLoanDetails', i, 'interestRate']).patchValue(sum.toFixed(2));
  }

  setEMIPaymentType(data, i) {
    const tempData = !ObjectUtil.isEmpty(data) ? data : '';
    this.isSubsequent = tempData === 'SUBSEQUENT_MONTH';
    this.isEvery = tempData === 'EVERY_20TH';
  }

  public checkDateOfExpiry(value, i): void {
    this.ADExpiry = value === 'AD';
    this.BSExpiry = value === 'BS';
  }

  setPaymentTerms(data) {
    const tempData = !ObjectUtil.isEmpty(data) ? data : '';
    this.isYearly = tempData === 'YEARLY';
    this.isSemiYearly = tempData === 'SEMI_YEARLY';
    this.isQuarterly = tempData === 'QUARTERLY';
    this.isMonthly = tempData === 'MONTHLY';
  }

  async translateAndSetVal(i) {
    const tempComplementary = this.termLoanForm.get(['termLoanDetails', i, 'complementaryOther']).value;
    if (!ObjectUtil.isEmpty(tempComplementary)) {
      this.termLoanForm.get(['termLoanDetails', i, 'complementaryOtherTrans']).patchValue(tempComplementary);
    }

    const tempComplimentaryLoanSelected = this.termLoanForm.get(['termLoanDetails', i, 'complimentaryLoanSelected']).value;
    if (!ObjectUtil.isEmpty(tempComplimentaryLoanSelected)) {
      this.termLoanForm.get(['termLoanDetails', i, 'complimentaryLoanSelectedTrans']).patchValue(tempComplimentaryLoanSelected);
    }

    const tempTermLoanFor = this.termLoanForm.get(['termLoanDetails', i, 'termLoanFor']).value;
    if (!ObjectUtil.isEmpty(tempTermLoanFor)) {
      this.termLoanForm.get(['termLoanDetails', i, 'termLoanForTrans']).patchValue(tempTermLoanFor);
    }

    const tempTermLoanType = this.termLoanForm.get(['termLoanDetails', i, 'termLoanType']).value;
    if (!ObjectUtil.isEmpty(tempTermLoanType)) {
      this.termLoanForm.get(['termLoanDetails', i, 'termLoanTypeTrans']).patchValue(tempTermLoanType);
    }

    const tempEMIPaymentType = this.termLoanForm.get(['termLoanDetails', i, 'emiPaymentType']).value;
    if (!ObjectUtil.isEmpty(tempEMIPaymentType)) {
      this.termLoanForm.get(['termLoanDetails', i, 'emiPaymentTypeTrans']).patchValue(tempEMIPaymentType);
    }

    const tempPaymentTerms = this.termLoanForm.get(['termLoanDetails', i, 'paymentTerms']).value;
    if (!ObjectUtil.isEmpty(tempPaymentTerms)) {
      this.termLoanForm.get(['termLoanDetails', i, 'paymentTermsTrans']).patchValue(tempPaymentTerms);
    }

    // Translation for Numbers
    const tempLoanAmount = this.termLoanForm.get(['termLoanDetails', i, 'loanAmount']).value;
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.termLoanForm.get(['termLoanDetails', i, 'loanAmountTrans']).patchValue(convertNumber);

    this.termLoanForm.get(['termLoanDetails', i, 'loanAmountWordsTrans']).patchValue(
        this.termLoanForm.get(['termLoanDetails', i, 'loanAmountWords']).value
    );

    const tempEMIAmount = this.termLoanForm.get(['termLoanDetails', i, 'emiInfigure']).value;
    const convertNumber1 = !ObjectUtil.isEmpty(tempEMIAmount) ?
        this.convertNumbersToNepali(tempEMIAmount, true) : '';
    this.termLoanForm.get(['termLoanDetails', i, 'emiInfigureTrans']).patchValue(convertNumber1);

    this.termLoanForm.get(['termLoanDetails', i, 'emiInWordsTrans']).patchValue(
        this.termLoanForm.get(['termLoanDetails', i, 'emiInWords']).value
    );

    const tempPaymentAmount = this.termLoanForm.get(['termLoanDetails', i, 'paymentAmountFigure']).value;
    const convertNumber2 = !ObjectUtil.isEmpty(tempPaymentAmount) ?
        this.convertNumbersToNepali(tempPaymentAmount, true) : '';
    this.termLoanForm.get(['termLoanDetails', i, 'paymentAmountFigureTrans']).patchValue(convertNumber2);

    this.termLoanForm.get(['termLoanDetails', i, 'paymentAmountWordsTrans']).patchValue(
        this.termLoanForm.get(['termLoanDetails', i, 'paymentAmountWords']).value
    );

    const tempPurposeOfLoan = this.convertNumbersToNepali(this.termLoanForm.get(['termLoanDetails', i, 'purposeOfLoan']).value, false);
    this.termLoanForm.get(['termLoanDetails', i, 'purposeOfLoanTrans']).patchValue(tempPurposeOfLoan);
    const tempBaseRate = this.convertNumbersToNepali(this.termLoanForm.get(['termLoanDetails', i, 'baseRate']).value.toFixed(2), false);
    this.termLoanForm.get(['termLoanDetails', i, 'baseRateTrans']).patchValue(tempBaseRate);
    const tempPremiumRate = this.convertNumbersToNepali(this.termLoanForm.get(['termLoanDetails', i, 'premiumRate']).value.toFixed(2), false);
    this.termLoanForm.get(['termLoanDetails', i, 'premiumRateTrans']).patchValue(tempPremiumRate);
    const tempInterestRate = this.convertNumbersToNepali(this.termLoanForm.get(['termLoanDetails', i, 'interestRate']).value, false);
    this.termLoanForm.get(['termLoanDetails', i, 'interestRateTrans']).patchValue(tempInterestRate);
    const tempNumberOfInstallment = this.convertNumbersToNepali(this.termLoanForm.get(['termLoanDetails', i, 'numberOfInstallment']).value, false);
    this.termLoanForm.get(['termLoanDetails', i, 'numberOfInstallmentTrans']).patchValue(tempNumberOfInstallment);
    const tempServiceCharge = this.convertNumbersToNepali(this.termLoanForm.get(['termLoanDetails', i, 'serviceCharge']).value, false);
    this.termLoanForm.get(['termLoanDetails', i, 'serviceChargeTrans']).patchValue(tempServiceCharge);
    const tempTenureOfLoan = this.convertNumbersToNepali(this.termLoanForm.get(['termLoanDetails', i, 'tenureOfLoan']).value, false);
    this.termLoanForm.get(['termLoanDetails', i, 'tenureOfLoanTrans']).patchValue(tempTenureOfLoan);
    const tempNumberOfPayments = this.convertNumbersToNepali(this.termLoanForm.get(['termLoanDetails', i, 'numberOfPayments']).value, false);
    this.termLoanForm.get(['termLoanDetails', i, 'numberOfPaymentsTrans']).patchValue(tempNumberOfPayments);

    /* Converting value for date */
    this.termLoanForm.get(['termLoanDetails', i, 'dateOfExpiryTypeTrans']).patchValue(
        this.termLoanForm.get(['termLoanDetails', i, 'dateOfExpiryType']).value
    );
    const tempDateOfExpType = this.termLoanForm.get(['termLoanDetails', i, 'dateOfExpiryType']).value;
    let tempExpDate;
    if (tempDateOfExpType === 'AD') {
      const tempEngExpDate = this.termLoanForm.get(['termLoanDetails', i, 'dateOfExpiry']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ? this.datePipe.transform(tempEngExpDate) : '';
      const finalExpDate = this.transformEnglishDate(tempExpDate);
      this.termLoanForm.get(['termLoanDetails', i, 'dateOfExpiryTrans']).patchValue(finalExpDate);
    } else {
      const tempDateOfExpNep = this.termLoanForm.get(['termLoanDetails', i, 'dateOfExpiryNepali']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.nDate : '';
      this.termLoanForm.get(['termLoanDetails', i, 'dateOfExpiryTrans']).patchValue(tempExpDate);
    }

    // translated by google api
    this.translatedFormGroup = this.formBuilder.group({
      purposeOfLoan: !ObjectUtil.isEmpty(this.termLoanForm.get(['termLoanDetails', i, 'purposeOfLoan']).value) ? this.termLoanForm.get(['termLoanDetails', i, 'purposeOfLoan']).value : '',
    });

    this.translatedValue =  await this.translateService.translateForm(this.translatedFormGroup);

    this.termLoanForm.get(['termLoanDetails', i, 'purposeOfLoanTrans']).patchValue(this.translatedValue.purposeOfLoan);

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
    this.termLoanForm.get(['termLoanDetails', i, 'complementaryOtherCT']).patchValue(
        this.termLoanForm.get(['termLoanDetails', i, 'complementaryOtherTrans']).value
    );
    this.termLoanForm.get(['termLoanDetails', i, 'complimentaryLoanSelectedCT']).patchValue(
        this.termLoanForm.get(['termLoanDetails', i, 'complimentaryLoanSelectedTrans']).value
    );
    this.termLoanForm.get(['termLoanDetails', i, 'termLoanForCT']).patchValue(
        this.termLoanForm.get(['termLoanDetails', i, 'termLoanForTrans']).value
    );
    this.termLoanForm.get(['termLoanDetails', i, 'termLoanTypeCT']).patchValue(
        this.termLoanForm.get(['termLoanDetails', i, 'termLoanTypeTrans']).value
    );
    this.termLoanForm.get(['termLoanDetails', i, 'loanAmountCT']).patchValue(
        this.termLoanForm.get(['termLoanDetails', i, 'loanAmountTrans']).value
    );
    this.termLoanForm.get(['termLoanDetails', i, 'loanAmountWordsCT']).patchValue(
        this.termLoanForm.get(['termLoanDetails', i, 'loanAmountWordsTrans']).value
    );
    this.termLoanForm.get(['termLoanDetails', i, 'loanAmountWordsCT']).patchValue(
        this.termLoanForm.get(['termLoanDetails', i, 'loanAmountWordsTrans']).value
    );
    this.termLoanForm.get(['termLoanDetails', i, 'purposeOfLoanCT']).patchValue(
        this.translatedValue.purposeOfLoan
    );
    this.termLoanForm.get(['termLoanDetails', i, 'baseRateCT']).patchValue(
        this.termLoanForm.get(['termLoanDetails', i, 'baseRateTrans']).value
    );
    this.termLoanForm.get(['termLoanDetails', i, 'premiumRateCT']).patchValue(
        this.termLoanForm.get(['termLoanDetails', i, 'premiumRateTrans']).value
    );
    this.termLoanForm.get(['termLoanDetails', i, 'interestRateCT']).patchValue(
        this.termLoanForm.get(['termLoanDetails', i, 'interestRateTrans']).value
    );
    this.termLoanForm.get(['termLoanDetails', i, 'emiPaymentTypeCT']).patchValue(
        this.termLoanForm.get(['termLoanDetails', i, 'emiPaymentTypeTrans']).value
    );
    this.termLoanForm.get(['termLoanDetails', i, 'emiInfigureCT']).patchValue(
        this.termLoanForm.get(['termLoanDetails', i, 'emiInfigureTrans']).value
    );
    this.termLoanForm.get(['termLoanDetails', i, 'emiInWordsCT']).patchValue(
        this.termLoanForm.get(['termLoanDetails', i, 'emiInWordsTrans']).value
    );
    this.termLoanForm.get(['termLoanDetails', i, 'numberOfInstallmentCT']).patchValue(
        this.termLoanForm.get(['termLoanDetails', i, 'numberOfInstallmentTrans']).value
    );
    this.termLoanForm.get(['termLoanDetails', i, 'serviceChargeCT']).patchValue(
        this.termLoanForm.get(['termLoanDetails', i, 'serviceChargeTrans']).value
    );
    this.termLoanForm.get(['termLoanDetails', i, 'tenureOfLoanCT']).patchValue(
        this.termLoanForm.get(['termLoanDetails', i, 'tenureOfLoanTrans']).value
    );
    this.termLoanForm.get(['termLoanDetails', i, 'dateOfExpiryTypeCT']).patchValue(
        this.termLoanForm.get(['termLoanDetails', i, 'dateOfExpiryTypeTrans']).value
    );
    this.termLoanForm.get(['termLoanDetails', i, 'dateOfExpiryNepaliCT']).patchValue(
        this.termLoanForm.get(['termLoanDetails', i, 'dateOfExpiryNepaliTrans']).value
    );
    this.termLoanForm.get(['termLoanDetails', i, 'dateOfExpiryCT']).patchValue(
        this.termLoanForm.get(['termLoanDetails', i, 'dateOfExpiryTrans']).value
    );
    this.termLoanForm.get(['termLoanDetails', i, 'paymentTermsCT']).patchValue(
        this.termLoanForm.get(['termLoanDetails', i, 'paymentTermsTrans']).value
    );
    this.termLoanForm.get(['termLoanDetails', i, 'paymentAmountFigureCT']).patchValue(
        this.termLoanForm.get(['termLoanDetails', i, 'paymentAmountFigureTrans']).value
    );
    this.termLoanForm.get(['termLoanDetails', i, 'paymentAmountWordsCT']).patchValue(
        this.termLoanForm.get(['termLoanDetails', i, 'paymentAmountWordsTrans']).value
    );
    this.termLoanForm.get(['termLoanDetails', i, 'numberOfPaymentsCT']).patchValue(
        this.termLoanForm.get(['termLoanDetails', i, 'numberOfPaymentsTrans']).value
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

  setLoanId() {
    this.filteredLoanIdList = this.cadDocAssignedLoan.filter(data =>
        data.loan.name === this.loanNameConstant.TERM_LOAN_TO_FOR_PURCHASE_OF_VEHICLE);
    this.filteredList.forEach((val, i) => {
      this.termLoanForm.get(['termLoanDetails', i, 'loanId']).patchValue(
          this.filteredLoanIdList[i].proposal.id);
    });
  }

}
