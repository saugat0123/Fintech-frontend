import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveOfferLetterConst} from '../../../progressive-offer-letter-const';

@Component({
    selector: 'app-hypothecation-of-goods-and-receivables-a-print',
    templateUrl: './hypothecation-of-goods-and-receivables-a-print.component.html',
    styleUrls: ['./hypothecation-of-goods-and-receivables-a-print.component.scss']
})
export class HypothecationOfGoodsAndReceivablesAPrintComponent implements OnInit {
    @Input() printDocForm;
    @Input() nepaliData;
    offerLetterConst = ProgressiveOfferLetterConst;

    constructor() {
    }

    ngOnInit() {
    }

}