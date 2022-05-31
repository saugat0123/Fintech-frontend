import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from "../../../model/customerApprovedLoanCadDocumentation";
import {OfferDocument} from "../../../model/OfferDocument";
import {NabilOfferLetterConst} from "../../../nabil-offer-letter-const";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NbDialogRef, NbDialogService} from "@nebular/theme";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NepaliToEngNumberPipe} from "../../../../../@core/pipe/nepali-to-eng-number.pipe";
import {NepaliCurrencyWordPipe} from "../../../../../@core/pipe/nepali-currency-word.pipe";
import {SbTranslateService} from "../../../../../@core/service/sbtranslate.service";
import {CreditAdministrationService} from "../../../service/credit-administration.service";
import {ToastService} from "../../../../../@core/utils";
import {EngToNepaliNumberPipe} from "../../../../../@core/pipe/eng-to-nepali-number.pipe";
import {CurrencyFormatterPipe} from "../../../../../@core/pipe/currency-formatter.pipe";
import {CadOfferLetterConfigurationComponent} from "../../../cad-offerletter-profile/cad-offer-letter-configuration/cad-offer-letter-configuration.component";
import {Attributes} from "../../../../../@core/model/attributes";
import {PersonalLoanAndPersonalOverdraftComponent} from "../../../mega-offer-letter-template/mega-offer-letter/personal-loan-and-personal-overdraft/personal-loan-and-personal-overdraft.component";
import {Alert, AlertType} from "../../../../../@theme/model/Alert";
import {ObjectUtil} from "../../../../../@core/utils/ObjectUtil";

