import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {MultiBanking} from '../../../model/multiBanking';

@Component({
  selector: 'app-multi-banking-summary',
  templateUrl: './multi-banking-summary.component.html',
  styleUrls: ['./multi-banking-summary.component.scss']
})
export class MultiBankingSummaryComponent implements OnInit {
  @Input() formData: MultiBanking;
  multiBankingData;

  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.formData)) {
      this.multiBankingData = JSON.parse(this.formData.data);
    }
  }

}
