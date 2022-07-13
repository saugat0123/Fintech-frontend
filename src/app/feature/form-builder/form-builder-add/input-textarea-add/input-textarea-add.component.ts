import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Editor} from '../../../../@core/utils/constants/editor';

@Component({
    selector: 'app-input-textarea-add',
    templateUrl: './input-textarea-add.component.html',
    styleUrls: ['./input-textarea-add.component.scss']
})
export class InputTextareaAddComponent implements OnInit {
    @Input() field: any;
    @Input() selectedField: any;
    @Output() removeField = new EventEmitter<any>();
    ckeConfig = Editor.CK_CONFIG;
    constructor() {
    }

    ngOnInit() {
    }

    removeElement() {
        this.removeField.emit(true);
    }
}

