import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-input-date-add',
    templateUrl: './input-date-add.component.html',
    styleUrls: ['./input-date-add.component.scss']
})
export class InputDateAddComponent implements OnInit {

    @Input() field: any;
    @Input() selectedField: any;
    @Output() removeField = new EventEmitter<any>();
    @Input() calendarType: any;

    constructor() {
    }

    ngOnInit() {
    }

    removeElement() {
        this.removeField.emit(true);
    }
}
