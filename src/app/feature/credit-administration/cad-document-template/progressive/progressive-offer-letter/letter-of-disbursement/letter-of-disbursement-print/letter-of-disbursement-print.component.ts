import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveOfferLetterConst} from "../../../progressive-offer-letter-const";

@Component({
  selector: 'app-letter-of-disbursement-print',
  templateUrl: './letter-of-disbursement-print.component.html',
  styleUrls: ['./letter-of-disbursement-print.component.scss']
})
export class LetterOfDisbursementPrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveOfferLetterConst;
  constructor() { }

  ngOnInit() {
  }

}
