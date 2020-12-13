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
  prevYearData;
  prevFiscalYearIndex: number;

  fiscalYearArray = new Array<FiscalYear>();

  constructor() { }

  ngOnInit() {
    this.currentFiscalYearIndex = this.fiscalYears.indexOf(
       this.fiscalYears.filter(value => value.isCurrentYear === true)[0]);
    this.prevFiscalYearIndex = this.currentFiscalYearIndex + 1;
    this.ntaData = JSON.parse(this.netTradingAssetsData.data);
    this.ntaData.forEach((value , index) => {
      if (value.id === this.fiscalYears[this.currentFiscalYearIndex].id) {
        this.currentYearData = value;
        if (this.ntaData[index + 1] !== undefined) {
          this.prevYearData = this.ntaData[index + 1]; // prev year index
        }
      }
    });
  }

}
