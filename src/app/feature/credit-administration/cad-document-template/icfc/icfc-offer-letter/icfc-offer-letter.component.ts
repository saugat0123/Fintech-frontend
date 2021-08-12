import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {IcfcOfferLetterConst} from '../icfc-offer-letter-const';

@Component({
    selector: 'app-icfc-offer-letter',
    templateUrl: './icfc-offer-letter.component.html',
    styleUrls: ['./icfc-offer-letter.component.scss']
})
export class IcfcOfferLetterComponent implements OnInit {
    @Input() offerLetterType;
    @Input() cadOfferLetterApprovedDoc;
    offerLetterConst = IcfcOfferLetterConst;

    constructor(
        private dialogRef: NbDialogRef<IcfcOfferLetterComponent>) {
    }

    ngOnInit() {

    }

    onClose() {
        this.dialogRef.close();
    }
}
