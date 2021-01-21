import {Component, Input, OnInit} from '@angular/core';
import {MegaOfferLetterConst} from '../../../../mega-offer-letter-const';


@Component({
  selector: 'app-retail-mortgage-loan-print',
  templateUrl: './retail-mortgage-loan-print.component.html',
  styleUrls: ['./retail-mortgage-loan-print.component.scss']
})
export class RetailMortgageLoanPrintComponent implements OnInit {
  @Input() letter: any;
  offerLetterConst = MegaOfferLetterConst;
  constructor() { }

  ngOnInit() {
  }

}
