import {Component, Input, OnInit} from '@angular/core';
import {LegalDocumentCheckListEnum} from '../../../../../../admin/modal/legalDocumentCheckListEnum';

@Component({
  selector: 'app-ac-debit-and-loan-disbursement-authority-print',
  templateUrl: './ac-debit-and-loan-disbursement-authority-print.component.html',
  styleUrls: ['./ac-debit-and-loan-disbursement-authority-print.component.scss']
})
export class AcDebitAndLoanDisbursementAuthorityPrintComponent implements OnInit {
  @Input() letter;
  offerLetterConst = LegalDocumentCheckListEnum;
  loanDisbursementSelected = false;
  accountDebitSelected =  false;

  constructor() { }

  ngOnInit() {
    this.letter.subjectSelectedValue.forEach(value => {
      switch (value) {
        case 'Loan Disbursement': this.loanDisbursementSelected = true;
          break;
        case 'Account Debit Authority': this.accountDebitSelected = true;
          break;
      }
    });
  }

}
