import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-above-swot-analysis',
  templateUrl: './above-swot-analysis.component.html',
  styleUrls: ['./above-swot-analysis.component.scss']
})
export class AboveSwotAnalysisComponent implements OnInit {
  @Input() customerInfo;
  tempSwotData;
  swotData;
  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerInfo)) {
      this.tempSwotData = JSON.parse(this.customerInfo.swotAnalysis);
      if (!ObjectUtil.isEmpty(this.tempSwotData)) {
        this.swotData = this.tempSwotData;
      }
    }
  }

}
