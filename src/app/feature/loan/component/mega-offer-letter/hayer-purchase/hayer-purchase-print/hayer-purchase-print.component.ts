import {Component, Input, OnInit} from '@angular/core';
import {OfferLetterConst} from '../../../offer-letter/model/offer-letter-const';

@Component({
  selector: 'app-hayer-purchase-print',
  templateUrl: './hayer-purchase-print.component.html',
  styleUrls: ['./hayer-purchase-print.component.scss']
})
export class HayerPurchasePrintComponent implements OnInit {
  offerLetterConst = OfferLetterConst;
  @Input() loan;

  constructor() {
  }

  ngOnInit() {
  }

}
