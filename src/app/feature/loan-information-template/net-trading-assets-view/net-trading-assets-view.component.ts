import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../loan/model/loanData';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {NetTradingAssets} from '../../admin/modal/NetTradingAssets';
import {CompanyJsonData} from '../../admin/modal/CompanyJsonData';

@Component({
  selector: 'app-net-trading-assets-view',
  templateUrl: './net-trading-assets-view.component.html',
  styleUrls: ['./net-trading-assets-view.component.scss']
})
export class NetTradingAssetsViewComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  @Input() netTradingAssets?: NetTradingAssets;
  netTradingAssetsData;
  ntaData;
  companyInfo;
  companyJson: CompanyJsonData = new CompanyJsonData();
  constructor() { }

  ngOnInit() {
    this.companyInfo = this.loanDataHolder.companyInfo;
    this.companyJson = JSON.parse(this.companyInfo.companyJsonData);
    if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.netTradingAssets)) {
      this.ntaData = JSON.parse(this.loanDataHolder.loanHolder.netTradingAssets.data);
    }
  }

}
