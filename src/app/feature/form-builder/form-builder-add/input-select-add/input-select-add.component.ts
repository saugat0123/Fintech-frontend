import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-input-select-add',
    templateUrl: './input-select-add.component.html',
    styleUrls: ['./input-select-add.component.scss']
})
export class InputSelectAddComponent implements OnInit {

    @Input() field: any;
    @Input() selectedField: any;
    @Output() removeField = new EventEmitter<any>();

    constructor() {
    }

    ngOnInit() {
    }

    removeElement() {
        this.removeField.emit(true);
    }

}
