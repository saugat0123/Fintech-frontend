import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-letter-of-arrangements',
    templateUrl: './letter-of-arrangements.component.html',
    styleUrls: ['./letter-of-arrangements.component.scss']
})
export class LetterOfArrangementsComponent implements OnInit {
    @Input() offerLetterType;
    @Input() cadOfferLetterApprovedDoc;

    constructor() {
    }

    ngOnInit() {
    }

}
