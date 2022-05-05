import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {LoanDataHolder} from '../../../../model/loanData';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {ShareSecurity} from '../../../../../admin/modal/shareSecurity';

@Component({
  selector: 'app-executive-summary-sme',
  templateUrl: './executive-summary-sme.component.html',
  styleUrls: ['./executive-summary-sme.component.scss']
})
export class ExecutiveSummarySmeComponent implements OnInit, OnChanges {
  @Input() loanDataHolder: LoanDataHolder;
  @Input() customerAllLoanList: LoanDataHolder[];
  @Input() totalProposed;
  securityData: Object;
  shareSecurityData: ShareSecurity = new ShareSecurity();
  jsonData;

  constructor() { }

  ngOnInit() {
    const data = this.customerAllLoanList;
    console.log('data', data);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('second parent', this.customerAllLoanList);
    if (!ObjectUtil.isEmpty(this.loanDataHolder.security)) {
      this.securityData = JSON.parse(this.loanDataHolder.security.data);
    }
    if (!ObjectUtil.isEmpty(this.loanDataHolder.shareSecurity)) {
      this.shareSecurityData = JSON.parse(this.loanDataHolder.shareSecurity.data);
    }
    if (!ObjectUtil.isEmpty(this.loanDataHolder.companyInfo)) {
      this.jsonData = this.loanDataHolder.companyInfo.companyJsonData;
    }
  }

}
