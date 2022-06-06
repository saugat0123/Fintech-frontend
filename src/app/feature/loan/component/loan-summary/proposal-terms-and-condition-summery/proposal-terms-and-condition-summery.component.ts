import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {environment} from '../../../../../../environments/environment';
import {Clients} from '../../../../../../environments/Clients';
import {SummaryType} from '../../SummaryType';
import {LoanType} from '../../../model/loanType';
import {DocStatus} from '../../../model/docStatus';

@Component({
  selector: 'app-proposal-terms-and-condition-summery',
  templateUrl: './proposal-terms-and-condition-summery.component.html',
  styleUrls: ['./proposal-terms-and-condition-summery.component.scss']
})
export class ProposalTermsAndConditionSummeryComponent implements OnInit {
  @Input() customerAllLoanList: Array<LoanDataHolder>;
  @Input() loanDataHolder;
  @Input() loanCategory;
  client = environment.client;
  clientName = Clients;
  summaryType = environment.summaryType;
  summaryTypeName = SummaryType;
  @Input() loanSummary;
  loanType = LoanType;
  docType = DocStatus;

  constructor() { }

  ngOnInit() {
  }

}
