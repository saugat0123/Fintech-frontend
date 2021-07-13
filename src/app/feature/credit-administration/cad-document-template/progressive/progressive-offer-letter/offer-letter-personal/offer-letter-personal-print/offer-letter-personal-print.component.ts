import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveOfferLetterConst} from '../../progressive-offer-letter-const';

@Component({
    selector: 'app-offer-letter-personal-print',
    templateUrl: './offer-letter-personal-print.component.html',
    styleUrls: ['./offer-letter-personal-print.component.scss']
})
export class OfferLetterPersonalPrintComponent implements OnInit {
    @Input() printDocForm;
    @Input() nepaliData;
    offerLetterConst = ProgressiveOfferLetterConst;

    constructor() {
    }

    ngOnInit() {
    }

}
