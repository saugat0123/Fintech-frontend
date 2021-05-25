import {Component, Input, OnInit} from '@angular/core';
import {ExcelOfferLetterConst} from '../../../../../cad-documents/cad-document-core/excel-offer-letter/excel-offer-letter-const';

@Component({
    selector: 'app-dp-note-borrower-print',
    templateUrl: './dp-note-borrower-print.component.html',
    styleUrls: ['./dp-note-borrower-print.component.scss']
})
export class DpNoteBorrowerPrintComponent implements OnInit {

    @Input() printDocForm;
    @Input() nepaliData;
    offerLetterConst = ExcelOfferLetterConst;

    constructor() {
    }

    ngOnInit() {
    }

}
