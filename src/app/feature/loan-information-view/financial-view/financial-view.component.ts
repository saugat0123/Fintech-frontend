import {Component, Input, OnInit, QueryList} from '@angular/core';
import {Financial} from '../../loan/model/financial';
import {CustomerType} from '../../customer/model/customerType';
import {environment} from '../../../../environments/environment';
import {Clients} from '../../../../environments/Clients';
import {KeyIndicatorsHeaderMap} from '../../loan-information-template/financial/constants/key-indicators-constants';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {ToastService} from '../../../@core/utils';
import {SummaryType} from '../../loan/component/SummaryType';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-financial-view',
  templateUrl: './financial-view.component.html',
  styleUrls: ['./financial-view.component.scss']
})
export class FinancialViewComponent implements OnInit {

  @Input() formData: Financial;
  @Input() customerType: any;
  activeClientIsMega = true;
  @Input() microFormData;
  @Input() microCustomer;
  isMicro = false;
  financialData: any;
  isBusinessLoan = false;
  activeTab: string;
  disableCrgAlphaParams = environment.disableCrgAlpha;
  client = environment.client;
  clientName = Clients;
  auditorList = [];
  summaryType = environment.summaryType;
  summaryTypeName = SummaryType;

  // selected ratio
  summaryCheckedList = [];
  keyIndicatorsHeaderParticularsMap = KeyIndicatorsHeaderMap.KeyIndicatorsHeaderParticularMap;

  constructor(protected toastService: ToastService) {
  }

  ngOnInit() {
    this.activeClientIsMega = environment.client === Clients.MEGA;
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

  public isNumber(value) {
    if (ObjectUtil.isEmpty(value)) {
      return 0;
    }
    if (Number.isNaN(value)) {
      return 0;
    } else {
      return value;
    }

  }

  public twoDecimalDigit(value) {
    const number = this.isNumber(value);
    return parseFloat(number).toFixed(2);
  }

  Number(s: string) {
    return this.isNumber(s);
  }
}
