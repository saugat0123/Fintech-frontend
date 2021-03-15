import {Component, OnInit, Input} from '@angular/core';
import {Proposal} from '../../admin/modal/proposal';
import {LoanDataHolder} from '../../loan/model/loanData';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {DocStatus} from '../../loan/model/docStatus';
import {LoanType} from '../../loan/model/loanType';
import {EnumUtils} from '../../../@core/utils/enums.utils';

@Component({
  selector: 'app-proposal-view',
  templateUrl: './proposal-view.component.html',
  styleUrls: ['./proposal-view.component.scss']
})
export class ProposalViewComponent implements OnInit {
  @Input() proposalData: Proposal;
  @Input() customerAllLoanList: LoanDataHolder[];
  @Input() loanDataHolder: LoanDataHolder;
  public DocStatus = DocStatus;
  public LoanType = LoanType;
  public EnumUtils = EnumUtils;
  proposalAllData: any;
  customerFundedLoanList: LoanDataHolder[];
  customerNonFundedLoanList: LoanDataHolder[];

  constructor() {
  }

  ngOnInit() {
    this.proposalAllData = JSON.parse(this.proposalData.data);
  }

  public getTotal(key: string): number {
    const tempList = this.customerAllLoanList
        .filter(l => JSON.parse(l.proposal.data)[key]);
    const total = tempList
        .map(l => JSON.parse(l.proposal.data)[key])
        .reduce((a, b) => a + b, 0);
    return this.isNumber(total);
  }

  public getTotalFundable(key: string, funded: boolean, loanList: LoanDataHolder[]): number {
    this.fundedAndNonfundedList(loanList);
    let numb;
    if (funded) {
      const tempList = this.customerFundedLoanList
          .filter(l => JSON.parse(l.proposal.data)[key]);
      numb = tempList
          .map(l => JSON.parse(l.proposal.data)[key])
          .reduce((a, b) => a + b, 0);
    } else {
      const tempList = this.customerNonFundedLoanList
          .filter(l => JSON.parse(l.proposal.data)[key]);
      numb = tempList
          .map(l => JSON.parse(l.proposal.data)[key])
          .reduce((a, b) => a + b, 0);
    }

    return this.isNumber(numb);

  }

  fundedAndNonfundedList(loanList: LoanDataHolder[]) {
    this.customerFundedLoanList = loanList.filter((l) => l.loan.isFundable);
    if (ObjectUtil.isEmpty(this.customerFundedLoanList)) {
      this.customerFundedLoanList = [];
    }
    this.customerNonFundedLoanList = this.customerAllLoanList.filter((l) => !l.loan.isFundable);
    if (ObjectUtil.isEmpty(this.customerNonFundedLoanList)) {
      this.customerNonFundedLoanList = [];
    }
  }

  isNumber(value) {
    if (ObjectUtil.isEmpty(value)) {
      return 0;
    }
    if (Number.isNaN(value)) {
      return 0;
    } else {
      return value;
    }

  }
}
