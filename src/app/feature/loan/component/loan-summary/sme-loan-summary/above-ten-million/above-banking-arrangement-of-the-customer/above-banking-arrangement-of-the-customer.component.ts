import {Component, Input, OnInit} from '@angular/core';
import {MultipleBanking} from '../../../../../../admin/modal/multipleBanking';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {Proposal} from '../../../../../../admin/modal/proposal';
import {Cicl, CiclArray} from '../../../../../../admin/modal/cicl';
import {CustomerCategory} from '../../../../../../customer/model/customerCategory';
import {CustomerType} from '../../../../../../customer/model/customerType';

@Component({
  selector: 'app-above-banking-arrangement-of-the-customer',
  templateUrl: './above-banking-arrangement-of-the-customer.component.html',
  styleUrls: ['./above-banking-arrangement-of-the-customer.component.scss']
})
export class AboveBankingArrangementOfTheCustomerComponent implements OnInit {
  @Input() multiBanking: MultipleBanking;
  @Input() proposal: Proposal;
  @Input() cicl: CiclArray;
  @Input() customerCategory;
  @Input() customerType: CustomerType;
  @Input() isRetailCustomer: boolean;
  multiBankingData;
  checkedData;
  proposalData;
  ciclData;
  customerCate = CustomerCategory;
  isAboveTen = false;
  isDSL = false;
  isBelowTen = false;
  isWholeSale = false;
  isUptoTwoMillion = false;
  isWithoutCollateral = false;

  constructor() { }

  ngOnInit() {
    this.checkCustomerCategory(this.customerCategory);
    if (!ObjectUtil.isEmpty(this.multiBanking)) {
      this.multiBankingData = JSON.parse(this.multiBanking.data);
      this.checkedData = JSON.parse(this.multiBanking.checkedData);
    }
    if (!ObjectUtil.isEmpty(this.cicl)) {
      this.ciclData = JSON.parse(this.cicl.data);
    }
    if (!ObjectUtil.isEmpty(this.proposal)) {
      this.proposalData = JSON.parse(this.proposal.data);
    }
  }

  checkCustomerCategory(value) {
    if (value === 'SME_ABOVE_TEN_MILLION' || value === 'AGRICULTURE_ABOVE_TEN_MILLION') {
      this.isAboveTen = true;
    } else if (value === 'SME_UPTO_TEN_MILLION' ||
        value === 'AGRICULTURE_TWO_TO_TEN_MILLION') {
      this.isBelowTen = true;
    } else if (value === 'AGRICULTURE_UPTO_TWO_MILLION') {
      this.isUptoTwoMillion = true;
    } else if (value === 'AGRICULTURE_UPTO_ZERO_POINT_FIVE_MILLION') {
      this.isWithoutCollateral = true;
    } else if (value === 'DSL_WHOLE_SALE') {
      this.isDSL = true;
    } else {
      this.isWholeSale = true;
    }
  }

}