@Component({
  selector: 'app-personal-loan-and-personal-overdraft-template-edit',
  templateUrl: './personal-loan-and-personal-overdraft-template-edit.component.html',
  styleUrls: ['./personal-loan-and-personal-overdraft-template-edit.component.scss']
})
export class PersonalLoanAndPersonalOverdraftTemplateEditComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() offerDocumentList: Array<OfferDocument>;
  @Input() initialInformation: any;
  @Input() offerLetterId: number;
  offerLetterTypes = [];
  offerLetterConst = NabilOfferLetterConst;
  offerLetterSelect;
  translatedValues: any = {};
  form: FormGroup;
  spinner = false;
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
  previewBtn = true;
  submitted = false;
  closed = false;
  constructor(private formBuilder: FormBuilder,
              private dialogService: NbDialogService,
              private modelService: NgbModal,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private translateService: SbTranslateService,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private engToNepaliNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatterPipe: CurrencyFormatterPipe,
              public ngDialogRef: NbDialogRef<PersonalLoanAndPersonalOverdraftTemplateEditComponent>,
  ) { }

  ngOnInit() {
    this.buildPersonal();
    if (!ObjectUtil.isEmpty(this.initialInformation)) {
      const loanExpiryDateType1 = this.initialInformation.loanExpiryDateType ? this.initialInformation.loanExpiryDateType.en : '';
      if (loanExpiryDateType1 === 'AD') {
        this.dateTypeAD2 = true;
      } else {
        this.dateTypeBS2 = true;
      }
      const dateofApprovalType1 = this.initialInformation.dateofApprovalType ? this.initialInformation.dateofApprovalType.en : '';
      if (dateofApprovalType1 === 'AD') {
        this.dateTypeAD = true;
      } else {
        this.dateTypeBS = true;
      }
      const dateofApplicationType1 = this.initialInformation.dateofApplicationType ? this.initialInformation.dateofApplicationType.en : '';
      if (dateofApplicationType1 === 'AD') {
        this.dateTypeAD1 = true;
      } else {
        this.dateTypeBS1 = true;
      }
      this.setPersonalLoanOverdraftData();
    }
  }

  buildPersonal() {
    this.form = this.formBuilder.group({
      dateofApproval: [undefined],
      dateofApprovalNepali: [undefined],
      dateofApprovalType: [undefined],
      dateofApplication: [undefined],
      dateofApplicationNepali: [undefined],
      dateofApplicationType: [undefined],
      loanAmountPl: [undefined],
      loanAmountPlInWords: [undefined],
      loanAmountOd: [undefined],
      loanAmountOdInWords: [undefined],
      purposeofLoan: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      yearlyInterestRate: [undefined],
      loanAdminFeeinFigure: [undefined],
      loanAdminFeeinWords: [undefined],
      purposeofLoanOd: [undefined],
      baseRateOd: [undefined],
      premiumRateOd: [undefined],
      yearlyInterestRateOd: [undefined],
      loanAdminFeeinFigureOd: [undefined],
      loanAdminFeeinWordsOd: [undefined],
      emiInFigure: [undefined],
      emiInWords: [undefined],
      loanExpiryDate: [undefined],
      loanExpiryDateType: [undefined],
      loanExpiryDateNepali: [undefined],
      accountNumber: [undefined],
      nameofCompanyCustomerWorking: [undefined],
      relationshipofficerName: [undefined],
      branchManager: [undefined],
      loanPeriodInMonth: [undefined],
      // translated value
      dateofApprovalTransVal: [undefined],
      dateofApprovalNepaliTransVal: [undefined],
      dateofApprovalTypeTransVal: [undefined],
      dateofApplicationTransVal: [undefined],
      dateofApplicationNepaliTransVal: [undefined],
      dateofApplicationTypeTransVal: [undefined],
      loanAmountPlTransVal: [undefined],
      loanAmountPlInWordsTransVal: [undefined],
      loanAmountOdTransVal: [undefined],
      loanAmountOdInWordsTransVal: [undefined],
      purposeofLoanTransVal: [undefined, Validators.required],
      baseRateTransVal: [undefined],
      premiumRateTransVal: [undefined],
      yearlyInterestRateTransVal: [undefined],
      loanAdminFeeinFigureTransVal: [undefined, Validators.required],
      loanAdminFeeinWordsTransVal: [undefined],
      purposeofLoanOdTransVal: [undefined, Validators.required],
      baseRateOdTransVal: [undefined],
      premiumRateOdTransVal: [undefined],
      yearlyInterestRateOdTransVal: [undefined],
      loanAdminFeeinFigureOdTransVal: [undefined, Validators.required],
      loanAdminFeeinWordsOdTransVal: [undefined],
      emiInFigureTransVal: [undefined, Validators.required],
      emiInWordsTransVal: [undefined],
      loanExpiryDateTransVal: [undefined],
      loanExpiryDateTypeTransVal: [undefined],
      loanExpiryDateNepaliTransVal: [undefined],
      accountNumberTransVal: [undefined, Validators.required],
      nameofCompanyCustomerWorkingTransVal: [undefined, Validators.required],
      relationshipofficerNameTransVal: [undefined, Validators.required],
      branchManagerTransVal: [undefined, Validators.required],
      loanPeriodInMonthTransVal: [undefined],
    });
  }

  async translate() {
    this.spinner = true;
    this.podtranslatedData = await this.translateService.translateForm(this.form);
    this.tdValues = this.podtranslatedData;
    this.setTemplatedCTData();
    this.spinner = false;
    this.btnDisable = false;
  }
  private setTemplatedCTData(): void {
    this.form.get('dateofApprovalTransVal').patchValue(this.podtranslatedData.dateofApproval);
    this.form.get('dateofApprovalNepaliTransVal').patchValue(this.podtranslatedData.dateofApprovalNepali);
    this.form.get('dateofApplicationTransVal').patchValue(this.podtranslatedData.dateofApplication);
    this.form.get('dateofApplicationNepaliTransVal').patchValue(this.podtranslatedData.dateofApplicationNepali);
    this.form.get('purposeofLoanTransVal').patchValue(this.podtranslatedData.purposeofLoan);
    this.form.get('purposeofLoanOdTransVal').patchValue(this.podtranslatedData.purposeofLoanOd);
    this.form.get('loanExpiryDateTransVal').patchValue(this.podtranslatedData.loanExpiryDate);
    this.form.get('loanExpiryDateNepaliTransVal').patchValue(this.podtranslatedData.loanExpiryDateNepali);
    this.form.get('nameofCompanyCustomerWorkingTransVal').patchValue(this.podtranslatedData.nameofCompanyCustomerWorking);
    this.form.get('relationshipofficerNameTransVal').patchValue(this.podtranslatedData.relationshipofficerName);
    this.form.get('branchManagerTransVal').patchValue(this.podtranslatedData.branchManager);
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

  calInterestRate1() {
    const baseRate = this.form.get('baseRateOd').value;
    const premiumRate = this.form.get('premiumRateOd').value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.form.get('yearlyInterestRateOd').patchValue(sum);
    this.translateNumber('baseRateOd', 'baseRateOdTransVal');
    this.translateNumber('premiumRateOd', 'premiumRateOdTransVal');
    this.translateNumber('yearlyInterestRateOd', 'yearlyInterestRateOdTransVal');
  }

  mappedData() {
    Object.keys(this.form.controls).forEach(key => {
      // tslint:disable-next-line:no-shadowed-variable
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

  checkboxVal(event, formControlName) {
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

  openModel() {
    this.dialogService.open(PersonalLoanAndPersonalOverdraftComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      hasBackdrop: false,
      context: {
        cadOfferLetterApprovedDoc: this.customerApprovedDoc,
        preview: true,
      }
    });
  }
  deleteCTAndTransControls(data) {
    const individualData = data as FormGroup;
    Object.keys(data).forEach(key => {
      if (key.indexOf('CT') > -1 || key.indexOf('TransVal') > -1) {
        delete individualData[key];
      }
    });
  }

  private setPersonalLoanOverdraftData(): void {
    // Set Date of Approval
    this.form.get('dateofApprovalType').patchValue(this.initialInformation.dateofApprovalType.en);
    if (this.initialInformation.dateofApprovalType.en === 'AD') {
      this.form.get('dateofApproval').patchValue(new Date(this.initialInformation.dateofApproval.en));
    } else {
      this.form.get('dateofApprovalNepali').patchValue(this.initialInformation.dateofApprovalNepali.en);
    }
    // Set Date of Application
    this.form.get('dateofApplicationType').patchValue(this.initialInformation.dateofApplicationType.en);
    if (this.initialInformation.dateofApplicationType.en === 'AD') {
      this.form.get('dateofApplication').patchValue(new Date(this.initialInformation.dateofApplication.en));
    } else {
      this.form.get('dateofApplicationNepali').patchValue(this.initialInformation.dateofApplicationNepali.en);
    }
    //set Expiry Date
    this.form.get('loanExpiryDateType').patchValue(this.initialInformation.loanExpiryDateType.en);
    if (this.initialInformation.loanExpiryDateType.en === 'AD') {
      this.form.get('loanExpiryDate').patchValue(new Date(this.initialInformation.loanExpiryDate.en));
    } else {
      this.form.get('loanExpiryDateNepali').patchValue(this.initialInformation.loanExpiryDateNepali.en);
    }
    this.form.get('loanAmountPl').patchValue(this.initialInformation.loanAmountPl.en);
    this.form.get('loanAmountPlInWords').patchValue(this.initialInformation.loanAmountPlInWords.en);
    this.form.get('loanAmountOd').patchValue(this.initialInformation.loanAmountOd.en);
    this.form.get('loanAmountOdInWords').patchValue(this.initialInformation.loanAmountOdInWords.en);
    this.form.get('purposeofLoan').patchValue(this.initialInformation.purposeofLoan.en);
    this.form.get('baseRate').patchValue(this.initialInformation.baseRate.en);
    this.form.get('premiumRate').patchValue(this.initialInformation.premiumRate.en);
    this.form.get('yearlyInterestRate').patchValue(this.initialInformation.yearlyInterestRate.en);
    this.form.get('loanAdminFeeinFigure').patchValue(this.initialInformation.loanAdminFeeinFigure.en);
    this.form.get('loanAdminFeeinWords').patchValue(this.initialInformation.loanAdminFeeinWords.en);
    this.form.get('purposeofLoanOd').patchValue(this.initialInformation.purposeofLoanOd.en);
    this.form.get('baseRateOd').patchValue(this.initialInformation.baseRateOd.en);
    this.form.get('premiumRateOd').patchValue(this.initialInformation.premiumRateOd.en);
    this.form.get('yearlyInterestRateOd').patchValue(this.initialInformation.yearlyInterestRateOd.en);
    this.form.get('loanAdminFeeinFigureOd').patchValue(this.initialInformation.loanAdminFeeinFigureOd.en);
    this.form.get('loanAdminFeeinWordsOd').patchValue(this.initialInformation.loanAdminFeeinWordsOd.en);
    this.form.get('emiInFigure').patchValue(this.initialInformation.emiInFigure.en);
    this.form.get('emiInWords').patchValue(this.initialInformation.emiInWords.en);
    this.form.get('accountNumber').patchValue(this.initialInformation.accountNumber.en);
    this.form.get('nameofCompanyCustomerWorking').patchValue(this.initialInformation.nameofCompanyCustomerWorking.en);
    this.form.get('relationshipofficerName').patchValue(this.initialInformation.relationshipofficerName.en);
    this.form.get('branchManager').patchValue(this.initialInformation.branchManager.en);
    this.form.get('loanPeriodInMonth').patchValue(this.initialInformation.loanPeriodInMonth.en);

    // set ct value
    this.form.get('loanAmountPlTransVal').patchValue(this.initialInformation.loanAmountPl.ct);
    this.form.get('loanAmountPlInWordsTransVal').patchValue(this.initialInformation.loanAmountPlInWords.ct);
    this.form.get('loanAmountOdTransVal').patchValue(this.initialInformation.loanAmountOd.ct);
    this.form.get('loanAmountOdInWordsTransVal').patchValue(this.initialInformation.loanAmountOdInWords.ct);
    this.form.get('purposeofLoanTransVal').patchValue(this.initialInformation.purposeofLoan.ct);
    this.form.get('baseRateTransVal').patchValue(this.initialInformation.baseRate.ct);
    this.form.get('premiumRateTransVal').patchValue(this.initialInformation.premiumRate.ct);
    this.form.get('yearlyInterestRateTransVal').patchValue(this.initialInformation.yearlyInterestRate.ct);
    this.form.get('loanAdminFeeinFigureTransVal').patchValue(this.initialInformation.loanAdminFeeinFigure.ct);
    this.form.get('loanAdminFeeinWordsTransVal').patchValue(this.initialInformation.loanAdminFeeinWords.ct);
    this.form.get('purposeofLoanOdTransVal').patchValue(this.initialInformation.purposeofLoanOd.ct);
    this.form.get('baseRateOdTransVal').patchValue(this.initialInformation.baseRateOd.ct);
    this.form.get('premiumRateOdTransVal').patchValue(this.initialInformation.premiumRateOd.ct);
    this.form.get('yearlyInterestRateOdTransVal').patchValue(this.initialInformation.yearlyInterestRateOd.ct);
    this.form.get('loanAdminFeeinFigureOdTransVal').patchValue(this.initialInformation.loanAdminFeeinFigureOd.ct);
    this.form.get('loanAdminFeeinWordsOdTransVal').patchValue(this.initialInformation.loanAdminFeeinWordsOd.ct);
    this.form.get('emiInFigureTransVal').patchValue(this.initialInformation.emiInFigure.ct);
    this.form.get('emiInWordsTransVal').patchValue(this.initialInformation.emiInWords.ct);
    this.form.get('accountNumberTransVal').patchValue(this.initialInformation.accountNumber.ct);
    this.form.get('nameofCompanyCustomerWorkingTransVal').patchValue(this.initialInformation.nameofCompanyCustomerWorking.ct);
    this.form.get('relationshipofficerNameTransVal').patchValue(this.initialInformation.relationshipofficerName.ct);
    this.form.get('branchManagerTransVal').patchValue(this.initialInformation.branchManager.ct);
    this.form.get('loanPeriodInMonthTransVal').patchValue(this.initialInformation.loanPeriodInMonth.ct);
  }

  submit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.toastService.show(new Alert(AlertType.DANGER, 'Please check validation'));
      this.spinner = false;
      return;
    }
    this.spinner = true;
    this.btnDisable = true;
    this.customerApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';

    if (this.customerApprovedDoc.offerDocumentList.length > 0) {
      this.offerLetterDocument = this.customerApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
          === this.offerLetterConst.value(this.offerLetterConst.PERSONAL_LOAN_AND_PERSONAL_OVERDRAFT).toString())[0];
      if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
        this.existingOfferLetter = true;
      }
    }

    if (this.existingOfferLetter) {
      this.customerApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.PERSONAL_LOAN_AND_PERSONAL_OVERDRAFT).toString()) {
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
          offerLetterPath.initialInformation = JSON.stringify(this.tdValues);
          this.podtranslatedData = {};
        }
      });
    }
    this.administrationService.saveCadDocumentBulk(this.customerApprovedDoc).subscribe((res: any) => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully updated Offer Letter'));
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

}
