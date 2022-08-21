import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {LaxmiOfferLetterConst} from '../laxmi-offer-letter-const';
import {OfferDocument} from '../../../../model/OfferDocument';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {NbDialogRef} from '@nebular/theme';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {NepaliCurrencyFormatterPipe} from '../../../../../../@core/pipe/nepali-currency-formatter.pipe';
import {LaxmiPurpose} from '../../../../../loan/model/laxmi-purpose';
import {formatDate} from '@angular/common';
import {ClientTypeShortFormPipe} from '../../../../../../@core/pipe/client-type-short-form.pipe';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';

@Component({
  selector: 'app-variation-offer-letter',
  templateUrl: './variation-offer-letter.component.html',
  styleUrls: ['./variation-offer-letter.component.scss']
})
export class VariationOfferLetterComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;
  form: FormGroup;
  spinner = false;
  offerLetterConst = LaxmiOfferLetterConst;
  existingOfferLetter = false;
  initialInfoPrint;
  offerLetterDocument: OfferDocument;
  nepaliData;
  purpose = LaxmiPurpose.enumObject();
  loanType = [];
  documentWord = [' गर्नुपर्नेछ |', ' गराएको यथावत रहने छ |'];
  hypoDocument = [' गरिदिनु पर्नेछ |', ' बैंकलाई उपलब्ध गराएको यथावत रहने छ ।'];
  commissionFreq = ['मासिक', 'त्रैमासिक', 'वार्षिक', 'अर्ध वार्षिक'];
  @Input() isVariation = false;

  constructor(
      private formBuilder: FormBuilder,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
      private routerUtilsService: RouterUtilsService,
      private dialogRef: NbDialogRef<VariationOfferLetterComponent>,
      private engToNepNumberPipe: EngToNepaliNumberPipe,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private nepaliCurrencyFormatterPipe: NepaliCurrencyFormatterPipe,
      private clientTypeShort: ClientTypeShortFormPipe,
      private nepaliToEnglishPipe: NepaliToEngNumberPipe,
  ) { }

  ngOnInit() {
    this.buildForm();
    this.parseAssignedLoanData();
    this.checkOfferLetter();
  }
  checkOfferLetter() {
    if (this.isVariation) {
      this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
          === this.offerLetterConst.value(this.offerLetterConst.VARIATION_OFFER_LETTER).toString())[0];
      if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
        this.offerLetterDocument = new OfferDocument();
        this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.VARIATION_OFFER_LETTER);
        this.fillForm();
        this.convertProposed();
      } else {
        const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
        this.existingOfferLetter = true;
        this.form.patchValue(initialInfo);
        this.setSecrityData(initialInfo.security);
        this.setCrossSecurityData(initialInfo.crossSecurity);
        this.setVehicleData(initialInfo.vehicleSecurity);
        this.setShareData(initialInfo.shareSecurity);
        this.setGuarantor(initialInfo.personalGuarantee, 'personalGuarantee');
        this.setGuarantor(initialInfo.corporateGuarantee, 'corporateGuarantee');
        this.setMoreSecurity(initialInfo.moreSecurity);
        this.initialInfoPrint = initialInfo;
      }
    } else {
      this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
          === this.offerLetterConst.value(this.offerLetterConst.VARIATION_OFFER_LETTER_FOR_COLLATERAL).toString())[0];
      if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
        this.offerLetterDocument = new OfferDocument();
        this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.VARIATION_OFFER_LETTER_FOR_COLLATERAL);
        this.fillForm();
        this.convertProposed();
      } else {
        const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
        this.existingOfferLetter = true;
        this.form.patchValue(initialInfo);
        this.setRemarks(initialInfo.purpose);
        this.setSecrityData(initialInfo.security);
        this.setCrossSecurityData(initialInfo.crossSecurity);
        this.setVehicleData(initialInfo.vehicleSecurity);
        this.setShareData(initialInfo.shareSecurity);
        this.setGuarantor(initialInfo.personalGuarantee, 'personalGuarantee');
        this.setGuarantor(initialInfo.corporateGuarantee, 'corporateGuarantee');
        this.setMoreSecurity(initialInfo.moreSecurity);
        this.initialInfoPrint = initialInfo;
      }
    }
  }
  fillForm() {
     this.nepaliData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    if (!ObjectUtil.isEmpty(this.nepaliData)) {
      this.form.patchValue({
        authorizedPerson: this.nepaliData.authorizedPersonDetail.name ? this.nepaliData.authorizedPersonDetail.name : '',
      });
    }
  }
  buildForm() {
    this.form = this.formBuilder.group({
      branchCode: [undefined],
      patraDate: [undefined],
      date: [undefined],
      borrowerName: [undefined],
      address: [undefined],
      contactNo: [undefined],
      attention: [undefined],
      refNumberOne: [undefined],
      refNumberTwo: [undefined],
      loanApprovalDate: [undefined],
      purpose: this.formBuilder.array([]),
      security: this.formBuilder.array([]),
      crossSecurity: this.formBuilder.array([]),
      reRegisterSecurity: this.formBuilder.array([]),
      vehicleSecurity: this.formBuilder.array([]),
      shareSecurity: this.formBuilder.array([]),
      personalGuarantee: this.formBuilder.array([]),
      corporateGuarantee: this.formBuilder.array([]),
      moreSecurity: this.formBuilder.array([]),
      fixedChecked: [true],
      collateralChecked: [false],
      reRegisterChecked: [false],
      registerMortgageOtherChecked: [false],
      fixedRenewWithEnhance: [false],
      swapFee: [true],
      otherSwapFeeChecked: [false],
      swapFeeOther: [undefined],
      prepaymentCharge: [true],
      prepaymentOtherCheck: [false],
      prepaymentOther: [undefined],
      commitmentFee: [true],
      commitmentFeeOtherCheck: [false],
      commitmentFeeOther: [undefined],
      informationFee: [true],
      informationFeeOtherCheck: [false],
      informationFeeOther: [undefined],
      valuationFee: [true],
      valuationFeeOtherCheck: [false],
      valuationFeeOther: [undefined],
      penalInterest: [true],
      penalInterestOtherCheck: [false],
      crossCollateralOtherChecked: [false],
      penalInterestOther: [undefined],
      amountOne: [undefined],
      amountInFigureOne: [undefined],
      amountTwo: [undefined],
      amountInFigureTwo: [undefined],
      fixedAssetsWord: [undefined],
      date1: [undefined],
      amount1: [undefined],
      registerMortgageOther: [undefined],
      ligLoan: [undefined],
      landLoanAmount: [undefined],
      totalNepaliConsumptionAmount: [undefined],
      totalConsumptionAmountWord: [undefined],
      loanBorrower: [undefined],
      consumptionAmount: [undefined],
      totalConsumptionAmount: [undefined],
      crossRenewWithEnhance: [false],
      crossCollateralWord: [undefined],
      date2: [undefined],
      crossCollateralOther: [undefined],
      reRegisterOtherChecked: [false],
      reRegisterDate: [undefined],
      reRegisterAmount: [undefined],
      reRegisterEnhance: [false],
      reRegisterOther: [undefined],
      vehicleSecurityNeeded: [true],
      vehicleSecurityOtherChecked: [false],
      date3: [undefined],
      vehicleSecurityOther: [undefined],
      shareSecurityNeeded: [true],
      shareOtherChecked: [false],
      shareRenewWith: [false],
      shareWord: [undefined],
      karjaWord: [undefined],
      date11: [undefined],
      loanTamsukOther: [undefined],
      date4: [undefined],
      shareOther: [undefined],
      peGuaranteeCheck: [true],
      coGuaranteeCheck: [false],
      currentAssetsNeeded: [true],
      currentAssetsOtherCheck: [false],
      currentAssetsRenew: [false],
      currentAssetsWord: [undefined],
      date7: [undefined],
      amount7: [undefined],
      currentAssetsOther: [undefined],
      fixedAssetsNeeded: [true],
      fixedHypoRenew: [false],
      fixedHypoWord: [undefined],
      date8: [undefined],
      amount8: [undefined],
      fixedAssetOtherCheck: [false],
      fixedAssetOther: [undefined],
      creditFacilityNeeded: [true],
      guaranteeFacilityNeeded: [true],
      letterCM: [undefined],
      cashLetterOtherCheck: [false],
      cashGuaranteeOtherCheck: [false],
      guarnateeCM: [undefined],
      cashGuaranteeOther: [undefined],
      cashLetterOther: [undefined],
      personalSecurityNeeded: [true],
      personalLoanOtherCheck: [false],
      date9: [undefined],
      personalLoanOther: [undefined],
      cashLienNeeded: [true],
      cashlienOtherCheck: [false],
      accountName: [undefined],
      accountNo: [undefined],
      accountAmount: [undefined],
      nepaliAccountAmount: [undefined],
      accountAmountWord: [undefined],
      date10: [undefined],
      cashlienOther: [undefined],
      loanTamsukOtherCheck: [false],
      loanAmount: [undefined],
      nepaliLoanAmount: [undefined],
      loanAmountWord: [undefined],
      karjaRenewChecked: [false],
      promiseAmount: [undefined],
      nepaliPromiseAmount: [undefined],
      promiseAmountWord: [undefined],
      creditLetterRenewChecked: [false],
      creditLetterWord: [undefined],
      date12: [undefined],
      promiseOtherCheck: [false],
      promiseOther: [undefined],
      nameOfBorrower: [undefined],
      amountThree: [undefined],
      amountInFigureThree: [undefined],
      marginPercentage: [undefined],
      refNumberThree: [undefined],
      refNumberFour: [undefined],
      dateOfLoanApproval: [undefined],
      staffNameOne: [undefined],
      staffNameTwo: [undefined],
      staffDesignationOne: [undefined],
      staffDesignationTwo: [undefined],
      loanApprovalLetter: [undefined],
      authorizedPerson: [undefined]
    });
  }
  parseAssignedLoanData() {
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
      this.cadOfferLetterApprovedDoc.assignedLoan.forEach((l, i) => {
        this.loanType.push(l.loanType);
        this.addPurpose(l);
      });
      const branchCode = (this.cadOfferLetterApprovedDoc.id).toString().padStart(4, '0');
      this.form.get('branchCode').patchValue(branchCode);
      this.form.get('patraDate').patchValue(formatDate(new Date(), 'dd-MM-yyyy', 'en'));
    }
  }
  valueChange(value, i, formControlName) {
    if (formControlName === 'purpose') {
      this.form.get(['purpose', i, formControlName]).patchValue(value);
      this.form.get(['purpose', i, 'otherPurpose']).patchValue(null);
    } else if (formControlName === 'rateMode') {
      this.form.get(['purpose', i, 'rateMode']).patchValue(value);
      this.form.get(['purpose', i, 'premiumRate']).patchValue(null);
      this.form.get(['purpose', i, 'monthlyRate']).patchValue(null);
      this.form.get(['purpose', i, 'quarterlyRate']).patchValue(null);
      this.form.get(['purpose', i, 'otherInterestRate']).patchValue(null);
    } else if (formControlName === 'repaymentMode') {
      this.form.get(['purpose', i, formControlName]).patchValue(value);
      this.form.get(['purpose', i, 'repaymentAmount']).patchValue(null);
      this.form.get(['purpose', i, 'repaymentAmount1']).patchValue(null);
      this.form.get(['purpose', i, 'repaymentAmount2']).patchValue(null);
      this.form.get(['purpose', i, 'repaymentAmount3']).patchValue(null);
      this.form.get(['purpose', i, 'repaymentAmountWord']).patchValue(null);
      this.form.get(['purpose', i, 'repaymentMonthly']).patchValue(null);
      this.form.get(['purpose', i, 'repaymentRate']).patchValue(null);
      this.form.get(['purpose', i, 'repaymentRate1']).patchValue(null);
      this.form.get(['purpose', i, 'otherRepayment']).patchValue(null);
      this.form.get(['purpose', i, 'nepaliRepaymentAmount']).patchValue(null);
    } else {
      this.form.get(['purpose', i, formControlName]).patchValue(value);
    }
  }
  otherValueCheck(checked, i, formControlName) {
    switch (formControlName) {
      case 'drawDownCheck':
        if (checked) {
          this.form.get(['purpose', i, 'drawDownCheck']).patchValue(checked);
        } else {
          this.form.get(['purpose', i, 'drawDownCheck']).patchValue(false);
          this.form.get(['purpose', i, 'drawDown']).patchValue(null);
        }
        break;
      case 'drawDownPeriodNeeded':
        if (checked) {
          this.form.get(['purpose', i, 'drawDownPeriodNeeded']).patchValue(checked);
          this.form.get(['purpose', i, 'drawDownDate']).patchValue(null);
          this.form.get(['purpose', i, 'downPeriodValue']).patchValue(null);
        } else {
          this.form.get(['purpose', i, 'drawDownPeriodNeeded']).patchValue(checked);
        }
        break;
      case 'drawDownOtherPeriodCheck':
        if (checked) {
          this.form.get(['purpose', i, 'drawDownOtherPeriodCheck']).patchValue(checked);
          this.form.get(['purpose', i, 'drawDownDate']).patchValue(null);
        } else {
          this.form.get(['purpose', i, 'drawDownOtherPeriodCheck']).patchValue(false);
          this.form.get(['purpose', i, 'downPeriodValue']).patchValue(null);
        }
        break;
      case 'moratariumPeriodNeeded':
        if (checked) {
          this.form.get(['purpose', i, 'moratariumPeriodNeeded']).patchValue(checked);
          this.form.get(['purpose', i, 'moratariumMonth']).patchValue(null);
          this.form.get(['purpose', i, 'moratariumValue']).patchValue(null);
        } else {
          this.form.get(['purpose', i, 'moratariumPeriodNeeded']).patchValue(checked);
        }
        break;
      case 'moratariumOtherCheck':
        if (checked) {
          this.form.get(['purpose', i, 'moratariumOtherCheck']).patchValue(checked);
          this.form.get(['purpose', i, 'moratariumMonth']).patchValue(null);
        } else {
          this.form.get(['purpose', i, 'moratariumOtherCheck']).patchValue(false);
          this.form.get(['purpose', i, 'moratariumValue']).patchValue(null);
        }
        break;
      case 'commissionNeeded':
        if (checked) {
          this.form.get(['purpose', i, 'commissionNeeded']).patchValue(checked);
          this.form.get(['purpose', i, 'rate']).patchValue(null);
          this.form.get(['purpose', i, 'commissionOther']).patchValue(null);
        } else {
          this.form.get(['purpose', i, 'commissionNeeded']).patchValue(checked);
        }
        break;
      case 'maturityNeeded':
        if (checked) {
          this.form.get(['purpose', i, 'maturityNeeded']).patchValue(checked);
          this.form.get(['purpose', i, 'maturityDate']).patchValue(null);
        } else {
          this.form.get(['purpose', i, 'maturityNeeded']).patchValue(checked);
        }
        break;
      case 'maturityOtherCheck':
        if (checked) {
          this.form.get(['purpose', i, 'maturityOtherCheck']).patchValue(checked);
          this.form.get(['purpose', i, 'maturityValue']).patchValue(null);
        } else {
          this.form.get(['purpose', i, 'maturityOtherCheck']).patchValue(checked);
        }
        break;
      case 'tenureNeeded':
        if (checked) {
          this.form.get(['purpose', i, 'tenureNeeded']).patchValue(checked);
          this.form.get(['purpose', i, 'reviewDate']).patchValue(null);
        } else {
          this.form.get(['purpose', i, 'tenureNeeded']).patchValue(checked);
        }
        break;
      case 'processingNeeded':
        if (checked) {
          this.form.get(['purpose', i, 'processingNeeded']).patchValue(checked);
          this.form.get(['purpose', i, 'loanProcessingRate']).patchValue(null);
          this.form.get(['purpose', i, 'loanProcessingAmount']).patchValue(null);
        } else {
          this.form.get(['purpose', i, 'processingNeeded']).patchValue(checked);
        }
        break;
      case 'adNeeded':
        if (checked) {
          this.form.get(['purpose', i, 'adNeeded']).patchValue(checked);
          this.form.get(['purpose', i, 'administrationRate']).patchValue(null);
          this.form.get(['purpose', i, 'administrationAmount']).patchValue(null);
        } else {
          this.form.get(['purpose', i, 'adNeeded']).patchValue(checked);
        }
        break;
      case 'repaymentNeeded':
        if (checked) {
          this.form.get(['purpose', i, 'repaymentNeeded']).patchValue(checked);
          this.form.get(['purpose', i, 'otherRepayment']).patchValue(null);
          this.form.get(['purpose', i, 'repaymentAmount']).patchValue(null);
          this.form.get(['purpose', i, 'repaymentAmountWord']).patchValue(null);
          this.form.get(['purpose', i, 'repaymentMonthly']).patchValue(null);
          this.form.get(['purpose', i, 'repaymentRate']).patchValue(null);
          this.form.get(['purpose', i, 'repaymentRate1']).patchValue(null);
          this.form.get(['purpose', i, 'repaymentAmount1']).patchValue(null);
          this.form.get(['purpose', i, 'repaymentAmount2']).patchValue(null);
          this.form.get(['purpose', i, 'repaymentAmount3']).patchValue(null);
        } else {
          this.form.get(['purpose', i, 'repaymentNeeded']).patchValue(checked);
        }
        break;
      case 'inPercentage':
        if (checked) {
          this.form.get(['purpose', i, 'inPercentage']).patchValue(checked);
          this.form.get(['purpose', i, 'administrationRate']).patchValue(null);
          this.form.get(['purpose', i, 'adFeeOther']).patchValue(null);
          this.form.get(['purpose', i, 'otherAdFeeChecked']).patchValue(false);
        } else {
          this.form.get(['purpose', i, 'inPercentage']).patchValue(checked);
        }
        break;
      case 'inAmount':
        if (checked) {
          this.form.get(['purpose', i, 'inAmount']).patchValue(checked);
          this.form.get(['purpose', i, 'administrationAmount']).patchValue(null);
          this.form.get(['purpose', i, 'adFeeOther']).patchValue(null);
          this.form.get(['purpose', i, 'otherAdFeeChecked']).patchValue(false);
        } else {
          this.form.get(['purpose', i, 'inAmount']).patchValue(checked);
        }
        break;
      case 'otherAdFeeChecked':
        if (checked) {
          this.form.get(['purpose', i, 'otherAdFeeChecked']).patchValue(checked);
          this.form.get(['purpose', i, 'administrationAmount']).patchValue(null);
          this.form.get(['purpose', i, 'administrationRate']).patchValue(null);
          this.form.get(['purpose', i, 'inAmount']).patchValue(false);
          this.form.get(['purpose', i, 'inPercentage']).patchValue(false);
        } else {
          this.form.get(['purpose', i, 'otherAdFeeChecked']).patchValue(checked);
        }
        break;
      case 'facilityNeeded':
        if (checked) {
          this.form.get(['purpose', i, 'facilityNeeded']).patchValue(checked);
        } else {
          this.form.get(['purpose', i, 'facilityNeeded']).patchValue(checked);
        }
        break;
      case 'otherLimitChecked':
        if (checked) {
          this.form.get(['purpose', i, 'otherLimitChecked']).patchValue(checked);
        } else {
          this.form.get(['purpose', i, 'otherLimitChecked']).patchValue(checked);
          this.form.get(['purpose', i, 'otherLimit']).patchValue(null);
        }
        break;
      case 'interestNeeded':
        if (checked) {
          this.form.get(['purpose', i, 'interestNeeded']).patchValue(checked);
          this.form.get(['purpose', i, 'rateMode']).patchValue(null);
        } else {
          this.form.get(['purpose', i, 'interestNeeded']).patchValue(checked);
        }
        break;
      case 'commissionOtherCheck':
        if (checked) {
          this.form.get(['purpose', i, 'commissionOtherCheck']).patchValue(checked);
          this.form.get(['purpose', i, 'commissionValue']).patchValue(null);
        } else {
          this.form.get(['purpose', i, 'commissionOtherCheck']).patchValue(checked);
        }
        break;
    }
  }
  addPurpose(data) {
    const purposeData = this.form.get('purpose') as FormArray;
    purposeData.push(
        this.formBuilder.group({
          loan: [data.loan.name],
          loanTag: [data.loan.loanTag],
          loanLimitAmount: [data.proposal.proposedLimit],
          nepaliLoanLimitAmount: [undefined],
          loanLimitWord: [undefined],
          isFunded: [data.loan.isFunded],
          loanNature: [data.loan.loanNature],
          loanType: [data.loanType],
          purpose: [undefined],
          drawDown: [undefined],
          drawDownCheck: [true],
          otherPurpose: [undefined],
          periodOtherCheck: [false],
          drawDownOtherPeriodCheck: [false],
          maturityOtherCheck: [false],
          commissionOtherCheck: [false],
          moratariumOtherCheck: [false],
          drawDownPeriodNeeded: [true],
          commissionNeeded: [true],
          repaymentNeeded: [true],
          maturityNeeded: [true],
          inAmount: [false],
          inPercentage: [true],
          tenureNeeded: [true],
          adNeeded: [true],
          moratariumPeriodNeeded: [true],
          moratariumValue: [undefined],
          maturityValue: [undefined],
          commissionValue: [undefined],
          downPeriodValue: [undefined],
          moratariumMonth: [undefined],
          drawDownDate: [undefined],
          termMonth: [undefined],
          periodValue: [undefined],
          rate: [undefined],
          commissionFrequency: [undefined],
          creditRate: [undefined],
          creditAmount: [undefined],
          maturityDate: [undefined],
          telexAmount: [undefined],
          // Rate model
          rateMode: [undefined],
          reviewDate: [undefined],
          premiumRate: [undefined],
          monthlyRate: [undefined],
          quarterlyRate: [undefined],
          // Repayment
          repaymentMode: [undefined],
          repaymentAmount: [undefined],
          nepaliRepaymentAmount: [undefined],
          repaymentAmount1: [undefined],
          repaymentAmount2: [undefined],
          repaymentAmount3: [undefined],
          repaymentAmountWord: [undefined],
          repaymentMonthly: [undefined],
          repaymentRate: [undefined],
          repaymentRate1: [undefined],
          administrationRate: [undefined],
          administrationAmount: [undefined],
          nepaliAdministrationAmount: [undefined],
          reviewRate: [undefined],
          reviewAmount: [undefined],
          otherRepayment: [undefined],
          otherInterestRate: [undefined],
          otherAdFeeChecked: [false],
          adFeeOther: [undefined],
          addRemark: this.formBuilder.array([]),
          facilityNeeded: [true],
          otherLimitChecked: [false],
          otherLimit: [undefined],
          interestNeeded: [undefined]
        })
    );
  }
  convertProposed() {
    const data = this.form.get('purpose') as FormArray;
    data.value.forEach((d, i) => {
      const word = this.nepaliCurrencyWordPipe.transform(d.loanLimitAmount);
      const nepaliFormat = this.engToNepNumberPipe.transform(this.nepaliCurrencyFormatterPipe.transform(d.loanLimitAmount));
      this.form.get(['purpose', i, 'loanLimitAmount']).patchValue(d.loanLimitAmount);
      this.form.get(['purpose', i, 'nepaliLoanLimitAmount']).patchValue(nepaliFormat);
      this.form.get(['purpose', i, 'loanLimitWord']).patchValue(word);
    });
  }
  convertProposedAmount(value, i: number, arrayType) {
    const word = this.nepaliCurrencyWordPipe.transform(value);
    const nepaliFormat = this.engToNepNumberPipe.transform(this.nepaliCurrencyFormatterPipe.transform(value));
    switch (arrayType) {
      case 'purpose':
        this.form.get(['purpose', i, 'loanLimitAmount']).patchValue(value);
        this.form.get(['purpose', i, 'nepaliLoanLimitAmount']).patchValue(nepaliFormat);
        this.form.get(['purpose', i, 'loanLimitWord']).patchValue(word);
        break;
      case 'repaymentAmount' :
        this.form.get(['purpose', i, 'repaymentAmount']).patchValue(value);
        this.form.get(['purpose', i, 'nepaliRepaymentAmount']).patchValue(nepaliFormat);
        this.form.get(['purpose', i, 'repaymentAmountWord']).patchValue(word);
        break;
      case 'personalGuarantee' :
        this.form.get([arrayType, i, 'amount']).patchValue(value);
        this.form.get([arrayType, i, 'nepaliAmount']).patchValue(nepaliFormat);
        this.form.get([arrayType, i, 'amountInWord']).patchValue(word);
        break;
      case 'corporateGuarantee' :
        this.form.get([arrayType, i, 'amount']).patchValue(value);
        this.form.get([arrayType, i, 'nepaliAmount']).patchValue(nepaliFormat);
        this.form.get([arrayType, i, 'amountInWord']).patchValue(word);
        break;
      case 'administrationAmount':
        this.form.get(['purpose', i, 'administrationAmount']).patchValue(value);
        this.form.get(['purpose', i, 'nepaliAdministrationAmount']).patchValue(nepaliFormat);
        break;
    }
  }
  addRemark(i: number) {
    const controls = this.form.get(['purpose' , i, 'addRemark']) as FormArray;
    controls.push(this.formBuilder.group({
      remark: [undefined]
    }));
  }

  removeRemarks(ix: number, i) {
    (<FormArray>this.form.get(['purpose', i, 'addRemark'])).removeAt(ix);
  }
  setRemarks(data) {
    data.forEach((d, index) => {
      const remark = this.form.get(['purpose', index, 'addRemark']) as FormArray;
      if (!ObjectUtil.isEmpty(d.addRemark)) {
        d.addRemark.forEach(r => {
          remark.push(this.formBuilder.group({
            remark: [r.remark],
          }));
        });
      }
    });
  }
  remarkValueChange(value: any, ix: number, i: number) {
    const rem = this.form.get(['purpose', i, 'addRemark']) as FormArray;
    rem.at(ix).patchValue({
      remark: value
    });
  }
  otherCheck(event, value) {
    switch (value) {
      case 'swapFee':
        if (event) {
          this.form.get('swapFee').patchValue(event);
        } else {
          this.form.get('swapFee').patchValue(false);
          this.form.get('otherSwapFeeChecked').patchValue(false);
          this.form.get('swapFeeOther').patchValue(null);
        }
        break;
      case 'otherSwapFeeChecked':
        if (event) {
          this.form.get('otherSwapFeeChecked').patchValue(event);
        } else {
          this.form.get('otherSwapFeeChecked').patchValue(false);
          this.form.get('swapFeeOther').patchValue(null);
        }
        break;
      case 'prepaymentCharge':
        if (event) {
          this.form.get('prepaymentCharge').patchValue(event);
        } else {
          this.form.get('prepaymentCharge').patchValue(false);
          this.form.get('prepaymentOtherCheck').patchValue(false);
          this.form.get('prepaymentOther').patchValue(null);
        }
        break;
      case 'prepaymentOtherCheck':
        if (event) {
          this.form.get('prepaymentOtherCheck').patchValue(event);
        } else {
          this.form.get('prepaymentOtherCheck').patchValue(false);
          this.form.get('prepaymentOther').patchValue(null);
        }
        break;
      case 'commitmentFee':
        if (event) {
          this.form.get('commitmentFee').patchValue(event);
        } else {
          this.form.get('commitmentFee').patchValue(false);
          this.form.get('commitmentFeeOtherCheck').patchValue(false);
          this.form.get('commitmentFeeOther').patchValue(null);
        }
        break;
      case 'commitmentFeeOtherCheck':
        if (event) {
          this.form.get('commitmentFeeOtherCheck').patchValue(event);
        } else {
          this.form.get('commitmentFeeOtherCheck').patchValue(false);
          this.form.get('commitmentFeeOther').patchValue(null);
        }
        break;
      case 'informationFee':
        if (event) {
          this.form.get('informationFee').patchValue(event);
        } else {
          this.form.get('informationFee').patchValue(false);
          this.form.get('informationFeeOtherCheck').patchValue(false);
          this.form.get('informationFeeOther').patchValue(null);
        }
        break;
      case 'informationFeeOtherCheck':
        if (event) {
          this.form.get('informationFeeOtherCheck').patchValue(event);
        } else {
          this.form.get('informationFeeOtherCheck').patchValue(false);
          this.form.get('informationFeeOther').patchValue(null);
        }
        break;
      case 'valuationFee':
        if (event) {
          this.form.get('valuationFee').patchValue(event);
        } else {
          this.form.get('valuationFee').patchValue(false);
          this.form.get('valuationFeeOtherCheck').patchValue(false);
          this.form.get('valuationFeeOther').patchValue(null);
        }
        break;
      case 'valuationFeeOtherCheck':
        if (event) {
          this.form.get('valuationFeeOtherCheck').patchValue(event);
        } else {
          this.form.get('valuationFeeOtherCheck').patchValue(false);
          this.form.get('valuationFeeOther').patchValue(null);
        }
        break;
      case 'penalInterest':
        if (event) {
          this.form.get('penalInterest').patchValue(event);
        } else {
          this.form.get('penalInterest').patchValue(false);
          this.form.get('penalInterestOtherCheck').patchValue(false);
          this.form.get('penalInterestOther').patchValue(null);
        }
        break;
      case 'penalInterestOtherCheck':
        if (event) {
          this.form.get('penalInterestOtherCheck').patchValue(event);
        } else {
          this.form.get('penalInterestOtherCheck').patchValue(false);
          this.form.get('penalInterestOther').patchValue(null);
        }
        break;
      case 'peGuaranteeOtherCheck':
        if (event) {
          this.form.get('peGuaranteeOtherCheck').patchValue(event);
          this.form.get('personalName').patchValue(null);
          this.form.get('personalAmount').patchValue(null);
          this.form.get('personalAmountWord').patchValue(null);
        } else {
          this.form.get('peGuaranteeOtherCheck').patchValue(false);
          this.form.get('peGuaranteeOther').patchValue(null);
        }
        break;
      case 'coGuaranteeOtherCheck':
        if (event) {
          this.form.get('coGuaranteeOtherCheck').patchValue(event);
          this.form.get('corporateName').patchValue(null);
          this.form.get('corporateAmount').patchValue(null);
          this.form.get('corporateAmountWord').patchValue(null);
        } else {
          this.form.get('coGuaranteeOtherCheck').patchValue(false);
          this.form.get('coGuaranteeOther').patchValue(null);
        }
        break;
      case 'currentAssetsOtherCheck':
        if (event) {
          this.form.get('currentAssetsOtherCheck').patchValue(event);
        } else {
          this.form.get('currentAssetsOtherCheck').patchValue(false);
          this.form.get('currentAssetsOther').patchValue(null);
        }
        break;
      case 'fixedAssetOtherCheck':
        if (event) {
          this.form.get('fixedAssetOtherCheck').patchValue(event);
        } else {
          this.form.get('fixedAssetOtherCheck').patchValue(false);
          this.form.get('fixedAssetOther').patchValue(null);
        }
        break;
      case 'personalLoanOtherCheck':
        if (event) {
          this.form.get('personalLoanOtherCheck').patchValue(event);
        } else {
          this.form.get('personalLoanOtherCheck').patchValue(false);
          this.form.get('personalLoanOther').patchValue(null);
        }
        break;
      case 'cashlienOtherCheck':
        if (event) {
          this.form.get('cashlienOtherCheck').patchValue(event);
          this.form.get('accountName').patchValue(null);
          this.form.get('accountNo').patchValue(null);
          this.form.get('accountAmount').patchValue(null);
          this.form.get('accountAmountWord').patchValue(null);
          this.form.get('nepaliAccountAmount').patchValue(null);
        } else {
          this.form.get('cashlienOtherCheck').patchValue(false);
          this.form.get('cashlienOther').patchValue(null);
        }
        break;
      case 'loanTamsukOtherCheck':
        if (event) {
          this.form.get('loanTamsukOtherCheck').patchValue(event);
          this.form.get('loanAmount').patchValue(null);
          this.form.get('loanAmountWord').patchValue(null);
          this.form.get('nepaliLoanAmount').patchValue(null);
        } else {
          this.form.get('loanTamsukOtherCheck').patchValue(false);
          this.form.get('loanTamsukOther').patchValue(null);
        }
        break;
      case 'promiseOtherCheck':
        if (event) {
          this.form.get('promiseOtherCheck').patchValue(event);
          this.form.get('promiseAmount').patchValue(null);
          this.form.get('promiseAmountWord').patchValue(null);
          this.form.get('nepaliPromiseAmount').patchValue(null);
        } else {
          this.form.get('promiseOtherCheck').patchValue(false);
          this.form.get('promiseOther').patchValue(null);
        }
        break;

      case 'cashLetterOtherCheck':
        if (event) {
          this.form.get('cashLetterOtherCheck').patchValue(event);
          this.form.get('letterCM').patchValue(null);
        } else {
          this.form.get('cashLetterOtherCheck').patchValue(false);
          this.form.get('cashLetterOther').patchValue(null);
        }
        break;

      case 'cashGuaranteeOtherCheck':
        if (event) {
          this.form.get('cashGuaranteeOtherCheck').patchValue(event);
          this.form.get('guarnateeCM').patchValue(null);
        } else {
          this.form.get('cashGuaranteeOtherCheck').patchValue(false);
          this.form.get('cashGuaranteeOther').patchValue(null);
        }
        break;
      case 'fixedChecked':
        if (event) {
          this.form.get('fixedChecked').patchValue(event);
        } else {
          this.form.get('fixedChecked').patchValue(false);
        }
        break;
      case 'collateralChecked':
        if (event) {
          this.form.get('collateralChecked').patchValue(event);
        } else {
          this.form.get('collateralChecked').patchValue(false);
        }
        break;
      case 'peGuaranteeCheck':
        if (event) {
          this.form.get('peGuaranteeCheck').patchValue(event);
        } else {
          this.form.get('peGuaranteeCheck').patchValue(false);
        }
        break;
      case 'coGuaranteeCheck':
        if (event) {
          this.form.get('coGuaranteeCheck').patchValue(event);
        } else {
          this.form.get('coGuaranteeCheck').patchValue(false);
        }
        break;
      case 'currentAssetsNeeded':
        if (event) {
          this.form.get('currentAssetsNeeded').patchValue(event);
        } else {
          this.form.get('currentAssetsNeeded').patchValue(false);
        }
        break;
      case 'personalSecurityNeeded':
        if (event) {
          this.form.get('personalSecurityNeeded').patchValue(event);
          this.form.get('personalLoanOther').patchValue(null);
        } else {
          this.form.get('personalSecurityNeeded').patchValue(false);
        }
        break;
      case 'cashLienNeeded':
        if (event) {
          this.form.get('cashLienNeeded').patchValue(event);
          this.form.get('cashlienOther').patchValue(null);
        } else {
          this.form.get('cashLienNeeded').patchValue(false);
        }
        break;
      case 'vehicleSecurityNeeded':
        if (event) {
          this.form.get('vehicleSecurityNeeded').patchValue(event);
        } else {
          this.form.get('vehicleSecurityNeeded').patchValue(false);
        }
        break;
      case 'shareSecurityNeeded':
        if (event) {
          this.form.get('shareSecurityNeeded').patchValue(event);
        } else {
          this.form.get('shareSecurityNeeded').patchValue(false);
        }
        break;
      case 'fixedAssetsNeeded':
        if (event) {
          this.form.get('fixedAssetsNeeded').patchValue(event);
        } else {
          this.form.get('fixedAssetsNeeded').patchValue(false);
        }
        break;
      case 'creditFacilityNeeded':
        if (event) {
          this.form.get('creditFacilityNeeded').patchValue(event);
        } else {
          this.form.get('creditFacilityNeeded').patchValue(false);
        }
        break;
      case 'guaranteeFacilityNeeded':
        if (event) {
          this.form.get('guaranteeFacilityNeeded').patchValue(event);
        } else {
          this.form.get('guaranteeFacilityNeeded').patchValue(false);
        }
        break;
      case 'reRegisterChecked':
        if (event) {
          this.form.get('reRegisterChecked').patchValue(event);
        } else {
          this.form.get('reRegisterChecked').patchValue(false);
        }
        break;
      case 'shareOtherChecked':
        if (event) {
          this.form.get('shareOtherChecked').patchValue(event);
        } else {
          this.form.get('shareOtherChecked').patchValue(false);
          this.form.get('shareOther').patchValue(null);
        }
        break;
      case 'registerMortgageOtherChecked':
        if (event) {
          this.form.get('registerMortgageOtherChecked').patchValue(event);
        } else {
          this.form.get('registerMortgageOtherChecked').patchValue(false);
          this.form.get('registerMortgageOther').patchValue(null);
        }
        break;
      case 'crossCollateralOtherChecked':
        if (event) {
          this.form.get('crossCollateralOtherChecked').patchValue(event);
        } else {
          this.form.get('crossCollateralOtherChecked').patchValue(false);
          this.form.get('crossCollateralOther').patchValue(null);
        }
        break;
      case 'reRegisterOtherChecked':
        if (event) {
          this.form.get('reRegisterOtherChecked').patchValue(event);
        } else {
          this.form.get('reRegisterOtherChecked').patchValue(false);
          this.form.get('reRegisterOther').patchValue(null);
        }
        break;
      case 'vehicleSecurityOtherChecked':
        if (event) {
          this.form.get('vehicleSecurityOtherChecked').patchValue(event);
        } else {
          this.form.get('vehicleSecurityOtherChecked').patchValue(false);
          this.form.get('vehicleSecurityOther').patchValue(null);
        }
        break;
    }
  }
  addSecurity(securityType) {
    const security = this.form.get(securityType) as FormArray;
    security.push(
        this.formBuilder.group({
          ownerName: [undefined],
          district: [undefined],
          vdc: [undefined],
          wardNo: [undefined],
          plotNumber: [undefined],
          area: [undefined]
        })
    );
  }
  removeSecurity(ii: number, securityType) {
    (<FormArray>this.form.get(securityType)).removeAt(ii);
  }

  setSecrityData(data) {
    const dataArray = this.form.get('security') as FormArray;
    if (!ObjectUtil.isEmpty(data)) {
      data.forEach(singleData => {
        dataArray.push(this.formBuilder.group({
          ownerName: [singleData.ownerName],
          district: [singleData.district],
          vdc: [singleData.vdc],
          wardNo: [singleData.wardNo],
          plotNumber: [singleData.plotNumber],
          area: [singleData.area]
        }));
      });
    }
  }
  securityValueChange(value: any, i: number, securityType, formControlName) {
    switch (securityType) {
      case 'collateralSecurity':
        this.form.get(['security', i, formControlName]).patchValue(value);
        break;
      case 'shareSecurity':
        this.form.get(['shareSecurity', i, formControlName]).patchValue(value);
        break;
      case 'vehicleSecurity':
        this.form.get(['vehicleSecurity', i, formControlName]).patchValue(value);
        break;
      case 'crossCollateralSecurity':
        this.form.get(['crossSecurity', i, formControlName]).patchValue(value);
        break;
      case 'reRegisterSecurity':
        this.form.get(['reRegisterSecurity', i, formControlName]).patchValue(value);
        break;
    }
  }
  wordChange(value: any, formControl: string) {
    this.form.get(formControl).patchValue(value);
  }
  otherCheckedValue(event, formControlName, word) {
    if (event) {
      this.form.get(formControlName).patchValue(event);
    } else {
      this.form.get(formControlName).patchValue(event);
      this.form.get(word).patchValue(null);
    }
  }
  setCrossSecurityData(data) {
    const dataArray = this.form.get('crossSecurity') as FormArray;
    if (!ObjectUtil.isEmpty(data)) {
      data.forEach(singleData => {
        dataArray.push(this.formBuilder.group({
          ownerName: [singleData.ownerName],
          district: [singleData.district],
          vdc: [singleData.vdc],
          wardNo: [singleData.wardNo],
          plotNumber: [singleData.plotNumber],
          area: [singleData.area]
        }));
      });
    }
  }
  convertAmount(value, type) {
    const nepaliFormat = this.engToNepNumberPipe.transform(this.nepaliCurrencyFormatterPipe.transform(value));
    const word = this.nepaliCurrencyWordPipe.transform(value);
    this.form.get(type).patchValue(value);
    switch (type) {
      case 'promiseAmount':
        this.form.get('promiseAmountWord').patchValue(word);
        this.form.get('nepaliPromiseAmount').patchValue(nepaliFormat);
        break;
      case 'totalConsumptionAmount':
        this.form.get('totalConsumptionAmountWord').patchValue(word);
        this.form.get('totalNepaliConsumptionAmount').patchValue(nepaliFormat);
        break;
      case 'accountAmount':
        const word2 = this.nepaliCurrencyWordPipe.transform(this.nepaliToEnglishPipe.transform(value));
        this.form.get(type).patchValue(value);
        this.form.get('accountAmountWord').patchValue(word);
        this.form.get('nepaliAccountAmount').patchValue(nepaliFormat);
        break;
      case 'loanAmount':
        this.form.get('loanAmountWord').patchValue(word);
        this.form.get('nepaliLoanAmount').patchValue(nepaliFormat);
        break;
    }
  }
  addVehicleSecurity() {
    const vSecurity = this.form.get('vehicleSecurity') as FormArray;
    vSecurity.push(
        this.formBuilder.group({
          vehicleDetail: [undefined],
          engineNumber: [undefined],
          chassisNumber: [undefined],
          model: [undefined]
        })
    );
  }
  setVehicleData(data) {
    const dataArray = this.form.get('vehicleSecurity') as FormArray;
    if (!ObjectUtil.isEmpty(data)) {
      data.forEach(singleData => {
        dataArray.push(this.formBuilder.group({
          vehicleDetail: [singleData.vehicleDetail],
          engineNumber: [singleData.engineNumber],
          chassisNumber: [singleData.chassisNumber],
          model: [singleData.model]
        }));
      });
    }
  }
  addShareSecurity() {
    const shSecurity = this.form.get('shareSecurity') as FormArray;
    shSecurity.push(
        this.formBuilder.group({
          shareHolderName: [undefined],
          companyName: [undefined],
          totalShareUnit: [undefined],
          shareType: [undefined],
        })
    );
  }
  setShareData(data) {
    const dataArray = this.form.get('shareSecurity') as FormArray;
    if (!ObjectUtil.isEmpty(data)) {
      data.forEach(singleData => {
        dataArray.push(this.formBuilder.group({
          shareHolderName: [singleData.shareHolderName],
          companyName: [singleData.companyName],
          totalShareUnit: [singleData.totalShareUnit],
          shareType: [singleData.shareType],
        }));
      });
    }
  }
  addGuarantee(arrayType) {
    const guarantee = this.form.get(arrayType) as FormArray;
    guarantee.push(
        this.formBuilder.group({
          name: [undefined],
          amount: [undefined],
          nepaliAmount: [undefined],
          amountInWord: [undefined],
          date: [undefined],
          other: [undefined],
          otherChecked: [false],
          renewWithChecked: [false],
          renewWithWord: [undefined]
        })
    );
  }
  private setGuarantor(data, guaranteeType) {
    const g = this.form.get(guaranteeType) as FormArray;
    if (!ObjectUtil.isEmpty(data)) {
      data.forEach(d => {
        g.push(
            this.formBuilder.group({
              name: [d.name],
              amount: [d.amount],
              nepaliAmount: [d.nepaliAmount],
              amountInWord: [d.amountInWord],
              date: [d.date],
              other: [d.other],
              otherChecked: [d.otherChecked],
              renewWithChecked: [d.renewWithChecked],
              renewWithWord: [d.renewWithWord]
            })
        );
      });
    }
  }
  guarantorValueCheck(checked: any, i: number, formControlName: string, gtype: string) {
    switch (formControlName) {
      case 'otherChecked':
        if (checked) {
          this.form.get([gtype, i, formControlName]).patchValue(checked);
        } else {
          this.form.get([gtype, i, formControlName]).patchValue(checked);
          this.form.get([gtype, i, 'name']).patchValue(null);
          this.form.get([gtype, i, 'amount']).patchValue(null);
        }
        break;
      case 'renewWithChecked':
        if (checked) {
          this.form.get([gtype, i, formControlName]).patchValue(checked);
        } else {
          this.form.get([gtype, i, formControlName]).patchValue(checked);
          this.form.get([gtype, i, 'renewWithWord']).patchValue(null);
        }
        break;
    }
  }
  addMoreSecurity() {
    (this.form.get('moreSecurity') as FormArray).push(
        this.formBuilder.group({
          otherSecurity: [undefined]
        })
    );
  }
  setMoreSecurity(data) {
    const dataArray = this.form.get('moreSecurity') as FormArray;
    if (!ObjectUtil.isEmpty(data)) {
      data.forEach(singleData => {
        dataArray.push(this.formBuilder.group({
          otherSecurity: [singleData.otherSecurity]
        }));
      });
    }
  }
  guarantorValueChange(value: any, i: number, guarantorType, formControlName) {
    this.form.get([guarantorType, i, formControlName]).patchValue(value);
  }
  submit() {
    this.spinner = true;
    if (this.isVariation) {
      if (this.existingOfferLetter) {
        this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(singleCadFile => {
          if (singleCadFile.docName.toString() ===
              this.offerLetterConst.value(this.offerLetterConst.VARIATION_OFFER_LETTER).toString()) {
            singleCadFile.initialInformation = JSON.stringify(this.form.value);
          }
        });
      } else {
        const offerDocument = new OfferDocument();
        offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.VARIATION_OFFER_LETTER);
        offerDocument.initialInformation = JSON.stringify(this.form.value);
        this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
      }
    } else {
      if (this.existingOfferLetter) {
        this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(singleCadFile => {
          if (singleCadFile.docName.toString() ===
              this.offerLetterConst.value(this.offerLetterConst.VARIATION_OFFER_LETTER_FOR_COLLATERAL).toString()) {
            singleCadFile.initialInformation = JSON.stringify(this.form.value);
          }
        });
      } else {
        const offerDocument = new OfferDocument();
        offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.VARIATION_OFFER_LETTER_FOR_COLLATERAL);
        offerDocument.initialInformation = JSON.stringify(this.form.value);
        this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
      }
    }
    this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved '));
      this.dialogRef.close();
      this.spinner = false;
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    }, error => {
      console.error(error);
      this.spinner = false;
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
      this.dialogRef.close();
    });
  }
}
