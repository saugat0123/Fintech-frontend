import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {OfferDocument} from '../../../model/OfferDocument';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {SbTranslateService} from '../../../../../@core/service/sbtranslate.service';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {Attributes} from '../../../../../@core/model/attributes';
import {PersonalLoanComponent} from '../../../mega-offer-letter-template/mega-offer-letter/personal-loan/personal-loan.component';

@Component({
  selector: 'app-personal-loan-template-edit',
  templateUrl: './personal-loan-template-edit.component.html',
  styleUrls: ['./personal-loan-template-edit.component.scss']
})
export class PersonalLoanTemplateEditComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() offerDocumentList: Array<OfferDocument>;
  @Input() initialInformation: any;
  @Input() offerLetterId: number;
  tdValues: any = {};
  form: FormGroup;
  fieldFlag = false;
  selectedSecurityVal;
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

  constructor(
      private formBuilder: FormBuilder,
      private dialogService: NbDialogService,
      private modelService: NgbModal,
      public ngDialogRef: NbDialogRef<PersonalLoanTemplateEditComponent>,
      private nepToEngNumberPipe: NepaliToEngNumberPipe,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private translateService: SbTranslateService,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
      private engToNepaliNumberPipe: EngToNepaliNumberPipe,
  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.initialInformation)) {
      this.loanLimit = this.initialInformation.loanLimitChecked.en;
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
      // this.dateTypeAD = true;
      // this.dateTypeAD1 = true;
      this.dateTypeAD2 = true;
      this.setPersonalLoanTemplateData();
    }
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
      companyName: [undefined],
      accountNumber: [undefined],
      relationshipOfficer: [undefined],
      managerName: [undefined],
      loanPeriodInMonth: [undefined],

      // Translated Value
      // refNumberTransVal: [undefined, Validators.required],
      loanLimitCheckedTransVal: [undefined],
      dateOfApprovalTransVal: [undefined],
      dateOfApprovalNepaliTransVal: [undefined],
      dateOfApprovalTypeTransVal: [undefined],
      dateofApplicationTransVal: [undefined],
      dateofApplicationNepaliTransVal: [undefined],
      dateofApplicationTypeTransVal: [undefined],
      purposeOfLoanTransVal: [undefined, Validators.required],
      baseRateTransVal: [undefined, Validators.required],
      premiumRateTransVal: [undefined, Validators.required],
      yearlyFloatingInterestRateTransVal: [undefined, Validators.required],
      loanAdminFeeTransVal: [undefined, Validators.required],
      emiAmountTransVal: [undefined, Validators.required],
      emiAmountWordsTransVal: [undefined],
      companyNameTransVal: [undefined, Validators.required],
      accountNumberTransVal: [undefined, Validators.required],
      relationshipOfficerTransVal: [undefined, Validators.required],
      managerNameTransVal: [undefined, Validators.required],
      loanPeriodInMonthTransVal: [undefined, Validators.required],
      loanAdminFeeinWordsTransVal: [undefined],
      loanAdminFeeinWords: [undefined],
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
          offerLetterPath.initialInformation = JSON.stringify(this.tdValues);
          this.translatedData = {};
        }
      });
    }

    this.administrationService.saveCadDocumentBulk(this.customerApprovedDoc).subscribe((res: any) => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully update Offer Letter'));
      this.customerApprovedDoc = res.detail;
      this.spinner = false;
      this.previewBtn = false;
      this.btnDisable = true;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to update Offer Letter'));
      this.spinner = false;
      this.btnDisable = true;
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
    this.form.get('dateOfApprovalTypeTransVal').patchValue(this.translatedData.dateOfApprovalType);
    if (this.dateTypeAD) {
      this.form.get('dateOfApprovalTransVal').patchValue(this.translatedData.dateOfApproval);
    } else {
      this.form.get('dateOfApprovalNepaliTransVal').patchValue(this.translatedData.dateOfApprovalNepali);
    }
    this.form.get('dateofApplicationTypeTransVal').patchValue(this.translatedData.dateofApplicationType);
    if (this.dateTypeAD) {
      this.form.get('dateofApplicationTransVal').patchValue(this.translatedData.dateofApplication);
    } else {
      this.form.get('dateofApplicationNepaliTransVal').patchValue(this.translatedData.dateofApplicationNepali);
    }
    this.form.get('purposeOfLoanTransVal').patchValue(this.translatedData.purposeOfLoan);
    this.form.get('relationshipOfficerTransVal').patchValue(this.translatedData.relationshipOfficer);
    this.form.get('managerNameTransVal').patchValue(this.translatedData.managerName);
    this.form.get('companyNameTransVal').patchValue(this.translatedData.companyName);
    this.form.get('loanPeriodInMonthTransVal').patchValue(this.translatedData.loanPeriodInMonth);
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

  public calInterestRate(): void {
    const baseRate = this.form.get('baseRate').value;
    const premiumRate = this.form.get('premiumRate').value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.form.get('yearlyFloatingInterestRate').patchValue(sum.toFixed(2));
    this.translateNumber('baseRate', 'baseRateTransVal');
    this.translateNumber('premiumRate', 'premiumRateTransVal');
    this.translateNumber('yearlyFloatingInterestRate', 'yearlyFloatingInterestRateTransVal');
  }

  public setPersonalLoanTemplateData(): void {
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
    // this.form.get('refNumber').patchValue(this.initialInformation.refNumber.en);
    const applicationType = this.initialInformation.dateofApplicationType ? this.initialInformation.dateofApplicationType.en : '';
    this.form.get('dateofApplicationType').patchValue(applicationType);
    if (applicationType === 'AD') {
      const applicationDateEng = this.initialInformation.dateofApplication ? this.initialInformation.dateofApplication.en : '';
      this.form.get('dateofApplication').patchValue(new Date(applicationDateEng));
    } else {
      const applicationDate = this.initialInformation.dateofApplicationNepali ? this.initialInformation.dateofApplicationNepali.en : '';
      this.form.get('dateofApplicationNepali').patchValue(applicationDate);
    }
    this.form.get('purposeOfLoan').patchValue(this.initialInformation.purposeOfLoan.en);
    this.form.get('baseRate').patchValue(this.initialInformation.baseRate.en);
    this.form.get('premiumRate').patchValue(this.initialInformation.premiumRate.en);
    this.form.get('yearlyFloatingInterestRate').patchValue(this.initialInformation.yearlyFloatingInterestRate.en);
    this.form.get('loanAdminFee').patchValue(this.initialInformation.loanAdminFee.en);
    this.form.get('loanAdminFeeinWords').patchValue(this.initialInformation.loanAdminFeeinWords.en);
    this.form.get('emiAmount').patchValue(this.initialInformation.emiAmount.en);
    this.form.get('emiAmountWords').patchValue(this.initialInformation.emiAmountWords.en);
    this.form.get('companyName').patchValue(this.initialInformation.companyName.en);
    this.form.get('accountNumber').patchValue(this.initialInformation.accountNumber.en);
    this.form.get('relationshipOfficer').patchValue(this.initialInformation.relationshipOfficer.en);
    this.form.get('managerName').patchValue(this.initialInformation.managerName.en);
    this.form.get('loanPeriodInMonth').patchValue(this.initialInformation.loanPeriodInMonth.en);

    // set ct value
    // this.form.get('refNumberTransVal').patchValue(this.initialInformation.refNumber.ct);
    this.form.get('purposeOfLoanTransVal').patchValue(this.initialInformation.purposeOfLoan.ct);
    this.form.get('baseRateTransVal').patchValue(this.initialInformation.baseRate.ct);
    this.form.get('premiumRateTransVal').patchValue(this.initialInformation.premiumRate.ct);
    this.form.get('yearlyFloatingInterestRateTransVal').patchValue(this.initialInformation.yearlyFloatingInterestRate.ct);
    this.form.get('loanAdminFeeTransVal').patchValue(this.initialInformation.loanAdminFee.ct);
    this.form.get('loanAdminFeeinWordsTransVal').patchValue(this.initialInformation.loanAdminFeeinWords.ct);
    this.form.get('emiAmountTransVal').patchValue(this.initialInformation.emiAmount.ct);
    this.form.get('emiAmountWordsTransVal').patchValue(this.initialInformation.emiAmountWords.ct);
    this.form.get('companyNameTransVal').patchValue(this.initialInformation.companyName.ct);
    this.form.get('accountNumberTransVal').patchValue(this.initialInformation.accountNumber.ct);
    this.form.get('relationshipOfficerTransVal').patchValue(this.initialInformation.relationshipOfficer.ct);
    this.form.get('managerNameTransVal').patchValue(this.initialInformation.managerName.ct);
    this.form.get('loanPeriodInMonthTransVal').patchValue(this.initialInformation.loanPeriodInMonth.ct);
  }

  loanChecked(data) {
    this.loanLimit = data;
  }

}
