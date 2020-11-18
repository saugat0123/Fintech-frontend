import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Editor} from '../../../../@core/utils/constants/editor';

@Component({
    selector: 'app-input-textarea-form',
    templateUrl: './input-textarea-form.component.html',
    styleUrls: ['./input-textarea-form.component.scss']
})
export class InputTextareaFormComponent implements OnInit {
    @Input() field: any;
    @Input() dynamicFormGroup: FormGroup;
    @Input() submitted: boolean;
    ckeConfig = Editor.CK_CONFIG;

    constructor() {
    }

    ngOnInit() {
    }

    dynamicFormControl(control) {
        return this.dynamicFormGroup.controls[control];
    }

}
