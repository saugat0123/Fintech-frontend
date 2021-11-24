import {Component, Input, OnInit} from '@angular/core';
import {NabilOfferLetterConst} from '../../../../../nabil-offer-letter-const';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-ddsl-without-subsidy-print',
  templateUrl: './ddsl-without-subsidy-print.component.html',
  styleUrls: ['./ddsl-without-subsidy-print.component.scss']
})
export class DdslWithoutSubsidyPrintComponent implements OnInit {
  @Input() ddslData: any;
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() preview = false;
  @Input() security: any;
  @Input() renewal: any;
  @Input() offerData;
  @Input() loanLimit;
  offerLetterConst = NabilOfferLetterConst;
  constructor() { }

  ngOnInit() {
  }

}
