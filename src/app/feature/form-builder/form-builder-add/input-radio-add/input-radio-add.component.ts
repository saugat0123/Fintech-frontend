import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-input-radio-add',
    templateUrl: './input-radio-add.component.html',
    styleUrls: ['./input-radio-add.component.scss']
})
export class InputRadioAddComponent implements OnInit {


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
