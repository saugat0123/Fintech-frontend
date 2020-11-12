import {Component, Input, OnInit} from '@angular/core';
import {OfferLetterConst} from '../../offer-letter-const';

@Component({
  selector: 'app-pratigya-patra-print',
  templateUrl: './pratigya-patra-print.component.html',
  styleUrls: ['./pratigya-patra-print.component.scss']
})
export class PratigyaPatraPrintComponent implements OnInit {
  @Input()
  letter: any;
  offerLetterConst = OfferLetterConst;

  constructor() { }

  ngOnInit() {
  }
}
