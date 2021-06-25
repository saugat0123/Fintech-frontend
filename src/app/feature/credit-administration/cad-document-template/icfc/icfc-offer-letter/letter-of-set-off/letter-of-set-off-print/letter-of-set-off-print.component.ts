import {Component, Input, OnInit} from '@angular/core';
import {IcfcOfferLetterConst} from '../../../icfc-offer-letter-const';

@Component({
  selector: 'app-letter-of-set-off-print',
  templateUrl: './letter-of-set-off-print.component.html',
  styleUrls: ['./letter-of-set-off-print.component.scss']
})
export class LetterOfSetOffPrintComponent implements OnInit {
  @Input() letter;
  offerLetterConst = IcfcOfferLetterConst;
  constructor() { }

  ngOnInit() {
  }

}
