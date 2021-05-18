import {Component, OnInit, Input} from '@angular/core';
import {ExcelOfferLetterConst} from '../../../../../cad-documents/cad-document-core/excel-offer-letter/excel-offer-letter-const';

@Component({
    selector: 'app-pledge-deed-first-print',
    templateUrl: './pledge-deed-first-print.component.html',
    styleUrls: ['./pledge-deed-first-print.component.scss']
})
export class PledgeDeedFirstPrintComponent implements OnInit {
    @Input() printDocForm;

    offerLetterConst = ExcelOfferLetterConst;

    constructor() {
    }

    ngOnInit() {
    }

}
