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
  riskDataFree: boolean;
  industryVisible = false;
  businessVisible = false;
  financialVisible = false;
  managementVisible = false;
  successionVisible = false;
  environmentVisible = false;
  adverseVisible = false;
  politicalVisible = false;

  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerInfo)) {
      this.tempRiskData = JSON.parse(this.customerInfo.riskAnalysis);
      if (!ObjectUtil.isEmpty(this.tempRiskData)) {
        this.riskData = this.tempRiskData;
        if (!ObjectUtil.isEmpty(this.tempRiskData.riskAnalysisFreeText)) {
          this.riskDataFree = true;
        }
      }
      if (!ObjectUtil.isEmpty(this.riskData)) {
        if (!ObjectUtil.isEmpty(this.riskData.industryRisk) || !ObjectUtil.isEmpty(this.riskData.industryFactor)) {
          this.industryVisible = true;
        } else {
          this.industryVisible = false;
        }
        if (!ObjectUtil.isEmpty(this.riskData.businessRisk) || !ObjectUtil.isEmpty(this.riskData.businessFactor)) {
          this.businessVisible = true;
        } else {
          this.businessVisible = false;
        }
        if (!ObjectUtil.isEmpty(this.riskData.financialRisk) || !ObjectUtil.isEmpty(this.riskData.financialFactor)) {
          this.financialVisible = true;
        } else {
          this.financialVisible = false;
        }
        if (!ObjectUtil.isEmpty(this.riskData.managementRisk) || !ObjectUtil.isEmpty(this.riskData.managementFactor)) {
          this.managementVisible = true;
        } else {
          this.managementVisible = false;
        }
        if (!ObjectUtil.isEmpty(this.riskData.successionRisk) || !ObjectUtil.isEmpty(this.riskData.successionFactor)) {
          this.successionVisible = true;
        } else {
          this.successionVisible = false;
        }
        if (!ObjectUtil.isEmpty(this.riskData.environmentalIssues) || !ObjectUtil.isEmpty(this.riskData.environmentalIssuesFactor)) {
          this.environmentVisible = true;
        } else {
          this.environmentVisible = false;
        }
        if (!ObjectUtil.isEmpty(this.riskData.adverseFeatures) || !ObjectUtil.isEmpty(this.riskData.adverseFeaturesFactor)) {
          this.adverseVisible = true;
        } else {
          this.adverseVisible = false;
        }
        if (!ObjectUtil.isEmpty(this.riskData.politicalRisk) || !ObjectUtil.isEmpty(this.riskData.politicalFactor)) {
          this.politicalVisible = true;
        } else {
          this.politicalVisible = false;
        }
      }
    }
  }

}
