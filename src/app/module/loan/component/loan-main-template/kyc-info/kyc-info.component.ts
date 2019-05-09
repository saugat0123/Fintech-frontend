import {Component, OnInit} from '@angular/core';

import {Router} from '@angular/router';

import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Customer} from '../../../../admin/modal/customer';
import {CustomerRelative} from '../../../../admin/modal/customer-relative';
import {CommonService} from '../../../../../shared-service/baseservice/common-baseservice';
import {CommonDataService} from '../../../../../shared-service/baseservice/common-dataService';

@Component({
    selector: 'app-kyc-info',
    templateUrl: './kyc-info.component.html',
    styleUrls: ['./kyc-info.component.css']
})
export class KycInfoComponent implements OnInit {

    customer: Customer = new Customer();
    customerRelatives: Array<CustomerRelative> = new Array<CustomerRelative>();
    basicInfo: FormGroup;

    constructor(
        private commonService: CommonService,
        private commonDateService: CommonDataService,
        private router: Router,
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        this.customer = this.commonDateService.getCustomer();
        this.basicInfo = this.formBuilder.group({
            otherRelatives: this.formBuilder.array([
                this.relativeFormGroup()
            ])
        });
    }

    onSubmit() {
        this.customer.customerRelatives = this.basicInfo.get('otherRelatives').value;
        this.commonService.saveOrEdit(this.customer, 'v1/basicInfo').subscribe();
        this.router.navigate(['home/loan/company-info']);
    }

    addCustomerRelative() {
        (<FormArray>this.basicInfo.get('otherRelatives')).push(this.relativeFormGroup());
    }

    relativeFormGroup(): FormGroup {
        return this.formBuilder.group({
            customerRelation: [''],
            customerRelativeName: [''],
            citizenshipNumber: [''],
            citizenshipIssuedDate: [''],
            citizenshipIssuedPlace: ['']
        });
    }

    removeRelative(index: number) {
        (<FormArray>this.basicInfo.get('otherRelatives')).removeAt(index);
    }

    previousPage() {
        this.router.navigate(['home/loan/basic-info']);

    }

}
