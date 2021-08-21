import {Component, Input, OnInit, QueryList} from '@angular/core';
import {Financial} from '../../loan/model/financial';
import {CustomerType} from '../../customer/model/customerType';
import {environment} from '../../../../environments/environment';
import {KeyIndicatorsHeaderMap} from '../../loan-information-template/financial/constants/key-indicators-constants';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {ToastService} from '../../../@core/utils';
import {LoanDataHolder} from '../../loan/model/loanData';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-financial-view',
  templateUrl: './financial-view.component.html',
  styleUrls: ['./financial-view.component.scss']
})
export class FinancialViewComponent implements OnInit {

  @Input() formData: Financial;
  @Input() customerType: any;
  @Input() microCustomer;
  isMicro = false;
  financialData: any;
  isBusinessLoan = false;
  activeTab: string;
  disableCrgAlphaParams = environment.disableCrgAlpha;
  auditorList = [];

  constructor(protected toastService: ToastService) {
  }

  ngOnInit() {
    if (this.formData !== undefined) {
      this.financialData = JSON.parse(this.formData.data);
      if (CustomerType[this.customerType] === CustomerType.INSTITUTION && !this.microCustomer) {
        this.isBusinessLoan = true;
      }
    }
    this.auditorList = this.financialData.auditorList;
  }

  changeActiveTab(tabs: QueryList<any>) {
    tabs.forEach(tabContent => {
      if (tabContent.active) {
        this.activeTab = tabContent['tabTitle'];
      }
    });
  }
}
