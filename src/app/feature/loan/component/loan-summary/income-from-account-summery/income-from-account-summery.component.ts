import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {AffiliateId} from '../../../../../@core/utils/constants/affiliateId';
import {environment} from '../../../../../../environments/environment';
import {SummaryType} from '../../SummaryType';

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
  summaryType = environment.summaryType;
  summaryTypeName = SummaryType;
  incomeFromAccountArray;

  constructor() {
  }

  ngOnInit() {
    if (LocalStorageUtil.getStorage().bankUtil.AFFILIATED_ID === AffiliateId.SRDB) {
      this.srdbAffiliatedId = true;
    }
    if (!ObjectUtil.isEmpty(this.formData)) {
      const data = [];
      this.incomeFromAccount = JSON.parse(this.formData.data);
      if (this.incomeFromAccount.incomeFromAccount) {
        this.incomeFromAccount.incomeFromAccount.forEach(item => {
          data.push(item);
        });
      } else {
        data.push(this.incomeFromAccount);
      }
      this.incomeFromAccountArray = data;
    }
  }

}
