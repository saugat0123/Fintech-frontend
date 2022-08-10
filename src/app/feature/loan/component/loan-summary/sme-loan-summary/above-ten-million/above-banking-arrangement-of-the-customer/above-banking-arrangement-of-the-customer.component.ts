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

  constructor() { }

  ngOnInit() {
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

}
