import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveOfferLetterConst} from '../../progressive-offer-letter-const';

@Component({
  selector: 'app-offer-letter-hire-purchase-and-auto-loan-print',
  templateUrl: './offer-letter-hire-purchase-and-auto-loan-print.component.html',
  styleUrls: ['./offer-letter-hire-purchase-and-auto-loan-print.component.scss']
})
export class OfferLetterHirePurchaseAndAutoLoanPrintComponent implements OnInit {
  @Input() printDocForm;
  @Input() nepaliData;
  offerLetterConst = ProgressiveOfferLetterConst;
  constructor() { }

  ngOnInit() {
  }

}
