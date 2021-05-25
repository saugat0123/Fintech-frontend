import {Component, Input, OnInit} from '@angular/core';
import {ExcelOfferLetterConst} from '../../../../../cad-documents/cad-document-core/excel-offer-letter/excel-offer-letter-const';

@Component({
    selector: 'app-pg-firm-print',
    templateUrl: './pg-firm-print.component.html',
    styleUrls: ['./pg-firm-print.component.scss']
})
export class PgFirmPrintComponent implements OnInit {

    @Input() printDocForm;
    @Input() nepaliData;
    offerLetterConst = ExcelOfferLetterConst;

    constructor() {
    }

    ngOnInit() {
    }

}
