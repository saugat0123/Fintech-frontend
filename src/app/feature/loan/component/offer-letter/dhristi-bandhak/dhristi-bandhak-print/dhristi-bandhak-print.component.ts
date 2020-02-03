import {Component, Input, OnInit} from '@angular/core';
import {OfferLetterConst} from '../../model/offer-letter-const';

@Component({
  selector: 'app-dhristi-bandhak-print',
  templateUrl: './dhristi-bandhak-print.component.html',
  styleUrls: ['./dhristi-bandhak-print.component.scss']
})
export class DhristiBandhakPrintComponent implements OnInit {
  @Input() loan: any;
  offerLetterConst = OfferLetterConst;

  constructor() {
  }

  ngOnInit() {
  }

}
