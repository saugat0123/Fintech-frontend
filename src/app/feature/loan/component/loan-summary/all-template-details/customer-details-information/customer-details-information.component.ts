import {Component, Input, OnInit} from '@angular/core';
import {Customer} from '../../../../../admin/modal/customer';

@Component({
  selector: 'app-customer-details-information',
  templateUrl: './customer-details-information.component.html',
  styleUrls: ['./customer-details-information.component.scss']
})
export class CustomerDetailsInformationComponent implements OnInit {
  @Input() customerInfoData: Customer;
  @Input() loanType;

  constructor() { }

  ngOnInit() {
  }

  findCustomerAge(date: Date) {
    const timeDiff = Math.abs(Date.now() - new Date(date).getTime());
    return  Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
  }

}
