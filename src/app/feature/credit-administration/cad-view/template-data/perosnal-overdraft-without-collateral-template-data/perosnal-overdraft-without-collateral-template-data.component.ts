import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {District} from '../../../../admin/modal/district';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {OfferDocument} from '../../../model/OfferDocument';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PersonalOverdraftComponent} from '../../../mega-offer-letter-template/mega-offer-letter/personal-overdraft/personal-overdraft.component';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {SbTranslateService} from '../../../../../@core/service/sbtranslate.service';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {Attributes} from '../../../../../@core/model/attributes';
import {PersonalOverdraftWithoutCollateralComponent} from '../../../mega-offer-letter-template/mega-offer-letter/personal-overdraft-without-collateral/personal-overdraft-without-collateral.component';
import {CadOfferLetterConfigurationComponent} from '../../../cad-offerletter-profile/cad-offer-letter-configuration/cad-offer-letter-configuration.component';
import {DatePipe} from "@angular/common";
import {EngNepDatePipe} from "nepali-patro";

@Component({
  selector: 'app-perosnal-overdraft-without-collateral-template-data',
  templateUrl: './perosnal-overdraft-without-collateral-template-data.component.html',
  styleUrls: ['./perosnal-overdraft-without-collateral-template-data.component.scss']
})
export class PerosnalOverdraftWithoutCollateralTemplateDataComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  oneForm: FormGroup;
  offerLetterTypes = [];
  offerLetterConst = NabilOfferLetterConst;
  offerLetterSelect;
  translatedValues: any = {};
  form: FormGroup;
  objectForm: FormGroup;
  spinner = false;
  btnDisable = true;
  loanLimit = false;
  renewal = false;
  existingOfferLetter = false;
  attributes;
  tdValues: any = {};
  translatedData;
  previewBtn = true;
  dateTypeBS = false;
  dateTypeAD = false;
  dateTypeBS1 = false;
  dateTypeAD1 = false;
  dateTypeBS2 = false;
  dateTypeAD2 = false;
  offerLetterDocument: OfferDocument;
  cadDocStatus = CadDocStatus.key();
  submitted = false;
  selectedSecurityVal;
  objectTranslate;
  closed = false;
  vdcOption = [{value: 'Municipality', label: 'Municipality'}, {value: 'VDC', label: 'VDC'}, {value: 'Rural', label: 'Rural'}];

  constructor(private formBuilder: FormBuilder,
              private dialogService: NbDialogService,
              private modelService: NgbModal,
              private ngDialogRef: NbDialogRef<PersonalOverdraftComponent>,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private translateService: SbTranslateService,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private engToNepaliNumberPipe: EngToNepaliNumberPipe,
              private addressService: AddressService,
              private currencyFormatterPipe: CurrencyFormatterPipe,
              private modalService: NgbModal,
              protected dialogRefcad: NbDialogRef<CadOfferLetterConfigurationComponent>,
              private datePipe: DatePipe,
              private engNepDatePipe: EngNepDatePipe) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      selectedSecurity: [undefined],
      loanLimitChecked: [undefined],
      renewalChecked: [undefined],
      referenceNumber: [undefined],
      dateOfApproval: [undefined],
      dateOfApprovalType: [undefined],
      dateOfApprovalNepali: [undefined],
      dateofApplication: [undefined],
      dateofApplicationType: [undefined],
      dateofApplicationNepali: [undefined],
      purposeOfLoan: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      yearlyInterestRate: [undefined],
      loanadminFee: [undefined],
      loanadminFeeWords: [undefined],
      loanCommitmentFee: [undefined],
      dateofExpiry: [undefined],
      dateofExpiryNepali: [undefined],
      dateOfExpiryType: [undefined],
      nameOfCompany: [undefined],
      relationshipofficerName: [undefined],
      nameofBranchManager: [undefined],

      // fortranslatedvalue
      selectedSecurityTransVal: [undefined],
      loanLimitCheckedTransVal: [undefined],
      renewalCheckedTransVal: [undefined],
      referenceNumberTransVal: [undefined],
      dateOfApprovalTransVal: [undefined],
      dateOfApprovalNepaliTransVal: [undefined],
      dateOfApprovalTypeTransVal: [undefined],
      dateofApplicationTransVal: [undefined],
      dateofApplicationNepaliTransVal: [undefined],
      dateofApplicationTypeTransVal: [undefined],
      purposeOfLoanTransVal: [undefined],
      baseRateTransVal: [undefined],
      premiumRateTransVal: [undefined],
      yearlyInterestRateTransVal: [undefined],
      loanadminFeeTransVal: [undefined],
      loanadminFeeWordsTransVal: [undefined],
      loanCommitmentFeeTransVal: [undefined],
      dateofExpiryTransVal: [undefined],
      dateofExpiryNepaliTransVal: [undefined],
      dateOfExpiryTypeTransVal: [undefined],
      relationshipofficerNameTransVal: [undefined],
      nameOfCompanyTransVal: [undefined],
      nameofBranchManagerTransVal: [undefined],
    });
  }

  get Form() {
    return this.form.controls;
  }

  submit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.toastService.show(new Alert(AlertType.DANGER, 'Please check validation'));
      this.spinner = false;
      return;
    }
    this.form.get('loanLimitChecked').patchValue(this.loanLimit);
    this.form.get('renewalChecked').patchValue(this.renewal);
    this.spinner = true;
    this.btnDisable = true;
    this.customerApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';

    if (this.customerApprovedDoc.offerDocumentList.length > 0) {
      this.offerLetterDocument = this.customerApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
          === this.offerLetterConst.value(this.offerLetterConst.PERSONAL_OVERDRAFT_WITHOUT_COLLATERAL).toString())[0];
      if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
        this.existingOfferLetter = true;
      }
    }

    if (this.existingOfferLetter) {
      this.customerApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.PERSONAL_OVERDRAFT_WITHOUT_COLLATERAL).toString()) {
          this.mappedData();
          offerLetterPath.initialInformation = JSON.stringify(this.tdValues);
          this.translatedData = {};
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PERSONAL_OVERDRAFT_WITHOUT_COLLATERAL);
      Object.keys(this.form.controls).forEach(key => {
        if (key.indexOf('TransVal') > -1 || key === 'municipalityOrVdc') {
          return;
        }
        this.attributes = new Attributes();
        this.attributes.en = this.form.get(key).value;
        this.attributes.np = this.tdValues[key];
        this.attributes.ct = this.form.get(key + 'TransVal').value;
        this.tdValues[key] = this.attributes;
      });
      this.translatedData = {};
      this.deleteCTAndTransContorls(this.tdValues);
      offerDocument.initialInformation = JSON.stringify(this.tdValues);
      this.customerApprovedDoc.offerDocumentList.push(offerDocument);
    }
    this.administrationService.saveCadDocumentBulk(this.customerApprovedDoc).subscribe((res: any) => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.customerApprovedDoc = res.detail;
      this.spinner = false;
      this.previewBtn = false;
      this.btnDisable = false;
      this.closed = true;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.spinner = false;
      this.btnDisable = true;
    });
  }

  mappedData() {
    Object.keys(this.form.controls).forEach(key => {
      if (key.indexOf('TransVal') > -1 || key === 'municipalityOrVdc') {
        return;
      }
      this.attributes = new Attributes();
      this.attributes.en = this.form.get(key).value;
      this.attributes.np = this.tdValues[key];
      this.attributes.ct = this.form.get(key + 'TransVal').value;
      this.tdValues[key] = this.attributes;
    });
  }

  openModel() {
    this.dialogService.open(PersonalOverdraftWithoutCollateralComponent, {
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
    this.translatedData = await this.translateService.translateForm(this.form);
    this.tdValues = this.translatedData;
    this.setTemplatedCTData(this.translatedData);
    this.spinner = false;
  }
  private setTemplatedCTData(data): void {
    // this.form.get('referenceNumberTransVal').patchValue(this.translatedData.referenceNumber);
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
    this.form.get('purposeOfLoanTransVal').patchValue(this.translatedData.purposeOfLoan);
    // this.form.get('baseRateTransVal').patchValue(this.translatedData.baseRate);
    // this.form.get('premiumRateTransVal').patchValue(this.translatedData.premiumRate);
    // this.form.get('yearlyInterestRateTransVal').patchValue(this.translatedData.yearlyInterestRate);
    // this.form.get('loanadminFeeTransVal').patchValue(this.translatedData.loanadminFee);
    // this.form.get('loanCommitmentFeeTransVal').patchValue(this.translatedData.loanCommitmentFee);
    this.form.get('nameOfCompanyTransVal').patchValue(this.translatedData.nameOfCompany);
    this.form.get('dateofExpiryTransVal').patchValue(this.translatedData.dateofExpiry);
    this.form.get('dateofExpiryNepaliTransVal').patchValue(this.translatedData.dateofExpiry);
    this.form.get('relationshipofficerNameTransVal').patchValue(this.translatedData.relationshipofficerName);
    this.form.get('nameofBranchManagerTransVal').patchValue(this.translatedData.nameofBranchManager);
    // this.form.get('staffNameTransVal').patchValue(this.translatedData.staffName);
    this.form.get('loanLimitCheckedTransVal').patchValue(this.loanLimit);
    this.form.get('renewalCheckedTransVal').patchValue(this.renewal);
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
    console.log(wordLabelVar);
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

  loanChecked(data) {
    this.loanLimit = data;
  }

  renewalChecked(data) {
    this.renewal = data;
  }

  transferValue() {
    const security = this.form.get('selectedSecurity').value;
    if (!ObjectUtil.isEmpty(security)) {
      this.selectedSecurityVal = security;
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

  public calInterestRate(): void {
    const baseRate = this.form.get('baseRate').value;
    const premiumRate = this.form.get('premiumRate').value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.form.get('yearlyInterestRate').patchValue(sum.toFixed(2));
    this.translateNumber('baseRate', 'baseRateTransVal');
    this.translateNumber('premiumRate', 'premiumRateTransVal');
    this.translateNumber('yearlyInterestRate', 'yearlyInterestRateTransVal');
  }
  // deleteCTAndTransContorls from form controls
  deleteCTAndTransContorls(data) {
    const individualData = data as FormGroup;
    Object.keys(data).forEach(key => {
      if (key.indexOf('CT') > -1 || key.indexOf('TransVal') > -1) {
        delete individualData[key];
      }
    });
  }

  openCloseTemplate(template) {
    this.modalService.open(template);
  }
  dismiss(template) {
    this.modalService.dismissAll();
  }

  decline(template) {
    this.modalService.dismissAll();
  }
  accept() {
    this.modalService.dismissAll();
    this.dialogRefcad.close();
  }
}
