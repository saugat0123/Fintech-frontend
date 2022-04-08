import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../../model/loanData';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-sana-mis-nrb-reporting',
  templateUrl: './sana-mis-nrb-reporting.component.html',
  styleUrls: ['./sana-mis-nrb-reporting.component.scss']
})
export class SanaMisNrbReportingComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  tempData = [];
  tempData1 = [];
  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.loanDataHolder)) {
      if (!ObjectUtil.isEmpty(this.loanDataHolder.reportingInfoLevels)) {
        this.tempData = this.loanDataHolder.reportingInfoLevels;
      }
      if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder)) {
        this.tempData1 = this.loanDataHolder.loanHolder.reportingInfoLevels;
      }
    }
  }

}
