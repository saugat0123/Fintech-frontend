import { Component, OnInit, Input } from '@angular/core';
import {MGroup} from '../../../../../../customer/model/mGroup';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-above-group-exposure-with-ccbl',
  templateUrl: './above-group-exposure-with-ccbl.component.html',
  styleUrls: ['./above-group-exposure-with-ccbl.component.scss']
})
export class AboveGroupExposureWithCcblComponent implements OnInit {
  @Input() mGroup: MGroup;
  exposureCcbl: any;
  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.mGroup) && !ObjectUtil.isEmpty(this.mGroup.detailInformation)) {
      this.exposureCcbl = this.mGroup.detailInformation;
    }
  }

}
