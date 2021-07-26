import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {environment} from '../../../../../../environments/environment';
import {Clients} from '../../../../../../environments/Clients';
import {SummaryType} from '../../SummaryType';

@Component({
  selector: 'app-proposal-terms-and-condition-summery',
  templateUrl: './proposal-terms-and-condition-summery.component.html',
  styleUrls: ['./proposal-terms-and-condition-summery.component.scss']
})
export class ProposalTermsAndConditionSummeryComponent implements OnInit {
  @Input() customerAllLoanList: Array<LoanDataHolder>;
  @Input() loanDataHolder: LoanDataHolder;
  @Input() loanCategory;
  client = environment.client;
  clientName = Clients;
  summaryType = environment.summaryType;
  summaryTypeName = SummaryType;
  constructor() { }

  ngOnInit() {
  }

}
