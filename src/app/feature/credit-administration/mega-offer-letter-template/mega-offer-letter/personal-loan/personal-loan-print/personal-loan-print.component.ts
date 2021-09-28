import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from "../../../../model/customerApprovedLoanCadDocumentation";
import {MegaOfferLetterConst} from "../../../../mega-offer-letter-const";
import {ObjectUtil} from "../../../../../../@core/utils/ObjectUtil";

@Component({
  selector: 'app-personal-loan-print',
  templateUrl: './personal-loan-print.component.html',
  styleUrls: ['./personal-loan-print.component.scss']
})
export class PersonalLoanPrintComponent implements OnInit {
  @Input() letter;
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  offerLetterConst = MegaOfferLetterConst;
  termLoanSelected = false;
  overdraftLoanSelected = false;
  demandLoanSelected = false;
  loanHolderInfo;
  loanTypeArray = ['LAI Term Loan', 'LAI Overdraft Loan', 'LAI Demand Loan'];
  spinner = false;
  constructor() {
  }
  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.letter)) {
      this.letter.loanTypeSelectedArray.forEach(value => {
        switch (value) {
          case 'LAI Term Loan':
            this.termLoanSelected = true;
            break;
          case 'LAI Overdraft Loan':
            this.overdraftLoanSelected = true;
            break;
          case 'LAI Demand Loan':
            this.demandLoanSelected = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    }
  }
}
