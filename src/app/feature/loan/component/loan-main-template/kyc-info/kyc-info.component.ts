import {Component, Input, OnInit} from '@angular/core';


import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {LoanDataService} from '../../../service/loan-data.service';
import {Customer} from '../../../../admin/modal/customer';
import {CustomerRelative} from '../../../../admin/modal/customer-relative';

@Component({
    selector: 'app-kyc-info',
    templateUrl: './kyc-info.component.html',
    styleUrls: ['./kyc-info.component.css']
})
export class KycInfoComponent implements OnInit {
    @Input() formValue: Customer;

    customer: Customer;
    customerRelatives: Array<CustomerRelative> = new Array<CustomerRelative>();
    kycInfo: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private loanDataService: LoanDataService
    ) {
    }

    ngOnInit() {
        if (this.formValue !== undefined) {
            this.customer = this.formValue;
        }
        console.log(this.customer);
        this.customer = this.loanDataService.getCustomer();
        console.log(this.customer);
        this.kycInfo = this.formBuilder.group({
            otherRelatives: this.formBuilder.array([
                this.relativeFormGroup()
            ])
        });
        console.log(this.customer.customerRelatives);
        if (this.customer.customerRelatives !== undefined) {
            console.log('in');
            this.kycInfo.setControl('otherRelatives', this.setRelativeForm(this.customer.customerRelatives));
        }
    }

    onSubmit() {
        this.customer.customerRelatives = this.kycInfo.get('otherRelatives').value;
        this.loanDataService.setCustomer(this.customer);
    }

    addCustomerRelative() {
        (<FormArray>this.kycInfo.get('otherRelatives')).push(this.relativeFormGroup());
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
        (<FormArray>this.kycInfo.get('otherRelatives')).removeAt(index);
    }

    setRelativeForm(relativeList: Array<CustomerRelative>): FormArray {
        const relativeFormArray = new FormArray([]);
        relativeList.forEach(relative => {
            console.log(relative);
            relativeFormArray.push(this.formBuilder.group({
                customerRelation: relative.customerRelation,
                customerRelativeName: relative.customerRelativeName,
                citizenshipNumber: relative.citizenshipNumber,
                citizenshipIssuedDate: relative.citizenshipIssuedDate,
                citizenshipIssuedPlace: relative.citizenshipIssuedPlace
            }));
        });
        return relativeFormArray;
    }


}
