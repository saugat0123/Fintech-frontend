import {Component, Input, OnInit} from '@angular/core';
import {Financial} from '../../../model/financial';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-financial-summary',
  templateUrl: './financial-summary.component.html',
  styleUrls: ['./financial-summary.component.scss']
})
export class FinancialSummaryComponent implements OnInit {
  @Input() formData: Financial;

  financialData: Object;

  constructor() { }

  ngOnInit() {
    if (this.formData !== undefined) {
      this.financialData = JSON.parse(this.formData.data);
    }
  }

}
