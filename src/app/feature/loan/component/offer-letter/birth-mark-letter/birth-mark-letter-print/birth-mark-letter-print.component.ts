import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
    selector: 'app-birth-mark-letter-print',
    templateUrl: './birth-mark-letter-print.component.html',
    styleUrls: ['./birth-mark-letter-print.component.scss']
})
export class BirthMarkLetterPrintComponent implements OnInit {
    @Input()
    form: FormGroup;

    constructor() {
    }

    ngOnInit() {
    }

}
