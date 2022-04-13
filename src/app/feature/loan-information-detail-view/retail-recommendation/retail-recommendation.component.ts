import { LoanDataHolder } from './../../loan/model/loanData';
import { Component, Input, OnInit } from '@angular/core';
import { ObjectUtil } from '../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-retail-recommendation',
  templateUrl: './retail-recommendation.component.html',
  styleUrls: ['./retail-recommendation.component.scss']
})
export class RetailRecommendationComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder
  proposalData;
  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.loanDataHolder.proposal)) {
      this.proposalData = this.loanDataHolder.proposal.data;
    }
  }

}
