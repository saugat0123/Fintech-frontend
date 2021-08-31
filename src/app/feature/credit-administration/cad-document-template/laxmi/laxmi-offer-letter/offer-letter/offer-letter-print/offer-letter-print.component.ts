import {Component, Input, OnInit} from '@angular/core';
import {LaxmiOfferLetterConst} from '../../laxmi-offer-letter-const';

@Component({
    selector: 'app-offer-letter-print',
    templateUrl: './offer-letter-print.component.html',
    styleUrls: ['./offer-letter-print.component.scss']
})
export class OfferLetterPrintComponent implements OnInit {
    @Input() printDocForm;
    @Input() nepaliData;
    offerLetterConst = LaxmiOfferLetterConst;

    constructor() {
    }

    ngOnInit() {
    }

}
