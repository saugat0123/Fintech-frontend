import {Component, Input, OnInit} from '@angular/core';
import {Proposal} from '../../../../admin/modal/proposal';
import {LoanDataHolder} from '../../../model/loanData';

@Component({
  selector: 'app-proposal-justification-summary',
  templateUrl: './proposal-justification-summary.component.html',
  styleUrls: ['./proposal-justification-summary.component.scss']
})
export class ProposalJustificationSummaryComponent implements OnInit {
  @Input() isDetailedView: boolean;
  @Input() proposalData: Proposal;
  @Input() customerAllLoanList: LoanDataHolder[];
  constructor() { }

  ngOnInit() {
  }

}
