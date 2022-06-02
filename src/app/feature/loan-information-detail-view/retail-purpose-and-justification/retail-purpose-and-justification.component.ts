import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../loan/model/loanData';
import {Proposal} from '../../admin/modal/proposal';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-retail-purpose-and-justification',
  templateUrl: './retail-purpose-and-justification.component.html',
  styleUrls: ['./retail-purpose-and-justification.component.scss']
})
export class RetailPurposeAndJustificationComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  @Input() proposalData: Proposal;
  proposalAllData;
  checkedData;
  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.proposalData)) {
      this.proposalAllData = JSON.parse(this.proposalData.data);
      this.checkedData = JSON.parse(this.proposalData.checkedData);
    }
  }
}
