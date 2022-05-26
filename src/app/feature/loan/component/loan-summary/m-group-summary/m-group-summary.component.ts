import {Component, Input, OnInit} from '@angular/core';
import {MGroup} from '../../../../customer/model/mGroup';
import {CustomerCategory} from '../../../../customer/model/customerCategory';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-m-group-summary',
  templateUrl: './m-group-summary.component.html',
  styleUrls: ['./m-group-summary.component.scss']
})
export class MGroupSummaryComponent implements OnInit {

  @Input() mGroup: MGroup;
  @Input() customerCategory: any;
  customerCategoryType = CustomerCategory;
  groupPosition;
  totalAmount;
  companyGroup;
  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.mGroup.groupPosition)) {
      this.groupPosition = JSON.parse(this.mGroup.groupPosition);
    }
    if (!ObjectUtil.isEmpty(this.mGroup.totalAmount)) {
      this.groupPosition = JSON.parse(this.mGroup.totalAmount);
    }
    if (!ObjectUtil.isEmpty(this.mGroup.companyGroup)) {
      this.groupPosition = JSON.parse(this.mGroup.companyGroup);
    }
  }

}
