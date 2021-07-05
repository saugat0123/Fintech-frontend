import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveOfferLetterConst} from '../../../progressive-offer-letter-const';

@Component({
  selector: 'app-hypothecation-of-goods-and-receivables-b-print',
  templateUrl: './hypothecation-of-goods-and-receivables-b-print.component.html',
  styleUrls: ['./hypothecation-of-goods-and-receivables-b-print.component.scss']
})
export class HypothecationOfGoodsAndReceivablesBPrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveOfferLetterConst;
  constructor() { }

  ngOnInit() {
  }

}
