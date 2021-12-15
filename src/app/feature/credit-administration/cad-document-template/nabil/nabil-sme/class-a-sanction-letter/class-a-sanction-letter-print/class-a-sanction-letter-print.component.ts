import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';
import {NabilOfferLetterConst} from '../../../../../nabil-offer-letter-const';
import {NepaliCurrencyWordPipe} from '../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../@core/pipe/currency-formatter.pipe';
import {EngNepDatePipe} from 'nepali-patro';
import {DatePipe} from '@angular/common';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-class-a-sanction-letter-print',
  templateUrl: './class-a-sanction-letter-print.component.html',
  styleUrls: ['./class-a-sanction-letter-print.component.scss']
})
export class ClassASanctionLetterPrintComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() letter: any;
  @Input() security: any;
  @Input() renewal: any;
  @Input() offerData;
  @Input() loanLimit;
  @Input() preview = false;
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
  finalDateOfSanctionDate;
  finalDateOfSanction;
  finalDateOfExpiry;
  previousSanctionDate;
  autoRefNum;
  tempData;
  loanOptions;
  New;
  Existing;
  CoupenRateFinancing;
  BaseRateFinancing;
  isNatural;
  loanType;
  dateofExpiryPrint: any;
  constructor( public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
               public engToNepNumberPipe: EngToNepaliNumberPipe,
               public currencyFormatPipe: CurrencyFormatterPipe,
               private engToNepaliDate: EngNepDatePipe,
               private datePipe: DatePipe) {
  }

  ngOnInit() {
    // this.selectedSecurity = this.security;
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
          this.loanHolderInfo.permanentWard.ct + ', ' + this.loanHolderInfo.registeredDistrict.ct + ' ,' +
          this.loanHolderInfo.registeredProvince.ct;
      this.branchName = this.loanHolderInfo.branch ? this.loanHolderInfo.branch.ct : '';
      this.loanType = this.letter.loanType.ct;
    }
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.offerDocumentList)) {
      this.offerDocumentDetails = this.cadOfferLetterApprovedDoc.offerDocumentList[0] ? JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation) : '';
    }
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.assignedLoan)) {
      this.autoRefNumber = this.cadOfferLetterApprovedDoc.assignedLoan[0].refNo;
    }
    // for date of approval
    const sanctionLetterDate = this.letter.sanctionLetterDateType ? this.letter.sanctionLetterDateType.en : '';
    if (sanctionLetterDate === 'AD') {
      const templateDateSanctionDate = this.letter.sanctionLetterDate ? this.letter.sanctionLetterDate.en : '';
      this.finalDateOfSanctionDate = this.engToNepaliDate.transform(this.datePipe.transform(templateDateSanctionDate), true);
    } else {
      const templateDateSanctionDate = this.letter.sanctionLetterDateNepali ? this.letter.sanctionLetterDateNepali.en : '';
      this.finalDateOfSanctionDate = templateDateSanctionDate ? templateDateSanctionDate.nDate : '';
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
    // For Date of Expiry:
    const dateOfExpiry = this.letter.dateOfExpiryType ? this.letter.dateOfExpiryType.en : '';
    if (dateOfExpiry === 'AD') {
      const templateDateExpiry = this.letter.dateOfExpiry ? this.letter.dateOfExpiry.en : '';
      this.finalDateOfExpiry = this.engToNepaliDate.transform(this.datePipe.transform(templateDateExpiry), true);
    } else {
      const templateDateExpiry = this.letter.dateOfExpiryNepali ? this.letter.dateOfExpiryNepali.en : '';
      this.finalDateOfExpiry = templateDateExpiry ? templateDateExpiry.nDate : '';
    }
    // For Previous Sanction:
    const previousSanctionDate = this.letter.previousSanctionType ? this.letter.previousSanctionType.en : '';
    if (previousSanctionDate === 'AD') {
      const templateDateSanction = this.letter.previousSanctionDate ? this.letter.previousSanctionDate.en : '';
      this.finalDateOfSanction = this.engToNepaliDate.transform(this.datePipe.transform(templateDateSanction), true);
    } else {
      const templateDateSanction = this.letter.previousSanctionDateNepali ? this.letter.previousSanctionDateNepali.en : '';
      this.finalDateOfSanction = templateDateSanction ? templateDateSanction.nDate : '';
    }
    this.guarantorDetails();
  }
  guarantorDetails() {
    if (this.guarantorData.length === 1) {
      const temp = JSON.parse(this.guarantorData[0].nepData);
      this.finalName =  temp.authorizedPersonName.ct;
    } else if
    (this.guarantorData.length === 2) {
      for (let i = 0; i < this.guarantorData.length; i++) {
        const temp = JSON.parse(this.guarantorData[i].nepData);
        this.guarantorNames.push(temp.authorizedPersonName.ct);
        // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
      }
      // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
      this.allguarantorNames = this.guarantorNames.join(' र ');
      this.finalName = this.allguarantorNames;
    } else {
      for (let i = 0; i < this.guarantorData.length - 1; i++) {
        const temp = JSON.parse(this.guarantorData[i].nepData);
        this.guarantorNames.push(temp.authorizedPersonName.ct);
        // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
      }
      // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
      this.allguarantorNames = this.guarantorNames.join(' , ');
      const temp1 = JSON.parse(this.guarantorData[this.guarantorData.length - 1 ].nepData);
      this.finalName =  this.allguarantorNames + ' र ' + temp1.authorizedPersonName.ct;
    }
  }

}

