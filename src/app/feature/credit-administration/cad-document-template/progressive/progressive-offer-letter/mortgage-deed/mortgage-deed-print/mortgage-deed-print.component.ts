import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveOfferLetterConst} from '../../../progressive-offer-letter-const';

@Component({
  selector: 'app-mortgage-deed-print',
  templateUrl: './mortgage-deed-print.component.html',
  styleUrls: ['./mortgage-deed-print.component.scss']
})
export class MortgageDeedPrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveOfferLetterConst;
  constructor() { }

  ngOnInit() {
  }

}
