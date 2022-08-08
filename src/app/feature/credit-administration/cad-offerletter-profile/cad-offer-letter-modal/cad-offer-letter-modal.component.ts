import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import { MegaOfferLetterConst } from '../../mega-offer-letter-const';

@Component({
    selector: 'app-cad-offer-letter-modal',
    templateUrl: './cad-offer-letter-modal.component.html',
    styleUrls: ['./cad-offer-letter-modal.component.scss']
})
export class CadOfferLetterModalComponent implements OnInit {
    @Input() offerLetterType: any;
    @Input() cadOfferLetterApprovedDoc;

    offerLetterTypeConst = MegaOfferLetterConst;

    constructor(protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
    ) {
    }

    ngOnInit() {
    }

    onClose() {
        this.dialogRef.close();
    }

}
