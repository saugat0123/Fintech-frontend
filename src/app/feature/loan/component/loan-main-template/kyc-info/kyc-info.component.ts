import {Component, Input, OnInit} from '@angular/core';

import {Router} from '@angular/router';

import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {BasicInfoService} from '../../../service/basic-info.service';
import {Customer} from '../../../model/customer';
import {CustomerRelative} from '../../../model/customer-relative';
import {Kyc} from '../../../model/kyc';

@Component({
    selector: 'app-kyc-info',
    templateUrl: './kyc-info.component.html',
    styleUrls: ['./kyc-info.component.css']
})
export class KycInfoComponent implements OnInit {
    @Input() formValue: Customer;

    customer: Customer;
    customerRelatives: Array<CustomerRelative> = new Array<CustomerRelative>();
    kyc: Kyc = new Kyc();
    basicInfo: FormGroup;

    constructor(
        private service: BasicInfoService,
        private router: Router,
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        if (this.formValue !== undefined) {
            this.customer = this.formValue;
        }
        this.basicInfo = this.formBuilder.group({
            otherRelatives: this.formBuilder.array([
                this.relativeFormGroup()
            ])
        });
    }

    onSubmit() {
        this.kyc.customerRelatives = this.basicInfo.get('otherRelatives').value;
        this.customer.kyc = this.kyc;
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
