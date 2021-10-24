import {Component, Input, OnInit} from '@angular/core';
import {Customer} from '../../admin/modal/customer';
import {CustomerType} from '../../customer/model/customerType';
import {CalendarType} from '../../../@core/model/calendar-type';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {IndividualJsonData} from '../../admin/modal/IndividualJsonData';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {environment} from '../../../../environments/environment';
import {Clients} from '../../../../environments/Clients';
import {LoanDataHolder} from '../../loan/model/loanData';
import {LoanTag} from '../../loan/model/loanTag';
import {Financial} from '../../loan/model/financial';

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
  @Input() loanDataHolder: LoanDataHolder;
  clientType: string;
  subsectorDetail: string;
  financialData: Financial = new Financial();
  crgLambdaDisabled = environment.disableCrgLambda;
  client = environment.client;
  clientName = Clients;

  @Input() calendarType: CalendarType;

  @Input() loanId: any;
  isJointInfo = false;
  jointInfo = [];
  riskInfo: any;
  age: number;
  isRemit = false;
  beneficiary;

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
      this.riskInfo = jointCustomerInfo;
      this.clientType = jointCustomerInfo.clientType;
      this.subsectorDetail = jointCustomerInfo.subsectorDetail;
      this.jointInfo.push(jointCustomerInfo.jointCustomerInfo);
      this.isJointInfo = true;
    }
    if (this.loanDataHolder.loan.loanTag === LoanTag.getKeyByValue(LoanTag.REMIT_LOAN)) {
      this.isRemit = true;
      if (this.isRemit) {
        this.beneficiary = JSON.parse(this.loanDataHolder.remitCustomer.beneficiaryData);
      }
    }
    if (!ObjectUtil.isEmpty(this.loanDataHolder.financial)) {
      this.financialData = this.loanDataHolder.financial;
    }
  }

  calculateAge(dob) {
    const difference = Math.abs(Date.now() - new Date(dob).getTime());
    this.age = Math.floor((difference / (1000 * 3600 * 24)) / 365);
    return this.age;
  }

}
