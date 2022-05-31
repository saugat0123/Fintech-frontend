import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {SbTranslateService} from '../../../../../../../../../@core/service/sbtranslate.service';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {EngNepDatePipe} from 'nepali-patro';
import {DatePipe} from '@angular/common';
import {LoanNameConstant} from '../../../../sme-costant/loan-name-constant';
import {OfferDocument} from '../../../../../../../model/OfferDocument';

@Component({
  selector: 'app-auto-loan-master',
  templateUrl: './auto-loan-master.component.html',
  styleUrls: ['./auto-loan-master.component.scss']
})
export class AutoLoanMasterComponent implements OnInit {
  @Input() loanName;
  @Input() offerDocumentList: Array<OfferDocument>;
  @Input() cadDocAssignedLoan;
  initialInformation: any;
  loanDetails: any = [];
  autoLoanMasterForm: FormGroup;
  isComplementaryOtherLoan = false;
  isVehiclePurchased = false;
  isVehicleRegistered = false;
  isNewTermLoan = false;
  isOtherCreditLimit = false;
  isNewInstallmentBasis = false;
  isReviewCreditLimit = false;
  isSubsequent = false;
  isEvery = false;
  BSExpiry = false;
  ADExpiry = false;
  isYearly = false;
  isSemiYearly = false;
  isMonthly = false;
  isQuarterly = false;
  translatedFormGroup: FormGroup;
  translatedValue: any;
  loanNameConstant = LoanNameConstant;
  dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
  filteredList: any = [];
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
        this.autoLoanMasterForm.patchValue(this.initialInformation.autoLoanMasterForm);
      }
      this.patchDate();
    }
    if (!ObjectUtil.isEmpty(this.filteredList)) {
      for (let val = 0; val < this.filteredList.length; val++) {
        const loanamountWords = this.engToNepWord.transform(this.filteredList[val].loanAmount);
        this.autoLoanMasterForm.get(['autoLoanFormArray', val, 'loanAmount']).patchValue(
            this.filteredList[val] ? this.filteredList[val].loanAmount : '');
        this.autoLoanMasterForm.get(['autoLoanFormArray', val, 'loanAmountWords']).patchValue(
            loanamountWords ? loanamountWords : '');
      }
    }
    this.setLoanId();
  }

  patchDate() {
    for (let val = 0; val < this.initialInformation.autoLoanMasterForm.autoLoanFormArray.length; val++) {
      const dateOfExpiryType = this.initialInformation.autoLoanMasterForm.autoLoanFormArray[val].dateOfExpiryType;
      if (dateOfExpiryType === 'AD') {
        const dateOfExpiry = this.initialInformation.autoLoanMasterForm.autoLoanFormArray[val].dateOfExpiry;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.autoLoanMasterForm.get(['autoLoanFormArray', val, 'dateOfExpiry']).patchValue(new Date(dateOfExpiry));
        }
      } else if (dateOfExpiryType === 'BS') {
        const dateOfExpiry = this.initialInformation.autoLoanMasterForm.autoLoanFormArray[val].dateOfExpiryNepali;
        if (!ObjectUtil.isEmpty(dateOfExpiry)) {
          this.autoLoanMasterForm.get(['autoLoanFormArray', val, 'dateOfExpiryNepali']).patchValue(dateOfExpiry);
        }
      }
    }
  }

  buildForm() {
    this.autoLoanMasterForm = this.formBuilder.group({
      autoLoanFormArray: this.formBuilder.array([]),
    });
  }

  checkComplimetryOtherLoan(data, index) {
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'complementaryOther']).patchValue(data);
  }

  checkVehiclePurchased(data, index) {
    // this.isVehiclePurchased = data;
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'vehiclePurchased']).patchValue(data);
  }

  checkVehicleRegistered(data, index) {
    // this.isVehicleRegistered = data;
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'vehicleRegistered']).patchValue(data);
  }

  setAutoLoanType(data, index) {
    const tempData = !ObjectUtil.isEmpty(data) ? data : '';
    this.isNewTermLoan = tempData === 'NEW_EMI_TERM_LOAN';
    this.isOtherCreditLimit = tempData === 'OTHER_CREDIT_LIMITS';
    this.isNewInstallmentBasis = tempData === 'NEW_INSTALLMENT_BASIS';
    this.isReviewCreditLimit = tempData === 'REVIEW_OF_OTHER_CREDIT_LIMIT';
  }

  public getNumAmountWord(numLabel, wordLabel, index, arrayName): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.autoLoanMasterForm.get([arrayName, index, numLabel]).value);
    this.autoLoanMasterForm.get([arrayName, index, wordLabel]).patchValue(transformValue);
  }

  setEMIPaymentType(data) {
    const tempData = !ObjectUtil.isEmpty(data) ? data : '';
    this.isSubsequent = tempData === 'SUBSEQUENT_MONTH';
    this.isEvery = tempData === 'EVERY_20TH';
  }

  filterLoanDetails(loanDetails) {
    this.filteredList = loanDetails.filter(data => data.name === this.loanNameConstant.AUTO_LOAN);
    this.filteredList.forEach(value => {
      this.addLoanFormArr();
    });
  }

  calInterestRate(index, arrName) {
    const baseRate = this.autoLoanMasterForm.get([arrName, index, 'baseRate']).value;
    const premiumRate = this.autoLoanMasterForm.get([arrName, index, 'premiumRate']).value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.autoLoanMasterForm.get([arrName, index, 'interestRate']).patchValue(sum.toFixed(2));
  }

  public checkDateOfExpiry(value): void {
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

  async translateAndSetVal(index) {
    // this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'complementaryOther']).patchValue(this.isComplementaryOtherLoan);
    const tempComplementary = this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'complementaryOther']).value;
    if (!ObjectUtil.isEmpty(tempComplementary)) {
      this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'complementaryOtherTrans']).patchValue(tempComplementary);
    }

    // this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'vehiclePurchased']).patchValue(this.isVehiclePurchased);
    const tempVehiclePurchased = this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'vehiclePurchased']).value;
    if (!ObjectUtil.isEmpty(tempVehiclePurchased)) {
      this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'vehiclePurchasedTrans']).patchValue(tempVehiclePurchased);
    }

    // this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'vehicleRegistered']).patchValue(this.isVehicleRegistered);
    const tempVehicleRegistered = this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'vehicleRegistered']).value;
    if (!ObjectUtil.isEmpty(tempVehicleRegistered)) {
      this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'vehicleRegisteredTrans']).patchValue(tempVehicleRegistered);
    }

    const tempComplimentaryLoanSelected = this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'complimentaryLoanSelected']).value;
    if (!ObjectUtil.isEmpty(tempComplimentaryLoanSelected)) {
      this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'complimentaryLoanSelectedTrans']).patchValue(tempComplimentaryLoanSelected);
    }

    const tempAutoLoanType = this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'autoLoanType']).value;
    if (!ObjectUtil.isEmpty(tempAutoLoanType)) {
      this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'autoLoanTypeTrans']).patchValue(tempAutoLoanType);
    }

    const tempEMIPaymentType = this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'emiPaymentType']).value;
    if (!ObjectUtil.isEmpty(tempEMIPaymentType)) {
      this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'emiPaymentTypeTrans']).patchValue(tempEMIPaymentType);
    }

    const tempPaymentTerms = this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'paymentTerms']).value;
    if (!ObjectUtil.isEmpty(tempPaymentTerms)) {
      this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'paymentTermsTrans']).patchValue(tempPaymentTerms);
    }

    // Translation for Numbers
    const tempLoanAmount = this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'loanAmount']).value;
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'loanAmountTrans']).patchValue(convertNumber);

    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'loanAmountWordsTrans']).patchValue(
        this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'loanAmountWords']).value
    );

    const tempEMIAmount = this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'emiInfigure']).value;
    const convertNumber1 = !ObjectUtil.isEmpty(tempEMIAmount) ?
        this.convertNumbersToNepali(tempEMIAmount, true) : '';
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'emiInfigureTrans']).patchValue(convertNumber1);

    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'emiInWordsTrans']).patchValue(
        this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'emiInWords']).value
    );

    const tempPaymentAmount = this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'paymentAmountFigure']).value;
    const convertNumber2 = !ObjectUtil.isEmpty(tempPaymentAmount) ?
        this.convertNumbersToNepali(tempPaymentAmount, true) : '';
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'paymentAmountFigureTrans']).patchValue(convertNumber2);

    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'paymentAmountWordsTrans']).patchValue(
        this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'paymentAmountWords']).value
    );

    const tempBaseRate = this.convertNumbersToNepali(this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'baseRate']).value.toFixed(2), false);
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'baseRateTrans']).patchValue(tempBaseRate);
    const tempPremiumRate = this.convertNumbersToNepali(this.autoLoanMasterForm.get(
        ['autoLoanFormArray', index, 'premiumRate']).value.toFixed(2), false);
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'premiumRateTrans']).patchValue(tempPremiumRate);
    const tempInterestRate = this.convertNumbersToNepali(this.autoLoanMasterForm.get(
        ['autoLoanFormArray', index, 'interestRate']).value, false);
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'interestRateTrans']).patchValue(tempInterestRate);
    const tempNumberOfInstallment = this.convertNumbersToNepali(this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'numberOfInstallment']).value, false);
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'numberOfInstallmentTrans']).patchValue(tempNumberOfInstallment);
    const tempServiceCharge = this.convertNumbersToNepali(this.autoLoanMasterForm.get(
        ['autoLoanFormArray', index, 'serviceCharge']).value, false);
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'serviceChargeTrans']).patchValue(tempServiceCharge);
    const tempTenureOfLoan = this.convertNumbersToNepali(this.autoLoanMasterForm.get(
        ['autoLoanFormArray', index, 'tenureOfLoan']).value, false);
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'tenureOfLoanTrans']).patchValue(tempTenureOfLoan);
   const tempNumberOfPayments = this.convertNumbersToNepali(this.autoLoanMasterForm.get(
       ['autoLoanFormArray', index, 'numberOfPayments']).value, false);
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'numberOfPaymentsTrans']).patchValue(tempNumberOfPayments);
    const tempDrawingPower = this.convertNumbersToNepali(this.autoLoanMasterForm.get(
        ['autoLoanFormArray', index, 'drawingPower']).value, false);
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'drawingPowerTrans']).patchValue(tempDrawingPower);

    /* Converting value for date */
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'dateOfExpiryTypeTrans']).patchValue(
        this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'dateOfExpiryType']).value
    );
    const tempDateOfExpType = this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'dateOfExpiryType']).value;
    let tempExpDate;
    if (tempDateOfExpType === 'AD') {
      const tempEngExpDate = this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'dateOfExpiry']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ? this.datePipe.transform(tempEngExpDate) : '';
      const finalExpDate = this.transformEnglishDate(tempExpDate);
      this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'dateOfExpiryTrans']).patchValue(finalExpDate);
    } else {
      const tempDateOfExpNep = this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'dateOfExpiryNepali']).value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.nDate : '';
      this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'dateOfExpiryTrans']).patchValue(tempExpDate);
    }

    // translated by google api
    this.translatedFormGroup = this.formBuilder.group({
      purposeOfLoan: !ObjectUtil.isEmpty(this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'purposeOfLoan']).value) ?
          this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'purposeOfLoan']).value : '',
      nameOfDealer: !ObjectUtil.isEmpty(this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'nameOfDealer']).value) ?
          this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'nameOfDealer']).value : '',
    });

    this.translatedValue =  await this.translateService.translateForm(this.translatedFormGroup);

    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'purposeOfLoanTrans']).patchValue(this.translatedValue.purposeOfLoan);
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'nameOfDealerTrans']).patchValue(this.translatedValue.nameOfDealer);

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
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'complementaryOtherCT']).patchValue(
        this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'complementaryOtherTrans']).value
    );
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'vehiclePurchasedCT']).patchValue(
        this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'vehiclePurchasedTrans']).value
    );
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'vehicleRegisteredCT']).patchValue(
        this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'vehicleRegisteredTrans']).value
    );
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'complimentaryLoanSelectedCT']).patchValue(
        this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'complimentaryLoanSelectedTrans']).value
    );
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'autoLoanTypeCT']).patchValue(
        this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'autoLoanTypeTrans']).value
    );
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'loanAmountCT']).patchValue(
        this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'loanAmountTrans']).value
    );
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'loanAmountWordsCT']).patchValue(
        this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'loanAmountWordsTrans']).value
    );
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'loanAmountWordsCT']).patchValue(
        this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'loanAmountWordsTrans']).value
    );
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'purposeOfLoanCT']).patchValue(
        this.translatedValue.purposeOfLoan
    );
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'baseRateCT']).patchValue(
        this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'baseRateTrans']).value
    );
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'premiumRateCT']).patchValue(
        this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'premiumRateTrans']).value
    );
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'interestRateCT']).patchValue(
        this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'interestRateTrans']).value
    );
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'emiPaymentTypeCT']).patchValue(
        this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'emiPaymentTypeTrans']).value
    );
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'emiInfigureCT']).patchValue(
        this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'emiInfigureTrans']).value
    );
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'emiInWordsCT']).patchValue(
        this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'emiInWordsTrans']).value
    );
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'numberOfInstallmentCT']).patchValue(
        this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'numberOfInstallmentTrans']).value
    );
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'serviceChargeCT']).patchValue(
        this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'serviceChargeTrans']).value
    );
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'tenureOfLoanCT']).patchValue(
        this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'tenureOfLoanTrans']).value
    );
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'drawingPowerCT']).patchValue(
        this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'drawingPowerTrans']).value
    );
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'dateOfExpiryTypeCT']).patchValue(
        this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'dateOfExpiryTypeTrans']).value
    );
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'dateOfExpiryNepaliCT']).patchValue(
        this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'dateOfExpiryNepaliTrans']).value
    );
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'dateOfExpiryCT']).patchValue(
        this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'dateOfExpiryTrans']).value
    );
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'paymentTermsCT']).patchValue(
        this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'paymentTermsTrans']).value
    );
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'paymentAmountFigureCT']).patchValue(
        this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'paymentAmountFigureTrans']).value
    );
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'paymentAmountWordsCT']).patchValue(
        this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'paymentAmountWordsTrans']).value
    );
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'numberOfPaymentsCT']).patchValue(
        this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'numberOfPaymentsTrans']).value
    );
    this.autoLoanMasterForm.get(['autoLoanFormArray', index, 'nameOfDealerCT']).patchValue(
        this.translatedValue.nameOfDealer
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
      complementaryOther: [false],
      complimentaryLoanSelected: [undefined],
      vehiclePurchased: [false],
      vehicleRegistered: [false],
      autoLoanType: [undefined],
      purposeOfLoan: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      drawingPower: [undefined],
      emiPaymentType: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      interestRate: [undefined],
      emiInfigure: [undefined],
      emiInWords: [undefined],
      numberOfInstallment: [undefined],
      dateOfExpiry: [undefined],
      dateOfExpiryType: [undefined],
      dateOfExpiryNepali: [undefined],
      serviceCharge: [undefined],
      tenureOfLoan: [undefined],
      nameOfDealer: [undefined],
      paymentAmountFigure: [undefined],
      paymentAmountWords: [undefined],
      numberOfPayments: [undefined],
      paymentTerms: [undefined],

      // For Translated Data
      complementaryOtherTrans: [false],
      complimentaryLoanSelectedTrans: [undefined],
      vehiclePurchasedTrans: [false],
      vehicleRegisteredTrans: [false],
      autoLoanTypeTrans: [undefined],
      purposeOfLoanTrans: [undefined],
      loanAmountTrans: [undefined],
      loanAmountWordsTrans: [undefined],
      drawingPowerTrans: [undefined],
      emiPaymentTypeTrans: [undefined],
      baseRateTrans: [undefined],
      premiumRateTrans: [undefined],
      interestRateTrans: [undefined],
      emiInfigureTrans: [undefined],
      emiInWordsTrans: [undefined],
      numberOfInstallmentTrans: [undefined],
      dateOfExpiryTrans: [undefined],
      dateOfExpiryTypeTrans: [undefined],
      dateOfExpiryNepaliTrans: [undefined],
      serviceChargeTrans: [undefined],
      tenureOfLoanTrans: [undefined],
      nameOfDealerTrans: [undefined],
      paymentAmountFigureTrans: [undefined],
      paymentAmountWordsTrans: [undefined],
      numberOfPaymentsTrans: [undefined],
      paymentTermsTrans: [undefined],

      // For Corrected Data
      complementaryOtherCT: [false],
      complimentaryLoanSelectedCT: [undefined],
      vehiclePurchasedCT: [false],
      vehicleRegisteredCT: [false],
      autoLoanTypeCT: [undefined],
      purposeOfLoanCT: [undefined],
      loanAmountCT: [undefined],
      loanAmountWordsCT: [undefined],
      drawingPowerCT: [undefined],
      emiPaymentTypeCT: [undefined],
      baseRateCT: [undefined],
      premiumRateCT: [undefined],
      interestRateCT: [undefined],
      emiInfigureCT: [undefined],
      emiInWordsCT: [undefined],
      numberOfInstallmentCT: [undefined],
      dateOfExpiryCT: [undefined],
      dateOfExpiryTypeCT: [undefined],
      dateOfExpiryNepaliCT: [undefined],
      serviceChargeCT: [undefined],
      tenureOfLoanCT: [undefined],
      nameOfDealerCT: [undefined],
      paymentAmountFigureCT: [undefined],
      paymentAmountWordsCT: [undefined],
      numberOfPaymentsCT: [undefined],
      paymentTermsCT: [undefined],
      loanId: [undefined],
    });
  }

  addLoanFormArr() {
    (this.autoLoanMasterForm.get('autoLoanFormArray') as FormArray).push(this.buildLoanForm());
  }

  removeLoanFormArr(i) {
    (this.autoLoanMasterForm.get('autoLoanFormArray') as FormArray).removeAt(i);
  }

  setLoanId() {
    this.filteredLoanIdList = this.cadDocAssignedLoan.filter(data =>
        data.loan.name === this.loanNameConstant.AUTO_LOAN);
    this.filteredList.forEach((val, i) => {
      this.autoLoanMasterForm.get(['autoLoanFormArray', i, 'loanId']).patchValue(
          this.filteredLoanIdList[i].proposal.id);
    });
  }

}
