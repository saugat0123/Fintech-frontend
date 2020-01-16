import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {CustomerOfferLetter} from '../../../model/customer-offer-letter';

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

    constructor() {
    }

    ngOnInit() {

    }

}
