import {Component, Input, OnInit} from '@angular/core';
import {CompanyInfo} from '../../../../../admin/modal/company-info';
import {LoanDataHolder} from '../../../../model/loanData';
import {CompanyJsonData} from '../../../../../admin/modal/CompanyJsonData';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-only-business-profile',
  templateUrl: './only-business-profile.component.html',
  styleUrls: ['./only-business-profile.component.scss']
})
export class OnlyBusinessProfileComponent implements OnInit {
  @Input() companyInfo: CompanyInfo;
  @Input() loanDataHolder: LoanDataHolder;
  companyJsonData: CompanyJsonData = new CompanyJsonData();
  companyLocationData;
  projectAddress;
  correspondenceAddress;
  contact;
  accountNumbers = '';
  accountNumberList = [];
  newGuarantor = [];
  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.companyInfo)) {
      this.companyJsonData = JSON.parse(this.companyInfo.companyJsonData);
      this.companyLocationData = JSON.parse(this.companyInfo.companyLocations.address);
      this.projectAddress = JSON.parse(this.companyInfo.companyLocations.projectAddress);
      this.correspondenceAddress = JSON.parse(this.companyInfo.companyLocations.correspondenceAddress);
      this.contact = JSON.parse(this.companyInfo.contactPersons);
      if (!ObjectUtil.isEmpty(this.companyJsonData)) {
        this.companyJsonData.accountDetails.forEach((val) => {
          this.accountNumberList.push(val.accountNo);
        });
      }
    }
    if ((!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.guarantors) && this.loanDataHolder.loanHolder.guarantors.guarantorList.length > 0)) {
      this.loanDataHolder.loanHolder.guarantors.guarantorList.forEach(val => {
        if (val.guarantorType === 'Promoter' || val.guarantorType === 'Partner' || val.guarantorType === 'Proprietor' ||
            val.guarantorType === 'Shareholder') {
          this.newGuarantor.push(val);
        }
      });
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
