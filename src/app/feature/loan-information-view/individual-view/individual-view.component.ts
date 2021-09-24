import {Component, Input, OnInit} from '@angular/core';
import {Customer} from '../../admin/modal/customer';
import {CustomerType} from '../../customer/model/customerType';
import {CalendarType} from '../../../@core/model/calendar-type';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {IndividualJsonData} from '../../admin/modal/IndividualJsonData';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {environment} from '../../../../environments/environment';
import {Clients} from '../../../../environments/Clients';
import {SummaryType} from '../../loan/component/SummaryType';

@Component({
  selector: 'app-individual-view',
  templateUrl: './individual-view.component.html',
  styleUrls: ['./individual-view.component.scss']
})
export class IndividualViewComponent implements OnInit {
  @Input() individual: Customer;
  @Input() customerInfo;
  @Input() customerInfoData: CustomerInfoData;
  @Input() calendarType: CalendarType;
  @Input() loanId: any;
  customerType = CustomerType;
  individualJsonData: IndividualJsonData;
  clientType: string;
  subsectorDetail: string;
  crgLambdaDisabled = environment.disableCrgLambda;
  client = environment.client;
  clientName = Clients;
  isJointInfo = false;
  jointInfo = [];
  riskInfo: any;
  age: number;
  summaryType = environment.summaryType;
  summaryTypeName = SummaryType;
  otherData = {
    otherIncomeData: false,
    otherOccupationData: false,
  };

  constructor() {
  }

  ngOnInit() {

    if (!ObjectUtil.isEmpty(this.individual)) {
      if (!ObjectUtil.isEmpty(this.individual.individualJsonData)) {
        this.individualJsonData = JSON.parse(this.individual.individualJsonData);
      }
      if (!ObjectUtil.isEmpty(this.individual.incomeSource || this.individual.occupation)) {
        const income = JSON.parse(this.individual.incomeSource);
        const occupation = JSON.parse(this.individual.occupation);
        occupation.multipleOccupation.forEach(t => {
          if (t === 'Other') {
            this.otherData.otherOccupationData = true;
          }
        });
        income.multipleIncome.forEach(t => {
          if (t === 'Other') {
            this.otherData.otherIncomeData = true;
          }
        });
      }
    }
    if (!ObjectUtil.isEmpty(this.individual.jointInfo)) {
      const jointCustomerInfo = JSON.parse(this.individual.jointInfo);
      this.riskInfo = jointCustomerInfo;
      this.clientType = jointCustomerInfo.clientType;
      this.subsectorDetail = jointCustomerInfo.subsectorDetail;
      this.jointInfo.push(jointCustomerInfo.jointCustomerInfo);
      this.isJointInfo = true;
    }

  }

  calculateAge(dob) {
    const difference = Math.abs(Date.now() - new Date(dob).getTime());
    this.age = Math.floor((difference / (1000 * 3600 * 24)) / 365);
    return this.age;
  }

}
