import { ObjectUtil } from './../../../../../@core/utils/ObjectUtil';
import { LoanDataHolder } from './../../../model/loanData';
import { Component, Input, OnInit } from '@angular/core';
import { MGroup } from '../../../../customer/model/mGroup';

@Component({
  selector: 'app-group-credit-facility-report',
  templateUrl: './group-credit-facility-report.component.html',
  styleUrls: ['./group-credit-facility-report.component.scss']
})
export class GroupCreditFacilityReportComponent implements OnInit {

  @Input() loanDataHolder: LoanDataHolder;
  @Input() customerLoanList;
  @Input() mGroupInfo: MGroup
  incomeSource;
  proposedLimit: string | number;
  constructor() { }

  ngOnInit() {
    this.patchValues();
  }
  patchValues() {
    if(!ObjectUtil.isEmpty(this.loanDataHolder.customerInfo)) {
      this.incomeSource = JSON.parse(this.loanDataHolder.customerInfo.incomeSource);
    }
    this.proposedLimit = ObjectUtil.isEmpty(this.loanDataHolder.proposal) ? '' : this.loanDataHolder.proposal.proposedLimit;
  }

}
