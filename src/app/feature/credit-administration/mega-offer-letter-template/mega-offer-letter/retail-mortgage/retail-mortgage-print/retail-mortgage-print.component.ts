import {Component, Input, OnInit} from '@angular/core';
import {MegaOfferLetterConst} from '../../../../mega-offer-letter-const';

@Component({
    selector: 'app-retail-mortgage-print',
    templateUrl: './retail-mortgage-print.component.html',
    styleUrls: ['./retail-mortgage-print.component.scss']
})
export class RetailMortgagePrintComponent implements OnInit {
    @Input() form: any;
    offerLetterConst = MegaOfferLetterConst;

    constructor() {
    }

    ngOnInit() {
    }

}
