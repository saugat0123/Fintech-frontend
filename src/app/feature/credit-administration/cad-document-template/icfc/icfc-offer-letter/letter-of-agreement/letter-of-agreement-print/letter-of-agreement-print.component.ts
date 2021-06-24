import {Component, Input, OnInit} from '@angular/core';
import {IcfcOfferLetterConst} from '../../../icfc-offer-letter-const';

@Component({
  selector: 'app-letter-of-agreement-print',
  templateUrl: './letter-of-agreement-print.component.html',
  styleUrls: ['./letter-of-agreement-print.component.scss']
})
export class LetterOfAgreementPrintComponent implements OnInit {
  @Input() letter;
  @Input() nepaliData;
  offerLetterConst = IcfcOfferLetterConst;

  constructor() { }

  ngOnInit() {
  }

}
