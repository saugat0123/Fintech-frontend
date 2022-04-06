import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../../model/loanData';
import {LoanType} from '../../../../../model/loanType';

@Component({
  selector: 'app-sana-current-status-and-present-proposal',
  templateUrl: './sana-current-status-and-present-proposal.component.html',
  styleUrls: ['./sana-current-status-and-present-proposal.component.scss']
})
export class SanaCurrentStatusAndPresentProposalComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  loanType: LoanType;

  constructor() { }

  ngOnInit() {
  }

}
