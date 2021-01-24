import {Component, Input, OnInit} from '@angular/core';
import { MegaOfferLetterConst } from 'src/app/feature/credit-administration/mega-offer-letter-const';

@Component({
  selector: 'app-retail-against-ins-print',
  templateUrl: './retail-against-ins-print.component.html',
  styleUrls: ['./retail-against-ins-print.component.scss']
})
export class RetailAgainstInsPrintComponent implements OnInit {
  @Input() letter;
  offerLetterConst = MegaOfferLetterConst;
  constructor() { }

  ngOnInit() {
  }

}
