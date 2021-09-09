import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';

@Component({
  selector: 'app-proposal-terms-and-condition-summery',
  templateUrl: './proposal-terms-and-condition-summery.component.html',
  styleUrls: ['./proposal-terms-and-condition-summery.component.scss']
})
export class ProposalTermsAndConditionSummeryComponent implements OnInit {
  @Input() customerAllLoanList: Array<LoanDataHolder>;
  @Input() loanDataHolder: LoanDataHolder;
  constructor() { }

  ngOnInit() {
  }

}
