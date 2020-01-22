import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {CustomerOfferLetter} from '../../../model/customer-offer-letter';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-pratigya-patra',
    templateUrl: './pratigya-patra.component.html',
    styleUrls: ['./pratigya-patra.component.scss']
})
export class PratigyaPatraComponent implements OnInit {
    @Input() loanDataHolder: LoanDataHolder;
    customerOfferLetter: CustomerOfferLetter;
    @Input() customerId: number;
    @Input() offerLetterTypeId: number;
    offerform: FormGroup;
    existingOfferLetter = false;
    spinner = false;
    initialInfoPrint;
    constructor(private offerBuilder: FormBuilder) {
    }

    ngOnInit() {

    }
    buildForm() {
        this.offerform = this.offerBuilder.group({
            loanamount: [undefined] ,
            companyno: [undefined] ,
            companyname: [undefined] ,
            loanamount2: [undefined] ,
            customerName: [undefined] ,
            interestamount: [undefined] ,
        });
    }
}
