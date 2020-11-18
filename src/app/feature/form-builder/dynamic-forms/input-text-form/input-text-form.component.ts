import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormType} from '../../constants/formType';
import {Pattern} from '../../../../@core/utils/constants/pattern';

@Component({
    selector: 'app-input-text-form',
    templateUrl: './input-text-form.component.html',
    styleUrls: ['./input-text-form.component.scss']
})
export class InputTextFormComponent implements OnInit {
    @Input() field: any;
    @Input() dynamicFormGroup: FormGroup;
    @Input() submitted: boolean;
    pattern = Pattern;
    constructor() {
    }

    ngOnInit() {
    }

    dynamicFormControl(control) {
        return this.dynamicFormGroup.controls[control];
    }
}
