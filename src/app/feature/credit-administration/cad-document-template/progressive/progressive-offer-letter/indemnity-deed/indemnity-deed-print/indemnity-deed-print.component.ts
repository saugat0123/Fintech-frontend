import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveOfferLetterConst} from "../../../progressive-offer-letter-const";

@Component({
  selector: 'app-indemnity-deed-print',
  templateUrl: './indemnity-deed-print.component.html',
  styleUrls: ['./indemnity-deed-print.component.scss']
})
export class IndemnityDeedPrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveOfferLetterConst;
  constructor() { }

  ngOnInit() {
  }

}
