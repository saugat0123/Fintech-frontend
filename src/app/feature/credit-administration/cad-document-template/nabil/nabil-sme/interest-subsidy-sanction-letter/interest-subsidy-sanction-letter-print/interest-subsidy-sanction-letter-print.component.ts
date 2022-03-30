import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CustomerApprovedLoanCadDocumentation } from '../../../../../model/customerApprovedLoanCadDocumentation';
import { NabilOfferLetterConst } from '../../../../../nabil-offer-letter-const';
import { NepaliCurrencyWordPipe } from '../../../../../../../@core/pipe/nepali-currency-word.pipe';
import { EngToNepaliNumberPipe } from '../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import { CurrencyFormatterPipe } from '../../../../../../../@core/pipe/currency-formatter.pipe';
import { EngNepDatePipe } from 'nepali-patro';
import { DatePipe } from '@angular/common';
import { ObjectUtil } from '../../../../../../../@core/utils/ObjectUtil';
import { CustomerSubType } from '../../../../../../customer/model/customerSubType';

@Component({
  selector: 'app-interest-subsidy-sanction-letter-print',
  templateUrl: './interest-subsidy-sanction-letter-print.component.html',
  styleUrls: ['./interest-subsidy-sanction-letter-print.component.scss'],
})
export class InterestSubsidySanctionLetterPrintComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() letter: any;
  @Input() security: any;
  @Input() renewal: any;
  @Input() offerData;
  @Input() loanLimit;
  @Input() preview;
  loanHolderInfo;
  offerLetterConst = NabilOfferLetterConst;
  selectedSecurity;
  renewalVal = false;
  customerAddress;
  proposedAmount;
  guarantorName;
  branchName;
  guarantorData;
  offerDocumentDetails;
  autoRefNumber;
  guarantorNames: Array<String> = [];
  allguarantorNames;
  guarantorAmount = 0;
  guarantorAmountNepali;
  finalName;
  autoPopulate1;
  autoPopulate2;
  finalDateOfApproval;
  finalDateOfApplication;
  finalDateofSanction;
  freeInformation;
  personalGuarantorsName: Array<any> = new Array<any>();
  guarantorParsed: Array<any> = new Array<any>();
  tempPersonalGuarantors;
  temp2;
  finalPersonalName;
  tempData;

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
  securityDetails: any;
  // security conditions
  securityTypeCondition = false;
  securityTypeConditionFixedAssests = false;
  securityTypeConditionStock = false;
  securityTypeConditionAssestsPlants = false;
  tempSecondaryLandBuilding;
  securityTypeSecondaryCondition = false;
  securityTypeSecondaryConditionFixedAssests = false;
  securityTypeSecondaryConditionStock = false;
  securityTypeSecondaryConditionAssestsPlants = false;
  securityTypeConditionLandAndBuilding = false;
  securityTypeConditionLandAndBuildingSecondary = false;
  securityTypeConditionLiveStocks = false;
  securityTypeConditionDocuments = false;
  securityTypeConditionPg = false;
  plotNumber;
  customerSubType = CustomerSubType;
  inStock = false;
  fixedAssests = false;
  liveStock = false;
  securityTypeConditionFixedAssestsSecondary = false;
  securityTypeConditionDocumentsSecondary = false;


  constructor(
    public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
    public engToNepNumberPipe: EngToNepaliNumberPipe,
    public currencyFormatPipe: CurrencyFormatterPipe,
    private engToNepaliDate: EngNepDatePipe,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.freeInformation = JSON.parse(
      this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation
    );
    this.selectedSecurity = this.security;
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
    // this.renewalVal = this.letter.renewalChecked.en;
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      let totalLoanAmount = 0;
      this.cadOfferLetterApprovedDoc.assignedLoan.forEach((value) => {
        const val = value.proposal.proposedLimit;
        totalLoanAmount = totalLoanAmount + val;
      });
      this.guarantorData =
        this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
      this.proposedAmount = totalLoanAmount;
      this.loanHolderInfo = JSON.parse(
        this.cadOfferLetterApprovedDoc.loanHolder.nepData
      );
      if (this.loanHolderInfo.clientType.en === 'INDIVIDUAL') {
        this.customerAddress =
          this.loanHolderInfo.permanentMunicipality.ct +
          '-' +
          this.loanHolderInfo.permanentWard.ct +
          ', ' +
          this.loanHolderInfo.permanentDistrict.ct +
          ', ' +
          this.loanHolderInfo.permanentProvince.ct;
      } else {
        this.customerAddress =
          this.loanHolderInfo.registeredMunicipality.ct +
          '-' +
          this.loanHolderInfo.permanentWard.ct +
          ', ' +
          this.loanHolderInfo.registeredDistrict.ct +
          ', ' +
          this.loanHolderInfo.registeredProvince.ct;
      }
      this.branchName = this.loanHolderInfo.branch
        ? this.loanHolderInfo.branch.ct
        : '';
      this.tempData = JSON.parse(
        this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation
      );
      this.securityDetails = this.tempData.securities;
    }
    this.requiredDocument();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.offerDocumentList)) {
      // tslint:disable-next-line:max-line-length
      this.offerDocumentDetails = this.cadOfferLetterApprovedDoc
        .offerDocumentList[0]
        ? JSON.parse(
            this.cadOfferLetterApprovedDoc.offerDocumentList[0]
              .initialInformation
          )
        : '';
    }
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.assignedLoan)) {
      this.autoRefNumber = this.cadOfferLetterApprovedDoc.assignedLoan[0].refNo;
    }
    // For date of Approval
    const dateOfApprovalType = this.letter.dateOfApprovalType
      ? this.letter.dateOfApprovalType.en
      : '';
    if (dateOfApprovalType === 'AD') {
      // const templateDateApproval = this.letter.dateOfApproval ? this.letter.dateOfApproval.en : '';
      // this.finalDateOfApproval = this.engToNepaliDate.transform(this.datePipe.transform(templateDateApproval), true);
      this.finalDateOfApproval = this.letter.dateOfApproval
        ? this.letter.dateOfApproval.ct
        : '';
    } else {
      const templateDateApproval = this.letter.dateOfApprovalNepali
        ? this.letter.dateOfApprovalNepali.en
        : '';
      this.finalDateOfApproval = templateDateApproval
        ? templateDateApproval.nDate
        : '';
    }
    // For Date of Application:
    const dateOfApplication = this.letter.dateOfApplicationType
      ? this.letter.dateOfApplicationType.en
      : '';
    if (dateOfApplication === 'AD') {
      const templateDateApplication = this.letter.dateOfApplication
        ? this.letter.dateOfApplication.ct
        : '';
      this.finalDateOfApplication = templateDateApplication
        ? templateDateApplication
        : '';
    } else {
      const templateDateApplication = this.letter.dateOfApplicationNepali
        ? this.letter.dateOfApplicationNepali.en
        : '';
      this.finalDateOfApplication = templateDateApplication
        ? templateDateApplication.nDate
        : '';
    }
    // For Sanction Letter Date:
    const sanctionLetterDate = this.letter.previousSanctionType
      ? this.letter.previousSanctionType.en
      : '';
    if (sanctionLetterDate === 'AD') {
      const templateSanctionDate = this.letter.previousSanctionDate
        ? this.letter.previousSanctionDate.ct
        : '';
      this.finalDateofSanction = templateSanctionDate
        ? templateSanctionDate
        : '';
    } else {
      const templateSanctionDate = this.letter.previousSanctionDateNepali
        ? this.letter.previousSanctionDateNepali.en
        : '';
      this.finalDateofSanction = templateSanctionDate
        ? templateSanctionDate.nDate
        : '';
    }
    this.guarantorData.forEach((any) => {
      this.guarantorParsed.push(JSON.parse(any.nepData));
    });
    this.guarantorDetails();
    this.checkPrimaryConditions();
    this.checkSecondaryConditions();
  }

  guarantorParse(nepData, key, trans?) {
    const data = JSON.parse(nepData);
    if (ObjectUtil.isEmpty(trans)) {
      return data[key].ct;
    } else {
      return data[key].en;
    }
  }

  guarantorDetails() {
    if (this.loanHolderInfo.clientType.en === 'INSTITUTION') {
      this.tempPersonalGuarantors = this.guarantorParsed.filter(
        (val) => val.guarantorType.en === 'Personal Guarantor'
      );
      this.tempPersonalGuarantors.forEach((i) => {
        this.personalGuarantorsName.push(
          i.guarantorName ? i.guarantorName.ct : ''
        );
      });
    }
    if (this.loanHolderInfo.clientType.en === 'INDIVIDUAL') {
      this.tempPersonalGuarantors = this.guarantorParsed;
    }
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
        this.temp2 = guarantorName.join(', ');
      }
      const temp1 = guarantorName[guarantorName.length - 1];
      finalName = this.temp2 + ' र ' + temp1;
    }
    return finalName ? finalName : '';
  }
  checkPrimaryConditions() {
    /* this.tempLandBuilding = this.securityDetails.primarySecurity.filter(val =>
         val.securityType === 'LAND' || val.securityType === 'LAND_AND_BUILDING');*/
    if (this.securityDetails.primarySecurity.length > 0) {
      this.securityDetails.primarySecurity.forEach((i) => {
        if (
          i.securityType === 'LAND' ||
          i.securityType === 'LAND_AND_BUILDING'
        ) {
          this.securityTypeCondition = true;
        }
        if (i.securityType === 'LAND_AND_BUILDING') {
          this.securityTypeConditionLandAndBuilding = true;
        }
      });
    }
    if (
      this.securityDetails.primarySecurity.some(
        (s) => s.securityType === 'HYPOTHECATION'
      )
    ) {
      this.securityTypeConditionFixedAssests = true;
      this.securityTypeConditionAssestsPlants = true;
      this.securityTypeConditionStock = true;
      this.securityTypeConditionLiveStocks = true;
      this.securityDetails.primarySecurity.forEach((val, i) => {
        if (!ObjectUtil.isEmpty(this.securityDetails.primarySecurity[i].requiredHypothecationInsurance)) {
          if (this.securityDetails.primarySecurity[i].requiredHypothecationInsurance.length > 0) {
            this.securityDetails.primarySecurity[i].requiredHypothecationInsurance.forEach(value => {
              if (value === 'INSURANCE_OF_STOCK') {
                this.inStock = true;
              }
              if (value === 'INSURANCE_OF_FIXED_ASSESTS') {
                this.fixedAssests = true;
              }
              if (value === 'INSURANCE_OF_LIVE_STOCKS') {
                this.liveStock = true;
              }
            });
          }
        }
      });
    }
    if (
      this.securityDetails.primarySecurity.some(
        (s) => s.securityType === 'STOCK'
      )
    ) {
      this.securityTypeConditionStock = true;
    }
    if (
      this.securityDetails.primarySecurity.some(
        (s) => s.securityType === 'ASSETS_PLANTS_MACHINERY_AND_OTHER_EQUIPMENTS'
      )
    ) {
      this.securityTypeConditionAssestsPlants = true;
    }
    if (
      this.securityDetails.primarySecurity.some(
        (s) => s.securityType === 'LIVE_STOCKS_ANIMALS'
      )
    ) {
      this.securityTypeConditionLiveStocks = true;
    }
    if (
      this.securityDetails.primarySecurity.some(
        (s) => s.securityType === 'ASSIGNMENT'
      )
    ) {
      this.securityTypeConditionDocuments = true;
    }
  }

  checkSecondaryConditions() {
    this.tempSecondaryLandBuilding =
      this.securityDetails.secondarySecurity.filter(
        (val) =>
          val.securityType === 'LAND' ||
          val.securityType === 'LAND_AND_BUILDING'
      );
    if (this.securityDetails.secondarySecurity.length > 0) {
      this.securityDetails.secondarySecurity.forEach((i) => {
        if (
          i.securityType === 'LAND' ||
          i.securityType === 'LAND_AND_BUILDING'
        ) {
          this.securityTypeSecondaryCondition = true;
        }
        if (i.securityType === 'LAND_AND_BUILDING') {
          this.securityTypeConditionLandAndBuildingSecondary = true;
        }
      });
    }
    if (
        this.securityDetails.secondarySecurity.some(
            (s) => s.securityType === 'HYPOTHECATION'
        )
    ) {
      this.securityTypeConditionFixedAssestsSecondary = true;
      this.securityDetails.secondarySecurity.forEach((val, i) => {
        if (!ObjectUtil.isEmpty(this.securityDetails.secondarySecurity[i].requiredHypothecationInsurance)) {
          if (this.securityDetails.secondarySecurity[i].requiredHypothecationInsurance.length > 0) {
            this.securityDetails.secondarySecurity[i].requiredHypothecationInsurance.forEach(value => {
              if (value === 'INSURANCE_OF_STOCK') {
                this.inStock = true;
              }
              if (value === 'INSURANCE_OF_FIXED_ASSESTS') {
                this.fixedAssests = true;
              }
              if (value === 'INSURANCE_OF_LIVE_STOCKS') {
                this.liveStock = true;
              }
            });
          }
        }
      });
    }
    if (
      this.securityDetails.secondarySecurity.some(
        (s) => s.securityType === 'STOCK'
      )
    ) {
      this.securityTypeSecondaryConditionStock = true;
    }
    if (
      this.securityDetails.secondarySecurity.some(
        (s) => s.securityType === 'ASSETS_PLANTS_MACHINERY_AND_OTHER_EQUIPMENTS'
      )
    ) {
      this.securityTypeSecondaryConditionAssestsPlants = true;
    }
    if (
      this.securityDetails.secondarySecurity.some(
        (s) => s.securityType === 'LIVE_STOCKS_ANIMALS'
      )
    ) {
      this.securityTypeConditionLiveStocks = true;
    }
    if (
      this.securityDetails.secondarySecurity.some(
        (s) => s.securityType === 'ASSIGNMENT'
      )
    ) {
      this.securityTypeConditionDocumentsSecondary = true;
    }
    if (
        this.securityDetails.secondarySecurity.some(
            (s) => s.securityTypeCT === 'PERSONAL GUARANTEE'
        )
    ) {
      this.securityTypeConditionPg = true;
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
