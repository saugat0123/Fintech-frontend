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
  selector: 'app-interest-subsidy-sanction-letter-print',
  templateUrl: './interest-subsidy-sanction-letter-print.component.html',
  styleUrls: ['./interest-subsidy-sanction-letter-print.component.scss']
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
          this.loanHolderInfo.permanentWard.ct + ', ' + this.loanHolderInfo.registeredDistrict.ct + ' ,' +
          this.loanHolderInfo.registeredProvince.ct;
      this.branchName = this.loanHolderInfo.branch ? this.loanHolderInfo.branch.ct : '';
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
    const dateOfApplication = this.letter.dateofApplicationType ? this.letter.dateofApplicationType.en : '';
    if (dateOfApplication === 'AD') {
      const templateDateApplication = this.letter.dateofApplication ? this.letter.dateofApplication.en : '';
      this.finalDateOfApplication = this.engToNepaliDate.transform(this.datePipe.transform(templateDateApplication), true);
    } else {
      const templateDateApplication = this.letter.dateofApplicationNepali ? this.letter.dateofApplicationNepali.en : '';
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
    this.guarantorDetails();
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
}
