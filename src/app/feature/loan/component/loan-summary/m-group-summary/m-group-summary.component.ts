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
  isAboveTen = false;
  isBelowTen = false;
  isWholeSale = false;
  isSana = false;
  isUptoTwo = false;

  constructor() { }

  ngOnInit() {
    this.checkCustomerCategory(this.customerCategory);
    if (!ObjectUtil.isEmpty(this.mGroup)) {
      if (!ObjectUtil.isEmpty(this.mGroup.groupPosition)) {
        this.groupPosition = JSON.parse(this.mGroup.groupPosition);
      }
      if (!ObjectUtil.isEmpty(this.mGroup.totalAmount)) {
        this.totalAmount = JSON.parse(this.mGroup.totalAmount);
      }
    }
  }

  checkCustomerCategory(value) {
    if (value === 'SME_ABOVE_TEN_MILLION' || value === 'AGRICULTURE_ABOVE_TEN_MILLION') {
      this.isAboveTen = true;
    } else if (value === 'SME_UPTO_TEN_MILLION' ||
        value === 'AGRICULTURE_TWO_TO_TEN_MILLION') {
      this.isBelowTen = true;
    } else if (value === 'SANA_BYABASAYI') {
      this.isSana = true;
    } else if (value === 'AGRICULTURE_UPTO_TWO_MILLION') {
      this.isUptoTwo = true;
    } else {
      this.isWholeSale = true;
    }
  }

}
