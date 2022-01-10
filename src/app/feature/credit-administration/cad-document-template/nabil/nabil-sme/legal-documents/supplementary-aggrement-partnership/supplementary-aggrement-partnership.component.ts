import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from "../../../../../model/customerApprovedLoanCadDocumentation";

@Component({
  selector: 'app-supplementary-aggrement-partnership',
  templateUrl: './supplementary-aggrement-partnership.component.html',
  styleUrls: ['./supplementary-aggrement-partnership.component.scss']
})
export class SupplementaryAggrementPartnershipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}
