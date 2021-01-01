import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-legal-and-disbursement',
  templateUrl: './legal-and-disbursement.component.html',
  styleUrls: ['./legal-and-disbursement.component.scss']
})
export class LegalAndDisbursementComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  constructor() { }

  ngOnInit() {
  }

}
