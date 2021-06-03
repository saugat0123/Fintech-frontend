import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {ProgressiveOfferLetterConst} from '../progressive-offer-letter-const';

@Component({
    selector: 'app-progressive-offer-letter',
    templateUrl: './progressive-offer-letter.component.html',
    styleUrls: ['./progressive-offer-letter.component.scss']
})
export class ProgressiveOfferLetterComponent implements OnInit {
    @Input() offerLetterType;
    @Input() cadOfferLetterApprovedDoc;
    offerLetterConst = ProgressiveOfferLetterConst;

    constructor(
        private dialogRef: NbDialogRef<ProgressiveOfferLetterComponent>) {
    }

    ngOnInit() {

    }

    onClose() {
        this.dialogRef.close();
    }

}
