import {Component, Input, OnInit} from '@angular/core';
import {OfferLetterConst} from '../../../offer-letter/model/offer-letter-const';
import {MegaOfferLetterConst} from "../../model/mega-offer-letter-const";

@Component({
  selector: 'app-sme-print',
  templateUrl: './sme-print.component.html',
  styleUrls: ['./sme-print.component.scss']
})
export class SmePrintComponent implements OnInit {
  @Input() letter: any;
  offerLetterConst = OfferLetterConst;
  megaofferLetterConst = MegaOfferLetterConst;
  constructor() { }

  ngOnInit() {
  }

}
