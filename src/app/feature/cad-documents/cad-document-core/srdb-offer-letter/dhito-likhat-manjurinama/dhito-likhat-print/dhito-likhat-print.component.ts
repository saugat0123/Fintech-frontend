import {Component, Input, OnInit} from '@angular/core';
import {OfferLetterConst} from '../../offer-letter-const';

@Component({
  selector: 'app-dhito-likhat-print',
  templateUrl: './dhito-likhat-print.component.html',
  styleUrls: ['./dhito-likhat-print.component.scss']
})
export class DhitoLikhatPrintComponent implements OnInit {

  @Input()
  letter: any;
  offerLetterConst = OfferLetterConst;

  constructor() {
  }

  ngOnInit() {
  }

}
