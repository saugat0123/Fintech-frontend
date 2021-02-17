import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-micro-basel-risk-exposure-summary',
  templateUrl: './micro-basel-risk-exposure-summary.component.html',
  styleUrls: ['./micro-basel-risk-exposure-summary.component.scss']
})
export class MicroBaselRiskExposureSummaryComponent implements OnInit {
  @Input() baselRiskData;
  baselRiskExposure;

  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.baselRiskData)) {
      this.baselRiskExposure = JSON.parse(this.baselRiskData.data);
    }
  }

}
