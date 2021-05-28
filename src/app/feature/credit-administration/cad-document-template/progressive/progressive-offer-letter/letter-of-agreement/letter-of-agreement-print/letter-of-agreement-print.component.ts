import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveOfferLetterConst} from "../../../progressive-offer-letter-const";

@Component({
  selector: 'app-letter-of-agreement-print',
  templateUrl: './letter-of-agreement-print.component.html',
  styleUrls: ['./letter-of-agreement-print.component.scss']
})
export class LetterOfAgreementPrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveOfferLetterConst;
  constructor() { }

  ngOnInit() {
  }

}
