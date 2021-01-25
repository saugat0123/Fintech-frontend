import {Component, Input, OnInit} from '@angular/core';
import {MegaOfferLetterConst} from 'src/app/feature/credit-administration/mega-offer-letter-const';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-retail-against-ins-print',
  templateUrl: './retail-against-ins-print.component.html',
  styleUrls: ['./retail-against-ins-print.component.scss']
})
export class RetailAgainstInsPrintComponent implements OnInit {
  @Input() letter;
  offerLetterConst = MegaOfferLetterConst;
  termLoanSelected = false;
  overdraftLoanSelected = false;
  demandLoanSelected = false;
  loanTypeArray = ['LAI Term Loan', 'LAI Overdraft Loan', 'LAI Demand Loan'];

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
  }

}
