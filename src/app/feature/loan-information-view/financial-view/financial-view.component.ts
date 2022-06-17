import {Component, Input, OnInit, QueryList} from '@angular/core';
import {Financial} from '../../loan/model/financial';
import {CustomerType} from '../../customer/model/customerType';
import {environment} from '../../../../environments/environment';
import {ToastService} from '../../../@core/utils';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-financial-view',
  templateUrl: './financial-view.component.html',
  styleUrls: ['./financial-view.component.scss']
})
export class FinancialViewComponent implements OnInit {

  @Input() formData: Financial;
  @Input() customerType;
  @Input() data;
  isMicro = false;
  financialData: any;
  isBusinessLoan = false;
  activeTab: string;
  disableCrgAlphaParams = environment.disableCrgAlpha;
  auditorList = [];
  incomeSource;
  initialData;

  constructor(protected toastService: ToastService) {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.formData)) {
      this.financialData = JSON.parse(this.formData.data);
      if (CustomerType[this.customerType] === CustomerType.INSTITUTION ) {
        this.isBusinessLoan = true;
      }
    }
    if (!ObjectUtil.isEmpty(this.data)) {
      this.initialData = JSON.parse(this.data.data);
    }
    if (!ObjectUtil.isEmpty(this.financialData)) {
      if (!ObjectUtil.isEmpty(this.financialData.auditorList)) {
        this.auditorList = this.financialData.auditorList;
      }
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
