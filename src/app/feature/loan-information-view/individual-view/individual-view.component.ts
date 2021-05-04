import {Component, Input, OnInit} from '@angular/core';
import {Customer} from '../../admin/modal/customer';
import {CustomerType} from '../../customer/model/customerType';
import {CalendarType} from '../../../@core/model/calendar-type';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {IndividualJsonData} from '../../admin/modal/IndividualJsonData';
import {environment as envSrdb} from '../../../../environments/environment.srdb';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {environment} from '../../../../environments/environment';
import {Clients} from '../../../../environments/Clients';

@Component({
  selector: 'app-individual-view',
  templateUrl: './individual-view.component.html',
  styleUrls: ['./individual-view.component.scss']
})
export class IndividualViewComponent implements OnInit {
  @Input() individual: Customer;
  @Input() customerInfo;
  customerType = CustomerType;
  individualJsonData: IndividualJsonData;
  @Input() customerInfoData: CustomerInfoData;
  clientType: string;
  subsectorDetail: string;

  crgLambdaDisabled = envSrdb.disableCrgLambda;
  client = environment.client;
  clientName = Clients;

  @Input() calendarType: CalendarType;

  @Input() loanId: any;
  isJointInfo = false;
  jointInfo = [];

  constructor() {
  }

  ngOnInit() {

    if (!ObjectUtil.isEmpty(this.individual)) {
      if (!ObjectUtil.isEmpty(this.individual.individualJsonData)) {
        this.individualJsonData = JSON.parse(this.individual.individualJsonData);
      }
    }
    if (!ObjectUtil.isEmpty(this.individual.jointInfo)) {
      const jointCustomerInfo = JSON.parse(this.individual.jointInfo);
      this.clientType = jointCustomerInfo.clientType;
      this.subsectorDetail = jointCustomerInfo.subsectorDetail;
      this.jointInfo.push(jointCustomerInfo.jointCustomerInfo);
      this.isJointInfo = true;
    }

  }

}
