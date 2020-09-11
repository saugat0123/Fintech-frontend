import {Component, Input, OnInit} from '@angular/core';
import {CompanyInfo} from '../../admin/modal/company-info';
import {CalendarType} from '../../../@core/model/calendar-type';
import {CustomerType} from '../../customer/model/customerType';

@Component({
  selector: 'app-company-info-view',
  templateUrl: './company-info-view.component.html',
  styleUrls: ['./company-info-view.component.scss']
})
export class CompanyInfoViewComponent implements OnInit {
  @Input() formValue: CompanyInfo;
  customerType = CustomerType;

  @Input() calendarType: CalendarType;

  @Input() loanId: any;

  constructor() {
  }

  ngOnInit() {
  }

}
