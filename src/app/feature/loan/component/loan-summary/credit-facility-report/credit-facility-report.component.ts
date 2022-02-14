import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-credit-facility-report',
  templateUrl: './credit-facility-report.component.html',
  styleUrls: ['./credit-facility-report.component.scss']
})
export class CreditFacilityReportComponent implements OnInit {
  @Input() loanDataHolder;
  @Input() nepaliDate;
  @Input() loanConfig;

  constructor() { }

  ngOnInit() {
  }

}
