import {Component, Input, OnInit, QueryList} from '@angular/core';
import {Financial} from '../../loan/model/financial';
import {CustomerType} from '../../customer/model/customerType';
import {environment} from '../../../../environments/environment';

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
  activeTab: string;
  disableCrgAlphaParams = environment.disableCrgAlpha;

  constructor() {
  }

  ngOnInit() {
    if (this.formData !== undefined) {
      this.financialData = JSON.parse(this.formData.data);
    }
    if (CustomerType[this.customerType] === CustomerType.INSTITUTION) {
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
