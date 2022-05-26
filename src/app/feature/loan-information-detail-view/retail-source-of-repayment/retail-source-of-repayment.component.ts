import {Component, Input, OnInit} from '@angular/core';
import {Financial} from '../../loan/model/financial';

@Component({
  selector: 'app-retail-source-of-repayment',
  templateUrl: './retail-source-of-repayment.component.html',
  styleUrls: ['./retail-source-of-repayment.component.scss']
})
export class RetailSourceOfRepaymentComponent implements OnInit {
  @Input() formData: Financial;
  financialData: any;

  constructor() { }

  ngOnInit() {
    if (this.formData !== undefined) {
      this.financialData = JSON.parse(this.formData.data);
    }
  }

}
