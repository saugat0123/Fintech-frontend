import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-loan-deed-company',
  templateUrl: './loan-deed-company.component.html',
  styleUrls: ['./loan-deed-company.component.scss']
})
export class LoanDeedCompanyComponent implements OnInit {

  constructor() { }
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  ngOnInit() {
  }

}
