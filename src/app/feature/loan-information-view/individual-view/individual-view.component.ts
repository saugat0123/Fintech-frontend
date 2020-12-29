import {Component, Input, OnInit} from '@angular/core';
import {Customer} from '../../admin/modal/customer';
import {CustomerType} from '../../customer/model/customerType';
import {CalendarType} from '../../../@core/model/calendar-type';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {IndividualJsonData} from '../../admin/modal/IndividualJsonData';

@Component({
  selector: 'app-individual-view',
  templateUrl: './individual-view.component.html',
  styleUrls: ['./individual-view.component.scss']
})
export class IndividualViewComponent implements OnInit {
  @Input() individual: Customer;
  @Input() customerInfo;
  customerType = CustomerType;
  individualJsonData: IndividualJsonData;

  @Input() calendarType: CalendarType;

  @Input() loanId: any;

  constructor() {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.individual)) {
      if (!ObjectUtil.isEmpty(this.individual.individualJsonData)) {
        console.log(this.individualJsonData);
        this.individualJsonData = JSON.parse(this.individual.individualJsonData);
      }
    }

  }
}
