import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CompanyInfo} from '../../admin/modal/company-info';
import {CompanyInfoService} from '../../admin/service/company-info.service';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-account-strategy',
  templateUrl: './account-strategy.component.html',
  styleUrls: ['./account-strategy.component.scss']
})
export class AccountStrategyComponent implements OnInit {
  @Input() accountStrategy;
  accountForm: FormGroup;
  isAccountEdited = false;
  companyInfo: CompanyInfo = new CompanyInfo();
  @Output() accountStrategyEmitter = new EventEmitter();
  constructor(
      private companyInfoService: CompanyInfoService,
      private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildform();
    if ( !ObjectUtil.isEmpty(this.accountStrategy)) {
      this.accountForm.get('accountStrategy').patchValue(this.accountStrategy);
    }
  }

  buildform() {
    this.accountForm = this.formBuilder.group({
      accountStrategy: [undefined]
    });
  }

  saveAccount() {
    this.isAccountEdited = false;
    this.companyInfo.accountStrategy = this.accountForm.get('accountStrategy').value;
    this.accountStrategyEmitter.emit(this.companyInfo.accountStrategy);
  }
}
