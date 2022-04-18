import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {OfferDocument} from '../../../model/OfferDocument';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Attributes} from '../../../../../@core/model/attributes';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {SmeComponent} from '../../../mega-offer-letter-template/mega-offer-letter/sme/sme.component';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {SbTranslateService} from '../../../../../@core/service/sbtranslate.service';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';

@Component({
  selector: 'app-auto-loan-template-edit',
  templateUrl: './auto-loan-template-edit.component.html',
  styleUrls: ['./auto-loan-template-edit.component.scss']
})
export class AutoLoanTemplateEditComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() offerDocumentList: Array<OfferDocument>;
  @Input() initialInformation: any;
  @Input() offerLetterId: number;
  spinner = false;
  offerLetterTypes = [];
  offerLetterConst = NabilOfferLetterConst;
  offerLetterSelect;
  form: FormGroup;
  translatedValues: any = {};
  previewBtn = true;
  btnDisable = true;
  loanLimit = false;
  existingOfferLetter = false;
  attributes;
  tdValues: any = {};
  podtranslatedData: any = {};
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

  constructor(public nbDialogRef: NbDialogRef<AutoLoanTemplateEditComponent>,
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
              private modalService: NgbModal,
              private datePipe: DatePipe,
              private engNepDatePipe: EngNepDatePipe) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.initialInformation)) {
      this.setDropDownValue('selectedAutoLoan', this.initialInformation.selectedAutoLoan.en);
      this.selectedAutoLoanVal = this.initialInformation.selectedAutoLoan.en;
      this.setDropDownValue('selectedInterest', this.initialInformation.selectedInterest.en);
      this.selectedInterestVal = this.initialInformation.selectedInterest.en;
      this.fieldFlag = true;
      this.setEducationalLoanData();
      const approvalDateType = this.initialInformation.dateOfApprovalType ?
          this.initialInformation.dateOfApprovalType.en : '';
      if (approvalDateType === 'AD') {
        this.dateTypeAD = true;
      }
      if (approvalDateType === 'BS') {
        this.dateTypeBS = true;
      }
      const applicationDateType = this.initialInformation.dateofApplicationType ?
          this.initialInformation.dateofApplicationType.en : '';
      if (applicationDateType === 'AD') {
        this.dateTypeAD1 = true;
      }
      if (applicationDateType === 'BS') {
        this.dateTypeBS1 = true;
      }
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      selectedAutoLoan: [undefined],
      selectedInterest: [undefined],
      loanLimitChecked: [undefined],
      // referenceNumber: [undefined],
      dateOfApproval: [undefined],
      dateOfApprovalNepali: [undefined],
      dateOfApprovalType: [undefined],
      dateofApplication: [undefined],
      dateofApplicationNepali: [undefined],
      dateofApplicationType: [undefined],
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

      // For translated data
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
    // set ct value of date of approval:
   if (this.dateTypeAD) {
     const approvalForm = !ObjectUtil.isEmpty(this.form.get('dateOfApproval').value) ?
         this.form.get('dateOfApproval').value : '';
     const convertApproval = approvalForm ?
         this.engNepDatePipe.transform(this.datePipe.transform(approvalForm), true) : '';
     this.form.get('dateOfApprovalTransVal').patchValue(convertApproval);
   }
   if (this.dateTypeBS) {
     const nepaliApprovalForm = !ObjectUtil.isEmpty(this.form.get('dateOfApprovalNepali').value) ?
         this.form.get('dateOfApprovalNepali').value : '';
     this.form.get('dateOfApprovalTransVal').patchValue(nepaliApprovalForm.nDate);
   }
    this.form.get('dateofApplicationTransVal').patchValue(this.podtranslatedData.dateofApplication);
    // set ct value of date of application:
    if (this.dateTypeAD) {
      const applicationForm = !ObjectUtil.isEmpty(this.form.get('dateofApplication').value) ?
          this.form.get('dateofApplication').value : '';
      const convertApplication = applicationForm ?
          this.engNepDatePipe.transform(this.datePipe.transform(applicationForm), true) : '';
      this.form.get('dateofApplicationTransVal').patchValue(convertApplication);
    }
    if (this.dateTypeBS) {
      const nepaliApplicationForm = !ObjectUtil.isEmpty(this.form.get('dateofApplicationNepali').value) ?
          this.form.get('dateofApplicationNepali').value : '';
      this.form.get('dateofApplicationTransVal').patchValue(nepaliApplicationForm.nDate);
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
    this.form.get('yearlyInterestRate').patchValue(sum.toFixed(2));
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
      this.deleteCTAndTransContorls(this.tdValues);
      offerDocument.initialInformation = JSON.stringify(this.tdValues);
      this.customerApprovedDoc.offerDocumentList.push(offerDocument);
    }
    this.podtranslatedData = {};
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

  dismiss(template) {
    this.modalService.dismissAll();
  }

  decline(template) {
    this.modalService.dismissAll();
  }

  accept() {
    this.modalService.dismissAll();
    this.nbDialogRef.close();
  }

  setDropDownValue(key, value) {
    if (!ObjectUtil.isEmpty(value)) {
      this.form.get(key).patchValue(value);
    }
  }

  setEducationalLoanData(): void {
    // Set EN values for educational loan data:
    this.form.get('loanLimitChecked').patchValue(this.initialInformation.loanLimitChecked.en);
    this.loanLimit = this.initialInformation.loanLimitChecked ? this.initialInformation.loanLimitChecked.en : '';
    // set value of date of approval:
    const dateTypeApproval = this.initialInformation.dateOfApprovalType ?
        this.initialInformation.dateOfApprovalType.en : '';
    this.form.get('dateOfApprovalType').patchValue(dateTypeApproval);
    if (dateTypeApproval === 'AD') {
      this.form.get('dateOfApproval').patchValue(new Date(this.initialInformation.dateOfApproval.en));
    } else {
      const dateTypeNepali = this.initialInformation.dateOfApprovalNepali ?
          this.initialInformation.dateOfApprovalNepali.en : '';
      this.form.get('dateOfApprovalNepali').patchValue(dateTypeNepali);
    }
    // set value of date of Application:
    const dateTypeApp = this.initialInformation.dateofApplicationType ?
        this.initialInformation.dateofApplicationType.en : '';
    this.form.get('dateofApplicationType').patchValue(dateTypeApp);
    if (dateTypeApp === 'AD') {
      this.form.get('dateofApplication').patchValue(new Date(this.initialInformation.dateofApplication.en));
    } else {
      const appDateNepali = this.initialInformation.dateofApplicationNepali ?
          this.initialInformation.dateofApplicationNepali.en : '';
      this.form.get('dateofApplicationNepali').patchValue(appDateNepali);
    }
    // this.form.get('dateofApplication').patchValue(this.initialInformation.dateofApplication.en);
    this.form.get('vehicleName').patchValue(this.initialInformation.vehicleName.en);
    this.form.get('drawingPower').patchValue(this.initialInformation.drawingPower.en);
    this.form.get('baseRate').patchValue(this.initialInformation.baseRate.en);
    this.form.get('premiumRate').patchValue(this.initialInformation.premiumRate.en);
    this.form.get('yearlyInterestRate').patchValue(this.initialInformation.yearlyInterestRate.en);
    this.form.get('loanAdminFee').patchValue(this.initialInformation.loanAdminFee.en);
    this.form.get('loanAdminFeeInWords').patchValue(this.initialInformation.loanAdminFeeInWords.en);
    this.form.get('emiAmountInFigure').patchValue(this.initialInformation.emiAmountInFigure.en);
    this.form.get('emiAmountInWords').patchValue(this.initialInformation.emiAmountInWords.en);
    this.form.get('numberOfEmi').patchValue(this.initialInformation.numberOfEmi.en);
    this.form.get('loanCommitmentFee').patchValue(this.initialInformation.loanCommitmentFee.en);
    this.form.get('vendorName').patchValue(this.initialInformation.vendorName.en);
    this.form.get('relationshipOfficerName').patchValue(this.initialInformation.relationshipOfficerName.en);
    this.form.get('branchManager').patchValue(this.initialInformation.branchManager.en);

    // Set CT Value for Template Data:
    // this.form.get('loanLimitCheckedTransVal').patchValue(this.initialInformation.loanLimitChecked.ct);
    // this.form.get('dateofApprovalTransVal').patchValue(this.initialInformation.dateofApproval.ct);
    // this.form.get('dateofApplicationTransVal').patchValue(this.initialInformation.dateofApplication.ct);
    this.form.get('vehicleNameTransVal').patchValue(this.initialInformation.vehicleName.ct);
    this.form.get('drawingPowerTransVal').patchValue(this.initialInformation.drawingPower.ct);
    this.form.get('baseRateTransVal').patchValue(this.initialInformation.baseRate.ct);
    this.form.get('premiumRateTransVal').patchValue(this.initialInformation.premiumRate.ct);
    this.form.get('yearlyInterestRateTransVal').patchValue(this.initialInformation.yearlyInterestRate.ct);
    this.form.get('loanAdminFeeTransVal').patchValue(this.initialInformation.loanAdminFee.ct);
    this.form.get('loanAdminFeeInWordsTransVal').patchValue(this.initialInformation.loanAdminFeeInWords.ct);
    this.form.get('emiAmountInFigureTransVal').patchValue(this.initialInformation.emiAmountInFigure.ct);
    this.form.get('emiAmountInWordsTransVal').patchValue(this.initialInformation.emiAmountInWords.ct);
    this.form.get('numberOfEmiTransVal').patchValue(this.initialInformation.numberOfEmi.ct);
    this.form.get('loanCommitmentFeeTransVal').patchValue(this.initialInformation.loanCommitmentFee.ct);
    this.form.get('vendorNameTransVal').patchValue(this.initialInformation.vendorName.ct);
    this.form.get('relationshipOfficerNameTransVal').patchValue(this.initialInformation.relationshipOfficerName.ct);
    this.form.get('branchManagerTransVal').patchValue(this.initialInformation.branchManager.ct);
  }

}
