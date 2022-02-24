import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-general-letter-of-trust-receipt-proprietorship',
  templateUrl: './general-letter-of-trust-receipt-proprietorship.component.html',
  styleUrls: ['./general-letter-of-trust-receipt-proprietorship.component.scss']
})
export class GeneralLetterOfTrustReceiptProprietorshipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}
