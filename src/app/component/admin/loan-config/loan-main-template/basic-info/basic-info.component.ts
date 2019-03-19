import { Component, OnInit } from '@angular/core';
import { Customer } from '../../../../../modal/customer';
import {CustomerFather} from '../../../../../modal/customer-father';
import {CustomerGrandFather} from '../../../../../modal/customer-grand-father';
import {CustomerSpouse} from '../../../../../modal/customer-spouse';
import { CommonService } from '../../../../../shared-service/baseservice/common-baseservice';
import { Router } from '@angular/router';
import { CustomerRelative } from '../../../../../modal/customer-relative';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
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
  customerRelatives: Set<CustomerRelative>= new Set<CustomerRelative>();
  basicInfo: FormGroup;
  constructor(
    private commonService: CommonService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { 
  }
  ngOnInit() {
    this.basicInfo = this.formBuilder.group({
        title: [''],
        customerName: [''],
        customerId: [''],
        accountNo: [''],
        address1: [''],
        address2: [''],
        telephone: [''],
        mobile: [''],
        email: [''],
        initialRelationDate: [''],
        citizenshipNumber: [''],
        citizenshipIssuedPlace: [''],
        citizenshipIssuedDate: [''],
        customerFather: this.formBuilder.group({
          customerFatherName: [''],
          citizenshipNumber: [''],
          citizenshipIssuedDate: [''],
          citizenshipIssuedPlace: ['']
        }),
        customerGrandFather: this.formBuilder.group({
          customerGrandFatherName: [''],
          citizenshipNumber: [''],
          citizenshipIssuedDate: [''],
          citizenshipIssuedPlace: ['']
        }),
        customerSpouse: this.formBuilder.group({
          customerSpouseName: [''],
          citizenshipNumber: [''],
          citizenshipIssuedDate: [''],
          citizenshipIssuedPlace: ['']
        }),
        otherRelatives: this.formBuilder.array([
          this.relativeFormGroup()
        ])
      })
  }
  
  onSubmit(){
    console.log(this.basicInfo.value)
    this.customer.title = this.basicInfo.get('title').value;
    console.log(this.customer.title)
    this.customer.customerName = this.basicInfo.get('customerName').value;
    this.customer.customerId = this.basicInfo.get('customerId').value;
    this.customer.accountNo = this.basicInfo.get('accountNo').value;
    this.customer.address1 = this.basicInfo.get('address1').value;
    this.customer.address2 = this.basicInfo.get('address2').value;
    this.customer.telephone = this.basicInfo.get('telephone').value;
    this.customer.mobile = this.basicInfo.get('mobile').value;
    this.customer.email = this.basicInfo.get('email').value;
    this.customer.initialRelationDate = this.basicInfo.get('initialRelationDate').value;
    this.customer.citizenshipNumber = this.basicInfo.get('citizenshipNumber').value;
    this.customer.issuedPlace = this.basicInfo.get('citizenshipIssuedPlace').value;
    this.customer.citizenshipIssuedDate = this.basicInfo.get('citizenshipIssuedDate').value;
    this.customerFather.customerFatherName = this.basicInfo.get('customerFather').get('customerFatherName').value;
    this.customerFather.citizenshipNumber = this.basicInfo.get('customerFather').get('citizenshipNumber').value;
    this.customerFather.citizenshipIssuedDate = this.basicInfo.get('customerFather').get('citizenshipIssuedDate').value;
    this.customerFather.citizenshipIssuedPlace = this.basicInfo.get('customerFather').get('citizenshipIssuedPlace').value;
    this.customer.customerFather = this.customerFather;
    this.customerGrandFather.customerGrandFatherName = this.basicInfo.get('customerGrandFather').get('customerGrandFatherName').value;
    this.customerGrandFather.citizenshipNumber = this.basicInfo.get('customerGrandFather').get('citizenshipNumber').value;
    this.customerGrandFather.citizenshipIssuedDate = this.basicInfo.get('customerGrandFather').get('citizenshipIssuedDate').value;
    this.customerGrandFather.citizenshipIssuedPlace = this.basicInfo.get('customerGrandFather').get('citizenshipIssuedPlace').value;
    this.customer.customerGrandFather = this.customerGrandFather;
    this.customerSpouse.customerSpouseName = this.basicInfo.get('customerSpouse').get('customerSpouseName').value;
    this.customerSpouse.citizenshipNumber = this.basicInfo.get('customerSpouse').get('citizenshipNumber').value;
    this.customerSpouse.citizenshipIssuedDate = this.basicInfo.get('customerSpouse').get('citizenshipIssuedDate').value;
    this.customerSpouse.citizenshipIssuedPlace = this.basicInfo.get('customerSpouse').get('citizenshipIssuedPlace').value;
    this.customer.customerSpouse = this.customerSpouse;
    this.customer.customerRelatives = this.basicInfo.get('otherRelatives').value;
    console.log(this.customer)
    this.commonService.saveOrEdit(this.customer,'v1/basicInfo').subscribe();
    // this.router.navigate(['home/loan/company-info'])
  }
  addCustomerRelative(){
     (<FormArray>this.basicInfo.get('otherRelatives')).push(this.formBuilder.group({
      customerRelation: [''],
      customerRelativeName: [''],
      citizenshipNumber: [''],
      citizenshipIssuedDate: [''],
      citizenshipIssuedPlace: ['']
    }));
  }

  relativeFormGroup(): FormGroup {
    return this.formBuilder.group({
      customerRelation: [''],
      customerRelativeName: [''],
      citizenshipNumber: [''],
      citizenshipIssuedDate: [''],
      citizenshipIssuedPlace: ['']
    })
  }
  removeRelative(index: number){
    (<FormArray>this.basicInfo.get('otherRelatives')).removeAt(index);
  }
  
}
