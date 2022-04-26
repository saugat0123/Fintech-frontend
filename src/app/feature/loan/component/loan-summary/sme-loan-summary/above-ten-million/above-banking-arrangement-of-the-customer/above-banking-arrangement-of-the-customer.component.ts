import {Component, Input, OnInit} from '@angular/core';
import {MultipleBanking} from '../../../../../../admin/modal/multipleBanking';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {Proposal} from '../../../../../../admin/modal/proposal';
import {Cicl, CiclArray} from '../../../../../../admin/modal/cicl';

@Component({
  selector: 'app-above-banking-arrangement-of-the-customer',
  templateUrl: './above-banking-arrangement-of-the-customer.component.html',
  styleUrls: ['./above-banking-arrangement-of-the-customer.component.scss']
})
export class AboveBankingArrangementOfTheCustomerComponent implements OnInit {
  @Input() multiBanking: MultipleBanking;
  @Input() proposal: Proposal;
  @Input() cicl: CiclArray;
  multiBankingData;
  checkedData;
  proposalData;
  ciclData;

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
