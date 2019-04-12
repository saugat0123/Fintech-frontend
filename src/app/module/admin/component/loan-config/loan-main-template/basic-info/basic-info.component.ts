import {Component, OnInit} from '@angular/core';
import {Customer} from '../../../../../../modal/customer';
import {CommonService} from '../../../../../../shared-service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {CustomerRelative} from '../../../../../../modal/customer-relative';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CommonDataService} from '../../../../../../shared-service/baseservice/common-dataService';

@Component({
    selector: 'app-basic-info',
    templateUrl: './basic-info.component.html',
    styleUrls: ['./basic-info.component.css']
})
export class BasicInfoComponent implements OnInit {
    customer: Customer = new Customer();
    customerRelatives: Array<CustomerRelative> = new Array<CustomerRelative>();
    basicInfo: FormGroup;

    constructor(
        private commonService: CommonService,
        private commonDataService: CommonDataService,
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
            province: [''],
            district: [''],
            municipalitiesOrVDC: [''],
            telephone: [''],
            mobile: [''],
            email: [''],
            initialRelationDate: [''],
            citizenshipNumber: [''],
            citizenshipIssuedPlace: [''],
            citizenshipIssuedDate: ['']
        });
    }

    onSubmit() {
        this.customer.title = this.basicInfo.get('title').value;
        this.customer.customerName = this.basicInfo.get('customerName').value;
        this.customer.customerId = this.basicInfo.get('customerId').value;
        this.customer.accountNo = this.basicInfo.get('accountNo').value;
        this.customer.province = this.basicInfo.get('province').value;
        this.customer.district = this.basicInfo.get('district').value;
        this.customer.municipalitiesOrVDC = this.basicInfo.get('municipalitiesOrVDC').value;
        this.customer.telephone = this.basicInfo.get('telephone').value;
        this.customer.mobile = this.basicInfo.get('mobile').value;
        this.customer.email = this.basicInfo.get('email').value;
        this.customer.initialRelationDate = this.basicInfo.get('initialRelationDate').value;
        this.customer.citizenshipNumber = this.basicInfo.get('citizenshipNumber').value;
        this.customer.issuedPlace = this.basicInfo.get('citizenshipIssuedPlace').value;
        this.customer.citizenshipIssuedDate = this.basicInfo.get('citizenshipIssuedDate').value;
        this.commonDataService.setCustomer(this.customer);
        // this.commonService.saveOrEdit(this.customer,'v1/basicInfo').subscribe();
        this.router.navigate(['home/loan/kyc-info']);
    }

}
