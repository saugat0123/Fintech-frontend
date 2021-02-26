import {Component, Input, OnInit} from '@angular/core';
import {Proposal} from '../../../../admin/modal/proposal';
import {LoanDataHolder} from '../../../model/loanData';
import {Clients} from '../../../../../../environments/Clients';
import {environment} from '../../../../../../environments/environment';

@Component({
  selector: 'app-proposal-justification-summary',
  templateUrl: './proposal-justification-summary.component.html',
  styleUrls: ['./proposal-justification-summary.component.scss']
})
export class ProposalJustificationSummaryComponent implements OnInit {
  @Input() proposalData: Proposal;
  @Input() customerAllLoanList: LoanDataHolder[];
  client = environment.client;
  clientName = Clients ;
  constructor() { }

  ngOnInit() {
  }

}
