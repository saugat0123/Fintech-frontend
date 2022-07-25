import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-remit-profile',
  templateUrl: './remit-profile.component.html',
  styleUrls: ['./remit-profile.component.scss']
})
export class RemitProfileComponent implements OnInit {

  constructor() { }

  @Input() loanHolder;
  @Input() isRemit;
  @Input() individual;
  remit: any;
  agentDetails: any;
  beneficiaryDetails: any;
  senderDetails: any;
  documentDetails: any;
  isNull = true;
  newDocDetails = [];
  province;
  district;
  municipality;
  isLoaded = false;
  isJointInfo = false;
  jointInfo = [];
  accountNumberList = [];
  accountNumbers;
  ngOnInit() {
    this.remit = this.loanHolder.remitCustomer;
    if (!ObjectUtil.isEmpty(this.remit)) {
      this.isNull = false;
      this.agentDetails = JSON.parse(this.remit.agentData);
      this.senderDetails = JSON.parse(this.remit.senderData);
      this.beneficiaryDetails = JSON.parse(this.remit.beneficiaryData);
      this.documentDetails = JSON.parse(this.remit.remitFilePathData);
    }
    if (!ObjectUtil.isEmpty(this.documentDetails)) {
      this.documentDetails.forEach((data, i) => {
        if (data instanceof Array) {
        } else {
          this.newDocDetails.push(data);
        }
      });
    }
    if (this.loanHolder.loanCategory === 'INDIVIDUAL' &&
        !ObjectUtil.isEmpty(this.loanHolder.customerInfo)) {
      if (this.loanHolder.customerInfo.jointInfo) {
        const jointCustomerInfo = JSON.parse(this.loanHolder.customerInfo.jointInfo);
        this.jointInfo.push(jointCustomerInfo.jointCustomerInfo);
        this.isJointInfo = true;
      }
      const customerData = JSON.parse(this.loanHolder.customerInfo.individualJsonData);
      if (!ObjectUtil.isEmpty(customerData)) {
        customerData.accountDetails.forEach((val) => {
          this.accountNumberList.push(val.accountNo);
        });
      }
    }
  }
  calculateAge(dob) {
    const difference = Math.abs(Date.now() - new Date(dob).getTime());
    const age = Math.floor((difference / (1000 * 3600 * 24)) / 365);
    return age;
  }
  opendocument(filePath: any) {
    const fileName = filePath.fullpath;
    const link = document.createElement('a');
    link.href = fileName;
    link.target = '_blank';
    link.click();
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
