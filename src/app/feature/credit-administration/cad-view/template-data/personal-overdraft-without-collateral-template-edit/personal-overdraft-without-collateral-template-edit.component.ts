import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from "../../../model/customerApprovedLoanCadDocumentation";
import {OfferDocument} from "../../../model/OfferDocument";
import {FormBuilder, FormGroup} from "@angular/forms";
import {NabilOfferLetterConst} from "../../../nabil-offer-letter-const";
import {CadDocStatus} from "../../../model/CadDocStatus";
import {ObjectUtil} from "../../../../../@core/utils/ObjectUtil";
import {NbDialogRef, NbDialogService} from "@nebular/theme";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PersonalOverdraftComponent} from "../../../mega-offer-letter-template/mega-offer-letter/personal-overdraft/personal-overdraft.component";
import {NepaliToEngNumberPipe} from "../../../../../@core/pipe/nepali-to-eng-number.pipe";
import {NepaliCurrencyWordPipe} from "../../../../../@core/pipe/nepali-currency-word.pipe";
import {SbTranslateService} from "../../../../../@core/service/sbtranslate.service";
import {CreditAdministrationService} from "../../../service/credit-administration.service";
import {ToastService} from "../../../../../@core/utils";
import {EngToNepaliNumberPipe} from "../../../../../@core/pipe/eng-to-nepali-number.pipe";
import {AddressService} from "../../../../../@core/service/baseservice/address.service";
import {CurrencyFormatterPipe} from "../../../../../@core/pipe/currency-formatter.pipe";
import {CadOfferLetterConfigurationComponent} from "../../../cad-offerletter-profile/cad-offer-letter-configuration/cad-offer-letter-configuration.component";
import {DatePipe} from "@angular/common";
import {EngNepDatePipe} from "nepali-patro";
import {PersonalOverdraftWithoutCollateralComponent} from "../../../mega-offer-letter-template/mega-offer-letter/personal-overdraft-without-collateral/personal-overdraft-without-collateral.component";
import {Alert, AlertType} from "../../../../../@theme/model/Alert";
import {Attributes} from "../../../../../@core/model/attributes";

