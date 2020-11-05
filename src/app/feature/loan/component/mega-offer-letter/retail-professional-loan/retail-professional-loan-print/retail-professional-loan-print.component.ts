import {Component, Input, OnInit} from '@angular/core';
import {OfferLetterConst} from '../../../offer-letter/model/offer-letter-const';
import {MegaOfferLetterConst} from "../../model/mega-offer-letter-const";

@Component({
  selector: 'app-retail-professional-loan-print',
  templateUrl: './retail-professional-loan-print.component.html',
  styleUrls: ['./retail-professional-loan-print.component.scss']
})
export class RetailProfessionalLoanPrintComponent implements OnInit {
  @Input()
  letter: any;
  offerLetterConst = OfferLetterConst;
  megaofferLetterConst = MegaOfferLetterConst;

  constructor() { }

  ngOnInit() {
  }

}
