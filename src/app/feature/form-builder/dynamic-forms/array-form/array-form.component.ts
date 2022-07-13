import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {FormType} from '../../constants/formType';

@Component({
    selector: 'app-array-form',
    templateUrl: './array-form.component.html',
    styleUrls: ['./array-form.component.scss']
})
export class ArrayFormComponent implements OnInit {
    @Input() fieldData: any;
    @Input() isFormBuild: boolean;
    @Input() dynamicFormGroup: FormGroup;
    @Input() submitted: boolean;
    @Output() removeControl = new EventEmitter<any>();
    @Output() addControl = new EventEmitter<any>();
    FormType = FormType;
    calendarType = 'AD';

    constructor() {

    }

    ngOnInit() {
    }

    dynamicFormControl(control) {
        return this.dynamicFormGroup.controls[control];
    }

    getArrayControl(control) {
        const obj: FormArray = this.dynamicFormGroup.controls[control] as FormArray;
        return obj;
    }

    add() {
        this.addControl.emit(true);
    }

    remove(index) {
        const value = {
            control: this.fieldData,
            index: index
        };
        this.removeControl.emit(value);
    }


}
