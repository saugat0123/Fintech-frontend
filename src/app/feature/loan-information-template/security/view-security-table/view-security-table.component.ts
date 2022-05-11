import {Component, Input, OnInit} from '@angular/core';
import {Security} from '../../../loan/model/security';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';

@Component({
  selector: 'app-view-security-table',
  templateUrl: './view-security-table.component.html',
  styleUrls: ['./view-security-table.component.scss']
})
export class ViewSecurityTableComponent implements OnInit {
  @Input() customerInfo: CustomerInfoData;
  securities: Array<Security> = new Array<Security>();
  regex = /_/g;

  constructor() { }

  ngOnInit() {
    if (this.customerInfo.securities.length > 0) {
      this.securities = this.customerInfo.securities;
    }
  }

}
