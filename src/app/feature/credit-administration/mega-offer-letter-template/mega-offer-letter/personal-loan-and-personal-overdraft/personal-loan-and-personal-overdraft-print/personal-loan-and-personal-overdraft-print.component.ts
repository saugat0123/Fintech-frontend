import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {MegaOfferLetterConst} from '../../../../mega-offer-letter-const';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {NabilOfferLetterConst} from "../../../../nabil-offer-letter-const";
import {NepaliCurrencyWordPipe} from "../../../../../../@core/pipe/nepali-currency-word.pipe";
import {EngToNepaliNumberPipe} from "../../../../../../@core/pipe/eng-to-nepali-number.pipe";
import {CurrencyFormatterPipe} from "../../../../../../@core/pipe/currency-formatter.pipe";
import {DatePipe} from "@angular/common";
import {EngNepDatePipe} from "nepali-patro";

@Component({
  selector: 'app-personal-loan-and-personal-overdraft-print',
  templateUrl: './personal-loan-and-personal-overdraft-print.component.html',
  styleUrls: ['./personal-loan-and-personal-overdraft-print.component.scss']
})
export class PersonalLoanAndPersonalOverdraftPrintComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() letter: any;
  @Input() offerData;
  loanHolderInfo;
  offerLetterConst = NabilOfferLetterConst;
  customerAddress;
  proposedAmount;
  guarantorName;
  branchName;
  autoRefNumber;
  guarantorData;
  guarantorNames: Array<String> = [];
  allguarantorNames;
  approvalDate;
  guarantorAmount: number = 0;
  finalName;
  applicationDate;
  expiryDate;
  @Input() preview = false;
  constructor(public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              public engToNepNumberPipe: EngToNepaliNumberPipe,
              public currencyFormatPipe: CurrencyFormatterPipe,
              private datePipe: DatePipe,
              private engNepDatePipe: EngNepDatePipe) {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      let totalLoanAmount = 0;
      this.cadOfferLetterApprovedDoc.assignedLoan.forEach(value => {
        const val = value.proposal.proposedLimit;
        totalLoanAmount = totalLoanAmount + val;
      });
      this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
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
      if (!ObjectUtil.isEmpty(this.guarantorData)) {
        this.guarantorName = this.guarantorParse(this.guarantorData[0].nepData, 'guarantorName');
      }
      this.branchName = this.loanHolderInfo.branch.ct;
      this.guarantorDetails();
      if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.assignedLoan)) {
        this.autoRefNumber = this.cadOfferLetterApprovedDoc.assignedLoan[0].refNo;
      }
      const approvalType = this.letter.dateofApprovalType ? this.letter.dateofApprovalType.en : '';
      if (approvalType === 'AD') {
        const finalApprDate = this.letter.dateofApproval ? this.datePipe.transform(this.letter.dateofApproval.en) : '';
        this.approvalDate = this.engNepDatePipe.transform(finalApprDate, true);
      } else {
        this.approvalDate = this.letter.dateofApprovalNepali ? this.letter.dateofApprovalNepali.en.nDate : '';
      }
      const applicationType = this.letter.dateofApplicationType ? this.letter.dateofApplicationType.en : '';
      if (applicationType === 'AD') {
        const finalAppDate = this.letter.dateofApplication ? this.datePipe.transform(this.letter.dateofApplication.en) : '';
        this.applicationDate = this.engNepDatePipe.transform(finalAppDate, true);
      } else {
        this.applicationDate = this.letter.dateofApplicationNepali ? this.letter.dateofApplicationNepali.en.nDate : '';
      }
      const expiryType = this.letter.loanExpiryDateType ? this.letter.loanExpiryDateType.en : '';
      if (expiryType === 'AD') {
        const finalExpDate = this.letter.loanExpiryDate ? this.datePipe.transform(this.letter.loanExpiryDate.en) : '';
        this.expiryDate = this.engNepDatePipe.transform(finalExpDate, true);
      } else {
        this.expiryDate = this.letter.loanExpiryDateNepali ? this.letter.loanExpiryDateNepali.en.nDate : '';
      }
    }
  }

  guarantorDetails(){
    if (this.guarantorData.length == 1){
      let temp = JSON.parse(this.guarantorData[0].nepData);
      this.finalName =  temp.guarantorName.ct;
    }
    else if(this.guarantorData.length == 2){
      for (let i = 0; i < this.guarantorData.length; i++){
        let temp = JSON.parse(this.guarantorData[i].nepData);
        this.guarantorNames.push(temp.guarantorName.ct);
        // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
      }
      // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
      this.allguarantorNames = this.guarantorNames.join(" र ");
      this.finalName = this.allguarantorNames;
    }
    else{
      for (let i = 0; i < this.guarantorData.length-1; i++){
        let temp = JSON.parse(this.guarantorData[i].nepData);
        this.guarantorNames.push(temp.guarantorName.ct);
        // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
      }
      // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
      this.allguarantorNames = this.guarantorNames.join(" , ");
      let temp1 = JSON.parse(this.guarantorData[this.guarantorData.length-1].nepData);
      this.finalName =  this.allguarantorNames + " र " + temp1.guarantorName.ct;
    }
    console.log('Guarantor Name:', this.finalName);
  }

  guarantorParse(nepData, key, trans?) {
    const data = JSON.parse(nepData);
    if (ObjectUtil.isEmpty(trans)) {
      return data[key].ct;
    } else {
      return data[key].en;
    }
  }
}
