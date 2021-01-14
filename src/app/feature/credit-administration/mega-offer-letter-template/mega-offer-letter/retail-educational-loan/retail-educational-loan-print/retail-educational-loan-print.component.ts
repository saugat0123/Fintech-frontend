import {Component, Input, OnInit} from '@angular/core';
import {MegaOfferLetterConst} from '../../../../mega-offer-letter-const';

@Component({
  selector: 'app-retail-educational-loan-print',
  templateUrl: './retail-educational-loan-print.component.html',
  styleUrls: ['./retail-educational-loan-print.component.scss']
})
export class RetailEducationalLoanPrintComponent implements OnInit {
@Input() letter;
offerLetterConst = MegaOfferLetterConst;
  constructor() { }

  ngOnInit() {
  }

}
