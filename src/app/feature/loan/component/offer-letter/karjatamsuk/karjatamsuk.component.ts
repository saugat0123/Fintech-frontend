import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../model/loanData';
import {CustomerOfferLetter} from '../../../model/customer-offer-letter';

@Component({
    selector: 'app-karjatamsuk',
    templateUrl: './karjatamsuk.component.html',
    styleUrls: ['./karjatamsuk.component.scss']
})
export class KarjatamsukComponent implements OnInit {

    @Input() loanDataHolder: LoanDataHolder;
    customerOfferLetter: CustomerOfferLetter;
    @Input() customerId: number;
    @Input() offerLetterTypeId: number;

    constructor() {
    }

    ngOnInit() {

    }

}
