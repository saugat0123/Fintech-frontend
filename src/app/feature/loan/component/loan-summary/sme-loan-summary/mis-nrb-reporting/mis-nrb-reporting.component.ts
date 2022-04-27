import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../model/loanData';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-mis-nrb-reporting',
  templateUrl: './mis-nrb-reporting.component.html',
  styleUrls: ['./mis-nrb-reporting.component.scss']
})
export class MisNrbReportingComponent implements OnInit {
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
