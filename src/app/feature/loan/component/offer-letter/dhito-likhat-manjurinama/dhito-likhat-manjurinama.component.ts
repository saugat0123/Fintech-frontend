import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {CustomerOfferLetter} from '../../../model/customer-offer-letter';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-dhito-likhat-manjurinama',
    templateUrl: './dhito-likhat-manjurinama.component.html',
    styleUrls: ['./dhito-likhat-manjurinama.component.scss']
})
export class DhitoLikhatManjurinamaComponent implements OnInit {

    @Input() loanDataHolder: LoanDataHolder;
    customerOfferLetter: CustomerOfferLetter;
    @Input() customerId: number;
    @Input() offerLetterTypeId: number;
    dhitoForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
     this.buildForm();
    }

    buildForm() {
        this.dhitoForm = this.formBuilder.group({
            customerDetail : this.formBuilder.array([]),
            loanName : [undefined],
            interestRateLoan : [undefined],
            loanTenure : [undefined],
            loanAmount : [undefined],
            loanAmountInWord : [undefined]
        });
        this.addCustomerDetail();

    }

    addCustomerDetail() {
        (this.dhitoForm.get('customerDetail') as FormArray).push(
            this.formBuilder.group({
                grandFathername : [undefined],
                fatherName : [undefined],
                district : [undefined],
                municipality : [undefined],
                wardNo : [undefined],
                currentDistrict: [undefined],
                currentMunicipality : [undefined],
                currentWardNo : [undefined],
                customerAge : [undefined],
                customerName : [undefined],
                citizenshipNo : [undefined],
                citizenIssuedDate : [undefined],
                citizenIssuedDistrict: [undefined]
            })
        );

    }
}
