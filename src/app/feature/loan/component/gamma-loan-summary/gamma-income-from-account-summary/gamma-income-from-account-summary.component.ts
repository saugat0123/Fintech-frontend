import {Component, Input, OnInit} from '@angular/core';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {AffiliateId} from '../../../../../@core/utils/constants/affiliateId';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-gamma-income-from-account-summary',
  templateUrl: './gamma-income-from-account-summary.component.html',
  styleUrls: ['./gamma-income-from-account-summary.component.scss']
})
export class GammaIncomeFromAccountSummaryComponent implements OnInit {
  @Input() formData;
  @Input() loanDataHolder;
  incomeFromAccount;
  srdbAffiliatedId = false;
  newCustomerFlag: boolean[];

  constructor() { }

  ngOnInit() {
    if (LocalStorageUtil.getStorage().bankUtil.AFFILIATED_ID === AffiliateId.SRDB) {
      this.srdbAffiliatedId = true;
    }
    if (!ObjectUtil.isEmpty(this.formData)) {
      this.incomeFromAccount = JSON.parse(this.formData.data);
      this.newCustomerFlag = this.incomeFromAccount.newCustomerChecked;
    }
  }
}
