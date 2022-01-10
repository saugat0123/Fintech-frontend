import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from "../../../../../model/customerApprovedLoanCadDocumentation";

@Component({
  selector: 'app-assignment-of-receivable-proprietorship',
  templateUrl: './assignment-of-receivable-proprietorship.component.html',
  styleUrls: ['./assignment-of-receivable-proprietorship.component.scss']
})
export class AssignmentOfReceivableProprietorshipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}
