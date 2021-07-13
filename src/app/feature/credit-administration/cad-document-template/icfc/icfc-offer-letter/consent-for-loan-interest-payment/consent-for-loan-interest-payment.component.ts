import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-consent-for-loan-interest-payment',
  templateUrl: './consent-for-loan-interest-payment.component.html',
  styleUrls: ['./consent-for-loan-interest-payment.component.scss']
})
export class ConsentForLoanInterestPaymentComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}
