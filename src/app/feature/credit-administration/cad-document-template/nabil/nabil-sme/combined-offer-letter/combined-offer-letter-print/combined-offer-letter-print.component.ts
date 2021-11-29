import { Component, OnInit } from '@angular/core';
import {NabilOfferLetterConst} from '../../../../../nabil-offer-letter-const';

@Component({
  selector: 'app-combined-offer-letter-print',
  templateUrl: './combined-offer-letter-print.component.html',
  styleUrls: ['./combined-offer-letter-print.component.scss']
})
export class CombinedOfferLetterPrintComponent implements OnInit {
  offerLetterConst = NabilOfferLetterConst;

  constructor() { }

  ngOnInit() {
  }

}
