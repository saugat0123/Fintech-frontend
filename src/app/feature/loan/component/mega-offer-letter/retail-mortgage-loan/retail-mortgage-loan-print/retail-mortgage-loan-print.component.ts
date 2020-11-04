import {Component, Input, OnInit} from '@angular/core';
import {OfferLetterConst} from '../../../offer-letter/model/offer-letter-const';

@Component({
  selector: 'app-retail-mortgage-loan-print',
  templateUrl: './retail-mortgage-loan-print.component.html',
  styleUrls: ['./retail-mortgage-loan-print.component.scss']
})
export class RetailMortgageLoanPrintComponent implements OnInit {
  @Input() letter: any;
  offerLetterConst = OfferLetterConst;
  constructor() { }

  ngOnInit() {
  }

}
