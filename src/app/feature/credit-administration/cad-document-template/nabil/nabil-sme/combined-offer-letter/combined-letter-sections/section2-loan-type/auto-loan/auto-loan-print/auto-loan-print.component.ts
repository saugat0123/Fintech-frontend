import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {ObjectUtil} from '../../../../../../../../../../@core/utils/ObjectUtil';
import {CurrencyFormatterPipe} from '../../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {LoanNameConstant} from '../../../../../../../../cad-view/template-data/nabil-sme-template-data/sme-costant/loan-name-constant';

@Component({
  selector: 'app-auto-loan-print',
  templateUrl: './auto-loan-print.component.html',
  styleUrls: ['./auto-loan-print.component.scss']
})
export class AutoLoanPrintComponent implements OnInit {
  @Input() letterData;
  @Input() customerApprovedDoc;
  @Input() freeText;
  @Input() loanData;
  @Input() pointNumber;
  @Input() autoLoanData;
  tempData;
  autoLoanFreeText;
  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
      this.tempData = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].initialInformation);
    }
    this.autoLoanFreeText = this.freeText ? this.freeText.section2.autoLoanFreeText : '';
  }
}
