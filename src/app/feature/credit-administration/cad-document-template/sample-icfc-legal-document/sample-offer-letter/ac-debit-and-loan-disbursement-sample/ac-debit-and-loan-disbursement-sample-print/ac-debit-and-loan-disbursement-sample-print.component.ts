import {Component, Input, OnInit} from '@angular/core';
import {IcfcOfferLetterConst} from '../../../../icfc/icfc-offer-letter-const';
import {CadCheckListTemplateEnum} from '../../../../../../admin/modal/cadCheckListTemplateEnum';

@Component({
  selector: 'app-ac-debit-and-loan-disbursement-sample-print',
  templateUrl: './ac-debit-and-loan-disbursement-sample-print.component.html',
  styleUrls: ['./ac-debit-and-loan-disbursement-sample-print.component.scss']
})
export class AcDebitAndLoanDisbursementSamplePrintComponent implements OnInit {
  @Input() letter;
  offerLetterConst = CadCheckListTemplateEnum;
  loanDisbursementSelected = false;
  accountDebitSelected =  false;

  constructor() { }

  ngOnInit() {
    const value = this.letter.subjectSelectedValue;
    switch (value) {
      case 'Loan Disbursement': this.loanDisbursementSelected = true;
        break;
      case 'Account Debit Authority': this.accountDebitSelected = true;
        break;
    }
  }

}
