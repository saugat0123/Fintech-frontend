import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-birth-mark-letter-print',
    templateUrl: './birth-mark-letter-print.component.html',
    styleUrls: ['./birth-mark-letter-print.component.scss']
})
export class BirthMarkLetterPrintComponent implements OnInit {
    @Input()
    letter: any;

    constructor() {
    }

    ngOnInit() {
    }

}
