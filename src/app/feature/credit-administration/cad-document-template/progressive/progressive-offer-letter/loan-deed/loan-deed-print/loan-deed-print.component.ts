import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveOfferLetterConst} from "../../../progressive-offer-letter-const";

@Component({
  selector: 'app-loan-deed-print',
  templateUrl: './loan-deed-print.component.html',
  styleUrls: ['./loan-deed-print.component.scss']
})
export class LoanDeedPrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveOfferLetterConst;
  constructor() { }

  ngOnInit() {
  }

}
