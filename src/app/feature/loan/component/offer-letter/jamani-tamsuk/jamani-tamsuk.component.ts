import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {CustomerOfferLetter} from '../../../model/customer-offer-letter';

@Component({
    selector: 'app-jamani-tamsuk',
    templateUrl: './jamani-tamsuk.component.html',
    styleUrls: ['./jamani-tamsuk.component.scss']
})
export class JamaniTamsukComponent implements OnInit {

    @Input() loanDataHolder: LoanDataHolder;
    customerOfferLetter: CustomerOfferLetter;
    @Input() customerId: number;
    @Input() offerLetterTypeId: number;

    constructor() {
    }

    ngOnInit() {

    }

}
