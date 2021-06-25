import {Component, Input, OnInit} from '@angular/core';
import {IcfcOfferLetterConst} from '../../../icfc-offer-letter-const';

@Component({
  selector: 'app-ac-debit-and-loan-disbursement-authority-print',
  templateUrl: './ac-debit-and-loan-disbursement-authority-print.component.html',
  styleUrls: ['./ac-debit-and-loan-disbursement-authority-print.component.scss']
})
export class AcDebitAndLoanDisbursementAuthorityPrintComponent implements OnInit {
  @Input() letter;
  offerLetterConst = IcfcOfferLetterConst;

  constructor() { }

  ngOnInit() {
  }

}
