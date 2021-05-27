import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveOfferLetterConst} from '../../../progressive-offer-letter-const';

@Component({
  selector: 'app-letter-of-arrangements-print',
  templateUrl: './letter-of-arrangements-print.component.html',
  styleUrls: ['./letter-of-arrangements-print.component.scss']
})
export class LetterOfArrangementsPrintComponent implements OnInit {

  @Input() printDocForm;
  offerLetterConst = ProgressiveOfferLetterConst;

  constructor() {
  }

  ngOnInit() {
  }

}
