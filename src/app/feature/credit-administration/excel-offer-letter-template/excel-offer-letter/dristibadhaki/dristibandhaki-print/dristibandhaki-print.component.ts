import {Component, Input, OnInit} from '@angular/core';
import {ExcelOfferLetterConst} from '../../../../../cad-documents/cad-document-core/excel-offer-letter/excel-offer-letter-const';

@Component({
    selector: 'app-dristibandhaki-print',
    templateUrl: './dristibandhaki-print.component.html',
    styleUrls: ['./dristibandhaki-print.component.scss']
})
export class DristibandhakiPrintComponent implements OnInit {

    @Input() printDocForm;
    offerLetterConst = ExcelOfferLetterConst;

    constructor() {
    }

    ngOnInit() {
    }

}
