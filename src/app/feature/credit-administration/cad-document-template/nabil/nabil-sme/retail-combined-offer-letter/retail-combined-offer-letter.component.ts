import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-retail-combined-offer-letter',
  templateUrl: './retail-combined-offer-letter.component.html',
  styleUrls: ['./retail-combined-offer-letter.component.scss']
})
export class RetailCombinedOfferLetterComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  constructor() { }

  ngOnInit() {
  }

}
