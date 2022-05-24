import {Component, Input, OnInit} from '@angular/core';
import {MultipleBanking} from '../../../../../../admin/modal/multipleBanking';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {Proposal} from '../../../../../../admin/modal/proposal';
import {Cicl, CiclArray} from '../../../../../../admin/modal/cicl';
import {CustomerCategory} from '../../../../../../customer/model/customerCategory';

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
  multiBankingData;
  checkedData;
  proposalData;
  ciclData;
  customerCate = CustomerCategory;
  commentVisible = false;

  constructor() { }

  ngOnInit() {
    console.log('this.cicl', this.cicl);
    if (!ObjectUtil.isEmpty(this.multiBanking)) {
      this.multiBankingData = JSON.parse(this.multiBanking.data);
      this.checkedData = JSON.parse(this.multiBanking.checkedData);
    }
    if (!ObjectUtil.isEmpty(this.cicl)) {
      this.ciclData = JSON.parse(this.cicl.data);
      console.log('ciclData', this.ciclData);
      if (!ObjectUtil.isEmpty(this.cicl.remarks)) {
        this.commentVisible = true;
      }
    }
    if (!ObjectUtil.isEmpty(this.proposal)) {
      this.proposalData = JSON.parse(this.proposal.data);
    }
  }

}