@Component({
  selector: 'app-personal-overdraft-without-collateral-template-edit',
  templateUrl: './personal-overdraft-without-collateral-template-edit.component.html',
  styleUrls: ['./personal-overdraft-without-collateral-template-edit.component.scss']
})
export class PersonalOverdraftWithoutCollateralTemplateEditComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() offerDocumentList: Array<OfferDocument>;
  @Input() initialInformation: any;
  oneForm: FormGroup;
  offerLetterTypes = [];
  offerLetterConst = NabilOfferLetterConst;
  offerLetterSelect;
  translatedValues: any = {};
  form: FormGroup;
  objectForm: FormGroup;
  spinner = false;
  btnDisable = false;
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

  constructor( private formBuilder: FormBuilder,
               private dialogService: NbDialogService,
               private modelService: NgbModal,
               public ngDialogRef: NbDialogRef<PersonalOverdraftWithoutCollateralTemplateEditComponent>,
               private nepToEngNumberPipe: NepaliToEngNumberPipe,
               private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
               private translateService: SbTranslateService,
               private administrationService: CreditAdministrationService,
               private toastService: ToastService,
               private engToNepaliNumberPipe: EngToNepaliNumberPipe,
               private addressService: AddressService,
               private currencyFormatterPipe: CurrencyFormatterPipe,
               private modalService: NgbModal,
               private datePipe: DatePipe,
               private engNepDatePipe: EngNepDatePipe) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.initialInformation)) {
      console.log('Initial Information:', this.initialInformation);
      this.loanLimit = this.initialInformation.loanLimitChecked.en;
      this.renewal = this.initialInformation.renewalChecked.en;
      const approvalDateType = this.initialInformation.dateOfApprovalType ? this.initialInformation.dateOfApprovalType.en : '';
      if (approvalDateType === 'AD') {
        this.dateTypeAD = true;
      } else {
        this.dateTypeBS = true;
      }
      const applicationDateType = this.initialInformation.dateofApplicationType ? this.initialInformation.dateofApplicationType.en : '';
      if (applicationDateType === 'AD') {
        this.dateTypeAD1 = true;
      } else {
        this.dateTypeBS1 = true;
      }
      const expiryDateType = this.initialInformation.dateOfExpiryType ? this.initialInformation.dateOfExpiryType.en : '';
      if (expiryDateType === 'AD') {
        this.dateTypeAD2 = true;
      } else {
        this.dateTypeBS2 = true;
      }
      // this.dateTypeAD = true;
      // this.dateTypeAD1 = true;
      this.setTemplateData();
    }
  }

  get Form() {
    return this.form.controls;
  }

  buildForm() {
    this.form = this.formBuilder.group({
      selectedSecurity: [undefined],
      loanLimitChecked: [undefined],
      renewalChecked: [undefined],
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

      // fortranslatedvaluef
      selectedSecurityTransVal: [undefined],
      loanLimitCheckedTransVal: [undefined],
      renewalCheckedTransVal: [undefined],
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

  async translate() {
    this.spinner = true;
    this.translatedData = await this.translateService.translateForm(this.form);
    this.tdValues = this.translatedData;
    this.setTemplatedCTData(this.translatedData);
    this.spinner = false;
    this.btnDisable = true;
  }
  private setTemplatedCTData(data): void {
    this.form.get('purposeOfLoanTransVal').patchValue(this.translatedData.purposeOfLoan);
    this.form.get('nameOfCompanyTransVal').patchValue(this.translatedData.nameOfCompany);
    this.form.get('relationshipofficerNameTransVal').patchValue(this.translatedData.relationshipofficerName);
    this.form.get('nameofBranchManagerTransVal').patchValue(this.translatedData.nameofBranchManager);
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

  public setTemplateData(): void {
    // set en value
    const approvalType = this.initialInformation.dateOfApprovalType ? this.initialInformation.dateOfApprovalType.en : '';
    this.form.get('dateOfApprovalType').patchValue(approvalType);
    if (approvalType === 'AD') {
      const approvalDateEng = this.initialInformation.dateOfApproval ? this.initialInformation.dateOfApproval.en : '';
      this.form.get('dateOfApproval').patchValue(new Date(approvalDateEng));
    } else {
      const approvalDate = this.initialInformation.dateOfApprovalNepali ? this.initialInformation.dateOfApprovalNepali.en : '';
      this.form.get('dateOfApprovalNepali').patchValue(approvalDate);
    }
    const applicationType = this.initialInformation.dateofApplicationType ? this.initialInformation.dateofApplicationType.en : '';
    this.form.get('dateofApplicationType').patchValue(applicationType);
    if (applicationType === 'AD') {
      const applicationDateEng = this.initialInformation.dateofApplication ? this.initialInformation.dateofApplication.en : '';
      this.form.get('dateofApplication').patchValue(new Date(applicationDateEng));
    } else {
      const applicationDate = this.initialInformation.dateofApplicationNepali ? this.initialInformation.dateofApplicationNepali.en : '';
      this.form.get('dateofApplicationNepali').patchValue(applicationDate);
    }
    const expiryType = this.initialInformation.dateOfExpiryType ? this.initialInformation.dateOfExpiryType.en : '';
    this.form.get('dateOfExpiryType').patchValue(expiryType);
    if (expiryType === 'AD') {
      const expiryDateEng = this.initialInformation.dateofExpiry ? this.initialInformation.dateofExpiry.en : '';
      this.form.get('dateofExpiry').patchValue(new Date(expiryDateEng));
    } else {
      const expiryDate = this.initialInformation.dateofExpiryNepali ? this.initialInformation.dateofExpiryNepali.en : '';
      this.form.get('dateofExpiryNepali').patchValue(expiryDate);
    }
    this.form.get('purposeOfLoan').patchValue(this.initialInformation.purposeOfLoan.en);
    this.form.get('baseRate').patchValue(this.initialInformation.baseRate.en);
    this.form.get('premiumRate').patchValue(this.initialInformation.premiumRate.en);
    this.form.get('yearlyInterestRate').patchValue(this.initialInformation.yearlyInterestRate.en);
    this.form.get('loanadminFee').patchValue(this.initialInformation.loanadminFee.en);
    this.form.get('loanadminFeeWords').patchValue(this.initialInformation.loanadminFeeWords.en);
    this.form.get('loanCommitmentFee').patchValue(this.initialInformation.loanCommitmentFee.en);
    this.form.get('nameOfCompany').patchValue(this.initialInformation.nameOfCompany.en);
    this.form.get('relationshipofficerName').patchValue(this.initialInformation.relationshipofficerName.en);
    this.form.get('nameofBranchManager').patchValue(this.initialInformation.nameofBranchManager.en);
    // set ct value
    // this.form.get('refNumberTransVal').patchValue(this.initialInformation.refNumber.ct);
    this.form.get('purposeOfLoanTransVal').patchValue(this.initialInformation.purposeOfLoan.ct);
    this.form.get('baseRateTransVal').patchValue(this.initialInformation.baseRate.ct);
    this.form.get('premiumRateTransVal').patchValue(this.initialInformation.premiumRate.ct);
    this.form.get('yearlyInterestRateTransVal').patchValue(this.initialInformation.yearlyInterestRate.ct);
    this.form.get('loanadminFeeTransVal').patchValue(this.initialInformation.loanadminFee.ct);
    this.form.get('loanadminFeeWordsTransVal').patchValue(this.initialInformation.loanadminFeeWords.ct);
    this.form.get('loanCommitmentFeeTransVal').patchValue(this.initialInformation.loanCommitmentFee.ct);
    this.form.get('nameOfCompanyTransVal').patchValue(this.initialInformation.nameOfCompany.ct);
    this.form.get('relationshipofficerNameTransVal').patchValue(this.initialInformation.relationshipofficerName.ct);
    this.form.get('nameofBranchManagerTransVal').patchValue(this.initialInformation.nameofBranchManager.ct);
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
        if (key.indexOf('TransVal') > -1 || key === 'municipalityOrVdc' || key === 'securities') {
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
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully updated Offer Letter'));
      this.customerApprovedDoc = res.detail;
      this.spinner = false;
      this.previewBtn = false;
      this.btnDisable = false;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to update Offer Letter'));
      this.spinner = false;
      this.btnDisable = true;
    });
  }


}
