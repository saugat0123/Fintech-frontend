import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveOfferLetterConst} from "../../../progressive-offer-letter-const";

@Component({
  selector: 'app-letter-of-lein-print',
  templateUrl: './letter-of-lein-print.component.html',
  styleUrls: ['./letter-of-lein-print.component.scss']
})
export class LetterOfLeinPrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveOfferLetterConst;

  constructor() { }

  ngOnInit() {
  }

}
