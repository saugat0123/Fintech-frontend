import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';
import {NabilOfferLetterConst} from '../../../../../nabil-offer-letter-const';
import {CustomerSubType} from '../../../../../../customer/model/customerSubType';
import {NepaliCurrencyWordPipe} from '../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../@core/pipe/currency-formatter.pipe';
import {EngNepDatePipe} from 'nepali-patro';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-kisan-karja-subsidy-print',
  templateUrl: './kisan-karja-subsidy-print.component.html',
  styleUrls: ['./kisan-karja-subsidy-print.component.scss']
})
export class KisanKarjaSubsidyPrintComponent implements OnInit {
  offerLetterConst = NabilOfferLetterConst;
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() letter: any;
  @Input() preview;
  @Input() offerData;
  @Input() form: any;
  customerSubType = CustomerSubType;
  autoRefNumber;
  loanHolderInfo;
  customerAddress;
  proposedAmount;
  guarantorName;
  branchName;
  tempData;
  freeInformation;
  finalName;
  guarantorNames: Array<String> = [];
  allguarantorNames;
  guarantorData;
  finalDateOfApproval;
  finalDateOfApplication;
  finalNextReviewDate;
  finalPrevSanctionLetterDate;
  offerDocumentDetails;
  // Test
  dateOfApplication;
  autoPopulate1;
  autoPopulate2;

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
  guarantor;

  constructor( public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
               public engToNepNumberPipe: EngToNepaliNumberPipe,
               public currencyFormatPipe: CurrencyFormatterPipe,
               private engToNepaliDate: EngNepDatePipe,
               private engNepDatePipe: EngNepDatePipe,
               private datePipe: DatePipe) { }

