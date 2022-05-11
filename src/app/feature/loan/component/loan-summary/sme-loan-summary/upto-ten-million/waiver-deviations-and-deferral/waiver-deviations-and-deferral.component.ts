import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../../model/loanData';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-waiver-deviations-and-deferral',
  templateUrl: './waiver-deviations-and-deferral.component.html',
  styleUrls: ['./waiver-deviations-and-deferral.component.scss']
})
export class WaiverDeviationsAndDeferralComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  tempData;
  proposalData;
  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.loanDataHolder)) {
      this.tempData = this.loanDataHolder.proposal;
      if (!ObjectUtil.isEmpty(this.tempData.data)) {
        this.proposalData = JSON.parse(this.tempData.data);
        console.log('proposalData', this.proposalData);
      }
    }
  }

}
