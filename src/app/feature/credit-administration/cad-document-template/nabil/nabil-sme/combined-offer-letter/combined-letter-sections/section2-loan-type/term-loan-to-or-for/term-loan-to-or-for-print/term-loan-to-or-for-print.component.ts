import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
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
    tempData;
    loanAmount;
    loanAmountInWord;
    termLoanFreeText: any = {};
    termLoanForTermLoanToOrFor;
    termLoanTypeTermLoanToOrFor;
    complementaryOtherTermLoanToOrFor = false;
    emiPaymentTypeTermLoanToOrFor;
    interestSubAgTermLoanToOrFor;
    paymentTermLoanToOrFor;


    constructor(private formBuilder: FormBuilder,
                private engToNepWord: NepaliCurrencyWordPipe,
                private currencyFormatPipe: CurrencyFormatterPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
    ) {
    }

    ngOnInit() {
      if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
        this.tempData = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].initialInformation);
        const totalLoanAmount = this.customerApprovedDoc.assignedLoan[0].proposal.proposedLimit;
        this.loanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount));
        this.loanAmountInWord = this.engToNepWord.transform(totalLoanAmount);
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
