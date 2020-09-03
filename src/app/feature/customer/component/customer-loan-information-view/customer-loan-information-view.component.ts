import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-customer-loan-information-view',
  templateUrl: './customer-loan-information-view.component.html',
  styleUrls: ['./customer-loan-information-view.component.scss']
})
export class CustomerLoanInformationViewComponent implements OnInit {
  @Input() customerInfo;

  constructor() {
  }

  ngOnInit() {
  }

}
