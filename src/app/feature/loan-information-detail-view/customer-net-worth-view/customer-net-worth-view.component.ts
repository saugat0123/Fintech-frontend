import {Component, Input, OnInit} from '@angular/core';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {Customer} from '../../admin/modal/customer';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-customer-net-worth-view',
  templateUrl: './customer-net-worth-view.component.html',
  styleUrls: ['./customer-net-worth-view.component.scss']
})
export class CustomerNetWorthViewComponent implements OnInit {

  constructor() { }
  netWorth: Array<any> = new Array<any>();
  customerName: Array<any> = new Array<any>();
  isJointCustomer = false;
  jointRelatives: Array<any> = new Array<any>();
  @Input() customerInfo: CustomerInfoData;
  @Input() customer: Customer;

  ngOnInit() {
    console.log(this.customer, 'Customer');
    this.getCustomerNetWorthDetail();
  }

  getCustomerNetWorthDetail(): void
  {
    if(!ObjectUtil.isEmpty(this.customerInfo) && this.customerInfo.isJointCustomer) {
      const  data = JSON.parse(this.customerInfo.netWorth);
      data.forEach(nw => {
        this.netWorth.push(nw);
      })
    } else  if (!ObjectUtil.isEmpty(this.customerInfo) && !this.customerInfo.isJointCustomer){
      this.netWorth.push( JSON.parse(this.customerInfo.netWorth));
    }

    if (!ObjectUtil.isEmpty(this.customer.jointInfo)) {
      const data = JSON.parse(this.customer.jointInfo);
      data.jointCustomerInfo.forEach(d => {
        this.customerName.push(d.customerName);
      });
    }
  }


}
