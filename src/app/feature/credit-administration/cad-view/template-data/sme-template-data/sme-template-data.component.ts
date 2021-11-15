// import { Component, OnInit } from '@angular/core';
//
// @Component({
//   selector: 'app-sme-template-data',
//   templateUrl: './sme-template-data.component.html',
//   styleUrls: ['./sme-template-data.component.scss']
// })
// export class SmeTemplateDataComponent implements OnInit {
//
//   constructor() { }
//
//   ngOnInit() {
//   }
//
// }

import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SbTranslateService} from '../../../../../@core/service/sbtranslate.service';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {NabilOfferLetterConst} from "../../../nabil-offer-letter-const";
import {Alert, AlertType} from "../../../../../@theme/model/Alert";
import {CadDocStatus} from "../../../model/CadDocStatus";
import {ObjectUtil} from "../../../../../@core/utils/ObjectUtil";
import {OfferDocument} from "../../../model/OfferDocument";
import {Attributes} from "../../../../../@core/model/attributes";
import {NbDialogRef, NbDialogService} from "@nebular/theme";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CreditAdministrationService} from "../../../service/credit-administration.service";
import {ToastService} from "../../../../../@core/utils";
import {EngToNepaliNumberPipe} from "../../../../../@core/pipe/eng-to-nepali-number.pipe";
import {CustomerApprovedLoanCadDocumentation} from "../../../model/customerApprovedLoanCadDocumentation";
import {SmeComponent} from "../../../mega-offer-letter-template/mega-offer-letter/sme/sme.component";
import {CurrencyFormatterPipe} from "../../../../../@core/pipe/currency-formatter.pipe";
import {CadOfferLetterConfigurationComponent} from "../../../cad-offerletter-profile/cad-offer-letter-configuration/cad-offer-letter-configuration.component";
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';

