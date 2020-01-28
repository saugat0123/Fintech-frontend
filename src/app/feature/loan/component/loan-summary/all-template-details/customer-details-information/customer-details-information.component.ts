import {Component, Input, OnInit} from '@angular/core';
import {Customer} from '../../../../../admin/modal/customer';

@Component({
  selector: 'app-customer-details-information',
  templateUrl: './customer-details-information.component.html',
  styleUrls: ['./customer-details-information.component.scss']
})
export class CustomerDetailsInformationComponent implements OnInit {
  @Input() customerInfoData: Customer;

  constructor() { }

  ngOnInit() {
  }

}
