import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';
import {NepaliCurrencyWordPipe} from '../../../../../../../../@core/pipe/nepali-currency-word.pipe';

@Component({
  selector: 'app-section18-required-security-documents',
  templateUrl: './section18-required-security-documents.component.html',
  styleUrls: ['./section18-required-security-documents.component.scss']
})
export class Section18RequiredSecurityDocumentsComponent implements OnInit {
  @Input() cadData;
  form: FormGroup;
  loanHolderInfo;
  initialInfo;
  assignedData;
  guarantorData;
  guarantorParsed: Array<any> = new Array<any>();
  loanName: Array<any> = new Array<any>();
  promissoryVisible: boolean;
  continuityVisible: boolean;
  loanDeedVisible: boolean;
  mortgagedVisible: boolean;
  reMortgagedVisible: boolean;
  hirePurchaseAgreement: boolean;
  insurance: boolean;
  blueBook: boolean;
  thirdPartyConsent: boolean;
  valuationReport: boolean;
  insuranceOfBuilding: boolean;
  selfDeclaration: boolean;
  undertakingLetter: boolean;
  pan: boolean;
  sharePledgeDeed: boolean;
  nrbDeclarationForm: boolean;
  riskTakerDetail: boolean;
  sharePledgeConfirmation: boolean;
  isPODSelected: boolean;
  constructor(
      private formBuilder: FormBuilder,
      public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe
  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadData.loanHolder.nepData);
      this.initialInfo = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
    }
    if (!ObjectUtil.isEmpty(this.cadData)) {
      this.assignedData =  this.cadData.assignedLoan;
      this.guarantorData = this.cadData.assignedLoan[0].taggedGuarantors;
    }
    this.requiredDocument();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.cadData.assignedLoan.forEach(val => {
        this.loanName.push(val.loan);
      });
    }
    this.checkCondition();
    this.fillForm();
    this.guarantorData.forEach(any => {
      this.guarantorParsed.push(JSON.parse(any.nepData));
    });
  }
  buildForm() {
    return this.form = this.formBuilder.group({
      loanAmountInFigure: [undefined],
      totalAmountInFigure: [undefined],
      remortgageDeedAmountInFigure: [undefined],
      nameOfGuarantors: [undefined],
      guaranteeAmount: [undefined],
      guaranteeAmountInWords: [undefined],
      insuranceAmount: [undefined],
      freeText2: [undefined],
      mortgageDeedAmountInFigure: [undefined]
    });
  }
  fillForm() {
    let totalLoanAmount = 0;
    let totalLoanDeed = 0;
    this.cadData.assignedLoan.forEach(value => {
      const val = value.proposal.proposedLimit;
      totalLoanAmount = totalLoanAmount + val;
    });
    if (!ObjectUtil.isEmpty(this.initialInfo) &&
    !ObjectUtil.isEmpty(this.initialInfo.existingLoanForm) &&
    !ObjectUtil.isEmpty(this.initialInfo.existingLoanForm.existingLoanFormArray)) {
      this.initialInfo.existingLoanForm.existingLoanFormArray.forEach(value => {
        const totalAmount = value.loanAmountInFigure;
        totalLoanDeed = totalLoanDeed + totalAmount;
      });
    }
    this.form.patchValue({
      loanAmountInFigure: totalLoanAmount ? totalLoanAmount : '',
      totalAmountInFigure: (totalLoanAmount + totalLoanDeed) ? (totalLoanAmount + totalLoanDeed) : '',
    });
  }
  requiredDocument() {
    const temp = this.initialInfo;
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument) && temp.requiredLegalDocument.requiredDocument.includes('Promissory Note')) {
      this.promissoryVisible = true;
    }
    if (
        !ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Letter Of Continuity')) {
      this.continuityVisible = true;
    }
    if (
        !ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Loan Deed')) {
      this.loanDeedVisible = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument) && temp.requiredLegalDocument.requiredDocument.includes('Mortgaged Deed')) {
      this.mortgagedVisible = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument) && temp.requiredLegalDocument.requiredDocument.includes('Re-Mortgage Deed')) {
      this.reMortgagedVisible = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument) && temp.requiredLegalDocument.requiredDocument.includes('Hire Purchase Agreement')) {
      this.hirePurchaseAgreement = true;
    }
    if (
        !ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Insurance Policy of Vehicle')) {
      this.insurance = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Vehicle Blue Book')) {
      this.blueBook = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Third Party Consent')) {
      this.thirdPartyConsent = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Valuation Report')) {
      this.valuationReport = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Insurance of Building')) {
      this.insuranceOfBuilding = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('PAN')) {
      this.pan = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Self Declaration')) {
      this.selfDeclaration = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Undertaking Letter')) {
      this.undertakingLetter = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Share PLedge Deed')) {
      this.sharePledgeDeed = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('NED Declaration Form')) {
      this.nrbDeclarationForm = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Risk Taker Detail')) {
      this.riskTakerDetail = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Share Pledge Confirmation')) {
      this.sharePledgeConfirmation = true;
    }
  }
  checkCondition() {
    this.loanName.forEach(val => {
      if ((val.name === 'PERSONAL OVERDRAFT' && val.isRenewable === true) || val.name === 'NABIL SAHAYATRI KARJA') {
        this.isPODSelected = true;
      }
    });
  }
}
