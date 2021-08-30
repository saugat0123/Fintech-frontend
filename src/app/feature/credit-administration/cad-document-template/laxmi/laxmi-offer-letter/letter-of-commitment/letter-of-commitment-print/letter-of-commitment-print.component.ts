import {Component, Input, OnInit} from '@angular/core';
import {LaxmiOfferLetterConst} from '../../laxmi-offer-letter-const';

@Component({
    selector: 'app-letter-of-commitment-print',
    templateUrl: './letter-of-commitment-print.component.html',
    styleUrls: ['./letter-of-commitment-print.component.scss']
})
export class LetterOfCommitmentPrintComponent implements OnInit {
    @Input() printDocForm;
    @Input() nepaliData;
    offerLetterConst = LaxmiOfferLetterConst;

    constructor() {
    }

    ngOnInit() {
    }

}
