import {Component, Input, OnInit} from '@angular/core';
import {Financial} from '../../../model/financial';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {KeyIndicatorsHeaderMap} from '../../../../loan-information-template/financial/constants/key-indicators-constants';
import {environment} from '../../../../../../environments/environment';
import {Clients} from '../../../../../../environments/Clients';

@Component({
  selector: 'app-financial-risk-summary',
  templateUrl: './financial-risk-summary.component.html',
  styleUrls: ['./financial-risk-summary.component.scss']
})
export class FinancialRiskSummaryComponent implements OnInit {
  @Input() formData: Financial;

  financialData: any;

  /** Summary checklist feature **/
  summaryCheckedList = [];
  keyIndicatorsHeaderParticularsMap = KeyIndicatorsHeaderMap.KeyIndicatorsHeaderParticularMap;

  client = environment.client;
  clientName = Clients;

  constructor(protected toastService: ToastService) { }

  ngOnInit() {
    /** Summary checklist feature **/
    if (this.formData !== undefined) {
      this.financialData = JSON.parse(this.formData.data);
      try {
        this.summaryCheckedList = this.financialData.keyIndicatorsData.summaryCheckList;
      } catch (e) {
        this.toastService.show(new Alert(AlertType.WARNING, 'No existing value found for summary checklist!'));
      }
    }
  }

}
