import {Component, Input, OnInit} from '@angular/core';
import {NabilOfferLetterConst} from '../../../../../nabil-offer-letter-const';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-combined-offer-letter-print',
  templateUrl: './combined-offer-letter-print.component.html',
  styleUrls: ['./combined-offer-letter-print.component.scss']
})
export class CombinedOfferLetterPrintComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  offerLetterConst = NabilOfferLetterConst;

  constructor() { }

  ngOnInit() {
  }

}
