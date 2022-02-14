import {Component, Input, OnInit} from '@angular/core';
import {Proposal} from '../../../admin/modal/proposal';
import {Security} from '../../model/security';
import {LoanDataHolder} from '../../model/loanData';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-security-schedule',
    templateUrl: './security-schedule.component.html',
    styleUrls: ['./security-schedule.component.scss']
})
export class SecurityScheduleComponent implements OnInit {

  constructor() {
  }

  @Input() loanDataHolder: LoanDataHolder;
  securityData: Security;
  files;
  fixedAssets: number;
  proposal: Proposal;

  ngOnInit() {
    this.proposal = this.loanDataHolder.proposal;
    if (!ObjectUtil.isEmpty(this.proposal.data)) {
      if (!ObjectUtil.isEmpty(JSON.parse(this.proposal.data).files)) {
        this.files = JSON.parse(JSON.parse(this.proposal.data).files);
      }
    }
    this.fixedAssets = this.loanDataHolder.security.totalSecurityAmount - Number((JSON.parse(this.proposal.data).proposedLimit));
    if (this.fixedAssets < 0) {
      this.fixedAssets = Math.abs(this.fixedAssets);
    } else {
      this.fixedAssets = 0;
    }
    console.log('this is security form data', this.fixedAssets);
    console.log('this is security form data', this.proposal);
  }
}

