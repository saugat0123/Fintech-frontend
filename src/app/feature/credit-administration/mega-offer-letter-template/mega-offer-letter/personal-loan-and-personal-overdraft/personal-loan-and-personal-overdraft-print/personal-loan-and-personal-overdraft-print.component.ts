import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {MegaOfferLetterConst} from '../../../../mega-offer-letter-const';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {NabilOfferLetterConst} from "../../../../nabil-offer-letter-const";
import {NepaliCurrencyWordPipe} from "../../../../../../@core/pipe/nepali-currency-word.pipe";
import {EngToNepaliNumberPipe} from "../../../../../../@core/pipe/eng-to-nepali-number.pipe";
import {CurrencyFormatterPipe} from "../../../../../../@core/pipe/currency-formatter.pipe";

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
  guarantorData;
  constructor(public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              public engToNepNumberPipe: EngToNepaliNumberPipe,
              public currencyFormatPipe: CurrencyFormatterPipe) {
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
      this.customerAddress =  this.loanHolderInfo.permanentMunicipality.ct + '-' +
          this.loanHolderInfo.permanentWard.ct + ', ' + this.loanHolderInfo.permanentDistrict.ct +
          ' ,' + this.loanHolderInfo.permanentProvince.ct;
      if (!ObjectUtil.isEmpty(this.guarantorData)) {
        this.guarantorName = this.guarantorParse(this.guarantorData[0].nepData, 'guarantorName');
      }
      this.branchName = this.loanHolderInfo.branch.ct;
      console.log('Letter Information',this.letter);
      console.log('Initial Information',this.loanHolderInfo);
    }
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
