import {Component, Input, OnInit} from '@angular/core';
import {MegaOfferLetterConst} from "../../../../../mega-offer-letter-const";

@Component({
  selector: 'app-retail-loan-against-insurance-print',
  templateUrl: './retail-loan-against-insurance-print.component.html',
  styleUrls: ['./retail-loan-against-insurance-print.component.scss']
})
export class RetailLoanAgainstInsurancePrintComponent implements OnInit {
  @Input() letter;
  offerLetterConst = MegaOfferLetterConst;
  constructor() { }

  ngOnInit() {
  }

}
