import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {AffiliateId} from '../../../../../@core/utils/constants/affiliateId';

@Component({
  selector: 'app-income-from-account-summery',
  templateUrl: './income-from-account-summery.component.html',
  styleUrls: ['./income-from-account-summery.component.scss']
})
export class IncomeFromAccountSummeryComponent implements OnInit {
  @Input() formData;
  incomeFromAccount;
  newCustomerFlag: boolean[];
  groupProfitabilityData = [];

  constructor() {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.formData)) {
      this.incomeFromAccount = JSON.parse(this.formData.data);
      if (!ObjectUtil.isEmpty(this.incomeFromAccount.groupProfitability)) {
        this.groupProfitabilityData = [];
        this.groupProfitabilityData = this.incomeFromAccount.groupProfitability;
      }
      this.newCustomerFlag = this.incomeFromAccount.newCustomerChecked;
    }
  }

}
