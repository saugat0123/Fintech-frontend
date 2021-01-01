import {Component, Input, OnInit} from '@angular/core';
import {MegaOfferLetterConst} from '../../../../mega-offer-letter-const';

@Component({
  selector: 'app-sme-print',
  templateUrl: './sme-print.component.html',
  styleUrls: ['./sme-print.component.scss']
})
export class SmePrintComponent implements OnInit {
  @Input() letter: any;
  offerLetterConst =  MegaOfferLetterConst;
  constructor() { }

  ngOnInit() {
  }

}
