import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-above-risk-analysis',
  templateUrl: './above-risk-analysis.component.html',
  styleUrls: ['./above-risk-analysis.component.scss']
})
export class AboveRiskAnalysisComponent implements OnInit {
  @Input() customerInfo;
  tempRiskData;
  riskData;

  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerInfo)) {
      this.tempRiskData = JSON.parse(this.customerInfo.riskAnalysis);
      if (!ObjectUtil.isEmpty(this.tempRiskData)) {
        this.riskData = this.tempRiskData;
      }
    }
  }

}
