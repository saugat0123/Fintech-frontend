import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../loan/model/loanData';
import {CustomerInfoData} from '../../loan/model/customerInfoData';

@Component({
  selector: 'app-retail-view',
  templateUrl: './retail-view.component.html',
  styleUrls: ['./retail-view.component.scss']
})
export class RetailViewComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  @Input() customerAllLoanList: Array<LoanDataHolder> = [];
  @Input() loanHolder: CustomerInfoData;
  @Input() proposalData;
  @Input() fixedAssetsData;
  @Input() lastDateOfInspection;
  @Input() companyGroup;
  @Input() commonLoanData;

  constructor() { }

  ngOnInit() {
  }

}
