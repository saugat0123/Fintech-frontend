import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-eligibility-result',
  templateUrl: './customer-eligibility-result.component.html',
  styleUrls: ['./customer-eligibility-result.component.css']
})
export class CustomerEligibilityResultComponent implements OnInit {
  result: boolean;

  constructor() { }

  ngOnInit() {
    this.result = true;
  }

}
