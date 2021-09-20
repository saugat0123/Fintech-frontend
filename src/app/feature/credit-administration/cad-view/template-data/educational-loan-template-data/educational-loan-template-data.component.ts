import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {SbTranslateService} from '../../../../../@core/service/sbtranslate.service';

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

  constructor(
      private formBuilder: FormBuilder,
      private dialogService: NbDialogService,
      private modelService: NgbModal,
      private ngDialogRef: NbDialogRef<EducationalLoanTemplateDataComponent>,
      private nepToEngNumberPipe: NepaliToEngNumberPipe,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private translateService: SbTranslateService
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      embassyName: [undefined],
      selectedCountry: [undefined],
      selectedSecurity: [undefined],

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
      loanDeedAmount: [undefined]
    });
  }

  submit() {
    console.log('Submitted Value ', this.form.value);
  }

  transferValue() {
    const country = this.form.get('selectedCountry').value;
    const security = this.form.get('selectedSecurity').value;

    if (!ObjectUtil.isEmpty(country) && !ObjectUtil.isEmpty(security)) {
      this.fieldFlag = true;
      this.selectedCountryVal = country;
      this.selectedSecurityVal = security;
      if (!ObjectUtil.isEmpty(this.form.get('embassyName').value)) {
        this.singleTranslate(this.form.get('embassyName').value);
      }
      // this.embassyName = this.translateService.translate(this.form.get('embassyName').value);
      console.log('Embassy Name', this.embassyName);
    }
  }

  openModel(modalName) {
    this.ngDialogRef.close();
    this.modelService.open(modalName, {size: 'xl', centered: true});
  }

  onClose() {
    this.modelService.dismissAll();
  }

  getChildData(savedFlag) {
    console.log('getChild', savedFlag);
    this.finalSavedFlag = savedFlag;
    if (this.finalSavedFlag) {
      this.onClose();
    }
  }

  async translate() {
    this.spinner = true;
    this.translatedValues = await this.translateService.translateForm(this.form);
    this.spinner = false;
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
}

