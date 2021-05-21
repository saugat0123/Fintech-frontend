import {Component, Input, OnInit} from '@angular/core';
import {Customer} from '../../../../admin/modal/customer';
import {CustomerType} from '../../../../customer/model/customerType';
import {IndividualJsonData} from '../../../../admin/modal/IndividualJsonData';
import {environment} from '../../../../../../environments/environment.srdb';
import {CalendarType} from '../../../../../@core/model/calendar-type';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {LoanDataHolder} from '../../../../loan/model/loanData';

@Component({
  selector: 'app-micro-individual-view',
  templateUrl: './micro-individual-view.component.html',
  styleUrls: ['./micro-individual-view.component.scss']
})
export class MicroIndividualViewComponent implements OnInit {

  @Input() individual: Customer;
  @Input() customerInfo;
  customerType = CustomerType;
  individualJsonData: IndividualJsonData;

  crgLambdaDisabled = environment.disableCrgLambda;

  @Input() calendarType: CalendarType;

  @Input() loanId: any;
  age: number;

  constructor() {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.individual)) {
      if (!ObjectUtil.isEmpty(this.individual.individualJsonData)) {
        this.individualJsonData = JSON.parse(this.individual.individualJsonData);
      }
    }
  }

  calculateAge(dob) {
    const difference = Math.abs(Date.now() - new Date(dob).getTime());
    this.age = Math.floor((difference / (1000 * 3600 * 24)) / 365);
    return this.age;
  }

}
