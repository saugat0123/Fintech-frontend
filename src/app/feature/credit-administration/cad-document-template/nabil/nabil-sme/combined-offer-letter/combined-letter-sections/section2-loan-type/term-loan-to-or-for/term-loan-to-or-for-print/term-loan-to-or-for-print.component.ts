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
    @Input() pointNumber;
    @Input() termLoanData;
    tempData;
    termLoanFreeText;

    constructor() {
    }

    ngOnInit() {
      if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
        this.tempData = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].initialInformation);
      }
        this.termLoanFreeText = this.freeText ? this.freeText.section2.termLoanFreeText : '';
    }

}
