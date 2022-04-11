import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../../model/loanData';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-above-swot-analysis',
  templateUrl: './above-swot-analysis.component.html',
  styleUrls: ['./above-swot-analysis.component.scss']
})
export class AboveSwotAnalysisComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  tempData;
  swotData;
  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.loanDataHolder)) {
      this.tempData = JSON.parse(this.loanDataHolder.companyInfo.companyJsonData);
    }
    if (!ObjectUtil.isEmpty(this.tempData)) {
      this.swotData = this.tempData.swot;
    }
  }

}
