import {Component, Input, OnInit} from '@angular/core';
import {MegaOfferLetterConst} from '../../../../mega-offer-letter-const';

@Component({
  selector: 'app-retail-housing-loan-print',
  templateUrl: './retail-housing-loan-print.component.html',
  styleUrls: ['./retail-housing-loan-print.component.scss']
})
export class RetailHousingLoanPrintComponent implements OnInit {
  @Input() letter: any;
  offerLetterConst = MegaOfferLetterConst;
  housingFinanceSelected = false;
  mortgageFinance = false;
  mortgageOverdraft = false;
  constructor() { }

  ngOnInit() {
    this.letter.selectedArray.forEach(value =>{
      switch (value) {
        case 'Housing Finance': this.housingFinanceSelected = true;
          break;
        case 'Mortgage Finance': this.mortgageFinance = true;
        break;
        case 'Mortgage Overdraft': this.mortgageOverdraft = true;
        break;

      }

    })
  }

}
