import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormType} from '../../constants/formType';

@Component({
    selector: 'app-input-text-add',
    templateUrl: './input-text-add.component.html',
    styleUrls: ['./input-text-add.component.scss']
})
export class InputTextAddComponent implements OnInit {
    @Input() field: any;
    @Input() selectedField: any;
    @Output() removeField = new EventEmitter<any>();
    INPUT_TYPE = FormType.INPUT_TYPE;

    constructor() {
    }

    ngOnInit() {
    }

    removeElement() {
        this.removeField.emit(true);
    }

    getType(setup) {
        return this.INPUT_TYPE.filter(r => r.value === setup)[0].type;
    }

}
