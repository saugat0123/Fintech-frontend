import {Component, Input, OnInit} from '@angular/core';
import {OfferLetterConst} from '../../offer-letter-const';

@Component({
  selector: 'app-kararnama-print',
  templateUrl: './kararnama-print.component.html',
  styleUrls: ['./kararnama-print.component.scss']
})
export class KararnamaPrintComponent implements OnInit {
  @Input()
  letter: any;
  offerLetterConst = OfferLetterConst;

  constructor() {
  }

  ngOnInit() {
  }

}
