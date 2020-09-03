import {Component, Input, OnInit} from '@angular/core';
import {Customer} from '../../admin/modal/customer';
import {CustomerType} from '../../customer/model/customerType';

@Component({
  selector: 'app-individual-view',
  templateUrl: './individual-view.component.html',
  styleUrls: ['./individual-view.component.scss']
})
export class IndividualViewComponent implements OnInit {
  @Input() individual: Customer;
  customerType = CustomerType;

  constructor() {
  }

  ngOnInit() {

  }


}
