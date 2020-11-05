import {Component, Input, OnInit} from '@angular/core';
import {OfferLetterConst} from '../../../offer-letter/model/offer-letter-const';
import {MegaOfferLetterConst} from "../../model/mega-offer-letter-const";

@Component({
    selector: 'app-retail-mortgage-print',
    templateUrl: './retail-mortgage-print.component.html',
    styleUrls: ['./retail-mortgage-print.component.scss']
})
export class RetailMortgagePrintComponent implements OnInit {
    @Input() form: any;
    offerLetterConst = OfferLetterConst;
    megaofferLetterConst = MegaOfferLetterConst;

    constructor() {
    }

    ngOnInit() {
    }

}
