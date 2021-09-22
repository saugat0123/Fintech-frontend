import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {SbTranslateService} from '../../../../../@core/service/sbtranslate.service';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {OfferDocument} from '../../../model/OfferDocument';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {RetailProfessionalLoanComponent} from '../../../mega-offer-letter-template/mega-offer-letter/retail-professional-loan/retail-professional-loan.component';

@Component({
  selector: 'app-educational-loan-template-data',
  templateUrl: './educational-loan-template-data.component.html',
  styleUrls: ['./educational-loan-template-data.component.scss']
})
export class EducationalLoanTemplateDataComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  translatedValues: any = {};
  form: FormGroup;
  fieldFlag = false;
  selectedSecurityVal;
  selectedCountryVal;
  embassyName;
  spinner = false;
  finalSavedFlag: boolean;
  loanLimit = false;
  existingOfferLetter = false;
  btnDisable = true;
  previewBtn = true;
  offerLetterConst = NabilOfferLetterConst;

  constructor(
      private formBuilder: FormBuilder,
      private dialogService: NbDialogService,
      private modelService: NgbModal,
      private ngDialogRef: NbDialogRef<EducationalLoanTemplateDataComponent>,
      private nepToEngNumberPipe: NepaliToEngNumberPipe,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private translateService: SbTranslateService,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
  ) { }

  ngOnInit() {
    console.log('Cad Data', this.customerApprovedDoc);
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      embassyName: [undefined],
      selectedCountry: [undefined],
      selectedSecurity: [undefined],
      loanLimitChecked: [undefined],

      dateOfApproval: [undefined],
      referenceNumber: [undefined],
      dateOfApplication: [undefined],
      purposeOfLoan: [undefined],
      amountInWords: [undefined],
      fixedDepositReceiptAmountFigure: [undefined],
      fixedDepositReceiptAmountWords: [undefined],
      fixedDepositAmountNumber: [undefined],
      distressValue: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      interestRate: [undefined],
      loanAdminFeeFigure: [undefined],
      loanAdminFeeWords: [undefined],
      emiAmountFigure: [undefined],
      emiAmountWords: [undefined],
      loanPeriodInMonths: [undefined],
      moratoriumPeriodInMonths: [undefined],
      loanCommitmentFeeInPercentage: [undefined],
      fixedDepositHolderName: [undefined],
      fixedDepositAmountFigure: [undefined],
      tenureFixedDeposit: [undefined],
      tenureDepositReceiptNumber: [undefined],
      guarantorName: [undefined],
      guaranteedAmountFigure: [undefined],
      guaranteedAmountWords: [undefined],
      nameOfBranch: [undefined],
      nameOfEmbassy: [undefined],
      nameOfFixedDeposit: [undefined],
      pledgeAmountFigure: [undefined],
      insuranceAmountFigure: [undefined],
      relationshipOfficerName: [undefined],
      branchManager: [undefined],
      sakhshiDistrict: [undefined],
      sakhshiMunicipality: [undefined],
      sakhshiWardNo: [undefined],
      sakhshiName: [undefined],
      approvalStaffName: [undefined],
      ownersName: [undefined],
      district: [undefined],
      municipality: [undefined],
      wardNo: [undefined],
      seatNo: [undefined],
      kittaNo: [undefined],
      landArea: [undefined],
      promissoryNoteAmount: [undefined],
      loanDeedAmount: [undefined],

      // Translated Value
      dateOfApprovalTransVal: [undefined],
      referenceNumberTransVal: [undefined],
      nameOfCustomerTransVal: [undefined],
      addressOfCustomerTransVal: [undefined],
      dateOfApplicationTransVal: [undefined],
      purposeOfLoanTransVal: [undefined],
      loanAmountFigureTransVal: [undefined],
      amountInWordsTransVal: [undefined],
      fixedDepositReceiptAmountFigureTransVal: [undefined],
      fixedDepositReceiptAmountWordsTransVal: [undefined],
      fixedDepositAmountNumberTransVal: [undefined],
      distressValueTransVal: [undefined],
      baseRateTransVal: [undefined],
      premiumRateTransVal: [undefined],
      interestRateTransVal: [undefined],
      loanAdminFeeFigureTransVal: [undefined],
      loanAdminFeeWordsTransVal: [undefined],
      emiAmountFigureTransVal: [undefined],
      emiAmountWordsTransVal: [undefined],
      loanPeriodInMonthsTransVal: [undefined],
      moratoriumPeriodInMonthsTransVal: [undefined],
      loanCommitmentFeeInPercentageTransVal: [undefined],
      fixedDepositHolderNameTransVal: [undefined],
      fixedDepositAmountFigureTransVal: [undefined],
      tenureFixedDepositTransVal: [undefined],
      tenureDepositReceiptNumberTransVal: [undefined],
      guarantorNameTransVal: [undefined],
      guaranteedAmountFigureTransVal: [undefined],
      guaranteedAmountWordsTransVal: [undefined],
      nameOfBranchTransVal: [undefined],
      nameOfEmbassyTransVal: [undefined],
      nameOfFixedDepositTransVal: [undefined],
      pledgeAmountFigureTransVal: [undefined],
      insuranceAmountFigureTransVal: [undefined],
      relationshipOfficerNameTransVal: [undefined],
      branchManagerTransVal: [undefined],
      sakhshiDistrictTransVal: [undefined],
      sakhshiMunicipalityTransVal: [undefined],
      sakhshiWardNoTransVal: [undefined],
      sakhshiNameTransVal: [undefined],
      approvalStaffNameTransVal: [undefined],
      ownersNameTransVal: [undefined],
      districtTransVal: [undefined],
      municipalityTransVal: [undefined],
      wardNoTransVal: [undefined],
      seatNoTransVal: [undefined],
      kittaNoTransVal: [undefined],
      landAreaTransVal: [undefined],
      promissoryNoteAmountTransVal: [undefined],
      loanDeedAmountTransVal: [undefined],
    });
  }

  submit() {
    console.log('Submitted Value ', this.form.value);
    this.form.get('loanLimitChecked').patchValue(this.loanLimit);
    console.log('Translated data from the submitted values!', this.translatedValues);
      this.spinner = true;
      this.btnDisable = true;
      this.customerApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

      this.translatedValues.selectedCountry = this.form.get('selectedCountry').value;
      this.translatedValues.selectedSecurity = this.form.get('selectedSecurity').value;
      this.translatedValues.loanLimitChecked = this.loanLimit;

    console.log('Translated Data', this.translatedValues);

      if (this.existingOfferLetter) {
          this.customerApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
              if (offerLetterPath.docName.toString() ===
                  this.offerLetterConst.value(this.offerLetterConst.EDUCATIONAL).toString()) {
                  offerLetterPath.initialInformation = JSON.stringify(this.translatedValues);
              }
          });
      } else {
          const offerDocument = new OfferDocument();
          offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.EDUCATIONAL);
          offerDocument.initialInformation = JSON.stringify(this.translatedValues);
          console.log('initial Information Document:::: ', offerDocument);
          this.customerApprovedDoc.offerDocumentList.push(offerDocument);
      }

      this.administrationService.saveCadDocumentBulk(this.customerApprovedDoc).subscribe(() => {
          this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
          this.spinner = false;
          this.previewBtn = this.btnDisable = false;
      }, error => {
          console.error(error);
          this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
          this.spinner = this.btnDisable = false;
      });
  }

  transferValue() {
    const country = this.form.get('selectedCountry').value;
    const security = this.form.get('selectedSecurity').value;

    if (!ObjectUtil.isEmpty(country) && !ObjectUtil.isEmpty(security)) {
      this.fieldFlag = true;
      this.selectedCountryVal = country;
      this.selectedSecurityVal = security;
      // if (!ObjectUtil.isEmpty(this.form.get('embassyName').value)) {
      //   this.singleTranslate(this.form.get('embassyName').value);
      // }
      // this.embassyName = this.translateService.translate(this.form.get('embassyName').value);
      console.log('Embassy Name', this.embassyName);
    }
  }

  openModel() {
    // this.modelService.open(modalName, {size: 'xl', centered: true});
    this.dialogService.open(RetailProfessionalLoanComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      hasBackdrop: false,
      context: {
        cadOfferLetterApprovedDoc: this.customerApprovedDoc,
        preview: true,
      }
    });
  }

  onClose() {
    this.modelService.dismissAll();
  }

  async translate() {
    this.spinner = true;
    this.translatedValues = await this.translateService.translateForm(this.form);
    this.spinner = false;
    this.btnDisable = false;
  }

  async singleTranslate(data) {
    this.spinner = true;
    const value = await this.translateService.translate(data);
    this.embassyName = value[0].translatedText;
    this.spinner = false;
  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }

  checkboxVal(event, formControlName) {
    // if (!ObjectUtil.isEmpty(this.translatedValues[formControlName])) {
    //   const val = this.translatedValues[formControlName];
    //   this.form.get(formControlName + 'TransVal').patchValue(val);
    // }
    const checkVal = event.target.checked;
    this[formControlName + 'Check'] = checkVal;
    console.log('checked Value', this[formControlName + 'Check']);
    if (!checkVal) {
      this.clearForm(formControlName + 'TransVal');
    }
  }

  clearForm(controlName) {
    this.form.get(controlName).setValue(null);
  }

    loanChecked(data) {
        this.loanLimit = data;
    }

    // changeDocumentName(securityType) {
    //     if (securityType === 'FIXED_DEPOSIT') {
    //       this.docSecurityName = 'Class A';
    //     } else {
    //       this.docSecurityName = 'Class E';
    //     }
    // }
}

