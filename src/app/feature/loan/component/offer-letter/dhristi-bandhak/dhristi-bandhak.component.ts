import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {CustomerOfferLetter} from '../../../model/customer-offer-letter';

@Component({
    selector: 'app-dhristi-bandhak',
    templateUrl: './dhristi-bandhak.component.html',
    styleUrls: ['./dhristi-bandhak.component.scss']
})
export class DhristiBandhakComponent implements OnInit {

    @Input() loanDataHolder: LoanDataHolder;
    customerOfferLetter: CustomerOfferLetter;
    @Input() customerId: number;
    @Input() offerLetterTypeId: number;

    constructor() {
    }

    ngOnInit() {

    }

}
