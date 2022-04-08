import { ObjectUtil } from './../../../../../@core/utils/ObjectUtil';
import { LoanDataHolder } from './../../../model/loanData';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-group-credit-facility-report',
  templateUrl: './group-credit-facility-report.component.html',
  styleUrls: ['./group-credit-facility-report.component.scss']
})
export class GroupCreditFacilityReportComponent implements OnInit {

  @Input() loanDataHolder: LoanDataHolder;
  @Input() customerLoanList;
  incomeSource;
  constructor() { }

  ngOnInit() {
    this.patchValues();
  }
  patchValues() {
    if(!ObjectUtil.isEmpty(this.loanDataHolder.customerInfo)) {
      this.incomeSource = JSON.parse(this.loanDataHolder.customerInfo.incomeSource);
    }
  }

}
