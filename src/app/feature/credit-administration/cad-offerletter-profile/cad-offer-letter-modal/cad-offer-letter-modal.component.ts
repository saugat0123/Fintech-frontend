import {Component, Input, OnInit} from '@angular/core';
import {MegaOfferLetterConst} from '../../mega-offer-letter-const';
import {NbDialogRef} from '@nebular/theme';
import {NabilOfferLetterConst} from '../../nabil-offer-letter-const';

@Component({
    selector: 'app-cad-offer-letter-modal',
    templateUrl: './cad-offer-letter-modal.component.html',
    styleUrls: ['./cad-offer-letter-modal.component.scss']
})
export class CadOfferLetterModalComponent implements OnInit {
    @Input() offerLetterType;
    @Input() cadOfferLetterApprovedDoc;

    offerLetterTypeConst = NabilOfferLetterConst;

    constructor(protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
    ) {
    }

    ngOnInit() {
    }

    onClose() {
        this.dialogRef.close();
    }

}