@Component({
  selector: 'app-sme-template-data',
  templateUrl: './sme-template-data.component.html',
  styleUrls: ['./sme-template-data.component.scss']
})
export class SmeTemplateDataComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  offerLetterTypes = [];
  offerLetterConst = NabilOfferLetterConst;
  offerLetterSelect;
  form: FormGroup;
  translatedValues: any = {};
  spinner = false;
  previewBtn = true;
  btnDisable = true;
  loanLimit = false;
  existingOfferLetter = false;
  attributes;
  tdValues: any = {};
  podtranslatedData: any ={};
  offerLetterDocument: OfferDocument;
  dateTypeBS = false;
  dateTypeAD = false;
  dateTypeBS1 = false;
  dateTypeAD1 = false;
  dateTypeBS2 = false;
  dateTypeAD2 = false;
  submitted = false;
  fieldFlag = false;
  selectedAutoLoanVal;
  selectedInterestVal;
  closed = false;


  constructor(
      private formBuilder: FormBuilder,
      private dialogService: NbDialogService,
      private modelService: NgbModal,
      private nepToEngNumberPipe: NepaliToEngNumberPipe,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private translateService: SbTranslateService,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
      private engToNepaliNumberPipe: EngToNepaliNumberPipe,
      private currencyFormatterPipe: CurrencyFormatterPipe,
      protected dialogRefcad: NbDialogRef<CadOfferLetterConfigurationComponent>,
      private modalService: NgbModal,
      private datePipe: DatePipe,
      private engNepDatePipe: EngNepDatePipe
  ) {
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      selectedAutoLoan: [undefined],
      selectedInterest: [undefined],
      loanLimitChecked: [undefined],
      // referenceNumber: [undefined],
      dateOfApproval: [undefined],
      dateOfApprovalType: [undefined],
      dateOfApprovalNepali: [undefined],
      dateofApplication: [undefined],
      dateofApplicationType: [undefined],
      dateofApplicationNepali: [undefined],
      vehicleName: [undefined],
      drawingPower: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      yearlyInterestRate: [undefined],
      loanAdminFee: [undefined],
      loanAdminFeeInWords: [undefined],
      emiAmountInFigure: [undefined],
      emiAmountInWords: [undefined],
      numberOfEmi: [undefined],
      loanCommitmentFee: [undefined],
      vendorName: [undefined],
      relationshipOfficerName: [undefined],
      branchManager: [undefined],
      // staffName: [undefined],

      //For translated data
      selectedAutoLoanTransVal: [undefined],
      selectedInterestTransVal: [undefined],
      loanLimitCheckedTransVal: [undefined],
      // referenceNumberTransVal: [undefined, Validators.required],
      dateOfApprovalTransVal: [undefined],
      dateOfApprovalNepaliTransVal: [undefined],
      dateOfApprovalTypeTransVal: [undefined],
      dateofApplicationTransVal: [undefined],
      dateofApplicationNepaliTransVal: [undefined],
      dateofApplicationTypeTransVal: [undefined],
      vehicleNameTransVal: [undefined, Validators.required],
      drawingPowerTransVal: [undefined, Validators.required],
      baseRateTransVal: [undefined],
      premiumRateTransVal: [undefined],
      yearlyInterestRateTransVal: [undefined],
      loanAdminFeeTransVal: [undefined, Validators.required],
      loanAdminFeeInWordsTransVal: [undefined],
      emiAmountInFigureTransVal: [undefined, Validators.required],
      emiAmountInWordsTransVal: [undefined],
      numberOfEmiTransVal: [undefined],
      loanCommitmentFeeTransVal: [undefined, Validators.required],
      vendorNameTransVal: [undefined, Validators.required],
      relationshipOfficerNameTransVal: [undefined, Validators.required],
      branchManagerTransVal: [undefined, Validators.required],
      // staffNameTransVal: [undefined, Validators.required],
    });
  }
  async translate() {
    this.spinner = true;
    this.podtranslatedData = await this.translateService.translateForm(this.form);
    this.tdValues = this.podtranslatedData;
    this.setTemplatedCTData(this.podtranslatedData);
    this.spinner = false;
    this.btnDisable = false;
  }
  private setTemplatedCTData(data): void {
    // this.form.get('referenceNumberTransVal').patchValue(this.podtranslatedData.referenceNumber);
    // this.form.get('dateOfApprovalTransVal').patchValue(this.podtranslatedData.dateOfApproval);
    this.form.get('dateOfApprovalTypeTransVal').patchValue(this.form.get('dateOfApprovalType').value);
    if (this.dateTypeAD) {
      const approvalDate = this.form.get('dateOfApproval').value;
      const convertApprovalDate = approvalDate ?
          this.engNepDatePipe.transform(this.datePipe.transform(approvalDate), true) : '';
      this.form.get('dateOfApprovalTransVal').patchValue(convertApprovalDate);
    }
    if (this.dateTypeBS) {
      const approvalDateNepali = !ObjectUtil.isEmpty(this.form.get('dateOfApprovalNepali').value) ?
          this.form.get('dateOfApprovalNepali').value : '';
      this.form.get('dateOfApprovalNepaliTransVal').patchValue(approvalDateNepali.nDate);
    }
    // this.form.get('dateofApplicationTransVal').patchValue(this.podtranslatedData.dateofApplication);
    this.form.get('dateofApplicationTypeTransVal').patchValue(this.form.get('dateofApplicationType').value);
    if (this.dateTypeAD) {
      const applicationDate = this.form.get('dateofApplication').value;
      const convertApplicationDate = applicationDate ?
          this.engNepDatePipe.transform(this.datePipe.transform(applicationDate), true) : '';
      this.form.get('dateofApplicationTransVal').patchValue(convertApplicationDate);
    }
    if (this.dateTypeBS) {
      const applicationNepali = !ObjectUtil.isEmpty(this.form.get('dateofApplicationNepali').value) ?
          this.form.get('dateofApplicationNepali').value : '';
      this.form.get('dateofApplicationNepaliTransVal').patchValue(applicationNepali.nDate);
    }
    this.form.get('vehicleNameTransVal').patchValue(this.podtranslatedData.vehicleName);
    // this.form.get('baseRateTransVal').patchValue(this.podtranslatedData.baseRate);
    // this.form.get('premiumRateTransVal').patchValue(this.podtranslatedData.premiumRate);
    // this.form.get('yearlyInterestRateTransVal').patchValue(this.podtranslatedData.yearlyInterestRate);
    // this.form.get('loanAdminFeeinFigureTransVal').patchValue(this.podtranslatedData.loanAdminFeeinFigure);
    // this.form.get('loanAdminFeeInWordsTransVal').patchValue(this.podtranslatedData.loanAdminFeeInWords);
    // this.form.get('emiAmountInWordsTransVal').patchValue(this.podtranslatedData.emiAmountInWords);
    this.form.get('vendorNameTransVal').patchValue(this.podtranslatedData.vendorName);
    this.form.get('relationshipOfficerNameTransVal').patchValue(this.podtranslatedData.relationshipOfficerName);
    this.form.get('branchManagerTransVal').patchValue(this.podtranslatedData.branchManager);
    // this.form.get('staffNameTransVal').patchValue(this.podtranslatedData.staffName);
    this.form.get('selectedInterestTransVal').patchValue(data.selectedInterest.en);
    this.form.get('selectedAutoLoanTransVal').patchValue(data.selectedAutoLoan.en);
    this.form.get('loanLimitCheckedTransVal').patchValue(this.loanLimit);
  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value.toString());
    this.form.get(numLabel + 'TransVal').patchValue(this.engToNepaliNumberPipe.transform(this.form.get(numLabel).value.toString()));
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
    this.form.get(wordLabel + 'TransVal').patchValue(returnVal);
  }
  translateNumber(source, target) {
    const wordLabelVar = this.engToNepaliNumberPipe.transform(this.currencyFormatterPipe.transform(this.form.get(source).value.toString()));
    this.form.get(target).patchValue(wordLabelVar);
  }

  translateNumber1(source, target) {
    const wordLabelVar = this.engToNepaliNumberPipe.transform(this.form.get(source).value.toString());
    this.form.get(target).patchValue(wordLabelVar);
  }
  calInterestRate() {
    const baseRate = this.form.get('baseRate').value;
    const premiumRate = this.form.get('premiumRate').value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.form.get('yearlyInterestRate').patchValue(sum);
    this.translateNumber('baseRate', 'baseRateTransVal');
    this.translateNumber('premiumRate', 'premiumRateTransVal');
    this.translateNumber('yearlyInterestRate', 'yearlyInterestRateTransVal');
  }

  mappedData() {
      Object.keys(this.form.controls).forEach(key => {
        if (key.indexOf('TransVal') > -1) {
          return;
        }
        this.attributes = new Attributes();
        this.attributes.en = this.form.get(key).value;
        this.attributes.np = this.tdValues[key];
        this.attributes.ct = this.form.get(key + 'TransVal').value;
        this.tdValues[key] = this.attributes;
      });
  }

  get Form() {
    return this.form.controls;
  }

  loanChecked(data) {
    this.loanLimit = data;
    console.log('Loan Limit Checked?', this.loanLimit);
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

  setDateTypeBS() {
    this.dateTypeBS = true;
    this.dateTypeAD = false;
  }

  setDateTypeAD() {
    this.dateTypeBS = false;
    this.dateTypeAD = true;
  }

  setDateTypeBS1() {
    this.dateTypeBS1 = true;
    this.dateTypeAD1 = false;
  }

  setDateTypeAD1() {
    this.dateTypeBS1 = false;
    this.dateTypeAD1 = true;
  }
  setDateTypeBS2() {
    this.dateTypeBS2 = true;
    this.dateTypeAD2 = false;
  }

  setDateTypeAD2() {
    this.dateTypeBS2 = false;
    this.dateTypeAD2 = true;
  }
  transferValue() {
    const autoloan = this.form.get('selectedAutoLoan').value;
    const interest = this.form.get('selectedInterest').value;

    if (!ObjectUtil.isEmpty(autoloan) && !ObjectUtil.isEmpty(interest)) {
      this.fieldFlag = true;
      this.selectedAutoLoanVal = autoloan;
      this.selectedInterestVal = interest;
    }
  }

  deleteCTAndTransContorls(data) {
    const individualData = data as FormGroup;
    Object.keys(data).forEach(key => {
      if (key.indexOf('CT') > -1 || key.indexOf('TransVal') > -1) {
        delete individualData[key];
      }
    });
  }

  openModel() {
    // this.modelService.open(modalName, {size: 'xl', centered: true});
    this.dialogService.open(SmeComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      hasBackdrop: false,
      context: {
        cadOfferLetterApprovedDoc: this.customerApprovedDoc,
        preview: true,
      }
    });
  }

  submit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.toastService.show(new Alert(AlertType.DANGER, 'Please check validation'));
      this.spinner = false;
      return;
    }
    this.form.get('loanLimitChecked').patchValue(this.loanLimit);
    this.spinner = true;
    this.btnDisable = true;
    this.customerApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';

    if (this.customerApprovedDoc.offerDocumentList.length > 0) {
      this.offerLetterDocument = this.customerApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
          === this.offerLetterConst.value(this.offerLetterConst.AUTO_LOAN).toString())[0];
      if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
        this.existingOfferLetter = true;
      }
    }

    if (this.existingOfferLetter) {
      this.customerApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.AUTO_LOAN).toString()) {
          this.mappedData();
          offerLetterPath.initialInformation = JSON.stringify(this.tdValues);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.AUTO_LOAN);
      Object.keys(this.form.controls).forEach(key => {
        if (key.indexOf('TransVal') > -1) {
          return;
        }
        this.attributes = new Attributes();
        this.attributes.en = this.form.get(key).value;
        this.attributes.np = this.tdValues[key];
        this.attributes.ct = this.form.get(key + 'TransVal').value;
        this.tdValues[key] = this.attributes;
      });
      this.podtranslatedData = {};
      this.deleteCTAndTransContorls(this.tdValues);
      offerDocument.initialInformation = JSON.stringify(this.tdValues);
      this.customerApprovedDoc.offerDocumentList.push(offerDocument);
    }
    this.administrationService.saveCadDocumentBulk(this.customerApprovedDoc).subscribe((res: any) => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.customerApprovedDoc = res.detail;
      this.spinner = false;
      this.previewBtn = false;
      this.btnDisable = true;
      this.closed = true;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.spinner = false;
      this.btnDisable = true;
    });
  }

  openCloseTemplate(template) {
    this.modalService.open(template);
  }

  dismiss(template){
    this.modalService.dismissAll();
  }

  decline(template){
    this.modalService.dismissAll();
  }

  accept(){
    this.modalService.dismissAll();
    this.dialogRefcad.close();
  }
}

