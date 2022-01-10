import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from "../../../../../model/customerApprovedLoanCadDocumentation";

@Component({
  selector: 'app-supplementary-aggrement-company',
  templateUrl: './supplementary-aggrement-company.component.html',
  styleUrls: ['./supplementary-aggrement-company.component.scss']
})
export class SupplementaryAggrementCompanyComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}
