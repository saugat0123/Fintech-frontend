import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-above-risk-analysis',
  templateUrl: './above-risk-analysis.component.html',
  styleUrls: ['./above-risk-analysis.component.scss']
})
export class AboveRiskAnalysisComponent implements OnInit {
  @Input() companyInfo;
  tempCompanyData;
  riskData;

  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.companyInfo)) {
      this.tempCompanyData = JSON.parse(this.companyInfo.companyJsonData);
      if (!ObjectUtil.isEmpty(this.tempCompanyData)) {
        this.riskData = JSON.parse(this.tempCompanyData.businessManagementRisk);
      }
    }
  }

}
