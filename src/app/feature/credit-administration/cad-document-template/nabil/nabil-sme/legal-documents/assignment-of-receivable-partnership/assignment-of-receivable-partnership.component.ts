import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from "../../../../../model/customerApprovedLoanCadDocumentation";

@Component({
  selector: 'app-assignment-of-receivable-partnership',
  templateUrl: './assignment-of-receivable-partnership.component.html',
  styleUrls: ['./assignment-of-receivable-partnership.component.scss']
})
export class AssignmentOfReceivablePartnershipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}
