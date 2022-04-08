import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../../model/loanData';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-sana-assessment-for-requirement-of-fund',
  templateUrl: './sana-assessment-for-requirement-of-fund.component.html',
  styleUrls: ['./sana-assessment-for-requirement-of-fund.component.scss']
})
export class SanaAssessmentForRequirementOfFundComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  tempData;
  proposalData;

  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.loanDataHolder)) {
      this.tempData = this.loanDataHolder.proposal;
      if (!ObjectUtil.isEmpty(this.tempData.data)) {
        this.proposalData = JSON.parse(this.tempData.data);
      }
    }
  }

}
