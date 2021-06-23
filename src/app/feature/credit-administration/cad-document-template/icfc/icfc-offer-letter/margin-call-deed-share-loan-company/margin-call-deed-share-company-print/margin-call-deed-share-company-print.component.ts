import {Component, Input, OnInit} from '@angular/core';
import {IcfcOfferLetterConst} from '../../../icfc-offer-letter-const';

@Component({
  selector: 'app-margin-call-deed-share-company-print',
  templateUrl: './margin-call-deed-share-company-print.component.html',
  styleUrls: ['./margin-call-deed-share-company-print.component.scss']
})
export class MarginCallDeedShareCompanyPrintComponent implements OnInit {
  @Input() letter;
  @Input() nepaliData;
  offerLetterConst = IcfcOfferLetterConst;

  constructor() { }

  ngOnInit() {
  }

}
