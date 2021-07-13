import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveOfferLetterConst} from '../../progressive-offer-letter-const';

@Component({
    selector: 'app-offer-letter-corporate-print',
    templateUrl: './offer-letter-corporate-print.component.html',
    styleUrls: ['./offer-letter-corporate-print.component.scss']
})
export class OfferLetterCorporatePrintComponent implements OnInit {

    @Input() printDocForm;
    @Input() nepaliData;
    offerLetterConst = ProgressiveOfferLetterConst;

    constructor() {
    }

    ngOnInit() {
    }

}
