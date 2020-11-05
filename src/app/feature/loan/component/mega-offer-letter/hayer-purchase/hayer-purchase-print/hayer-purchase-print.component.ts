import {Component, Input, OnInit} from '@angular/core';
import {OfferLetterConst} from '../../../offer-letter/model/offer-letter-const';
import {MegaOfferLetterConst} from "../../model/mega-offer-letter-const";

@Component({
  selector: 'app-hayer-purchase-print',
  templateUrl: './hayer-purchase-print.component.html',
  styleUrls: ['./hayer-purchase-print.component.scss']
})
export class HayerPurchasePrintComponent implements OnInit {
  megaofferLetterConst = MegaOfferLetterConst;
  @Input() loan;

  constructor() {
  }

  ngOnInit() {
  }

}
