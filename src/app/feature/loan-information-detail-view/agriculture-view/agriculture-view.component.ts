import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../loan/model/loanData';
import {CustomerInfoData} from '../../loan/model/customerInfoData';

@Component({
  selector: 'app-agriculture-view',
  templateUrl: './agriculture-view.component.html',
  styleUrls: ['./agriculture-view.component.scss']
})
export class AgricultureViewComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  @Input() customerAllLoanList: Array<LoanDataHolder> = [];
  @Input() loanHolder: CustomerInfoData;
  @Input() proposalData;
  @Input() fixedAssetsData;
  @Input() fiscalYear;
  @Input() lastDateOfInspection;
  @Input() companyGroup;
  @Input() commonLoanData;

  constructor() { }

  ngOnInit() {
  }

}
