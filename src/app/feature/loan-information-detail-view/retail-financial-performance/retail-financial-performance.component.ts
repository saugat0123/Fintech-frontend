import { LoanDataHolder } from './../../loan/model/loanData';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-retail-financial-performance',
  templateUrl: './retail-financial-performance.component.html',
  styleUrls: ['./retail-financial-performance.component.scss']
})
export class RetailFinancialPerformanceComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder
  @Input() financialData:any;
  constructor() { }

  ngOnInit() {
  }

}
