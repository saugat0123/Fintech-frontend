import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-general-letter-of-trust-receipt-company',
  templateUrl: './general-letter-of-trust-receipt-company.component.html',
  styleUrls: ['./general-letter-of-trust-receipt-company.component.scss']
})
export class GeneralLetterOfTrustReceiptCompanyComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}
