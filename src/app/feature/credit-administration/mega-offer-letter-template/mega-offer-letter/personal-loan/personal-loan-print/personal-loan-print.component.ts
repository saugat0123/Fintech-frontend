import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from "../../../../model/customerApprovedLoanCadDocumentation";
import {MegaOfferLetterConst} from "../../../../mega-offer-letter-const";
import {ObjectUtil} from "../../../../../../@core/utils/ObjectUtil";
import {NabilOfferLetterConst} from "../../../../nabil-offer-letter-const";
import {NepaliCurrencyWordPipe} from "../../../../../../@core/pipe/nepali-currency-word.pipe";
import {EngToNepaliNumberPipe} from "../../../../../../@core/pipe/eng-to-nepali-number.pipe";
import {CurrencyFormatterPipe} from "../../../../../../@core/pipe/currency-formatter.pipe";

@Component({
  selector: 'app-personal-loan-print',
  templateUrl: './personal-loan-print.component.html',
  styleUrls: ['./personal-loan-print.component.scss']
})
export class PersonalLoanPrintComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() letter: any;
  @Input() offerData;
  loanHolderInfo;
  offerLetterConst = MegaOfferLetterConst;
  customerAddress;
  proposedAmount;
  guarantorName;
  branchName;
  constructor( public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
               public engToNepNumberPipe: EngToNepaliNumberPipe,
               public currencyFormatPipe: CurrencyFormatterPipe) {
  }

  ngOnInit() {
    console.log('Letter Information',this.letter);
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      let totalLoanAmount = 0;
      this.cadOfferLetterApprovedDoc.assignedLoan.forEach(value => {
        const val = value.proposal.proposedLimit;
        totalLoanAmount = totalLoanAmount + val;
      });
      this.proposedAmount = totalLoanAmount;
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      this.customerAddress =  this.loanHolderInfo.permanentMunicipality.np + '-' + this.loanHolderInfo.permanentWard.np + ', ' + this.loanHolderInfo.permanentDistrict.np + ' ,' + this.loanHolderInfo.permanentProvince.np;
      this.branchName = this.cadOfferLetterApprovedDoc.loanHolder.branch.name;
    }
  }
}
