import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {LoanDataHolder} from '../../../model/loanData';
import {CustomerCategory} from '../../../../customer/model/customerCategory';
import {CustomerInfoData} from '../../../model/customerInfoData';
import {CalendarType} from '../../../../../@core/model/calendar-type';

@Component({
  selector: 'app-summary-header',
  templateUrl: './summary-header.component.html',
  styleUrls: ['./summary-header.component.scss']
})
export class SummaryHeaderComponent implements OnInit {
  client: string;
  @Input() loanCategory;
  @Input() isJointInfo: boolean;
  @Input() loanDataHolder: LoanDataHolder;
  @Input() customerInfo: CustomerInfoData;
   calendarType: CalendarType = CalendarType.AD;
  @Input() jointInfo;
  @Input() currentDocAction;
  @Input() crgCCbl;
  customerCategory = CustomerCategory;
  zeroPointFive = false;
  isDetailedView = false;

  constructor() {
    this.client = environment.client;
  }

  ngOnInit() {
    this.checkCustomerCategoryForDetailView();


  }

  checkCustomerCategoryForDetailView() {
    if (this.loanDataHolder.loanHolder.customerCategory.toString() === 'AGRICULTURE_UPTO_ZERO_POINT_FIVE_MILLION') {
      this.zeroPointFive = true;
      this.isDetailedView = true;
    }
  }
}
