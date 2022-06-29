import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';
import {NepaliCurrencyWordPipe} from '../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';

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
  freeTextVal;
  isPODSelected: boolean;
  multiBankingDeclaration: boolean;
  personalGuarantee: boolean;
  podRenewableApplication: boolean;
  fiveMDeclarationLetter: boolean;
  houseCompletionCertificate: boolean;
  negativeLien: boolean;
  letterOfConsentForContOfExistingMortgage: boolean;
  debitAuthority: boolean;
  letterofSetOff: boolean;
  fixedDepositCertificate: boolean;
  loanArray: Array<any> = new Array<any>();
  promissoryFigure: any;
  saveFreeText: any;
  fixedDepositHolders: Array<any> = new Array<any>();
  constructor(
      private formBuilder: FormBuilder,
      public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private englishToNepali: EngToNepaliNumberPipe
  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadData.loanHolder.nepData);
      this.initialInfo = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
      this.saveFreeText = JSON.parse(this.cadData.offerDocumentList[0].supportedInformation);
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
    // console.log('name', this.loanHolderInfo.name.np);
    this.checkCondition();
    this.fillForm();
    this.guarantorData.forEach(any => {
      this.guarantorParsed.push(JSON.parse(any.nepData));
    });
    if (!ObjectUtil.isEmpty(this.initialInfo) && !ObjectUtil.isEmpty(this.initialInfo.securities)) {
      let primaryFixedSecurity: any = [];
      let secondaryFixedSecurity: any = [];
      if (!ObjectUtil.isEmpty(this.initialInfo.securities.primarySecurity)) {
        primaryFixedSecurity = this.initialInfo.securities.primarySecurity.filter((val: any) =>
        val.securityType === 'TD')[0];
        if (!ObjectUtil.isEmpty(primaryFixedSecurity)) {
          this.fixedDepositHolders.push(primaryFixedSecurity);
        }
      }
      if (!ObjectUtil.isEmpty(this.initialInfo.securities.secondarySecurity)) {
        secondaryFixedSecurity = this.initialInfo.securities.secondarySecurity.filter((val: any) =>
        val.securityType === 'TD')[0];
        if (!ObjectUtil.isEmpty(secondaryFixedSecurity)) {
          this.fixedDepositHolders.push(secondaryFixedSecurity);
        }
      }
    }
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
      freeText2: this.formBuilder.array([]),
      mortgageDeedAmountInFigure: [undefined],
      borrowerKhataNum: [undefined],
      letterOfConsentForContOfExistingMortgageName: [undefined],
      newOrAdditionalLoan: [undefined],
      pdoNabil: [undefined],
      mortgageDate: [undefined],
    });
  }
  fillForm() {
    let totalLoanAmount = 0;
    let totalLoanDeed = 0;
    this.cadData.assignedLoan.forEach(value => {
      const val = value.proposal.proposedLimit;
      if (!ObjectUtil.isEmpty(val)) {
        this.loanArray.push(val);
      }
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
    const tempAmount = totalLoanAmount + totalLoanDeed;
    this.form.patchValue({
      // loanAmountInFigure: totalLoanAmount ? totalLoanAmount : '',
      totalAmountInFigure: (totalLoanAmount + totalLoanDeed) ? this.englishToNepali.transform(tempAmount.toString()) : '',
      borrowerKhataNum: !ObjectUtil.isEmpty(this.saveFreeText) ?
          !ObjectUtil.isEmpty(this.saveFreeText.section18) ?
          this.saveFreeText.section18.borrowerKhataNum : '' : '',
      letterOfConsentForContOfExistingMortgageName: !ObjectUtil.isEmpty(this.saveFreeText) ?
          !ObjectUtil.isEmpty(this.saveFreeText.section18) ?
          this.saveFreeText.section18.letterOfConsentForContOfExistingMortgageName : '' : '',
      newOrAdditionalLoan: !ObjectUtil.isEmpty(this.saveFreeText) ?
          !ObjectUtil.isEmpty(this.saveFreeText.section18) ?
          this.saveFreeText.section18.newOrAdditionalLoan : '' : '',
      pdoNabil: !ObjectUtil.isEmpty(this.saveFreeText) ?
          !ObjectUtil.isEmpty(this.saveFreeText.section18) ?
          this.saveFreeText.section18.pdoNabil : '' : '',
      mortgageDate: !ObjectUtil.isEmpty(this.saveFreeText) ?
          !ObjectUtil.isEmpty(this.saveFreeText.section18) ?
          this.saveFreeText.section18.mortgageDate : '' : '',
    });
    if (!ObjectUtil.isEmpty(this.cadData) &&
    !ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
      if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList[0].supportedInformation)) {
        this.freeTextVal = JSON.parse(this.cadData.offerDocumentList[0].supportedInformation);
        console.log('Free Text Val:', this.freeTextVal);
        if (!ObjectUtil.isEmpty(this.freeTextVal) &&
            !ObjectUtil.isEmpty(this.freeTextVal.section18)) {
          for (let val = 0; val < this.freeTextVal.section18.length; val++) {
            this.addTextArea();
          }
          for (let val = 0; val < this.freeTextVal.section18.length; val++) {
            this.form.get(['freeText2', val, 'additionalGuarantorDetails']).patchValue(
                this.freeTextVal.section18[val].additionalGuarantorDetails);
          }
        }
      }
    }
  }
  addTextArea() {
    (this.form.get('freeText2') as FormArray).push(
        this.formBuilder.group({
          additionalGuarantorDetails: [undefined]
        }));
  }

  removeAtIndex(i: number) {
    (this.form.get('freeText2') as FormArray).removeAt(i);
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
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument) && temp.requiredLegalDocument.requiredDocument.includes('Mortgage Deed')) {
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
        && temp.requiredLegalDocument.requiredDocument.includes('NRB Declaration Form')) {
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
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Multi Banking Declaration')) {
      this.multiBankingDeclaration = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Personal Guarantee and Networth Statement')) {
      this.personalGuarantee = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('POD Renewable Application')) {
      this.podRenewableApplication = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('5M Declaration Letter')) {
      this.fiveMDeclarationLetter = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('House Completion Certificate')) {
      this.houseCompletionCertificate = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Negative Lien')) {
      this.negativeLien = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Letter of Consent from Mortgage property owner for continuation of existing mortgage')) {
      this.letterOfConsentForContOfExistingMortgage = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Debit Authority')) {
      this.debitAuthority = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Letter of Set Off')) {
      this.letterofSetOff = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Fixed Deposit  Certificate')) {
      this.fixedDepositCertificate = true;
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
