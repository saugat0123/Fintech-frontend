import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../../model/loanData';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-above-background-of-customer',
  templateUrl: './above-background-of-customer.component.html',
  styleUrls: ['./above-background-of-customer.component.scss']
})
export class AboveBackgroundOfCustomerComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  tempData;
  legalStatusData;
  companyJson;
  teamList = [];
  constructor() { }

  ngOnInit() {
    console.log('this.tempData', this.loanDataHolder);
    if (!ObjectUtil.isEmpty(this.loanDataHolder)) {
      this.tempData = this.loanDataHolder.companyInfo;
      if (!ObjectUtil.isEmpty(this.tempData)) {
        this.legalStatusData = this.tempData.legalStatus;
        this.companyJson = JSON.parse(this.tempData.companyJsonData);
      }
      if (!ObjectUtil.isEmpty(this.companyJson)) {
        this.teamList = this.companyJson.managementTeamList;
      }
    }
  }

}
