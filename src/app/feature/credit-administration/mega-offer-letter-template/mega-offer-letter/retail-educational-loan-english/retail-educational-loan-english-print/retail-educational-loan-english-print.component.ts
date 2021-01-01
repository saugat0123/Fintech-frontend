import {Component, Input, OnInit} from '@angular/core';
import {MegaOfferLetterConst} from '../../../../mega-offer-letter-const';

@Component({
  selector: 'app-retail-educational-loan-english-print',
  templateUrl: './retail-educational-loan-english-print.component.html',
  styleUrls: ['./retail-educational-loan-english-print.component.scss']
})
export class RetailEducationalLoanEnglishPrintComponent implements OnInit {
  @Input() letter: any;
  offerLetterConst = MegaOfferLetterConst;
  constructor() { }

  ngOnInit() {
  }

}
