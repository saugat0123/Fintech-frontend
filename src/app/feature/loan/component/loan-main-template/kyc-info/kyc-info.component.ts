import {Component, OnInit} from '@angular/core';

import {Router} from '@angular/router';

import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Customer} from '../../../../admin/modal/customer';
import {CustomerRelative} from '../../../../admin/modal/customer-relative';
import {BasicInfoService} from '../../../service/basic-info.service';

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
        private service: BasicInfoService,
        private router: Router,
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        this.basicInfo = this.formBuilder.group({
            otherRelatives: this.formBuilder.array([
                this.relativeFormGroup()
            ])
        });
    }

    onSubmit() {
        this.customer.customerRelatives = this.basicInfo.get('otherRelatives').value;
        this.service.save(this.customer).subscribe();
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
