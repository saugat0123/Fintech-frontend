import {Component, Input, OnInit, QueryList} from '@angular/core';
import {Financial} from '../../../../model/financial';

@Component({
  selector: 'app-financial-details',
  templateUrl: './financial-details.component.html',
  styleUrls: ['./financial-details.component.scss']
})
export class FinancialDetailsComponent implements OnInit {
  @Input() financialData: Financial;
  @Input() loanCategory;
  isBusinessLoan = false;
  riskRating = ['Very High', 'High', 'Average', 'Moderate', 'Low', 'Very Low'];
  activeTab: string;

  constructor() { }

  ngOnInit() {
      if (this.loanCategory === 'BUSINESS_TYPE') {
        this.isBusinessLoan = true;
      }
  }
  changeActiveTab(tabs: QueryList<any>) {
    tabs.forEach(tabContent => {
      if (tabContent.active) {
        this.activeTab = tabContent['tabTitle'];
      }
    });
  }


}
