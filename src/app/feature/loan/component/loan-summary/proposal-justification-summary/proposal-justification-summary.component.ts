import {Component, DoCheck, Input, IterableDiffers, OnInit} from '@angular/core';
import {Proposal} from '../../../../admin/modal/proposal';
import {LoanDataHolder} from '../../../model/loanData';

@Component({
  selector: 'app-proposal-justification-summary',
  templateUrl: './proposal-justification-summary.component.html',
  styleUrls: ['./proposal-justification-summary.component.scss']
})
export class ProposalJustificationSummaryComponent implements OnInit, DoCheck {
  @Input() isDetailedView: boolean;
  @Input() proposalData: Proposal;
  @Input() customerAllLoanList: LoanDataHolder[];
  allLonList: LoanDataHolder[];
  iterableDiffer;

  constructor(private iterableDiffers: IterableDiffers) {
    this.iterableDiffer = iterableDiffers.find([]).create(null);
  }

  ngOnInit() {
  }

  ngDoCheck(): void {
    const changes = this.iterableDiffer.diff(this.customerAllLoanList);
    if (changes) {
      this.allLonList = this.customerAllLoanList.filter(cl => cl.documentStatus.toString() !== 'APPROVED');
      // this.getLoanConfig();
    }
  }

}
