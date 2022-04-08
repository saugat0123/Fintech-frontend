import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../../model/loanData';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-sana-repayment-modality',
  templateUrl: './sana-repayment-modality.component.html',
  styleUrls: ['./sana-repayment-modality.component.scss']
})
export class SanaRepaymentModalityComponent implements OnInit {
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
