import {Component, Input, OnInit} from '@angular/core';
import {NetTradingAssets} from '../../../../admin/modal/NetTradingAssets';
import {FiscalYear} from '../../../../admin/modal/FiscalYear';
import {environment} from '../../../../../../environments/environment';
import {Clients} from '../../../../../../environments/Clients';

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

  // Client
  client = environment.client;
  clientName = Clients;

  constructor() { }

  ngOnInit() {
    this.currentFiscalYearIndex = this.fiscalYears.indexOf(
        this.fiscalYears.filter(value => value.isCurrentYear === true)[0]);
    this.prevFiscalYearIndex = this.currentFiscalYearIndex + 1;
    this.ntaData = JSON.parse(this.netTradingAssetsData.data);
    console.log('NtaData::::', this.ntaData);
    this.ntaData.forEach((value , index) => {
      if (value.id === this.fiscalYears[this.currentFiscalYearIndex].id) {
        this.currentYearData = value;
        console.log('CurentYeardata:::', this.currentYearData);
        if (this.ntaData[index + 1] !== undefined) {
          this.prevYearData = this.ntaData[index + 1]; // prev year index
        }
      }
    });
  }
}
