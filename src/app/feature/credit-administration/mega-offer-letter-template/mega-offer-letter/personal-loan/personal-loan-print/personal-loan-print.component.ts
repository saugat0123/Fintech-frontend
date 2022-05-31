import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {MegaOfferLetterConst} from '../../../../mega-offer-letter-const';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';

@Component({
  selector: 'app-personal-loan-print',
  templateUrl: './personal-loan-print.component.html',
  styleUrls: ['./personal-loan-print.component.scss']
})
export class PersonalLoanPrintComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() letter: any;
  @Input() offerData;
  @Input() loanLimit;
  @Input() preview = false;
  loanHolderInfo;
  offerLetterConst = MegaOfferLetterConst;
  customerAddress;
  proposedAmount;
  guarantorName;
  branchName;
  autoRefNumber;
  guarantorData;
  guarantorNames: Array<String> = [];
  allguarantorNames;
  guarantorAmount;
  guarantorAmountNepali;
  finalName;
  approvalDate;
  applicationDate;

  constructor(public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              public engToNepNumberPipe: EngToNepaliNumberPipe,
              public currencyFormatPipe: CurrencyFormatterPipe,
              private datePipe: DatePipe,
              private engNepDatePipe: EngNepDatePipe) {
  }

  ngOnInit() {
    console.log('Letter Information', this.letter);
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      let totalLoanAmount = 0;
      this.cadOfferLetterApprovedDoc.assignedLoan.forEach(value => {
        const val = value.proposal.proposedLimit;
        totalLoanAmount = totalLoanAmount + val;
      });
      this.proposedAmount = totalLoanAmount;
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      if (!ObjectUtil.isEmpty(this.loanHolderInfo)) {
        this.customerAddress =  ((!ObjectUtil.isEmpty(this.loanHolderInfo.permanentMunicipality) &&
                !ObjectUtil.isEmpty(this.loanHolderInfo.permanentMunicipality.ct)) ?
                this.loanHolderInfo.permanentMunicipality.ct : '') +
            ((!ObjectUtil.isEmpty(this.loanHolderInfo.permanentWard) &&
                !ObjectUtil.isEmpty(this.loanHolderInfo.permanentWard.ct)) ?
                '-' + this.loanHolderInfo.permanentWard.ct : '') +
            ((!ObjectUtil.isEmpty(this.loanHolderInfo.permanentDistrict) &&
                !ObjectUtil.isEmpty(this.loanHolderInfo.permanentDistrict.ct)) ?
                ', ' + this.loanHolderInfo.permanentDistrict.ct : '') +
            ((!ObjectUtil.isEmpty(this.loanHolderInfo.permanentProvince) &&
                !ObjectUtil.isEmpty(this.loanHolderInfo.permanentProvince.ct)) ?
                ' ,' + this.loanHolderInfo.permanentProvince.ct + ' प्रदेश ' : '');
      }
    }
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.assignedLoan)) {
      this.autoRefNumber = this.cadOfferLetterApprovedDoc.assignedLoan[0].refNo;
    }
    this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
    this.guarantorDetails();
    const guarantorNep = JSON.parse(this.guarantorData[0].nepData);
    if (!ObjectUtil.isEmpty(guarantorNep.gurantedAmount)) {
      this.guarantorAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(guarantorNep.gurantedAmount.en));
    }
    const approvalType = this.letter.dateOfApprovalType ? this.letter.dateOfApprovalType.en : '';
    if (approvalType === 'AD') {
      const finalApprDate = this.letter.dateOfApproval ? this.datePipe.transform(this.letter.dateOfApproval.en) : '';
      this.approvalDate = this.engNepDatePipe.transform(finalApprDate, true);
    } else {
      this.approvalDate = this.letter.dateOfApprovalNepali ? this.letter.dateOfApprovalNepali.en.nDate : '';
    }
    const applicationType = this.letter.dateofApplicationType ? this.letter.dateofApplicationType.en : '';
    if (applicationType === 'AD') {
      const finalAppDate = this.letter.dateofApplication ? this.datePipe.transform(this.letter.dateofApplication.en) : '';
      this.applicationDate = this.engNepDatePipe.transform(finalAppDate, true);
    } else {
      this.applicationDate = this.letter.dateofApplicationNepali ? this.letter.dateofApplicationNepali.en.nDate : '';
    }
  }

  guarantorDetails() {
    if (this.guarantorData.length === 1) {
      const temp = JSON.parse(this.guarantorData[0].nepData);
      this.finalName =  temp.guarantorName.ct;
    } else if (this.guarantorData.length === 2) {
      for (let i = 0; i < this.guarantorData.length; i++) {
        const temp = JSON.parse(this.guarantorData[i].nepData);
        this.guarantorNames.push(temp.guarantorName.ct);
      }
      this.allguarantorNames = this.guarantorNames.join(' र ');
      this.finalName = this.allguarantorNames;
    } else {
      for (let i = 0; i < this.guarantorData.length - 1; i++) {
        const temp = JSON.parse(this.guarantorData[i].nepData);
        this.guarantorNames.push(temp.guarantorName.ct);
      }
      this.allguarantorNames = this.guarantorNames.join(' , ');
      const temp1 = JSON.parse(this.guarantorData[this.guarantorData.length - 1].nepData);
      this.finalName =  this.allguarantorNames + ' र ' + temp1.guarantorName.ct;
    }
  }
}
