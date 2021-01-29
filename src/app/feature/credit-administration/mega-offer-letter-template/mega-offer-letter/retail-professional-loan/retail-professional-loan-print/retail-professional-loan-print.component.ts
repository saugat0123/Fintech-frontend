import {Component, Input, OnInit} from '@angular/core';
import {MegaOfferLetterConst} from '../../../../mega-offer-letter-const';

@Component({
  selector: 'app-retail-professional-loan-print',
  templateUrl: './retail-professional-loan-print.component.html',
  styleUrls: ['./retail-professional-loan-print.component.scss']
})
export class RetailProfessionalLoanPrintComponent implements OnInit {
  @Input()
  letter: any;
  offerLetterConst = MegaOfferLetterConst;
  loanTypeArray = ['Professional Term Loan', 'Professional Overdraft Loan' ];
  proTermLoanSelected = false;
  proOverdraftLoanSelected = false;

  constructor() { }

  ngOnInit() {
    this.availableLoanType(this.letter['loanTypeSelectedArray']);
  }

  availableLoanType($event) {
    this.loanTypeArray.forEach( () => {
      $event.includes('Professional Term Loan') ? this.proTermLoanSelected = true : this.proTermLoanSelected = false;
      $event.includes('Professional Overdraft Loan') ? this.proOverdraftLoanSelected = true : this.proOverdraftLoanSelected = false;
    });
  }

}
