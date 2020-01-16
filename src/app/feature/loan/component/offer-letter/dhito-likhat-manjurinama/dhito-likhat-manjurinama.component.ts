import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {CustomerOfferLetter} from '../../../model/customer-offer-letter';

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

    constructor() {
    }

    ngOnInit() {

    }

}
