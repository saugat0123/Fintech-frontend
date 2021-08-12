import {Component, Input, OnInit, QueryList} from '@angular/core';
import {Financial} from '../../loan/model/financial';
import {CustomerType} from '../../customer/model/customerType';
import {environment} from '../../../../environments/environment';
import {KeyIndicatorsHeaderMap} from '../../loan-information-template/financial/constants/key-indicators-constants';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {ToastService} from '../../../@core/utils';

@Component({
  selector: 'app-financial-view',
  templateUrl: './financial-view.component.html',
  styleUrls: ['./financial-view.component.scss']
})
export class FinancialViewComponent implements OnInit {

  @Input() formData: Financial;
  @Input() customerType: any;
  @Input() microFormData;
  @Input() microCustomer;
  isMicro = false;

  financialData: any;

  isBusinessLoan = false;
  activeTab: string;
  disableCrgAlphaParams = environment.disableCrgAlpha;
  auditorList = [];

  // selected ratio
  summaryCheckedList = [];
  keyIndicatorsHeaderParticularsMap = KeyIndicatorsHeaderMap.KeyIndicatorsHeaderParticularMap;

  constructor(protected toastService: ToastService) {
  }

  ngOnInit() {
    if ((this.customerType === CustomerType.INDIVIDUAL) && this.microCustomer) {
      this.financialData = JSON.parse(this.microFormData.data);
      this.isMicro = true;
    }
    if (this.formData !== undefined) {
      this.financialData = JSON.parse(this.formData.data);
      if (CustomerType[this.customerType] === CustomerType.INSTITUTION) {
        try {
          this.summaryCheckedList = this.financialData.keyIndicatorsData.summaryCheckList;
        } catch (e) {
          this.toastService.show(new Alert(AlertType.WARNING, 'No existing value found for summary checklist!'));
        }
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
