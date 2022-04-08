import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../../model/loanData';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-sana-security-arrangement',
  templateUrl: './sana-security-arrangement.component.html',
  styleUrls: ['./sana-security-arrangement.component.scss']
})
export class SanaSecurityArrangementComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  loanData;
  landDataList = [];
  insuranceList = [];
  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.loanDataHolder)) {
      this.loanData = this.loanDataHolder.security;
      if (!ObjectUtil.isEmpty(this.loanData.data)) {
        const data = JSON.parse(this.loanData.data);
        this.landDataList = data.initialForm.landDetails;
      }
    }
    if (!ObjectUtil.isEmpty(this.loanDataHolder.insurance)) {
      this.insuranceList = this.loanDataHolder.insurance;
    }
  }

}
