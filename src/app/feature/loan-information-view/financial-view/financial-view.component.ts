import {Component, Input, OnInit, QueryList} from '@angular/core';
import {Financial} from '../../loan/model/financial';
import {FinancialService} from '../../loan-information-template/financial/financial.service';

@Component({
  selector: 'app-financial-view',
  templateUrl: './financial-view.component.html',
  styleUrls: ['./financial-view.component.scss']
})
export class FinancialViewComponent implements OnInit {

  @Input() formData: Financial;
  @Input() customerType: any;

  financialData: any;

  isBusinessLoan = false;
  riskRating = ['Very High', 'High', 'Average', 'Moderate', 'Low', 'Very Low'];
  activeTab: string;

  constructor() { }

  ngOnInit() {
    if (this.formData !== undefined) {
      this.financialData = JSON.parse(this.formData.data);
    }
    if (this.customerType === 'COMPANY') {
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
