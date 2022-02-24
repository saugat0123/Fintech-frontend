import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-general-letter-of-trust-receipt-partnership',
  templateUrl: './general-letter-of-trust-receipt-partnership.component.html',
  styleUrls: ['./general-letter-of-trust-receipt-partnership.component.scss']
})
export class GeneralLetterOfTrustReceiptPartnershipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}
