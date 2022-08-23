import {Component, Input, OnInit} from '@angular/core';
import {MGroup} from '../../../../customer/model/mGroup';
import {CustomerCategory} from '../../../../customer/model/customerCategory';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CustomerType} from '../../../../customer/model/customerType';
import {DefaultTable} from '../../../model/defaultTable';

@Component({
  selector: 'app-m-group-summary',
  templateUrl: './m-group-summary.component.html',
  styleUrls: ['./m-group-summary.component.scss']
})
export class MGroupSummaryComponent implements OnInit {

  @Input() mGroup: MGroup;
  @Input() customerCategory: any;
  @Input() customerType: CustomerType;
  customerCategoryType = CustomerCategory;
  groupPosition;
  totalAmount;

  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.mGroup)) {
      if (!ObjectUtil.isEmpty(this.mGroup.groupPosition)) {
        this.groupPosition = JSON.parse(this.mGroup.groupPosition);
      }
      if (!ObjectUtil.isEmpty(this.mGroup.totalAmount)) {
        this.totalAmount = JSON.parse(this.mGroup.totalAmount);
      }
    }
  }

}
