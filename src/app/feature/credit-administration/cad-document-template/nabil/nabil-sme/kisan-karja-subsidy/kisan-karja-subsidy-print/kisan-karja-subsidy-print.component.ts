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
  @Input() letterData;
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
  guarantorAmount: number = 0;
  guarantorData;
  finalDateOfApproval;
  finalDateOfApplication;
  finalNextReviewDate;
  finalPrevSanctionLetterDate;

  constructor( public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
               public engToNepNumberPipe: EngToNepaliNumberPipe,
               public currencyFormatPipe: CurrencyFormatterPipe,
               private engToNepaliDate: EngNepDatePipe,
               private datePipe: DatePipe) { }

  ngOnInit() {
    console.log('This is letter data:', this.letter);
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
      this.customerAddress = this.loanHolderInfo.permanentMunicipality.ct + '-' +
          this.loanHolderInfo.permanentWard.ct + ', ' + this.loanHolderInfo.permanentDistrict.ct +
          ' ,' + this.loanHolderInfo.permanentProvince.ct;
      this.branchName = this.loanHolderInfo.branch.ct;
      if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.assignedLoan)) {
        this.autoRefNumber = this.cadOfferLetterApprovedDoc.assignedLoan[0].refNo;
      }
      this.branchName = this.loanHolderInfo.branch.ct;
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
    // For Next Review Date:
    const nextReviewDate = this.letter.nextReviewDateType ? this.letter.nextReviewDateType.en : '';
    if (nextReviewDate === 'AD') {
      const templateReviewDate = this.letter.nextReviewDate ? this.letter.nextReviewDate.en : '';
      this.finalNextReviewDate = this.engToNepaliDate.transform(this.datePipe.transform(templateReviewDate), true);
    } else {
      const templateReviewDate = this.letter.nextReviewDateNepali ? this.letter.nextReviewDateNepali.en : '';
      this.finalNextReviewDate = templateReviewDate ? templateReviewDate.nDate : '';
    }
    // For Previous Sanction Letter Date:
    const prevSanctionLetterDate = this.letter.previousSanctionType ? this.letter.previousSanctionType.en : '';
    if (prevSanctionLetterDate === 'AD') {
      const templateReviewDate = this.letter.prevSanctionLetterDate ? this.letter.prevSanctionLetterDate.en : '';
      this.finalPrevSanctionLetterDate = this.engToNepaliDate.transform(this.datePipe.transform(templateReviewDate), true);
    } else {
      const templatePrevSanctionLetterDate = this.letter.previousSanctionDateNepali ? this.letter.previousSanctionDateNepali.en : '';
      this.finalPrevSanctionLetterDate = templatePrevSanctionLetterDate ? templatePrevSanctionLetterDate.nDate : '';
    }
    this.guarantorDetails();
  }
  guarantorDetails() {
    if (this.guarantorData.length === 1) {
      const temp = JSON.parse(this.guarantorData[0].nepData);
      this.finalName =  temp.guarantorName.ct;
    } else if (this.guarantorData.length === 2) {
      for (let i = 0; i < this.guarantorData.length; i++) {
        const temp = JSON.parse(this.guarantorData[i].nepData);
        this.guarantorNames.push(temp.guarantorName.ct);
        // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
      }
      // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
      this.allguarantorNames = this.guarantorNames.join(' र ');
      this.finalName = this.allguarantorNames;
    } else {
      for (let i = 0; i < this.guarantorData.length - 1 ; i++) {
        const temp = JSON.parse(this.guarantorData[i].nepData);
        this.guarantorNames.push(temp.guarantorName.ct);
        // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
      }
      // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
      this.allguarantorNames = this.guarantorNames.join(' , ');
      const temp1 = JSON.parse(this.guarantorData[this.guarantorData.length - 1].nepData);
      this.finalName =  this.allguarantorNames + ' र ' + temp1.guarantorName.ct;
    }
  }

}
