import { LoanDataHolder } from './../../loan/model/loanData';
import { Component, Input, OnInit } from '@angular/core';
import { ObjectUtil } from '../../../@core/utils/ObjectUtil';
import {CustomerInfoData} from '../../loan/model/customerInfoData';

@Component({
  selector: 'app-retail-recommendation',
  templateUrl: './retail-recommendation.component.html',
  styleUrls: ['./retail-recommendation.component.scss']
})
export class RetailRecommendationComponent implements OnInit {
  @Input() loanDataHolder: CustomerInfoData;
  @Input() customerAllLoanList: LoanDataHolder[];
  proposalData;
  loanData;
  constructor() { }

  ngOnInit() {
    this.loanData = this.loanDataHolder;
  }

}