  ngOnInit() {
    this.freeInformation = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation);
    this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
    this.guarantor = JSON.parse(this.guarantorData[0].nepData);
    if (ObjectUtil.isEmpty(this.freeInformation)) {
      this.autoPopulate1 = 'सम्पर्क अधिकृत';
    } else {
      this.autoPopulate1 = this.freeInformation.autoPopulate1;
    }
    if (ObjectUtil.isEmpty(this.freeInformation)) {
      this.autoPopulate2 = 'शाखा प्रबन्धक/बरिष्ठ सम्पर्क प्रबन्धक';
    } else {
      this.autoPopulate2 = this.freeInformation.autoPopulate2;
    }
    this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      let totalLoanAmount = 0;
      this.cadOfferLetterApprovedDoc.assignedLoan.forEach(value => {
        const val = value.proposal.proposedLimit;
        totalLoanAmount = totalLoanAmount + val;
      });
      this.proposedAmount = totalLoanAmount;
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
      this.customerAddress = this.loanHolderInfo.registeredMunicipality.ct + '-' +
          this.loanHolderInfo.permanentWard.ct + ', ' + this.loanHolderInfo.registeredDistrict.ct + ', ' +
          this.loanHolderInfo.registeredProvince.ct;
      this.branchName = this.loanHolderInfo.branch.ct;
    }
    this.requiredDocument();
      if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.offerDocumentList)) {
        // tslint:disable-next-line:max-line-length
        this.offerDocumentDetails = this.cadOfferLetterApprovedDoc.offerDocumentList[0] ? JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation) : '';
      }
      if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.assignedLoan)) {
        this.autoRefNumber = this.cadOfferLetterApprovedDoc.assignedLoan[0].refNo;
      }
    // For date of Approval
    const dateOfApprovalType = this.letter.dateOfApprovalType ? this.letter.dateOfApprovalType.en : '';
      if (dateOfApprovalType === 'AD') {
      this.finalDateOfApproval = this.tempData.dateOfApproval ? this.tempData.dateOfApproval.ct : '';
    } else {
      this.finalDateOfApproval = this.tempData.dateOfApprovalNepali ? this.tempData.dateOfApprovalNepali.ct : '';
    }

    // For Date of Application:
    const dateOfApplication = this.letter.dateOfApplicationType ? this.letter.dateOfApplicationType.en : '';
      if (dateOfApplication === 'AD') {
        this.finalDateOfApplication = this.tempData.dateOfApplication ? this.tempData.dateOfApplication.ct : '';
      } else {
        this.finalDateOfApplication = this.tempData.dateOfApplicationNepali ? this.tempData.dateOfApplicationNepali.ct : '';
      }
    // For Next Review Date:
    const nextReviewDate = this.letter.nextReviewDateType ? this.letter.nextReviewDateType.en : '';
      if (nextReviewDate === 'AD') {
        this.finalNextReviewDate = this.tempData.nextReviewDate ? this.tempData.nextReviewDate.ct : '';
      } else {
        this.finalNextReviewDate = this.tempData.nextReviewDateNepali ? this.tempData.nextReviewDateNepali.ct : '';
      }
    // For Previous Sanction Letter Date:
    const prevSanctionLetterDate = this.letter.previousSanctionType ? this.letter.previousSanctionType.en : '';
      if (prevSanctionLetterDate === 'AD') {
        this.finalPrevSanctionLetterDate = this.tempData.previousSanctionDate ? this.tempData.previousSanctionDate.ct : '';
      } else {
        this.finalPrevSanctionLetterDate = this.tempData.previousSanctionDateNepali ? this.tempData.previousSanctionDateNepali.ct : '';
      }
    this.guarantorDetails();
  }
  guarantorDetails() {
    if (this.guarantorData.length === 1) {
      const tempGuarantorNep = JSON.parse(this.guarantorData[0].nepData);
      if (tempGuarantorNep.guarantorType.en === 'Personal Guarantor') {
        // const temp = JSON.parse(this.guarantorData[0].nepData);
        this.finalName = tempGuarantorNep.guarantorName.ct;
      } else {
        // const temp = JSON.parse(this.guarantorData[0].nepData);
        this.finalName = tempGuarantorNep.authorizedPersonName.ct;
      }
    } else if (this.guarantorData.length === 2) {
      for (let i = 0; i < this.guarantorData.length; i++) {
        const tempGuarantorNep = JSON.parse(this.guarantorData[i].nepData);
        if (tempGuarantorNep.guarantorType.en === 'Personal Guarantor') {
          // const temp = JSON.parse(this.guarantorData[i].nepData);
          this.guarantorNames.push(tempGuarantorNep.guarantorName.ct);
        } else {
          // const temp = JSON.parse(this.guarantorData[i].nepData);
          this.guarantorNames.push(tempGuarantorNep.authorizedPersonName.ct);
        }
        // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
      }
      // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
      this.allguarantorNames = this.guarantorNames.join(' र ');
      this.finalName = this.allguarantorNames;
    } else {
      for (let i = 0; i < this.guarantorData.length - 1; i++) {
        const tempGuarantorNep = JSON.parse(this.guarantorData[i].nepData);
        if (tempGuarantorNep.guarantorType.en === 'Personal Guarantor') {
          // const temp = JSON.parse(this.guarantorData[i].nepData);
          this.guarantorNames.push(tempGuarantorNep.guarantorName.ct);
          // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
        } else {
          // const temp = JSON.parse(this.guarantorData[i].nepData);
          // console.log(temp);
          this.guarantorNames.push(tempGuarantorNep.authorizedPersonName.ct);
        }

      }
      // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
      this.allguarantorNames = this.guarantorNames.join(' , ');
      const temp1 = JSON.parse(this.guarantorData[this.guarantorData.length - 1].nepData);
      this.finalName = this.allguarantorNames + ' र ' + temp1.authorizedPersonName.ct;
    }
  }
  requiredDocument() {
    const temp = this.tempData;
    if (!ObjectUtil.isEmpty(temp.requiredDocuments)) {
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Promissory Note')) {
        this.promissoryVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Board Minute')) {
        this.boardVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Loan Deed')) {
        this.loanDeedVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Mortgaged Deed')) {
        this.mortgagedVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Letter Of Continuity')) {
        this.continuityVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('General Letter Of Hypothecation with Supplementary Agreement')) {
        this.supplementaryVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Assignment Of Receivables with Power Of Attorney')) {
        this.attorneyVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Multiple Banking Declaration')) {
        this.multiVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Personal Guarantee')) {
        this.guaranteeVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Wealth Statement Of Guarantor')) {
        this.wealthVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Insurance Of Stock')) {
        this.bankersClause1 = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Insurance Of Building')) {
        this.bankersClause2 = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Insurance Declaration Statement')) {
        this.insuranceDeclarationVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Undertaking Letter')) {
        this.undertakingLetterVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Declaration Letter')) {
        this.declarationVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Lease Agreement')) {
        this.leaseVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Letter Of Consent from Mortgage Property Owner for Continuation Of Existing Mortgage')) {
        this.consentLetterVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Letter Of Consent from Mortgage Property Owner for Continuation Of Existing Mortgage')) {
        this.continuityVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Building Construction Complete Certificate')) {
        this.buildingVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Hire Purchase Agreement')) {
        this.hirePurchaseVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Comprehensive Insurance')) {
        this.comprehensiveVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Consent for Third Party Transfer in Case Of Default')) {
        this.thirdPartyVisible = true;
      }if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Blue Book')) {
        this.blueBook = true;
      }if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Loan Subordination Agreement')) {
        this.loanSubordinationAgreement = true;
      }if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Pari-Pasu Deed')) {
        this.pariPasu = true;
      }if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Partnership Deed')) {
        this.partnershipDeed = true;
      }if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Letter Of Set Off')) {
        this.letterSetOff = true;
      }
    }
  }
}
