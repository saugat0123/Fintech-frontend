import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ProgressiveOfferLetterConst} from '../progressive-offer-letter-const';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliPercentWordPipe} from '../../../../../../@core/pipe/nepali-percent-word.pipe';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {OfferDocument} from '../../../../model/OfferDocument';
import {NbDialogRef} from '@nebular/theme';
import {OfferLetterCorporateComponent} from '../offer-letter-corporate/offer-letter-corporate.component';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {NepDataPersonal} from '../../../../model/nepDataPersonal';

@Component({
  selector: 'app-offer-letter-hire-purchase-and-auto-loan',
  templateUrl: './offer-letter-hire-purchase-and-auto-loan.component.html',
  styleUrls: ['./offer-letter-hire-purchase-and-auto-loan.component.scss'],
})
export class OfferLetterHirePurchaseAndAutoLoanComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;
  form: FormGroup;
  spinner;
  offerLetterConst = ProgressiveOfferLetterConst;
  customerOfferLetter: CustomerOfferLetter;
  initialInfoPrint;
  existingOfferLetter = false;
  isHP = false;
  isLandAndBuilding = false;
  offerLetterDocument: OfferDocument;
  nepaliData;
  nepDataPersonal = new NepDataPersonal();
  primaryCollaterals = new Array<any>();
  secondaryCollaterals = new Array<any>();

  constructor(
      private formBuilder: FormBuilder,
      private nepToEngNumberPipe: NepaliToEngNumberPipe,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private engToNepaliNumberPipe: EngToNepaliNumberPipe,
      private engToNepNumberPipe: EngToNepaliNumberPipe,
      private currencyFormatPipe: CurrencyFormatterPipe,
      private nepPercentWordPipe: NepaliPercentWordPipe,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
      private routerUtilsService: RouterUtilsService,
      private dialogRef: NbDialogRef<OfferLetterCorporateComponent>
  ) {
  }

  ngOnInit() {
    this.nepaliData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    this.nepDataPersonal = JSON.parse(this.cadOfferLetterApprovedDoc.nepDataPersonal);
    (this.nepaliData.collateralDetails).forEach(value => {
      if (value.securityDetails === 'HP') {
        this.primaryCollaterals.push(value);
        this.isHP = true;
      }
    });
    (this.nepaliData.collateralDetails).forEach(value => {
      if (value.securityDetails === 'Land_And_Building') {
        this.secondaryCollaterals.push(value);
        this.isLandAndBuilding = true;
      }
    });
    this.buildForm();
    this.checkOfferLetter();
    this.fillForm();
    this.setPrimaryCollaterals(this.primaryCollaterals);
    this.setAdditionalCollaterals(this.secondaryCollaterals);
    this.setIndividualDetails(this.nepaliData.guarantorDetails);
  }

  fillForm() {
    if (!ObjectUtil.isEmpty(this.nepaliData)) {
      this.form.patchValue({
        customerName: this.nepaliData.name ? this.nepaliData.name : '',
        customerAddress: !ObjectUtil.isEmpty(this.nepaliData.permanentMunicipalities) ?
            this.nepaliData.permanentMunicipalities.nepaliName : '',
        customerAddressWard: !ObjectUtil.isEmpty( this.nepaliData.permanentWard) ?  this.nepaliData.permanentWard : '',
        customerAddressDistrict: !ObjectUtil.isEmpty(this.nepaliData.permanentDistrict) ? this.nepaliData.permanentDistrict.nepaliName : '',
        customerTempAddress: !ObjectUtil.isEmpty(this.nepaliData.temporaryMunicipalities) ?
            this.nepaliData.temporaryMunicipalities.nepaliName : '',
        customerTempAddressWard: !ObjectUtil.isEmpty(this.nepaliData.temporaryWard) ? this.nepaliData.temporaryWard : '',
        customerTempAddressDistrict: !ObjectUtil.isEmpty(this.nepaliData.temporaryDistrict) ?
            this.nepaliData.temporaryDistrict.nepaliName : '',
        customerCitizenshipAddress: !ObjectUtil.isEmpty(this.nepaliData.permanentVdc) ?  this.nepaliData.permanentVdc : '',
        customerCitizenshipAddressWard: !ObjectUtil.isEmpty(this.nepaliData.permanentVdcWard) ? this.nepaliData.permanentVdcWard : '',
        customerCitizenshipAddressDistrict: !ObjectUtil.isEmpty(this.nepaliData.permanentDistrict) ?
            this.nepaliData.permanentDistrict.nepaliName : '',
        customerMobileNum: !ObjectUtil.isEmpty(this.nepaliData.contactNumber) ? this.nepaliData.contactNumber : '',
        financeBranch: !ObjectUtil.isEmpty(this.nepaliData.branchName) ? this.nepaliData.branchName : '',
        amount: !ObjectUtil.isEmpty(this.nepDataPersonal.numberNepali) ? this.nepDataPersonal.numberNepali : '',
        amountInWords: !ObjectUtil.isEmpty(this.nepDataPersonal.nepaliWords) ? this.nepDataPersonal.nepaliWords : '',
        monthlyPayment: !ObjectUtil.isEmpty(this.nepDataPersonal.installmentAmount) ? this.nepDataPersonal.installmentAmount : '',
        yearlyInterest: !ObjectUtil.isEmpty(this.nepDataPersonal.interestRate) ? this.nepDataPersonal.interestRate : '',
        interestBaseRate: !ObjectUtil.isEmpty(this.nepDataPersonal.baseRate) ? this.nepDataPersonal.baseRate : '',
        interestPremiumRate: !ObjectUtil.isEmpty(this.nepDataPersonal.premium) ? this.nepDataPersonal.premium : '',
        interestTempDiscountRate: !ObjectUtil.isEmpty(this.nepDataPersonal.discount) ? this.nepDataPersonal.discount : '',
        dhitoDate: !ObjectUtil.isEmpty(this.nepaliData.valuationDate) ? this.nepaliData.valuationDate : '',
        currentDate: !ObjectUtil.isEmpty(this.nepaliData.valuatorName) ? this.nepaliData.valuatorName : '',
        marketPrice: !ObjectUtil.isEmpty(this.nepaliData.fairMarketValue) ? this.nepaliData.fairMarketValue : '',
        distestPrice: !ObjectUtil.isEmpty(this.nepaliData.distressValue) ? this.nepaliData.distressValue : '',
        farePrice: !ObjectUtil.isEmpty(this.nepDataPersonal.numberNepali) ? this.nepDataPersonal.numberNepali : '',
        loanLimitTime: !ObjectUtil.isEmpty(this.nepDataPersonal.tenureOfLoanInYears) ? this.nepDataPersonal.tenureOfLoanInYears : '',
        serviceCharge: !ObjectUtil.isEmpty(this.nepDataPersonal.serviceFeePercent) ? this.nepDataPersonal.serviceFeePercent : '',
        telephoneNumber: !ObjectUtil.isEmpty(this.nepaliData.branchTelNo) ? this.nepaliData.branchTelNo : '',
        customerEmail: !ObjectUtil.isEmpty(this.nepaliData.customerEmail) ? this.nepaliData.customerEmail : '',
        signatoryCitizenshipNum: !ObjectUtil.isEmpty(this.nepaliData.citizenshipNo) ? this.nepaliData.citizenshipNo : '',
        signatoryCitizenshipIssueDate: !ObjectUtil.isEmpty(this.nepaliData.citizenshipIssueDate) ?
            this.nepaliData.citizenshipIssueDate : '',
        signatoryCitizenshipIssuePlace: !ObjectUtil.isEmpty(this.nepaliData.citizenshipIssueDistrict) ?
            this.nepaliData.citizenshipIssueDistrict : '',
        signatoryParentName: !ObjectUtil.isEmpty(this.nepaliData.fatherName) ? this.nepaliData.fatherName : '',
        signatoryGrandParentName: !ObjectUtil.isEmpty(this.nepaliData.grandFatherName) ? this.nepaliData.grandFatherName : '',
        isLandAndBuilding: this.isLandAndBuilding,
        isHP: this.isHP
      });
    }
  }

  checkOfferLetter() {
    this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
        === this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER_HIRE_PURCHASE_AND_AUTO_LOAN).toString())[0];
    if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
      this.offerLetterDocument = new OfferDocument();
      this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER_HIRE_PURCHASE_AND_AUTO_LOAN);
      this.fillForm();
    } else {
      const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
      this.initialInfoPrint = initialInfo;
      this.existingOfferLetter = true;
      this.form.patchValue(this.initialInfoPrint);
    }
  }

  onSubmit(): void {
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;
    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER_HIRE_PURCHASE_AND_AUTO_LOAN).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.form.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER_HIRE_PURCHASE_AND_AUTO_LOAN);
      offerDocument.initialInformation = JSON.stringify(this.form.value);
      this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
    }

    this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    });
  }

  setPrimaryCollaterals(data) {
    const formArray = this.form.get('primaryCollaterals') as FormArray;
    data.forEach((value, i) => {
      if (value.securityDetails === 'HP') {
        formArray.push(this.formBuilder.group({
          vehicleType: [!ObjectUtil.isEmpty(value.vehicleType) ? value.vehicleType : ''],
          vehicleNumber: [!ObjectUtil.isEmpty(value.vehicleNumber) ? value.vehicleNumber : ''],
          vehicleModelNum: [!ObjectUtil.isEmpty(value.vehicleModelNum) ? value.vehicleModelNum : ''],
          engineNumber: [!ObjectUtil.isEmpty(value.engineNumber) ? value.engineNumber : ''],
          chassisNumber: [!ObjectUtil.isEmpty(value.chassisNumber) ? value.chassisNumber : ''],
          vehicleQuotationPrice: [!ObjectUtil.isEmpty(value.vehicleQuotationPrice) ? value.vehicleQuotationPrice : ''],
          marginPercentageOne: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.primaryCollaterals) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.primaryCollaterals[i]) ?
                      this.initialInfoPrint.primaryCollaterals[i].marginPercentageOne : '' : '' : ''],
          marginPercentageTwo: [!ObjectUtil.isEmpty(this.initialInfoPrint) ?
              !ObjectUtil.isEmpty(this.initialInfoPrint.primaryCollaterals) ?
                  !ObjectUtil.isEmpty(this.initialInfoPrint.primaryCollaterals[i]) ?
                      this.initialInfoPrint.primaryCollaterals[i].marginPercentageTwo : '' : '' : ''],
        }));
      }
    });
  }

  removePrimaryCollateral(i: number) {
    (this.form.get('primaryCollaterals') as FormArray).removeAt(i);
  }

  setAdditionalCollaterals(data) {
    const formArray = this.form.get('additionalCollaterals') as FormArray;
    data.forEach(value => {
      if (value.securityDetails === 'Land_And_Building') {
        const tempExistingAddress = value.collateralMunVdcOriginal + ', ' + value.collateralWardNoOld;
        const tempNewAddress = value.collateralMunVdcChanged + ', ' + value.wardNoNew;
        formArray.push(this.formBuilder.group({
          name: [!ObjectUtil.isEmpty(value.collateralName) ? value.collateralName : ''],
          fatherName: [!ObjectUtil.isEmpty(value.collateralFatherName) ? value.collateralFatherName : ''],
          grandFatherName: [!ObjectUtil.isEmpty(value.collateralGrandFatherName) ? value.collateralGrandFatherName : ''],
          address: [!ObjectUtil.isEmpty(value.collateralPermanentMunVdc) ? value.collateralPermanentMunVdc.nepaliName : ''],
          addressVDC: [!ObjectUtil.isEmpty(value.collateralPermanentVdc) ? value.collateralPermanentVdc : ''],
          addressWard: [!ObjectUtil.isEmpty(value.collateralPermanentVdcWard) ? value.collateralPermanentVdcWard : ''],
          district: [!ObjectUtil.isEmpty(value.collateralDistrict) ? value.collateralDistrict : ''],
          existingAddress: [tempExistingAddress ? tempExistingAddress : ''],
          currentAddress: [tempNewAddress ? tempNewAddress : ''],
          jaggaKittaNum: [!ObjectUtil.isEmpty(value.plotNo) ? value.plotNo : ''],
          landArea: [!ObjectUtil.isEmpty(value.areaOfCollateral) ? value.areaOfCollateral : ''],
          jaggaSiNum: [!ObjectUtil.isEmpty(value.seatNo) ? value.seatNo : ''],
        }));
      }
    });
  }

  /*addAdditionalCollateral() {
    (this.form.get('additionalCollaterals') as FormArray).push(
        this.formBuilder.group({
          name: [undefined],
          fatherName: [undefined],
          grandFatherName: [undefined],
          address: [undefined],
          district: [undefined],
          existingAddress: [undefined],
          currentAddress: [undefined],
          jaggaKittaNum: [undefined],
          landArea: [undefined],
          jaggaSiNum: [undefined],
        }));
  }*/

  removeAdditionalCollateral(i: number) {
    (this.form.get('additionalCollaterals') as FormArray).removeAt(i);
  }

  setIndividualDetails(data) {
    const formArray = this.form.get('individualDetails') as FormArray;
    (this.form.get('individualDetails') as FormArray).clear();
    if (data.length === 0) {
      this.addIndividualDetails();
      return;
    }
    data.forEach((value, i) => {
      /*let allGuarantors = '';
      (this.nepaliData.guarantorDetails).forEach(guarantor => {
        allGuarantors = allGuarantors + guarantor.guarantorName + ', ';
      });
      allGuarantors = allGuarantors.slice(0, -2);
      allGuarantors = allGuarantors.replace(/,(?=[^,]*$)/, ' र');*/
      formArray.push(this.formBuilder.group({
        shreeName1: [!ObjectUtil.isEmpty(value.guarantorName) ? value.guarantorName : ''],
        amount1: !ObjectUtil.isEmpty(this.nepDataPersonal.numberNepali) ? this.nepDataPersonal.numberNepali : '',
        amountInWords1: !ObjectUtil.isEmpty(this.nepDataPersonal.nepaliWords) ? this.nepDataPersonal.nepaliWords : '',
      }));
    });
  }

  addIndividualDetails() {
    return this.formBuilder.group({
          shreeName1: [undefined],
          amount1: [undefined],
          amountInWords1: [undefined],
        });
  }

  addMoreIndividualDetails() {
  const formArray = (this.form.get('individualDetails') as FormArray);
  formArray.push(this.addIndividualDetails());
}

  removeIndividualDetails(index) {
    (this.form.get('individualDetails') as FormArray).removeAt(index);
  }


  private buildForm() {
    this.form = this.formBuilder.group({
      patraNum: [undefined],
      date: [undefined],
      customerName: [undefined],
      financeBranch: [undefined],
      customerAddress: [undefined],
      customerAddressWard: [undefined],
      customerAddressDistrict: [undefined],
      customerTempAddress: [undefined],
      customerTempAddressWard: [undefined],
      customerTempAddressDistrict: [undefined],
      customerCitizenshipAddress: [undefined],
      customerCitizenshipAddressWard: [undefined],
      customerCitizenshipAddressDistrict: [undefined],
      customerMobileNum: [undefined],
      primaryCollaterals: this.formBuilder.array([]),
      additionalCollaterals: this.formBuilder.array([]),
      dhitoDate: [undefined],
      currentDate: [undefined],
      marketPrice: [undefined],
      distestPrice: [undefined],
      farePrice: [undefined],
      individualDetails: this.formBuilder.array([this.addIndividualDetails()]),
      telephoneNumber: [undefined],
      currentAddress1: [undefined],
      customerEmail: [undefined],
      employeeName1: [undefined],
      employeeName2: [undefined],
      signatoryCitizenshipNum: [undefined],
      signatoryCitizenshipIssueDate: [undefined],
      signatoryCitizenshipIssuePlace: [undefined],
      signatoryParentName: [undefined],
      signatoryGrandParentName: [undefined],
      witnessName1: [undefined],
      witnessAddress1: [undefined],
      witnessName2: [undefined],
      witnessAddress2: [undefined],
      sahichhapEmployee: [undefined],
      sanketNumber: [undefined],
      docDate: [undefined],
      docyear: [undefined],
      docMonth: [undefined],
      docRoj: [undefined],
      subham: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      monthlyPayment: [undefined],
      yearlyInterest: [undefined],
      interestBaseRate: [undefined],
      interestPremiumRate: [undefined],
      interestTempDiscountRate: [undefined],
      interestFinalRate: [undefined],
      loanLimitTime: [undefined],
      serviceCharge: [undefined],
      vehicleType: [undefined],
      isLandAndBuilding: [false],
      isHP: [false]
    });
  }

  getNumAmountFormArray(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }

  getNumAmount(amount1: string, amountInWords1: string, i: number) {
    const wordLabelVar1 = this.nepToEngNumberPipe.transform(this.form.get(['individualDetails', i, amount1]).value);
    const returnVal1 = this.nepaliCurrencyWordPipe.transform(wordLabelVar1);
    this.form.get(['individualDetails', i, amountInWords1]).patchValue(returnVal1);
  }

  getNumAmountInWord(amount3: string, amountInWords3: string) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(amount3).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(amountInWords3).patchValue(returnVal);
  }

  calcYearlyRate(interestBaseRate: string, interestPremiumRate: string, interestTempDiscountRate: string, yearlyInterest: string) {
    const addRate = parseFloat(this.nepToEngNumberPipe.transform(this.form.get(interestBaseRate).value)) +
        parseFloat(this.nepToEngNumberPipe.transform(this.form.get(interestPremiumRate).value)) -
        parseFloat(this.nepToEngNumberPipe.transform(this.form.get(interestTempDiscountRate).value));
    const finalValue = this.engToNepaliNumberPipe.transform(this.currencyFormatPipe.transform(addRate));
    this.form.get(yearlyInterest).patchValue(finalValue);
  }

}
