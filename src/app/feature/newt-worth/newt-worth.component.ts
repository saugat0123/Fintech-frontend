import {Component, Input, OnInit} from '@angular/core';
import {Proposal} from '../admin/modal/proposal';
import {ObjectUtil} from '../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-newt-worth',
  templateUrl: './newt-worth.component.html',
  styleUrls: ['./newt-worth.component.scss']
})
export class NewtWorthComponent implements OnInit {

  constructor() {
  }

  @Input() proposal: Proposal;
  individualJsonData;
  mergedChecked;

  ngOnInit() {
    this.individualJsonData = JSON.parse(this.proposal.data);
    this.mergedChecked = JSON.parse(this.proposal.checkedData);
    if (!ObjectUtil.isEmpty(this.mergedChecked)) {
      if (this.mergedChecked.netChecked) {
        if (this.individualJsonData.deposit.length < 1) {
          if (!ObjectUtil.isEmpty(this.individualJsonData.depositBank)) {
            this.individualJsonData.deposit.push({
              amount: this.individualJsonData.depositBank,
              assets: this.individualJsonData.depositBankRemark
            });
          }
          if (!ObjectUtil.isEmpty(this.individualJsonData.depositOther)) {
            this.individualJsonData.deposit.push({
              amount: this.individualJsonData.depositOther,
              assets: this.individualJsonData.depositOtherRemark
            });
          }
        }
      }

    }
  }

}
