import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../../model/loanData';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-sana-disbursement-modality',
  templateUrl: './sana-disbursement-modality.component.html',
  styleUrls: ['./sana-disbursement-modality.component.scss']
})
export class SanaDisbursementModalityComponent implements OnInit {
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
