import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ObjectUtil} from "../../../../../../../../../@core/utils/ObjectUtil";
import {NepaliCurrencyWordPipe} from "../../../../../../../../../@core/pipe/nepali-currency-word.pipe";
import {SbTranslateService} from "../../../../../../../../../@core/service/sbtranslate.service";
import {CurrencyFormatterPipe} from "../../../../../../../../../@core/pipe/currency-formatter.pipe";
import {EngToNepaliNumberPipe} from "../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe";
import {EngNepDatePipe} from "nepali-patro";
import {DatePipe} from "@angular/common";
import {OfferDocument} from '../../../../../../../model/OfferDocument';

@Component({
  selector: 'app-auto-loan-master',
  templateUrl: './auto-loan-master.component.html',
  styleUrls: ['./auto-loan-master.component.scss']
})
export class AutoLoanMasterComponent implements OnInit {
  @Input() loanName;
  @Input() offerDocumentList: Array<OfferDocument>;
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
  dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];

  constructor(private formBuilder: FormBuilder,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private currencyFormatterPipe: CurrencyFormatterPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private translateService: SbTranslateService,
              private engToNepDatePipe: EngNepDatePipe,
              private datePipe: DatePipe) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.loanName)) {
      this.loanDetails = this.loanName;
    }
    if (this.offerDocumentList.length > 0) {
      this.offerDocumentList.forEach(offerLetter => {
        this.initialInformation = JSON.parse(offerLetter.initialInformation);
      });
    }
    if (!ObjectUtil.isEmpty(this.initialInformation)) {
      this.autoLoanMasterForm.patchValue(this.initialInformation.autoLoanMasterForm);
    }
  }

  buildForm() {
    this.autoLoanMasterForm = this.formBuilder.group({
      //For form Data
      complementaryOther: [undefined],
      complimentaryLoanSelected: [undefined],
      vehiclePurchased: [undefined],
      vehicleRegistered: [undefined],
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

      //For Translated Data
      complementaryOtherTrans: [undefined],
      complimentaryLoanSelectedTrans: [undefined],
      vehiclePurchasedTrans: [undefined],
      vehicleRegisteredTrans: [undefined],
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

      //For Corrected Data
      complementaryOtherCT: [undefined],
      complimentaryLoanSelectedCT: [undefined],
      vehiclePurchasedCT: [undefined],
      vehicleRegisteredCT: [undefined],
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

    })
  }

  checkComplimetryOtherLoan(data) {
    this.isComplementaryOtherLoan = data;
    this.autoLoanMasterForm.get('complementaryOther').patchValue(this.isComplementaryOtherLoan);
  }

  checkVehiclePurchased(data) {
    this.isVehiclePurchased = data;
    this.autoLoanMasterForm.get('vehiclePurchased').patchValue(this.isVehiclePurchased);
  }

  checkVehicleRegistered(data) {
    this.isVehicleRegistered = data;
    this.autoLoanMasterForm.get('vehicleRegistered').patchValue(this.isVehicleRegistered);
  }

  setAutoLoanType(data) {
    const tempData = !ObjectUtil.isEmpty(data) ? data : '';
    this.isNewTermLoan = tempData === 'NEW_EMI_TERM_LOAN';
    this.isOtherCreditLimit = tempData === 'OTHER_CREDIT_LIMITS';
    this.isNewInstallmentBasis = tempData === 'NEW_INSTALLMENT_BASIS';
    this.isReviewCreditLimit = tempData === 'REVIEW_OF_OTHER_CREDIT_LIMIT';
  }

  public getNumAmountWord(numLabel, wordLabel): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.autoLoanMasterForm.get(numLabel).value);
    this.autoLoanMasterForm.get(wordLabel).patchValue(transformValue);
  }

  setEMIPaymentType(data) {
    const tempData = !ObjectUtil.isEmpty(data) ? data : '';
    this.isSubsequent = tempData === 'SUBSEQUENT_MONTH';
    this.isEvery = tempData === 'EVERY_20TH';
  }

  calInterestRate() {
    const baseRate = this.autoLoanMasterForm.get('baseRate').value;
    const premiumRate = this.autoLoanMasterForm.get('premiumRate').value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.autoLoanMasterForm.get('interestRate').patchValue(sum);
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

  async translateAndSetVal() {
    this.autoLoanMasterForm.get('complementaryOther').patchValue(this.isComplementaryOtherLoan);
    const tempComplementary = this.autoLoanMasterForm.get('complementaryOther').value;
    if (!ObjectUtil.isEmpty(tempComplementary)) {
      this.autoLoanMasterForm.get('complementaryOtherTrans').patchValue(tempComplementary);
    }

    this.autoLoanMasterForm.get('vehiclePurchased').patchValue(this.isVehiclePurchased);
    const tempVehiclePurchased = this.autoLoanMasterForm.get('vehiclePurchased').value;
    if (!ObjectUtil.isEmpty(tempVehiclePurchased)) {
      this.autoLoanMasterForm.get('vehiclePurchasedTrans').patchValue(tempVehiclePurchased);
    }

    this.autoLoanMasterForm.get('vehicleRegistered').patchValue(this.isVehicleRegistered);
    const tempVehicleRegistered = this.autoLoanMasterForm.get('vehicleRegistered').value;
    if (!ObjectUtil.isEmpty(tempVehicleRegistered)) {
      this.autoLoanMasterForm.get('vehicleRegisteredTrans').patchValue(tempVehicleRegistered);
    }

    const tempComplimentaryLoanSelected = this.autoLoanMasterForm.get('complimentaryLoanSelected').value;
    if (!ObjectUtil.isEmpty(tempComplimentaryLoanSelected)) {
      this.autoLoanMasterForm.get('complimentaryLoanSelectedTrans').patchValue(tempComplimentaryLoanSelected);
    }

    const tempAutoLoanType = this.autoLoanMasterForm.get('autoLoanType').value;
    if (!ObjectUtil.isEmpty(tempAutoLoanType)) {
      this.autoLoanMasterForm.get('autoLoanTypeTrans').patchValue(tempAutoLoanType);
    }

    const tempEMIPaymentType = this.autoLoanMasterForm.get('emiPaymentType').value;
    if (!ObjectUtil.isEmpty(tempEMIPaymentType)) {
      this.autoLoanMasterForm.get('emiPaymentTypeTrans').patchValue(tempEMIPaymentType);
    }

    const tempPaymentTerms = this.autoLoanMasterForm.get('paymentTerms').value;
    if (!ObjectUtil.isEmpty(tempPaymentTerms)) {
      this.autoLoanMasterForm.get('paymentTermsTrans').patchValue(tempPaymentTerms);
    }

    //Translation for Numbers
    const tempLoanAmount = this.autoLoanMasterForm.get('loanAmount').value;
    const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
        this.convertNumbersToNepali(tempLoanAmount, true) : '';
    this.autoLoanMasterForm.get('loanAmountTrans').patchValue(convertNumber);

    this.autoLoanMasterForm.get('loanAmountWordsTrans').patchValue(
        this.autoLoanMasterForm.get('loanAmountWords').value
    );

    const tempEMIAmount = this.autoLoanMasterForm.get('emiInfigure').value;
    const convertNumber1 = !ObjectUtil.isEmpty(tempEMIAmount) ?
        this.convertNumbersToNepali(tempEMIAmount, true) : '';
    this.autoLoanMasterForm.get('emiInfigureTrans').patchValue(convertNumber1);

    this.autoLoanMasterForm.get('emiInWordsTrans').patchValue(
        this.autoLoanMasterForm.get('emiInWords').value
    );

    const tempPaymentAmount = this.autoLoanMasterForm.get('paymentAmountFigure').value;
    const convertNumber2 = !ObjectUtil.isEmpty(tempPaymentAmount) ?
        this.convertNumbersToNepali(tempPaymentAmount, true) : '';
    this.autoLoanMasterForm.get('paymentAmountFigureTrans').patchValue(convertNumber2);

    this.autoLoanMasterForm.get('paymentAmountWordsTrans').patchValue(
        this.autoLoanMasterForm.get('paymentAmountWords').value
    );

    const tempBaseRate = this.convertNumbersToNepali(this.autoLoanMasterForm.get('baseRate').value, false);
    this.autoLoanMasterForm.get('baseRateTrans').patchValue(tempBaseRate);
    const tempPremiumRate = this.convertNumbersToNepali(this.autoLoanMasterForm.get('premiumRate').value, false);
    this.autoLoanMasterForm.get('premiumRateTrans').patchValue(tempPremiumRate);
    const tempInterestRate = this.convertNumbersToNepali(this.autoLoanMasterForm.get('interestRate').value, false);
    this.autoLoanMasterForm.get('interestRateTrans').patchValue(tempInterestRate);
    const tempNumberOfInstallment = this.convertNumbersToNepali(this.autoLoanMasterForm.get('numberOfInstallment').value, false);
    this.autoLoanMasterForm.get('numberOfInstallmentTrans').patchValue(tempNumberOfInstallment);
    const tempServiceCharge = this.convertNumbersToNepali(this.autoLoanMasterForm.get('serviceCharge').value, false);
    this.autoLoanMasterForm.get('serviceChargeTrans').patchValue(tempServiceCharge);
    const tempTenureOfLoan = this.convertNumbersToNepali(this.autoLoanMasterForm.get('tenureOfLoan').value, false);
    this.autoLoanMasterForm.get('tenureOfLoanTrans').patchValue(tempTenureOfLoan);
   const tempNumberOfPayments = this.convertNumbersToNepali(this.autoLoanMasterForm.get('numberOfPayments').value, false);
    this.autoLoanMasterForm.get('numberOfPaymentsTrans').patchValue(tempNumberOfPayments);
    const tempDrawingPower = this.convertNumbersToNepali(this.autoLoanMasterForm.get('drawingPower').value, false);
    this.autoLoanMasterForm.get('drawingPowerTrans').patchValue(tempDrawingPower);

    /* Converting value for date */
    this.autoLoanMasterForm.get('dateOfExpiryTypeTrans').patchValue(
        this.autoLoanMasterForm.get('dateOfExpiryType').value
    );
    const tempDateOfExpType = this.autoLoanMasterForm.get('dateOfExpiryType').value;
    let tempExpDate;
    if (tempDateOfExpType === 'AD') {
      const tempEngExpDate = this.autoLoanMasterForm.get('dateOfExpiry').value;
      tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ?
          this.engToNepDatePipe.transform(this.datePipe.transform(tempEngExpDate), true) : '';
      this.autoLoanMasterForm.get('dateOfExpiryTrans').patchValue(tempExpDate);
    } else {
      const tempDateOfExpNep = this.autoLoanMasterForm.get('dateOfExpiryNepali').value;
      tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
          tempDateOfExpNep.nDate : '';
      this.autoLoanMasterForm.get('dateOfExpiryTrans').patchValue(tempExpDate);
    }

    // translated by google api
    this.translatedFormGroup = this.formBuilder.group({
      purposeOfLoan: !ObjectUtil.isEmpty(this.autoLoanMasterForm.get('purposeOfLoan').value) ? this.autoLoanMasterForm.get('purposeOfLoan').value : '',
      nameOfDealer: !ObjectUtil.isEmpty(this.autoLoanMasterForm.get('nameOfDealer').value) ? this.autoLoanMasterForm.get('nameOfDealer').value : '',
    });

    this.translatedValue =  await this.translateService.translateForm(this.translatedFormGroup);

    this.autoLoanMasterForm.get('purposeOfLoanTrans').patchValue(this.translatedValue.purposeOfLoan);
    this.autoLoanMasterForm.get('nameOfDealerTrans').patchValue(this.translatedValue.nameOfDealer);

    this.setCTValue();
  }

  setCTValue() {
    this.autoLoanMasterForm.get('complementaryOtherCT').patchValue(
        this.autoLoanMasterForm.get('complementaryOtherTrans').value
    );
    this.autoLoanMasterForm.get('vehiclePurchasedCT').patchValue(
        this.autoLoanMasterForm.get('vehiclePurchasedTrans').value
    );
    this.autoLoanMasterForm.get('vehicleRegisteredCT').patchValue(
        this.autoLoanMasterForm.get('vehicleRegisteredTrans').value
    );
    this.autoLoanMasterForm.get('complimentaryLoanSelectedCT').patchValue(
        this.autoLoanMasterForm.get('complimentaryLoanSelectedTrans').value
    );
    this.autoLoanMasterForm.get('autoLoanTypeCT').patchValue(
        this.autoLoanMasterForm.get('autoLoanTypeTrans').value
    );
    this.autoLoanMasterForm.get('loanAmountCT').patchValue(
        this.autoLoanMasterForm.get('loanAmountTrans').value
    );
    this.autoLoanMasterForm.get('loanAmountWordsCT').patchValue(
        this.autoLoanMasterForm.get('loanAmountWordsTrans').value
    );
    this.autoLoanMasterForm.get('loanAmountWordsCT').patchValue(
        this.autoLoanMasterForm.get('loanAmountWordsTrans').value
    );
    this.autoLoanMasterForm.get('purposeOfLoanCT').patchValue(
        this.translatedValue.purposeOfLoan
    );
    this.autoLoanMasterForm.get('baseRateCT').patchValue(
        this.autoLoanMasterForm.get('baseRateTrans').value
    );
    this.autoLoanMasterForm.get('premiumRateCT').patchValue(
        this.autoLoanMasterForm.get('premiumRateTrans').value
    );
    this.autoLoanMasterForm.get('interestRateCT').patchValue(
        this.autoLoanMasterForm.get('interestRateTrans').value
    );
    this.autoLoanMasterForm.get('emiPaymentTypeCT').patchValue(
        this.autoLoanMasterForm.get('emiPaymentTypeTrans').value
    );
    this.autoLoanMasterForm.get('emiInfigureCT').patchValue(
        this.autoLoanMasterForm.get('emiInfigureTrans').value
    );
    this.autoLoanMasterForm.get('emiInWordsCT').patchValue(
        this.autoLoanMasterForm.get('emiInWordsTrans').value
    );
    this.autoLoanMasterForm.get('numberOfInstallmentCT').patchValue(
        this.autoLoanMasterForm.get('numberOfInstallmentTrans').value
    );
    this.autoLoanMasterForm.get('serviceChargeCT').patchValue(
        this.autoLoanMasterForm.get('serviceChargeTrans').value
    );
    this.autoLoanMasterForm.get('tenureOfLoanCT').patchValue(
        this.autoLoanMasterForm.get('tenureOfLoanTrans').value
    );
    this.autoLoanMasterForm.get('drawingPowerCT').patchValue(
        this.autoLoanMasterForm.get('drawingPowerTrans').value
    );
    this.autoLoanMasterForm.get('dateOfExpiryTypeCT').patchValue(
        this.autoLoanMasterForm.get('dateOfExpiryTypeTrans').value
    );
    this.autoLoanMasterForm.get('dateOfExpiryNepaliCT').patchValue(
        this.autoLoanMasterForm.get('dateOfExpiryNepaliTrans').value
    );
    this.autoLoanMasterForm.get('dateOfExpiryCT').patchValue(
        this.autoLoanMasterForm.get('dateOfExpiryTrans').value
    );
    this.autoLoanMasterForm.get('paymentTermsCT').patchValue(
        this.autoLoanMasterForm.get('paymentTermsTrans').value
    );
    this.autoLoanMasterForm.get('paymentAmountFigureCT').patchValue(
        this.autoLoanMasterForm.get('paymentAmountFigureTrans').value
    );
    this.autoLoanMasterForm.get('paymentAmountWordsCT').patchValue(
        this.autoLoanMasterForm.get('paymentAmountWordsTrans').value
    );
    this.autoLoanMasterForm.get('numberOfPaymentsCT').patchValue(
        this.autoLoanMasterForm.get('numberOfPaymentsTrans').value
    );
    this.autoLoanMasterForm.get('nameOfDealerCT').patchValue(
        this.translatedValue.nameOfDealer
    );
    console.log(this.autoLoanMasterForm.value);
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
