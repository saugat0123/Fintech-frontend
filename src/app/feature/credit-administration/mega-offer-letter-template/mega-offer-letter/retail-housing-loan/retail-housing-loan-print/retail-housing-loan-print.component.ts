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

  constructor() { }

  ngOnInit() {
  }

}
