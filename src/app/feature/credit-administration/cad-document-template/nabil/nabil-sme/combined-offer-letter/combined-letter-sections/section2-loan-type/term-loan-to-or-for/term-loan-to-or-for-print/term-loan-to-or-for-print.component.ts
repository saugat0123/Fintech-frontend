import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-term-loan-to-or-for-print',
    templateUrl: './term-loan-to-or-for-print.component.html',
    styleUrls: ['./term-loan-to-or-for-print.component.scss']
})
export class TermLoanToOrForPrintComponent implements OnInit {
    @Input() letterData;
    @Input() customerApprovedDoc;
    @Input() freeText;
    @Input() loanData;
    @Input() index;
    tempData;
    termLoanFreeText: any = {};
    termLoanForTermLoanToOrFor;
    termLoanTypeTermLoanToOrFor;
    complementaryOtherTermLoanToOrFor = false;
    emiPaymentTypeTermLoanToOrFor;
    interestSubAgTermLoanToOrFor;
    paymentTermLoanToOrFor;


    constructor() {
    }

    ngOnInit() {
      if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
        this.tempData = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].initialInformation);
      }
      if (!ObjectUtil.isEmpty(this.tempData.termLoanForm)) {
        this.termLoanForTermLoanToOrFor = this.tempData.termLoanForm.termLoanFor;
        this.termLoanTypeTermLoanToOrFor = this.tempData.termLoanForm.termLoanType;
        this.emiPaymentTypeTermLoanToOrFor = this.tempData.termLoanForm.emiPaymentType;
        this.interestSubAgTermLoanToOrFor = this.tempData.termLoanForm.subsidyOrAgricultureLoan;
        this.paymentTermLoanToOrFor = this.tempData.termLoanForm.paymentTerms;
        if (this.tempData.termLoanForm.complementaryOther === true) {
          this.complementaryOtherTermLoanToOrFor = true;
        }
      }
    }

}
