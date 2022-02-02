import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-mortgage-term-loan-print',
  templateUrl: './mortgage-term-loan-print.component.html',
  styleUrls: ['./mortgage-term-loan-print.component.scss']
})
export class MortgageTermLoanPrintComponent implements OnInit {
  @Input() letterData;
  @Input() customerApprovedDoc;
  @Input() freeText;
  @Input() loanData;
  @Input() pointNumber;
  @Input() mortgageTermLoanData;
  tempData;
  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
      this.tempData = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].initialInformation);
    }
  }
}
