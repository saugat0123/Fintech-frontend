import {Component, Input, OnInit} from '@angular/core';
import {NetTradingAssets} from '../../../../admin/modal/NetTradingAssets';
import {FiscalYear} from '../../../../admin/modal/FiscalYear';

@Component({
  selector: 'app-nta-summary',
  templateUrl: './nta-summary.component.html',
  styleUrls: ['./nta-summary.component.scss']
})
export class NtaSummaryComponent implements OnInit {
  @Input() netTradingAssetsData?: NetTradingAssets;
  @Input() fiscalYears: Array<FiscalYear>;
  ntaData = [];
  currentFiscalYearIndex: number;
  currentYearData;
  currentYear = [];

  fiscalYearArray = new Array<FiscalYear>();

  constructor() { }

  ngOnInit() {
    this.currentFiscalYearIndex = this.fiscalYears.indexOf(
        this.fiscalYears.filter(value => value.isCurrentYear === true)[0]);
    this.ntaData = JSON.parse(this.netTradingAssetsData.data);
    this.currentYearData = this.ntaData.filter(d => d.isCurrentYear === true);
    this.currentYear = this.fiscalYears.filter(f => f.isCurrentYear === true);
  }

}
