import {Component, Input, OnInit} from '@angular/core';
import {Financial} from '../../../model/financial';

@Component({
  selector: 'app-financial-risk-summary',
  templateUrl: './financial-risk-summary.component.html',
  styleUrls: ['./financial-risk-summary.component.scss']
})
export class FinancialRiskSummaryComponent implements OnInit {
  @Input() formData: Financial;

  financialData: any;

  constructor() { }

  ngOnInit() {
    if (this.formData !== undefined) {
      this.financialData = JSON.parse(this.formData.data);
    }
  }

}
