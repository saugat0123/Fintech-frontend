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
  @Input() proposalData;
  clientType: string;
  subsectorDetail: string;
  financialData: Financial = new Financial();
  crgLambdaDisabled = environment.disableCrgLambda;
  client = environment.client;
  clientName = Clients;

  @Input() calendarType: CalendarType;
  dbr;
  @Input() loanId: any;
  isJointInfo = false;
  jointInfo = [];
  riskInfo: any;
  age: number;
  isRemit = false;
  beneficiary;
  senderDetails;
  proposalAllData;
  accountNumberList = [];
  accountNumbers;

  constructor() {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.individual)) {
      if (!ObjectUtil.isEmpty(this.individual.individualJsonData)) {
        this.individualJsonData = JSON.parse(this.individual.individualJsonData);
      }
    }
    if (!ObjectUtil.isEmpty(this.individual)) {
      if (this.individual.jointInfo) {
        const jointCustomerInfo = JSON.parse(this.individual.jointInfo);
        this.riskInfo = jointCustomerInfo;
        this.clientType = jointCustomerInfo.clientType;
        this.subsectorDetail = jointCustomerInfo.subsectorDetail;
        this.jointInfo.push(jointCustomerInfo.jointCustomerInfo);
        this.isJointInfo = true;
      }
    }
    if (!ObjectUtil.isEmpty(this.proposalData)) {
      this.proposalAllData = JSON.parse(this.loanDataHolder.proposal.data);
    }
    if (this.loanDataHolder.loan.loanTag === LoanTag.getKeyByValue(LoanTag.REMIT_LOAN) && this.loanDataHolder.loan.isRemit) {
      this.isRemit = true;
      if (this.isRemit) {
        this.beneficiary = JSON.parse(this.loanDataHolder.remitCustomer.beneficiaryData);
        this.senderDetails = JSON.parse(this.loanDataHolder.remitCustomer.senderData);
      }
    }
    if (!ObjectUtil.isEmpty(this.loanDataHolder.financial)) {
      this.financialData = this.loanDataHolder.financial;
    }
    if (!ObjectUtil.isEmpty(this.loanDataHolder.customerInfo)) {
      const customerData = JSON.parse(this.loanDataHolder.customerInfo.individualJsonData);
      if (!ObjectUtil.isEmpty(customerData)) {
        customerData.accountDetails.forEach((val) => {
          this.accountNumberList.push(val.accountNo);
        });
      }
    }
    this.calculateEmiEqiAmount();
  }

  calculateAge(dob) {
    const difference = Math.abs(Date.now() - new Date(dob).getTime());
    this.age = Math.floor((difference / (1000 * 3600 * 24)) / 365);
    return this.age;
  }
  calculateEmiEqiAmount() {
    const proposedAmount = this.loanDataHolder.proposal.proposedLimit;
    const rate = Number(this.loanDataHolder.loan.interestRate) / (12 * 100);
    const n = this.loanDataHolder.proposal.tenureDurationInMonths;
    const emi = Number((proposedAmount * rate * Math.pow(1 + rate, n)) / Number(Math.pow(1 + rate, n) - 1));
    if (this.isRemit) {
      this.dbr = emi / JSON.parse(this.loanDataHolder.remitCustomer.senderData).senderEmployment.monthly_salary;
    }
  }

  getAccountNumber(accountNumberList) {
    let accountNumber = '';
    if (accountNumberList.length === 1) {
      accountNumber = accountNumberList[0];
    }
    if (accountNumberList.length === 2) {
      accountNumber = accountNumberList.join(' and ');
    }
    if (accountNumberList.length > 2) {
      for (let i = 0; i < accountNumberList.length - 1; i++) {
        this.accountNumbers = accountNumberList.join(' , ');
      }
      const tempData = accountNumberList[accountNumberList.length - 1];
      accountNumber = this.accountNumbers + ' and ' + tempData;
    }
    return accountNumber ? accountNumber : '';
  }
}
