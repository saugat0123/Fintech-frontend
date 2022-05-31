import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {SbTranslateService} from '../../../../../@core/service/sbtranslate.service';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {OfferDocument} from '../../../model/OfferDocument';
import {Attributes} from '../../../../../@core/model/attributes';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {PersonalLoanComponent} from '../../../mega-offer-letter-template/mega-offer-letter/personal-loan/personal-loan.component';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {CadOfferLetterConfigurationComponent} from "../../../cad-offerletter-profile/cad-offer-letter-configuration/cad-offer-letter-configuration.component";

@Component({
  selector: 'app-personal-loan-template-data',
  templateUrl: './personal-loan-template-data.component.html',
  styleUrls: ['./personal-loan-template-data.component.scss']
})
export class PersonalLoanTemplateDataComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() loanName;
  @Input() offerDocumentList: Array<OfferDocument>;
  @Input() cadDocAssignedLoan;
  tdValues: any = {};
  form: FormGroup;
  fieldFlag = false;
  selectedSecurityVal;
  selectedCountryVal;
  embassyName;
  spinner = false;
  loanLimit = false;
  existingOfferLetter = false;
  btnDisable = true;
  previewBtn = true;
  offerLetterConst = NabilOfferLetterConst;
  attributes;
  translatedData;
  dateTypeBS = false;
  dateTypeAD = false;
  dateTypeBS1 = false;
  dateTypeAD1 = false;
  dateTypeBS2 = false;
  dateTypeAD2 = false;
  offerLetterDocument: OfferDocument;
  cadDocStatus = CadDocStatus.key();
  submitted = false;
  closed = false;

  constructor(
      private formBuilder: FormBuilder,
      private dialogService: NbDialogService,
      private modelService: NgbModal,
      private ngDialogRef: NbDialogRef<PersonalLoanTemplateDataComponent>,
      private nepToEngNumberPipe: NepaliToEngNumberPipe,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private translateService: SbTranslateService,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
      private engToNepaliNumberPipe: EngToNepaliNumberPipe,
      private currencyFormatterPipe: CurrencyFormatterPipe,
      private modalService: NgbModal,
      protected dialogRefcad: NbDialogRef<CadOfferLetterConfigurationComponent>,
  ) { }

  ngOnInit() {
    this.buildForm();
     }

  buildForm() {
    this.form = this.formBuilder.group({
      // refNumber: [undefined],
      loanLimitChecked: [undefined],
      dateOfApproval: [undefined],
      dateOfApprovalNepali: [undefined],
      dateOfApprovalType: [undefined],
      dateofApplication: [undefined],
      dateofApplicationNepali: [undefined],
      dateofApplicationType: [undefined],
      purposeOfLoan: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      yearlyFloatingInterestRate: [undefined],
      loanAdminFee: [undefined],
      emiAmount: [undefined],
      emiAmountWords: [undefined],
      loanPeriodInMonth: [undefined],
      companyName: [undefined],
      accountNumber: [undefined],
      relationshipOfficer: [undefined],
      managerName: [undefined],
      // sakshiDistrict: [undefined],
      // sakshiMunicipality: [undefined],
      // sakshiWardNum: [undefined],
      // sakshiName: [undefined],

      // Translated Value
      // refNumberTransVal: [undefined, Validators.required],
      loanLimitCheckedTransVal: [undefined],
      dateOfApprovalTransVal: [undefined],
      dateOfApprovalNepaliTransVal: [undefined],
      dateOfApprovalTypeTransVal: [undefined],
      dateofApplicationTransVal: [undefined],
      dateofApplicationTypeTransVal: [undefined],
      dateofApplicationNepaliTransVal: [undefined],
      purposeOfLoanTransVal: [undefined, Validators.required],
      baseRateTransVal: [undefined, Validators.required],
      premiumRateTransVal: [undefined, Validators.required],
      yearlyFloatingInterestRateTransVal: [undefined, Validators.required],
      loanAdminFeeTransVal: [undefined, Validators.required],
      emiAmountTransVal: [undefined, Validators.required],
      emiAmountWordsTransVal: [undefined],
      loanPeriodInMonthTransVal: [undefined],
      companyNameTransVal: [undefined, Validators.required],
      accountNumberTransVal: [undefined, Validators.required],
      relationshipOfficerTransVal: [undefined, Validators.required],
      managerNameTransVal: [undefined, Validators.required],
      // sakshiDistrictTransVal: [undefined,Validators.required],
      // sakshiMunicipalityTransVal: [undefined,Validators.required],
      // sakshiWardNumTransVal: [undefined,Validators.required],
      // sakshiNameTransVal: [undefined,Validators.required],
      loanAdminFeeinWords: [undefined],
      loanAdminFeeinWordsTransVal: [undefined],
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
          === this.offerLetterConst.value(this.offerLetterConst.PERSONAL_LOAN).toString())[0];
      if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
        this.existingOfferLetter = true;
      }
    }

    if (this.existingOfferLetter) {
      this.customerApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.PERSONAL_LOAN).toString()) {
          this.mappedData();
          offerLetterPath.initialInformation = JSON.stringify(this.tdValues);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PERSONAL_LOAN);
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
      this.translatedData = {};
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
      this.btnDisable = false;
    });
  }

  mappedData() {
    Object.keys(this.form.controls).forEach(key => {
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
    });
  }
  get Form() {
    return this.form.controls;
  }

  openModel() {
    this.dialogService.open(PersonalLoanComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      hasBackdrop: false,
      dialogClass: 'model-full',
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
    this.translatedData = await this.translateService.translateForm(this.form);
    this.tdValues = this.translatedData;
    this.setTemplatedCTData();
    this.spinner = false;
    this.btnDisable = false;
  }
  private setTemplatedCTData(): void {
    this.translatedData.emiAmountWords = this.form.get('emiAmountWords').value;
    // this.form.get('refNumberTransVal').patchValue(this.translatedData.refNumber);
    this.form.get('dateOfApprovalTransVal').patchValue(this.translatedData.dateOfApproval);
    this.form.get('dateOfApprovalNepaliTransVal').patchValue(this.translatedData.dateOfApprovalNepali);
    this.form.get('dateofApplicationTransVal').patchValue(this.translatedData.dateofApplication);
    this.form.get('dateofApplicationNepaliTransVal').patchValue(this.translatedData.dateofApplicationNepali);
    this.form.get('purposeOfLoanTransVal').patchValue(this.translatedData.purposeOfLoan);
    // this.form.get('baseRateTransVal').patchValue(this.translatedData.baseRate);
    // this.form.get('premiumRateTransVal').patchValue(this.translatedData.premiumRate);
    // this.form.get('yearlyFloatingInterestRateTransVal').patchValue(this.translatedData.yearlyFloatingInterestRate);
    // this.form.get('loanAdminFeeTransVal').patchValue(this.translatedData.loanAdminFee);
    // this.form.get('emiAmountTransVal').patchValue(this.translatedData.emiAmount);
    // this.form.get('emiAmountWordsTransVal').patchValue(this.translatedData.emiAmountWords);
    // this.form.get('accountNumberTransVal').patchValue(this.translatedData.accountNumber);
    this.form.get('relationshipOfficerTransVal').patchValue(this.translatedData.relationshipOfficer);
    this.form.get('managerNameTransVal').patchValue(this.translatedData.managerName);
    this.form.get('companyNameTransVal').patchValue(this.translatedData.companyName);
    this.form.get('loanLimitCheckedTransVal').patchValue(this.loanLimit);
    /*this.form.get('sakshiDistrictTransVal').patchValue(this.translatedData.sakshiDistrict);
    this.form.get('sakshiMunicipalityTransVal').patchValue(this.translatedData.sakshiMunicipality);
    this.form.get('sakshiWardNumTransVal').patchValue(this.translatedData.sakshiWardNum);
    this.form.get('sakshiNameTransVal').patchValue(this.translatedData.sakshiName);*/
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

  checkboxVal(event, formControlName) {
    const checkVal = event.target.checked;
    this[formControlName + 'Check'] = checkVal;
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

  calInterestRate() {
    const baseRate = this.form.get('baseRate').value;
    const premiumRate = this.form.get('premiumRate').value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.form.get('yearlyFloatingInterestRate').patchValue(sum.toFixed(2));
    this.translateNumber('baseRate', 'baseRateTransVal');
    this.translateNumber('premiumRate', 'premiumRateTransVal');
    this.translateNumber('yearlyFloatingInterestRate', 'yearlyFloatingInterestRateTransVal');
  }

  loanChecked(data) {
    this.loanLimit = data;
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
