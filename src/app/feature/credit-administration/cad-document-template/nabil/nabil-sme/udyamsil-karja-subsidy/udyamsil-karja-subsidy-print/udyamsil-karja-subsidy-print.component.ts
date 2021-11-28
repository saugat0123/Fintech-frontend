import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';
import {FormGroup} from '@angular/forms';
import {NabilOfferLetterConst} from '../../../../../nabil-offer-letter-const';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-udyamsil-karja-subsidy-print',
  templateUrl: './udyamsil-karja-subsidy-print.component.html',
  styleUrls: ['./udyamsil-karja-subsidy-print.component.scss']
})
export class UdyamsilKarjaSubsidyPrintComponent implements OnInit {
  @Input() offerData;
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() letter;
  loanHolderInfo;
  tempData;
  offerLetterConst = NabilOfferLetterConst;
  autoRefNumber;
  customerAddress;
  loanName;
  proposedAmount;
  guarantorName;
  branchName;
  freeInformation;
  loanOption;
  interestSubsidy;
  repaymentType;

  constructor() { }

  ngOnInit() {
    console.log('This is letter data:', this.letter);
    this.freeInformation = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation);
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
      this.loanOption = this.tempData.loanOption.ct;
      this.interestSubsidy = this.tempData.interestSubsidy.ct;
      this.repaymentType = this.tempData.repaymentType.ct;
      let totalLoanAmount = 0;
      this.cadOfferLetterApprovedDoc.assignedLoan.forEach(value => {
        const val = value.proposal.proposedLimit;
        totalLoanAmount = totalLoanAmount + val;
      });
      this.proposedAmount = totalLoanAmount;
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      this.customerAddress = this.loanHolderInfo.permanentMunicipality.ct + '-' +
          this.loanHolderInfo.permanentWard.ct + ', ' + this.loanHolderInfo.permanentDistrict.ct +
          ' ,' + this.loanHolderInfo.permanentProvince.ct;
      this.branchName = this.loanHolderInfo.branch.ct;
      if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.assignedLoan)) {
        this.autoRefNumber = this.cadOfferLetterApprovedDoc.assignedLoan[0].refNo;
      }
    }
  }

}
