import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-section6-facilities-clause-print',
  templateUrl: './section6-facilities-clause-print.component.html',
  styleUrls: ['./section6-facilities-clause-print.component.scss']
})
export class Section6FacilitiesClausePrintComponent implements OnInit {
  @Input() customerApprovedDoc;
  @Input() freeText;
  tenureOfLoan;
  constructor() { }

  ngOnInit() {
  }

}
