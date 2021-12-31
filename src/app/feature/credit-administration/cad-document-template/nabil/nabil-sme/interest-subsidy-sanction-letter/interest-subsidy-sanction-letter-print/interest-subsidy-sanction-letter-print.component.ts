import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';
import {NabilOfferLetterConst} from '../../../../../nabil-offer-letter-const';
import {NepaliCurrencyWordPipe} from '../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../@core/pipe/currency-formatter.pipe';
import {EngNepDatePipe} from 'nepali-patro';
import {DatePipe} from '@angular/common';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {CustomerSubType} from '../../../../../../customer/model/customerSubType';

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
  guarantorAmount: number = 0;
  guarantorAmountNepali;
  finalName;
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
  plotNumber;
  customerSubType = CustomerSubType;

  constructor(public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              public engToNepNumberPipe: EngToNepaliNumberPipe,
              public currencyFormatPipe: CurrencyFormatterPipe,
              private engToNepaliDate: EngNepDatePipe,
              private datePipe: DatePipe) { }

  ngOnInit() {
    this.freeInformation = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation);
    this.selectedSecurity = this.security;
    // this.renewalVal = this.letter.renewalChecked.en;
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      let totalLoanAmount = 0;
      this.cadOfferLetterApprovedDoc.assignedLoan.forEach(value => {
        const val = value.proposal.proposedLimit;
        totalLoanAmount = totalLoanAmount + val;
      });
      this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
      this.proposedAmount = totalLoanAmount;
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      this.customerAddress =  this.loanHolderInfo.registeredMunicipality.ct + '-' +
          this.loanHolderInfo.permanentWard.ct + ', ' + this.loanHolderInfo.registeredDistrict.ct + ', ' +
          this.loanHolderInfo.registeredProvince.ct;
      this.branchName = this.loanHolderInfo.branch ? this.loanHolderInfo.branch.ct : '';
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
      this.securityDetails = this.tempData.securities;
    }
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.offerDocumentList)) {
      this.offerDocumentDetails = this.cadOfferLetterApprovedDoc.offerDocumentList[0] ? JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation) : '';
    }
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.assignedLoan)) {
      this.autoRefNumber = this.cadOfferLetterApprovedDoc.assignedLoan[0].refNo;
    }
    // For date of Approval
    const dateOfApprovalType = this.letter.dateOfApprovalType ? this.letter.dateOfApprovalType.en : '';
    if (dateOfApprovalType === 'AD') {
      const templateDateApproval = this.letter.dateOfApproval ? this.letter.dateOfApproval.en : '';
      this.finalDateOfApproval = this.engToNepaliDate.transform(this.datePipe.transform(templateDateApproval), true);
    } else {
      const templateDateApproval = this.letter.dateOfApprovalNepali ? this.letter.dateOfApprovalNepali.en : '';
      this.finalDateOfApproval = templateDateApproval ? templateDateApproval.nDate : '';
    }
    // For Date of Application:
    const dateOfApplication = this.letter.dateOfApplicationType ? this.letter.dateOfApplicationType.en : '';
    if (dateOfApplication === 'AD') {
      const templateDateApplication = this.letter.dateOfApplication ? this.letter.dateOfApplication.en : '';
      this.finalDateOfApplication = this.engToNepaliDate.transform(this.datePipe.transform(templateDateApplication), true);
    } else {
      const templateDateApplication = this.letter.dateOfApplicationNepali ? this.letter.dateOfApplicationNepali.en : '';
      this.finalDateOfApplication = templateDateApplication ? templateDateApplication.nDate : '';
    }
    // For Sanction Letter Date:
    const sanctionLetterDate = this.letter.previousSanctionType ? this.letter.previousSanctionType.en : '';
    if (sanctionLetterDate === 'AD') {
      const templateSanctionDate = this.letter.previousSanctionDate ? this.letter.previousSanctionDate.en : '';
      this.finalDateofSanction = this.engToNepaliDate.transform(this.datePipe.transform(templateSanctionDate), true);
    } else {
      const templateSanctionDate = this.letter.previousSanctionDateNepali ? this.letter.previousSanctionDateNepali.en : '';
      this.finalDateofSanction = templateSanctionDate ? templateSanctionDate.nDate : '';
    }
    this.guarantorData.forEach(any => {
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
    this.tempPersonalGuarantors = this.guarantorParsed.filter(val =>
        val.guarantorType.en === 'Personal Guarantor');
    this.tempPersonalGuarantors.forEach(i => {
      this.personalGuarantorsName.push(i.guarantorName ? i.guarantorName.ct : '');
    });
  }

  commonGuarantorDetails(guarantorName, finalName) {
    if(guarantorName.length === 1) {
      finalName = guarantorName[0];
    }
    if(guarantorName.length === 2) {
      finalName = guarantorName.join(' र ');
    }
    if(guarantorName.length > 2){
      for (let i = 0; i < guarantorName.length - 1; i++) {
        this.temp2 = guarantorName.join(' , ');
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
      this.securityDetails.primarySecurity.forEach(i => {
        if (i.securityType === 'LAND' || i.securityType === 'LAND_AND_BUILDING') {
          this.securityTypeCondition = true;
        }
        if (i.securityType === 'LAND_AND_BUILDING') {
          this.securityTypeConditionLandAndBuilding = true;
        }
      });
    }
    if (this.securityDetails.primarySecurity.some(s => s.securityType === 'FIXED_ASSETS')) {
      this.securityTypeConditionFixedAssests = true;
    }
    if (this.securityDetails.primarySecurity.some(s => s.securityType === 'STOCK')) {
      this.securityTypeConditionStock = true;
    }
    if (this.securityDetails.primarySecurity.some(s => s.securityType === 'ASSETS_PLANTS_MACHINERY_AND_OTHER_EQUIPMENTS')) {
      this.securityTypeConditionAssestsPlants = true;
    }
    if (this.securityDetails.primarySecurity.some(s => s.securityType === 'LIVE_STOCKS_ANIMALS')) {
      this.securityTypeConditionLiveStocks = true;
    }
    if (this.securityDetails.secondarySecurity.some(s => s.securityType === 'DOCUMENTS')) {
      this.securityTypeConditionDocuments = true;
    }
  }

  checkSecondaryConditions() {
    this.tempSecondaryLandBuilding = this.securityDetails.secondarySecurity.filter(val =>
        val.securityType === 'LAND' || val.securityType === 'LAND_AND_BUILDING');
    if (this.securityDetails.secondarySecurity.length > 0) {
      this.securityDetails.secondarySecurity.forEach(i => {
        if (i.securityType === 'LAND' || i.securityType === 'LAND_AND_BUILDING') {
          this.securityTypeSecondaryCondition = true;
        }
        if (i.securityType === 'LAND_AND_BUILDING') {
          this.securityTypeConditionLandAndBuildingSecondary = true;
        }
      });
    }
    if (this.securityDetails.secondarySecurity.some(s => s.securityType === 'FIXED_ASSETS')) {
      this.securityTypeSecondaryConditionFixedAssests = true;
    }
    if (this.securityDetails.secondarySecurity.some(s => s.securityType === 'STOCK')) {
      this.securityTypeSecondaryConditionStock = true;
    }
    if (this.securityDetails.secondarySecurity.some(s => s.securityType === 'ASSETS_PLANTS_MACHINERY_AND_OTHER_EQUIPMENTS')) {
      this.securityTypeSecondaryConditionAssestsPlants = true;
    }
    if (this.securityDetails.secondarySecurity.some(s => s.securityType === 'LIVE_STOCKS_ANIMALS')) {
      this.securityTypeConditionLiveStocks = true;
    }
    if (this.securityDetails.secondarySecurity.some(s => s.securityType === 'DOCUMENTS')) {
      this.securityTypeConditionDocuments = true;
    }
  }
}
