import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';
import {NabilOfferLetterConst} from '../../../../../nabil-offer-letter-const';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {NepaliCurrencyWordPipe} from '../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../@core/pipe/currency-formatter.pipe';
import {EngNepDatePipe} from 'nepali-patro';
import {DatePipe} from '@angular/common';

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
  guarantorAmount: number = 0;
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
    // For Previous Sanction Date
    const previousSanctionType = this.letter.previousSanctionType ? this.letter.previousSanctionType.en : '';
    if (previousSanctionType === 'AD') {
      const templateReviewDate = this.letter.previousSanctionDate ? this.letter.previousSanctionDate.en : '';
      this.finalPrevSanctionLetterDate = this.engToNepaliDate.transform(this.datePipe.transform(templateReviewDate), true);
    } else {
      const templatePrevSanctionLetterDate = this.letter.previousSanctionDateNepali ? this.letter.previousSanctionDateNepali.en : '';
      this.finalPrevSanctionLetterDate = templatePrevSanctionLetterDate ? templatePrevSanctionLetterDate.nDate : '';
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
}
