import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../loan/model/loanData';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {NetTradingAssets} from '../../admin/modal/NetTradingAssets';

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
  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.netTradingAssets)) {
      this.ntaData = JSON.parse(this.loanDataHolder.loanHolder.netTradingAssets.data);
    }
  }

}
