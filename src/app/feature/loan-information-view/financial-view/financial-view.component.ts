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
  @Input() customerType: any;
  @Input() microCustomer;
  isMicro = false;
  financialData: any;
  isBusinessLoan = false;
  activeTab: string;
  disableCrgAlphaParams = environment.disableCrgAlpha;
  auditorList = [];
  financialKeys;

  constructor(protected toastService: ToastService) {
  }

  ngOnInit() {
    if (this.formData !== undefined) {
      if (this.formData.uploadExcel) {
            if (!ObjectUtil.isEmpty(this.formData.excelData)) {
              this.financialData = JSON.parse(this.formData.excelData);
              this.financialKeys = Object.keys(this.financialData);
            }
      } else {
        this.financialData = JSON.parse(this.formData.data);
      }
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
