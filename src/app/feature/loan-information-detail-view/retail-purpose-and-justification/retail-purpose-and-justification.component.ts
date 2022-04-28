import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../loan/model/loanData';
import {Proposal} from '../../admin/modal/proposal';

@Component({
  selector: 'app-retail-purpose-and-justification',
  templateUrl: './retail-purpose-and-justification.component.html',
  styleUrls: ['./retail-purpose-and-justification.component.scss']
})
export class RetailPurposeAndJustificationComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  @Input() proposalData: Proposal;
  constructor() { }

  ngOnInit() { }
}
