import {Component, Input, OnInit} from '@angular/core';
import {LoanNepali} from '../../model/loanNepali';

@Component({
  selector: 'app-success-offer-letter-print',
  templateUrl: './success-offer-letter-print.component.html',
  styleUrls: ['./success-offer-letter-print.component.scss']
})
export class SuccessOfferLetterPrintComponent implements OnInit {

  @Input()
  loanNepali: LoanNepali = new LoanNepali();

  constructor() {
  }

  ngOnInit() {
  }

}
