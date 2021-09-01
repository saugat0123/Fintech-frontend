import {Component, Input, OnInit} from '@angular/core';
import {LaxmiOfferLetterConst} from '../../laxmi-offer-letter-const';

@Component({
    selector: 'app-personal-guarantee-print',
    templateUrl: './personal-guarantee-print.component.html',
    styleUrls: ['./personal-guarantee-print.component.scss']
})
export class PersonalGuaranteePrintComponent implements OnInit {
    @Input() printDocForm;
    @Input() nepaliData;
    offerLetterConst = LaxmiOfferLetterConst;

    constructor() {
    }

    ngOnInit() {
    }

}
