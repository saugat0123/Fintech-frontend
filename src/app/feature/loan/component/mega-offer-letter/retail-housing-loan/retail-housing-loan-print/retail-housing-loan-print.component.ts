import {Component, Input, OnInit} from '@angular/core';
import {OfferLetterConst} from '../../../offer-letter/model/offer-letter-const';

@Component({
  selector: 'app-retail-housing-loan-print',
  templateUrl: './retail-housing-loan-print.component.html',
  styleUrls: ['./retail-housing-loan-print.component.scss']
})
export class RetailHousingLoanPrintComponent implements OnInit {
  @Input() letter: any;
  offerLetterConst = OfferLetterConst;
  constructor() { }

  ngOnInit() {
  }

}
