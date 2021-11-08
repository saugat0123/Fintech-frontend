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
import {NepaliNumberAndWords} from '../../../../model/nepaliNumberAndWords';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';

@Component({
  selector: 'app-offer-letter-hire-purchase-and-auto-loan',
  templateUrl: './offer-letter-hire-purchase-and-auto-loan.component.html',
  styleUrls: ['./offer-letter-hire-purchase-and-auto-loan.component.scss']
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
  offerLetterDocument: OfferDocument;
  nepaliData;
  loanAmountTemplate = new NepaliNumberAndWords();

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
    this.buildForm();
    this.checkOfferLetter();
  }

  fillForm() {
    this.nepaliData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    if (!ObjectUtil.isEmpty(this.nepaliData)) {
      const customerAddress =
          this.nepaliData.permanentMunicipality + ' j8f g= ' +
          this.nepaliData.permanentWard + ', ' +
          this.nepaliData.permanentDistrict;
      const customerTempAddress =
          this.nepaliData.temporaryMunicipality + ' j8f g= ' +
          this.nepaliData.temporaryWard + ', ' +
          this.nepaliData.temporaryDistrict;
      this.form.patchValue({
        customerName: this.nepaliData.name ? this.nepaliData.name : '',
        customerAddress: customerAddress ? customerAddress : '',
        customerTempAddress: customerTempAddress ? customerTempAddress : '',
        customerMunicipality: this.nepaliData.permanentMunicipality ? this.nepaliData.permanentMunicipality : '',
        customerWardNum: this.nepaliData.permanentWard ? this.nepaliData.permanentWard : '',
        customerDistrict: this.nepaliData.permanentDistrict ? this.nepaliData.permanentDistrict : '',
        signatoryCitizenshipNum: this.nepaliData.citizenshipNo ? this.nepaliData.citizenshipNo : '',
        signatoryCitizenshipIssueDate: this.nepaliData.citizenshipIssueDate ? this.nepaliData.citizenshipIssueDate : '',
        signatoryCitizenshipIssuePlace: this.nepaliData.citizenshipIssueDistrict ? this.nepaliData.citizenshipIssueDistrict : '',
        signatoryParentName: this.nepaliData.fatherName ? this.nepaliData.fatherName : '',
        signatoryGrandParentName: this.nepaliData.grandFatherName ? this.nepaliData.grandFatherName : '',
      });
    }
    this.form.get(['addMoreIndividualDetails', 0, 'amount1']).patchValue(this.loanAmountTemplate.numberNepali);
    this.form.get(['addMoreIndividualDetails', 0, 'amountInWords1']).patchValue(this.loanAmountTemplate.nepaliWords);
  }

  checkOfferLetter() {
    this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
        === this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER_HIRE_PURCHASE_AND_AUTO_LOAN).toString())[0];
    if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
      this.offerLetterDocument = new OfferDocument();
      this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.OFFER_LETTER_HIRE_PURCHASE_AND_AUTO_LOAN);
      this.fillForm();
      this.addPrimaryCollateral();
      this.addAdditionalCollateral();
      this.addMoreIndividualDetails();
    } else {
      const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
      this.initialInfoPrint = initialInfo;
      this.existingOfferLetter = true;
      this.setPrimaryCollaterals(initialInfo.primaryCollaterals);
      this.setAdditionalCollaterals(initialInfo.additionalCollaterals);
      this.setIndividualDetails(initialInfo.individualDetails);

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
    if (data.length === 0) {
      this.addPrimaryCollateral();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        vehicleType: [value.vehicleType],
        vehicleNumber: [value.vehicleNumber],
        vehicleModelNum: [value.vehicleModelNum],
        engineNumber: [value.engineNumber],
        chassisNumber: [value.chassisNumber],
        quotationPrice: [value.quotationPrice],
        vehicleQuotationPrice: [value.vehicleQuotationPrice],
        marginPercentage: [value.marginPercentage],
        marginPercentageOne: [value.marginPercentageOne],
        marginPercentageTwo: [value.marginPercentageTwo],
      }));
    });
  }

  addPrimaryCollateral() {
    (this.form.get('primaryCollaterals') as FormArray).push(
        this.formBuilder.group({
          vehicleType: [undefined],
          vehicleNumber: [undefined],
          vehicleModelNum: [undefined],
          engineNumber: [undefined],
          chassisNumber: [undefined],
          vehicleQuotationPrice: [undefined],
          marginPercentage: [undefined],
          marginPercentageOne: [undefined],
          marginPercentageTwo: [undefined],
        }));
  }

  removePrimaryCollateral(i: number) {
    (this.form.get('primaryCollaterals') as FormArray).removeAt(i);
  }

  setAdditionalCollaterals(data) {
    const formArray = this.form.get('additionalCollaterals') as FormArray;
    if (data.length === 0) {
      this.addAdditionalCollateral();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        name: [value.name],
        fatherName: [value.fatherName],
        grandFatherName: [value.grandFatherName],
        address: [value.address],
        district: [value.district],
        existingAddress: [value.existingAddress],
        currentAddress: [value.currentAddress],
        jaggaKittaNum: [value.jaggaKittaNum],
        landArea: [value.landArea],
        jaggaSiNum: [value.jaggaSiNums],
      }));
    });
  }

  addAdditionalCollateral() {
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

  }

  removeAdditionalCollateral(i: number) {
    (this.form.get('additionalCollaterals') as FormArray).removeAt(i);
  }

  setIndividualDetails(data) {
    const formArray = this.form.get('individualDetails') as FormArray;
    if (data.length === 0) {
      this.addMoreIndividualDetails();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        shreeName1: [value.shreeName1],
        shreeName2: [value.shreeName2],
        amount1: [value.amount1],
        amountInWords1: [value.amountInWords1],
      }));
    });
  }

  addMoreIndividualDetails() {
    (this.form.get('individualDetails') as FormArray).push(
        this.formBuilder.group({
          shreeName1: [undefined],
          shreeName2: [undefined],
          amount1: [undefined],
          amountInWords1: [undefined],
        }));
  }

  removeIndividualDetails(index) {
    (this.form.get('individualDetails') as FormArray).removeAt(index);
  }


  private buildForm() {
    this.form = this.formBuilder.group({
      patraNum: [undefined],
      paFile: [undefined],
      date: [undefined],
      customerName: [undefined],
      branchName: [undefined],
      customerAddress: [undefined],
      customerTempAddress: [undefined],
      customerCitizenshipAddress: [undefined],
      customerMobileNum: [undefined],
      primaryCollaterals: this.formBuilder.array([]),
      additionalCollaterals: this.formBuilder.array([]),
      dhitoDate: [undefined],
      currentDate: [undefined],
      marketPrice: [undefined],
      distestPrice: [undefined],
      farePrice: [undefined],
      individualDetails: this.formBuilder.array([]),
      amount2: [undefined],
      amountInWords2: [undefined],
      amount3: [undefined],
      amountInWords3: [undefined],
      amount4: [undefined],
      financeBranch: [undefined],
      telephoneNumber: [undefined],
      currentAddress1: [undefined],
      customerMobileNum1: [undefined],
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
    });
  }

  getNumAmountFormArray(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }

  getNumAmount(amount1, amountInWords1, i) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(['addMoreIndividualDetails', i, amount1]).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(['addMoreIndividualDetails', i, amountInWords1]).patchValue(returnVal);
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
