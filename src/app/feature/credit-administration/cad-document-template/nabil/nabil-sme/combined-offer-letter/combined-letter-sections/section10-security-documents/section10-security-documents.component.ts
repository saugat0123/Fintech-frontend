import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';
import {EngToNepaliNumberPipe} from '../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../@core/pipe/currency-formatter.pipe';

@Component({
  selector: 'app-section10-security-documents',
  templateUrl: './section10-security-documents.component.html',
  styleUrls: ['./section10-security-documents.component.scss']
})
export class Section10SecurityDocumentsComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc;
  form: FormGroup;
  loanHolderInfo: any;
  tempData: any;
  guarantorData: any;
  guarantorNames: Array<String> = [];
  allguarantorNames;
  finalName;
  finalPersonalName;
  personalGuarantorsName: Array<any> = new Array<any>();
  guarantorParsed: Array<any> = new Array<any>();
  tempPersonalGuarantors;
  temp2;
  limitAmount;
  kittaNumbers: Array<any> = new Array<any>();
  securityOwnersName: Array<any> = new Array<any>();
  plotNumber;
  nameOfPropertyOwner;
  promissoryVisible: boolean;
  boardVisible: boolean;
  loanDeedVisible: boolean;
  mortgagedVisible: boolean;
  continuityVisible: boolean;
  supplementaryVisible: boolean;
  attorneyVisible: boolean;
  multiVisible: boolean;
  guaranteeVisible: boolean;
  wealthVisible: boolean;
  bankersClause1: boolean;
  bankersClause2: boolean;
  insuranceDeclarationVisible: boolean;
  undertakingLetterVisible: boolean;
  declarationVisible: boolean;
  leaseVisible: boolean;
  consentLetterVisible: boolean;
  buildingVisible: boolean;
  hirePurchaseVisible: boolean;
  comprehensiveVisible: boolean;
  thirdPartyVisible: boolean;
  blueBook: boolean;
  loanSubordinationAgreement: boolean;
  pariPasu: boolean;
  partnershipDeed: boolean;
  letterSetOff: boolean;
  constructor(private formBuilder: FormBuilder,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatPipe: CurrencyFormatterPipe) {
  }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
      this.limitAmount = this.tempData.smeGlobalForm.totalLimitInFigure;
      this.requiredDocument();
      this.fillForm();
      this.guarantorData.forEach(any => {
        this.guarantorParsed.push(JSON.parse(any.nepData));
      });
      this.guarantorDetails();
    }
    const securities = this.tempData.securities;
    securities.primarySecurity.forEach(pd => {
      pd.propertyDetails.forEach(p => {
        if (!ObjectUtil.isEmpty(p.securityOwnersKittaNoCT)) {
          this.kittaNumbers.push(p.securityOwnersKittaNoCT);
        }
      });
    });
    securities.secondarySecurity.forEach(pd => {
      pd.propertyDetails.forEach(p => {
        if (!ObjectUtil.isEmpty(p.securityOwnersKittaNoCT)) {
          this.kittaNumbers.push(p.securityOwnersKittaNoCT);
        }
      });
    });
    securities.primarySecurity.forEach(sw => {
      if (!ObjectUtil.isEmpty(sw.securityOwnersNameCT)) {
        this.securityOwnersName.push(sw.securityOwnersNameCT);
      }
    });
    securities.secondarySecurity.forEach(sw => {
      if (!ObjectUtil.isEmpty(sw.securityOwnersNameCT)) {
        this.securityOwnersName.push(sw.securityOwnersNameCT);
      }
    });
  }
  getKittaNumbers(plotNumber, kittaNumbers) {
    if (plotNumber.length === 1) {
      kittaNumbers = plotNumber[0];
    }
    if (plotNumber.length === 2) {
      kittaNumbers = plotNumber.join(' र ');
    }
    if (plotNumber.length > 2) {
      for (let i = 0; i < plotNumber.length - 1; i++) {
        this.temp2 = plotNumber.join(' , ');
      }
      const temp1 = plotNumber[plotNumber.length - 1];
      kittaNumbers = this.temp2 + ' र ' + temp1;
    }
    return kittaNumbers ? kittaNumbers : '';
  }

  getSecurityOwner(nameOfPropertyOwner, securityOwnersName) {
    if (nameOfPropertyOwner.length === 1) {
      securityOwnersName = nameOfPropertyOwner[0];
    }
    if (nameOfPropertyOwner.length === 2) {
      securityOwnersName = nameOfPropertyOwner.join(' र ');
    }
    if (nameOfPropertyOwner.length > 2) {
      for (let i = 0; i < nameOfPropertyOwner.length - 1; i++) {
        this.temp2 = nameOfPropertyOwner.join(' , ');
      }
      const temp1 = nameOfPropertyOwner[nameOfPropertyOwner.length - 1];
      securityOwnersName = this.temp2 + ' र ' + temp1;
    }
    return securityOwnersName ? securityOwnersName : '';
  }
  buildForm() {
    this.form = this.formBuilder.group({
      totalLoanAmountInFigure: [undefined],
      loanAmountInFigure: [undefined],
      nameOfBranch: [undefined],
      additionalGuarantorDetails: [undefined],
      guarantorName: [undefined],
      plotNumber: [undefined],
      nameOfPropertyOwner: [undefined],
    });
  }

  guarantorDetails() {
    this.tempPersonalGuarantors = this.guarantorParsed.filter(val =>
        val.guarantorType.en === 'Personal Guarantor');
    this.personalGuarantorDetails();
  }

  personalGuarantorDetails() {
    let rel: String = '';
    this.tempPersonalGuarantors.forEach(i => {
      if (i.gender.en === 'FEMALE' && i.relationMedium.en === '0') {
        rel = 'श्रीमती';
      }
      if (i.gender.en === 'FEMALE' && i.relationMedium.en === '1') {
        rel = 'सुश्री';
      }
      if (i.gender.en === 'MALE') {
        rel = 'श्रीमान्';
      }
      this.personalGuarantorsName.push(rel + ' ' + i.guarantorName.ct);
    });
  }

  commonGuarantorDetails(guarantorName, finalName) {
    if (guarantorName.length === 1) {
      finalName = guarantorName[0];
    }
    if (guarantorName.length === 2) {
      finalName = guarantorName.join(' र ');
    }
    if (guarantorName.length > 2) {
      for (let i = 0; i < guarantorName.length - 1; i++) {
        this.temp2 = guarantorName.join(' , ');
      }
      const temp1 = guarantorName[guarantorName.length - 1];
      finalName = this.temp2 + ' र ' + temp1;
    }
    return finalName ? finalName : '';
  }

  fillForm() {
    const proposalData = this.cadOfferLetterApprovedDoc.assignedLoan[0].proposal;
    const loanAmount = this.engToNepNumberPipe.transform(proposalData.proposedLimit);
    let totalLoanAmount = 0;
    this.cadOfferLetterApprovedDoc.assignedLoan.forEach(value => {
      const val = value.proposal.proposedLimit;
      totalLoanAmount = totalLoanAmount + val;
    });
    this.form.patchValue({
      totalLoanAmountInFigure: this.limitAmount ? this.limitAmount : '',
      loanAmountInFigure: this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount)),
      nameOfBranch: this.loanHolderInfo.branch ? this.loanHolderInfo.branch.ct : '',
      guarantorName: this.finalName ? this.finalName : '',
      plotNumber: this.kittaNumbers ? this.kittaNumbers : '',
      nameOfPropertyOwner: this.securityOwnersName ? this.securityOwnersName : '',
    });
  }

  requiredDocument() {
    const temp = this.tempData;
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument) && temp.requiredLegalDocument.requiredDocument.includes('Promissory Note')) {
      this.promissoryVisible = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument) && temp.requiredLegalDocument.requiredDocument.includes('Board Minute')) {
      this.boardVisible = true;
    }
    if (
        !ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Loan Deed')) {
      this.loanDeedVisible = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument) && temp.requiredLegalDocument.requiredDocument.includes('Mortgaged Deed')) {
      this.mortgagedVisible = true;
    }
    if (
        !ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Letter Of Continuity')) {
      this.continuityVisible = true;
    }
    if (
        !ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('General Letter Of Hypothecation with Supplementary Agreement')) {
      this.supplementaryVisible = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Assignment Of Receivables with Power Of Attorney')) {
      this.attorneyVisible = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Multiple Banking Declaration')) {
      this.multiVisible = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Personal Guarantee')) {
      this.guaranteeVisible = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Wealth Statement Of Guarantor')) {
      this.wealthVisible = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Insurance Of Stock')) {
      this.bankersClause1 = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Insurance Of Building')) {
      this.bankersClause2 = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Insurance Declaration Statement')) {
      this.insuranceDeclarationVisible = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Undertaking Letter')) {
      this.undertakingLetterVisible = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Declaration Letter')) {
      this.declarationVisible = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Lease Agreement')) {
      this.leaseVisible = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Letter Of Consent from Mortgage Property Owner for Continuation Of Existing Mortgage')) {
      this.consentLetterVisible = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Letter Of Consent from Mortgage Property Owner for Continuation Of Existing Mortgage')) {
      this.continuityVisible = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Building Construction Complete Certificate')) {
      this.buildingVisible = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Hire Purchase Agreement')) {
      this.hirePurchaseVisible = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Comprehensive Insurance')) {
      this.comprehensiveVisible = true;
    }
    if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Consent for Third Party Transfer in Case Of Default')) {
      this.thirdPartyVisible = true;
    }if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Blue Book')) {
      this.blueBook = true;
    }if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Loan Subordination Agreement')) {
      this.loanSubordinationAgreement = true;
    }if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Pari-Pasu Deed')) {
      this.pariPasu = true;
    }if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Partnership Deed')) {
      this.partnershipDeed = true;
    }if (!ObjectUtil.isEmpty(temp.requiredLegalDocument.requiredDocument)
        && temp.requiredLegalDocument.requiredDocument.includes('Letter Of Set Off')) {
      this.letterSetOff = true;
    }
  }

}
