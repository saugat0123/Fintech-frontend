import {Component, Input, OnInit} from '@angular/core';
import {Customer} from '../../admin/modal/customer';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-customer-kyc-view',
  templateUrl: './customer-kyc-view.component.html',
  styleUrls: ['./customer-kyc-view.component.scss']
})
export class CustomerKycViewComponent implements OnInit {


  constructor() {
  }

  @Input() customer: Customer;
  isJointCustomer = false;
  jointRelatives: Array<any> = new Array<any>();

  ngOnInit() {

    console.log(this.customer);
    if (!ObjectUtil.isEmpty(this.customer.jointInfo)) {
      this.isJointCustomer = true;
      const data = JSON.parse(this.customer.jointInfo);
      data.jointCustomerInfo.forEach(d => {
        this.jointRelatives.push(d);
      });
    }

  }

}
