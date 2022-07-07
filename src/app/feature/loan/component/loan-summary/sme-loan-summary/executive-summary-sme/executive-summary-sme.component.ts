import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../model/loanData';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {ShareSecurity} from '../../../../../admin/modal/shareSecurity';

@Component({
  selector: 'app-executive-summary-sme',
  templateUrl: './executive-summary-sme.component.html',
  styleUrls: ['./executive-summary-sme.component.scss']
})
export class ExecutiveSummarySmeComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  @Input() customerAllLoanList: LoanDataHolder[];
  @Input() totalProposed;
  @Input() isDetailedView: boolean;
  securityData: Object;
  shareSecurityData: ShareSecurity = new ShareSecurity();
  jsonData;
  data;
  approveAuth;
  financialCCBL;

  constructor() { }

  ngOnInit() {
    // this.data = JSON.parse(this.loanDataHolder.loanHolder.commonLoanData);
    if (!ObjectUtil.isEmpty(this.data)) {
      this.approveAuth = this.data.approvingAuthority;
    }
    if (!ObjectUtil.isEmpty(this.loanDataHolder.security)) {
      this.securityData = JSON.parse(this.loanDataHolder.security.data);
    }
    if (!ObjectUtil.isEmpty(this.loanDataHolder.shareSecurity)) {
      this.shareSecurityData = JSON.parse(this.loanDataHolder.shareSecurity.data);
    }
    if (!ObjectUtil.isEmpty(this.loanDataHolder.companyInfo)) {
      this.jsonData = this.loanDataHolder.companyInfo.companyJsonData;
    }
    if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.financialCcbl)) {
      this.financialCCBL = JSON.parse(this.loanDataHolder.loanHolder.financialCcbl);
    }
  }

}
