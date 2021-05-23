import {Component, Input, OnInit} from '@angular/core';
import {ExcelOfferLetterConst} from '../../../../../cad-documents/cad-document-core/excel-offer-letter/excel-offer-letter-const';

@Component({
    selector: 'app-pg-retail-loan-print',
    templateUrl: './pg-retail-loan-print.component.html',
    styleUrls: ['./pg-retail-loan-print.component.scss']
})
export class PgRetailLoanPrintComponent implements OnInit {

    @Input() printDocForm;
    @Input() nepaliData;
    offerLetterConst = ExcelOfferLetterConst;

    constructor() {
    }

    ngOnInit() {
    }

}
