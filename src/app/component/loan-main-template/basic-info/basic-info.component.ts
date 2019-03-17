import { Component, OnInit } from '@angular/core';
import { Customer } from '../../../modal/customer';
import {CustomerFather} from '../../../modal/customer-father';
import {CustomerGrandFather} from '../../../modal/customer-grand-father';
import {CustomerSpouse} from '../../../modal/customer-spouse';
import { CommonService } from '../../../shared-service/baseservice/common-baseservice';
import { Router } from '@angular/router';
import { CommonDataService } from '../../../shared-service/baseservice/common-dataService';
@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.css']
})
export class BasicInfoComponent implements OnInit {
  customer: Customer = new Customer();
  customerFather: CustomerFather= new CustomerFather();
  customerGrandFather: CustomerGrandFather = new CustomerGrandFather();
  customerSpouse: CustomerSpouse = new CustomerSpouse();
  globalMsg;
  constructor(
    private commonService: CommonService,
    private router: Router,
    private dataService: CommonDataService
  ) { 
  }
  ngOnInit() {
  }
  onSubmit(){
    this.customer.customerFather = this.customerFather;
    this.customer.customerGrandFather = this.customerGrandFather;
    this.customer.customerSpouse = this.customerSpouse;
    console.log(this.customer)
    this.commonService.saveOrEdit(this.customer,'v1/basicInfo').subscribe();
  }

}
