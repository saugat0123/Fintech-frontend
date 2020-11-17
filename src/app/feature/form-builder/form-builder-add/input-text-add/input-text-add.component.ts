import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-input-text-add',
    templateUrl: './input-text-add.component.html',
    styleUrls: ['./input-text-add.component.scss']
})
export class InputTextAddComponent implements OnInit {
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
