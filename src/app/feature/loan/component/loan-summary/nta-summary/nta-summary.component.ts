import {Component, Input, OnInit} from '@angular/core';
import {NetTradingAssets} from '../../../../admin/modal/NetTradingAssets';
import {FiscalYear} from '../../../../admin/modal/FiscalYear';
import {environment} from '../../../../../../environments/environment';
import {SummaryType} from '../../SummaryType';
import {Clients} from '../../../../../../environments/Clients';

@Component({
  selector: 'app-nta-summary',
  templateUrl: './nta-summary.component.html',
  styleUrls: ['./nta-summary.component.scss']
})
export class NtaSummaryComponent implements OnInit {
  @Input() netTradingAssetsData?: NetTradingAssets;
  @Input() fiscalYears: Array<FiscalYear>;
  @Input() count;
  ntaData = [];
  currentFiscalYearIndex: number;
  currentYearData;
  prevYearData;
  prevFiscalYearIndex: number;
  fiscalYearArray = new Array<FiscalYear>();
  summaryType = environment.summaryType;
  summaryTypeName = SummaryType;

  // Client
  client = environment.client;
  clientName = Clients;

  constructor() { }

  ngOnInit() {
    this.currentFiscalYearIndex = this.fiscalYears.indexOf(
        this.fiscalYears.filter(value => value.isCurrentYear === true)[0]);
    this.prevFiscalYearIndex = this.currentFiscalYearIndex + 1;
    this.ntaData = JSON.parse(this.netTradingAssetsData.data);
    this.ntaData.forEach((value , index) => {
      if (value.id === this.fiscalYears[this.currentFiscalYearIndex].id) {
        this.currentYearData = value;
      }
    });

    this.ntaData.forEach( value => {
      if (this.fiscalYears[this.currentFiscalYearIndex].id < this.fiscalYears[this.prevFiscalYearIndex].id) {
        if (value.id === this.fiscalYears[this.prevFiscalYearIndex].id) {
          this.prevYearData = value;
        }
      }
    });
  }
}
