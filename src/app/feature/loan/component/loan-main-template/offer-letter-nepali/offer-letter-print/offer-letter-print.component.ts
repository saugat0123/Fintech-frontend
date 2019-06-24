import {Component, Input, OnInit} from '@angular/core';
import {LoanNepali} from '../model/loanNepali';

@Component({
    selector: 'app-offer-letter-print',
    templateUrl: './offer-letter-print.component.html',
    styleUrls: ['./offer-letter-print.component.scss']
})
export class OfferLetterPrintComponent implements OnInit {
    @Input()
    loanNepali: LoanNepali = new LoanNepali();

    constructor() {
    }

    ngOnInit() {
    }

}
