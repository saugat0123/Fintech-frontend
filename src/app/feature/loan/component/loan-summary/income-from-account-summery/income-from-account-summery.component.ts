import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {AffiliateId} from '../../../../../@core/utils/constants/affiliateId';
import {environment} from '../../../../../../environments/environment';
import {SummaryType} from '../../SummaryType';
import {Clients} from '../../../../../../environments/Clients';

@Component({
  selector: 'app-income-from-account-summery',
  templateUrl: './income-from-account-summery.component.html',
  styleUrls: ['./income-from-account-summery.component.scss']
})
export class IncomeFromAccountSummeryComponent implements OnInit {
  @Input() formData;
  @Input() count;
  incomeFromAccount;
  srdbAffiliatedId = false;
  newCustomerFlag: boolean[];
  summaryType = environment.summaryType;
  summaryTypeName = SummaryType;
  client = environment.client;
  clientName = Clients;

  constructor() {
  }

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
