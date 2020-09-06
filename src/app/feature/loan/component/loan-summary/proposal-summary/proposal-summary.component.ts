import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {Proposal} from '../../../../admin/modal/proposal';
import {DocStatus} from '../../../model/docStatus';
import {LoanType} from '../../../model/loanType';
import {EnumUtils} from '../../../../../@core/utils/enums.utils';

@Component({
  selector: 'app-proposal-summary',
  templateUrl: './proposal-summary.component.html',
  styleUrls: ['./proposal-summary.component.scss']
})
export class ProposalSummaryComponent implements OnInit {
  @Input() proposalData: Proposal;
  @Input() customerAllLoanList: LoanDataHolder[];
  public DocStatus = DocStatus;
  public LoanType = LoanType;
  public EnumUtils = EnumUtils;

  constructor() { }

  ngOnInit() {
  }

  public getTotal(key: string): number {
    return this.customerAllLoanList
    .map(l => JSON.parse(l.proposal.data)[key])
    .reduce((a, b) => a + b, 0);
  }

}
