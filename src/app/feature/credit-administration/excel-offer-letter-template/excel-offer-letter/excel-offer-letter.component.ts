import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {ExcelOfferLetterConst} from '../../../cad-documents/cad-document-core/excel-offer-letter/excel-offer-letter-const';

@Component({
    selector: 'app-excel-offer-letter',
    templateUrl: './excel-offer-letter.component.html',
    styleUrls: ['./excel-offer-letter.component.scss']
})
export class ExcelOfferLetterComponent implements OnInit {

    @Input() offerLetterType;
    @Input() cadOfferLetterApprovedDoc;
    excelOfferLetterConst = ExcelOfferLetterConst;

    constructor(
        private dialogRef: NbDialogRef<ExcelOfferLetterComponent>) {
    }

    ngOnInit() {

    }

    onClose() {
        this.dialogRef.close();
    }

}
