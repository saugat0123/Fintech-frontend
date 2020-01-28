import {Component, Input, OnInit} from '@angular/core';
import {Financial} from '../../../../model/financial';

@Component({
  selector: 'app-financial-details',
  templateUrl: './financial-details.component.html',
  styleUrls: ['./financial-details.component.scss']
})
export class FinancialDetailsComponent implements OnInit {
  @Input() financialData: Financial;

  constructor() { }

  ngOnInit() {
  }

}
