import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {environment} from '../../../../../../environments/environment';
import {Clients} from '../../../../../../environments/Clients';

@Component({
  selector: 'app-proposal-terms-and-condition-summery',
  templateUrl: './proposal-terms-and-condition-summery.component.html',
  styleUrls: ['./proposal-terms-and-condition-summery.component.scss']
})
export class ProposalTermsAndConditionSummeryComponent implements OnInit {
  @Input() customerAllLoanList: Array<LoanDataHolder>;
  @Input() loanDataHolder: LoanDataHolder;
  client = environment.client;
  clientName = Clients;
  checked = false;
  constructor() { }

  ngOnInit() {
    this.customerAllLoanList.forEach((d) => {
      if (JSON.parse(d.proposal.checkedData).debtChecked) {
        this.checked = true;
      }
    });
  }

}
