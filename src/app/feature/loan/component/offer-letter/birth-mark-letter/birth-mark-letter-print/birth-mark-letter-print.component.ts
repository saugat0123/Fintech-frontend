import {Component, Input, OnInit} from '@angular/core';
import {LoanNepali} from '../../model/loanNepali';

@Component({
    selector: 'app-birth-mark-letter-print',
    templateUrl: './birth-mark-letter-print.component.html',
    styleUrls: ['./birth-mark-letter-print.component.scss']
})
export class BirthMarkLetterPrintComponent implements OnInit {
    @Input()
    loanNepali: LoanNepali = new LoanNepali();

    constructor() {
    }

    ngOnInit() {
    }

}
