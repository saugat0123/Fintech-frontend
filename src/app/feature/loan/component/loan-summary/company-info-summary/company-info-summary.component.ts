import {Component, Input, OnInit} from '@angular/core';
import {CompanyInfo} from '../../../../admin/modal/company-info';
import {BusinessType} from '../../../../admin/modal/businessType';
import {CompanyJsonData} from '../../../../admin/modal/CompanyJsonData';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {LoanDataHolder} from '../../../model/loanData';
import {environment} from '../../../../../../environments/environment';
import {Clients} from '../../../../../../environments/Clients';
import {Guarantor} from '../../../model/guarantor';

@Component({
  selector: 'app-company-info-summary',
  templateUrl: './company-info-summary.component.html',
  styleUrls: ['./company-info-summary.component.scss']
})
export class CompanyInfoSummaryComponent implements OnInit {
  @Input() companyInfo: CompanyInfo;
  @Input() loanDataHolder: LoanDataHolder;
  newGuarantor = [];
  businessType = BusinessType;
  companyJsonData: CompanyJsonData = new CompanyJsonData();
  contact = [];
  additionalInfoJsonData;
  companyLocationData;
  projectAddress;
  correspondenceAddress;
  @Input() approveSheet;
  client = environment.client;
  clientName = Clients;
  accountNumberList = [];
  accountNumbers;
  insurance;
  thisClient;
  check = false;
  checkedData;
  constructor() { }

  ngOnInit() {
    this.thisClient = this.loanDataHolder.loanHolder.clientType;
    if (this.thisClient === 'CORPORATE' || this.thisClient === 'INFRASTRUCTURE_AND_PROJECT' ||
        this.thisClient === 'MID_MARKET' || this.thisClient === 'BUSINESS_DEVELOPMENT') {
      this.check = true;
    }
    if (!ObjectUtil.isEmpty(this.loanDataHolder.proposal)) {
      this.checkedData = JSON.parse(this.loanDataHolder.proposal.checkedData);
      // this.proposalAllData = JSON.parse(this.loanDataHolder.proposal.data);
    }
    this.insurance = this.loanDataHolder.insurance;
    if (!ObjectUtil.isEmpty(this.loanDataHolder) && !ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.guarantors) &&
        (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.guarantors.guarantorList) &&
            this.loanDataHolder.loanHolder.guarantors.guarantorList.length > 0)) {
      this.loanDataHolder.loanHolder.guarantors.guarantorList.forEach(val => {
        if (val.guarantorType === 'Promoter' || val.guarantorType === 'Partner' || val.guarantorType === 'Proprietor' || val.guarantorType === 'Shareholder') {
          this.newGuarantor.push(val);
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.companyJsonData)) {
      this.companyJsonData = JSON.parse(this.companyInfo.companyJsonData);
      this.companyLocationData = JSON.parse(this.companyInfo.companyLocations.address);
      this.projectAddress = JSON.parse(this.companyInfo.companyLocations.projectAddress);
      this.correspondenceAddress = JSON.parse(this.companyInfo.companyLocations.correspondenceAddress);
      this.contact = JSON.parse(this.companyInfo.contactPersons);
    }
      if (!ObjectUtil.isEmpty(this.companyInfo)) {
        const customerData = JSON.parse(this.companyInfo.companyJsonData);
        if (!ObjectUtil.isEmpty(customerData)) {
          customerData.accountDetails.forEach((val) => {
            this.accountNumberList.push(val.accountNo);
          });
        }
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
