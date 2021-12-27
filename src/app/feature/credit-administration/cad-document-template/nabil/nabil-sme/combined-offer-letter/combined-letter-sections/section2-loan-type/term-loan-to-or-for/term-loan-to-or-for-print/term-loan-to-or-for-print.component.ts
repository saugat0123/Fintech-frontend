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
    @Input() data;
    tempData;
    termLoanFreeText: any = {};
    termLoanForTermLoanToOrFor;
    termLoanTypeTermLoanToOrFor;
    complementaryOtherTermLoanToOrFor = false;
    emiPaymentTypeTermLoanToOrFor;
    interestSubAgTermLoanToOrFor;
    paymentTermLoanToOrFor;
    complementaryOtherTermLoanToOrForName;

    constructor() {
    }

    ngOnInit() {
      if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
        this.tempData = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].initialInformation);
      }
      if (!ObjectUtil.isEmpty(this.data)) {
        this.termLoanForTermLoanToOrFor = this.data.termLoanFor;
        this.termLoanTypeTermLoanToOrFor = this.data.termLoanType;
        this.emiPaymentTypeTermLoanToOrFor = this.data.emiPaymentType;
        this.interestSubAgTermLoanToOrFor = this.data.subsidyOrAgricultureLoan;
          this.complementaryOtherTermLoanToOrForName = this.data.complimentaryLoanSelected;
        this.paymentTermLoanToOrFor = this.data.paymentTerms;
        if (this.data.complementaryOther === true) {
          this.complementaryOtherTermLoanToOrFor = true;
        }
      }
    }

}
