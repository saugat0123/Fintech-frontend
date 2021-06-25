import {Component, Input, OnInit} from '@angular/core';
import {IcfcOfferLetterConst} from '../../../icfc-offer-letter-const';

@Component({
  selector: 'app-personal-term-loan-print',
  templateUrl: './personal-term-loan-print.component.html',
  styleUrls: ['./personal-term-loan-print.component.scss']
})
export class PersonalTermLoanPrintComponent implements OnInit {
  @Input() letter;
  offerLetterConst = IcfcOfferLetterConst;
  varInterestRateSelected = false;
  fixedInterestRateSelected = false;
  personalOverdraftLoanSelected = false;
  allLoanInterest = false;
  allTermLoanSelected = false;
  odNatureLoanSelected = false;
  constructor() { }

  ngOnInit() {
    this.letter.interestTypeSelectedArray.forEach(value => {
      switch (value) {
        case 'Variable Interest Rate': this.varInterestRateSelected = true;
        break;
        case 'Fixed Interest Rate': this.fixedInterestRateSelected = true;
        break;
        case 'Personal Overdraft Loan': this.personalOverdraftLoanSelected = true;
        break;
        case 'All Types of Loans': this.allTermLoanSelected = true;
        break;
      }
    });

    this.letter.loanTermSelectedArray.forEach(value => {
      switch (value) {
        case 'All Term Loan': this.allTermLoanSelected = true;
          break;
        case 'OD Nature Loan': this.fixedInterestRateSelected = true;
          break;
      }
    });
  }

}
