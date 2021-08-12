import {Component, Input, OnInit} from '@angular/core';
import {IcfcOfferLetterConst} from '../../../icfc-offer-letter-const';

@Component({
  selector: 'app-business-loan-print',
  templateUrl: './business-loan-print.component.html',
  styleUrls: ['./business-loan-print.component.scss']
})
export class BusinessLoanPrintComponent implements OnInit {
  @Input() letter;
  @Input() nepaliData;
  offerLetterConst = IcfcOfferLetterConst;
  businessOverdraftLoanQSelected;
  businessOverdraftLoanMSelected;
  businessTermLoanSelected;
  overdraftLoanSelected;
  termLoanSelected;
  constructor() { }

  ngOnInit() {
    this.letter.interestTypeSelectedArray.forEach(value => {
      switch (value) {
        case 'Business Overdraft Loan (Quarterly)': this.businessOverdraftLoanQSelected = true;
          break;
        case 'Business Overdraft Loan (Monthly)': this.businessOverdraftLoanMSelected = true;
          break;
        case 'Business Term Loan': this.businessTermLoanSelected = true;
          break;
      }
    });

    this.letter.loanTermSelectedArray.forEach(value => {
      switch (value) {
        case 'Overdraft Loan': this.overdraftLoanSelected = true;
          break;
        case 'Term Loan': this.termLoanSelected = true;
          break;
      }
    });
  }

}
