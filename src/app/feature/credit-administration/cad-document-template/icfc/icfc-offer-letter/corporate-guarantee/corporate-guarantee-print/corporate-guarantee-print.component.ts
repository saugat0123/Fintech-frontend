import {Component, Input, OnInit} from '@angular/core';
import {IcfcOfferLetterConst} from '../../../icfc-offer-letter-const';

@Component({
  selector: 'app-corporate-guarantee-print',
  templateUrl: './corporate-guarantee-print.component.html',
  styleUrls: ['./corporate-guarantee-print.component.scss']
})
export class CorporateGuaranteePrintComponent implements OnInit {
  @Input() letter;
  offerLetterConst = IcfcOfferLetterConst;

  constructor() { }

  ngOnInit() {
  }

}
