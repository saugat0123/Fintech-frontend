import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-income-from-account-summery',
  templateUrl: './income-from-account-summery.component.html',
  styleUrls: ['./income-from-account-summery.component.scss']
})
export class IncomeFromAccountSummeryComponent implements OnInit {
  @Input() formData;
  incomeFromAccount;

  constructor() {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.formData)) {
      this.incomeFromAccount = JSON.parse(this.formData.data);
    }
  }

}
