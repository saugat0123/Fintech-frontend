import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';
import {NabilOfferLetterConst} from '../../../../../nabil-offer-letter-const';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {NepaliCurrencyWordPipe} from '../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../@core/pipe/currency-formatter.pipe';
import {EngNepDatePipe} from 'nepali-patro';
import {DatePipe} from '@angular/common';
import {CustomerType} from '../../../../../../customer/model/customerType';

@Component({
  selector: 'app-udyamsil-karja-subsidy-print',
  templateUrl: './udyamsil-karja-subsidy-print.component.html',
  styleUrls: ['./udyamsil-karja-subsidy-print.component.scss']
})
export class UdyamsilKarjaSubsidyPrintComponent implements OnInit {
  @Input() offerData;
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() letter;
  @Input() loanOption;
  loanHolderInfo;
  guarantorData;
  tempData;
  offerLetterConst = NabilOfferLetterConst;
  autoRefNumber;
  customerAddress;
  freeInformation;
  customerName;
  loanName;
  proposedAmount;
  allguarantorNames;
  guarantorNames: Array<String> = [];
  guarantorAmount = 0;
  guarantorName;
  finalName;
  branchName;
  interestSubsidy;
  repaymentType;
  dateOfApproval;
  dateOfApplication;
  offerDocumentDetails;
  finalDateOfApproval;
  finalPrevSanctionLetterDate;
  finalDateOfApplication;
  customerType;
  client = CustomerType;
  guarantorParsed: Array < any > = new Array < any > ();
  tempPersonalGuarantors;

  constructor(
      public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      public engToNepNumberPipe: EngToNepaliNumberPipe,
      public currencyFormatPipe: CurrencyFormatterPipe,
      private engToNepaliDate: EngNepDatePipe,
      private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.freeInformation = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation);
    this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
    if (!ObjectUtil.isEmpty(this.guarantorData)) {
      this.guarantorData.forEach(any => {
        this.guarantorParsed.push(JSON.parse(any.nepData));
      });
    }
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      let totalLoanAmount = 0;
      this.cadOfferLetterApprovedDoc.assignedLoan.forEach(value => {
        const val = value.proposal.proposedLimit;
        totalLoanAmount = totalLoanAmount + val;
      });
      this.proposedAmount = totalLoanAmount;
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      if (!ObjectUtil.isEmpty(this.loanHolderInfo)) {
        this.customerType = this.loanHolderInfo.clientType.en;
      }
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
      this.customerAddress = this.loanHolderInfo.registeredMunicipality.ct + '-' +
          this.loanHolderInfo.permanentWard.ct + ', ' + this.loanHolderInfo.registeredDistrict.ct + ' ,' +
          this.loanHolderInfo.registeredProvince.ct;
      this.branchName = this.loanHolderInfo.branch.ct;
    }
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.offerDocumentList)) {
      // tslint:disable-next-line:max-line-length
      this.offerDocumentDetails = this.cadOfferLetterApprovedDoc.offerDocumentList[0] ? JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation) : '';
    }
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.assignedLoan)) {
      this.autoRefNumber = this.cadOfferLetterApprovedDoc.assignedLoan[0].refNo;
      this.loanName = this.cadOfferLetterApprovedDoc.assignedLoan[0].loan ? this.cadOfferLetterApprovedDoc.assignedLoan[0].loan.nepaliName : '';
    }
    this.loanOption = this.tempData.loanOption.ct;
    this.interestSubsidy = this.tempData.interestSubsidy.ct;
    this.repaymentType = this.tempData.repaymentType.ct;
    // For date of Approval
    const dateOfApprovalType = this.letter.dateOfApprovalType ? this.letter.dateOfApprovalType.en : '';
    if (dateOfApprovalType === 'AD') {
      this.finalDateOfApproval = this.tempData.dateOfApproval ? this.tempData.dateOfApproval.ct : '';
    } else {
      const templateDateApproval = this.letter.dateOfApprovalNepali ? this.letter.dateOfApprovalNepali.en : '';
      this.finalDateOfApproval = templateDateApproval ? templateDateApproval.nDate : '';
    }
    // For Date of Application:
    const dateOfApplication = this.letter.dateOfApplicationType ? this.letter.dateOfApplicationType.en : '';
    if (dateOfApplication === 'AD') {
      this.finalDateOfApplication = this.tempData.dateOfApplication ? this.tempData.dateOfApplication.ct : '';
    } else {
      const templateDateApplication = this.letter.dateOfApplicationNepali ? this.letter.dateOfApplicationNepali.en : '';
      this.finalDateOfApplication = templateDateApplication ? templateDateApplication.nDate : '';
    }
    // For Previous Sanction Date
    const previousSanctionType = this.letter.previousSanctionType ? this.letter.previousSanctionType.en : '';
    if (previousSanctionType === 'AD') {
      this.finalPrevSanctionLetterDate =  this.tempData.previousSanctionDate ? this.tempData.previousSanctionDate.ct : '';
    } else {
      const templatePrevSanctionLetterDate = this.letter.previousSanctionDateNepali ? this.letter.previousSanctionDateNepali.en : '';
      this.finalPrevSanctionLetterDate = templatePrevSanctionLetterDate ? templatePrevSanctionLetterDate.nDate : '';
    }
    this.guarantorDetails();
  }
  guarantorDetails() {
    if (this.customerType === this.client.INSTITUTION) {
      this.tempPersonalGuarantors = this.guarantorParsed.filter(val =>
          val.guarantorType.en === 'Personal Guarantor');
    }
    if (!ObjectUtil.isEmpty(this.tempPersonalGuarantors)) {
      if (this.tempPersonalGuarantors.length === 1) {
        this.finalName = this.tempPersonalGuarantors[0].guarantorName ? this.tempPersonalGuarantors[0].guarantorName.ct : '';
      } else if (this.tempPersonalGuarantors.length === 2) {
        for (let i = 0; i < this.tempPersonalGuarantors.length; i++) {
          this.guarantorNames.push(this.tempPersonalGuarantors[i].guarantorName.ct);
        }
        this.allguarantorNames = this.guarantorNames.join(' र ');
        this.finalName = this.allguarantorNames;
      } else {
        for (let i = 0; i < this.tempPersonalGuarantors.length - 1; i++) {
          this.guarantorNames.push(this.tempPersonalGuarantors[i].guarantorName.ct);
        }
        this.allguarantorNames = this.guarantorNames.join(' , ');
        const temp1 = this.tempPersonalGuarantors[this.tempPersonalGuarantors.length - 1];
        this.finalName = this.allguarantorNames + ' र ' + temp1.guarantorName.ct;
      }
    }
  }
}
