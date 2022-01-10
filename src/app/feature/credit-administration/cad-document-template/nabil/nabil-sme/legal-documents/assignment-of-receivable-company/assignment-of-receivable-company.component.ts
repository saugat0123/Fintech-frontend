import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from "../../../../../model/customerApprovedLoanCadDocumentation";

@Component({
  selector: 'app-assignment-of-receivable-company',
  templateUrl: './assignment-of-receivable-company.component.html',
  styleUrls: ['./assignment-of-receivable-company.component.scss']
})
export class AssignmentOfReceivableCompanyComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}
