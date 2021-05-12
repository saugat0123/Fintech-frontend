import {Component, Input, OnInit} from '@angular/core';
import {NetTradingAssets} from '../../../../admin/modal/NetTradingAssets';
import {FiscalYear} from '../../../../admin/modal/FiscalYear';

@Component({
  selector: 'app-nta-mega-summary',
  templateUrl: './nta-mega-summary.component.html',
  styleUrls: ['./nta-mega-summary.component.scss']
})
export class NtaMegaSummaryComponent implements OnInit {
  @Input() netTradingAssetsData?: NetTradingAssets;
  @Input() fiscalYears: Array<FiscalYear>;
  ntaData = [];
  currentFiscalYearIndex: number;
  currentYearData;
  prevYearData;
  prevFiscalYearIndex: number;

  fiscalYearArray = new Array<FiscalYear>();

  constructor() { }

  ngOnInit() {
    this.currentFiscalYearIndex = this.fiscalYears.indexOf(
        this.fiscalYears.filter(value => value.isCurrentYear === true)[0]);
    this.ntaData = JSON.parse(this.netTradingAssetsData.data);
    this.ntaData.forEach((value) => {
      if (value.id === this.fiscalYears[this.currentFiscalYearIndex].id) {
        this.currentYearData = value;
      }
    });

    this.ntaData.forEach(value => {
      if (this.fiscalYears[this.currentFiscalYearIndex].id > 1 ) {
        this.prevFiscalYearIndex = this.fiscalYears.length - 1;
        if (value.id === this.fiscalYears[this.prevFiscalYearIndex].id) {
          this.prevYearData = value;
        }}
    });
  }
}
