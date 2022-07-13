import {AfterViewChecked, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Editor} from '../../../@core/utils/constants/editor';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {FormType} from '../constants/formType';
import {Pattern} from '../../../@core/utils/constants/pattern';

@Component({
    selector: 'app-dynamic-forms',
    templateUrl: './dynamic-forms.component.html',
    styleUrls: ['./dynamic-forms.component.scss']
})
export class DynamicFormsComponent implements OnInit, AfterViewChecked {
    @Input()
    config: any;
    @Input()
    baseForm: any;
    @Input()
    preview: boolean;
    @Input()
    editPreviousValue: any;
    dynamicFormGroup: FormGroup;
    ckeConfig = Editor.CK_CONFIG;
    submitted = false;
    calendarType = 'AD';
    isFormBuild = false;
    FormType = FormType;
    INPUT_TYPE = FormType.INPUT_TYPE;


    constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.dynamicFormGroup = this.createGroup(this.config, this.editPreviousValue);
        if (!ObjectUtil.isEmpty(this.dynamicFormGroup.controls)) {
            this.isFormBuild = true;
            this.initializeArray();
        }
    }

    ngAfterViewChecked() {
        this.cdr.detectChanges();

    }

    createGroup(config, object) {
        const group = this.fb.group({});
        config.forEach(input => {
            if (input.type !== FormType.ADDRESS && input.type !== FormType.BREAK && input.type !== FormType.FORM_ARRAY) {
                group.addControl(input.id, this.createNewFormControlFb(input, object));
            } else if (input.type === FormType.ADDRESS) {
                const id = input.id;
                const prov = id + '_province';
                const district = id + '_district';
                const municipality = id + '_municipality';
                group.addControl(prov, this.createNewFormControlFbAddress(input, prov, object));
                group.addControl(district, this.createNewFormControlFbAddress(input, district, object));
                group.addControl(municipality, this.createNewFormControlFbAddress(input, municipality, object));


            } else if (input.type === FormType.FORM_ARRAY) {
                group.addControl(input.id, this.fb.array([]));
            }
        });
        return group;
    }

    dynamicFormControl(control) {
        return this.dynamicFormGroup.controls[control];
    }

    onSubmit() {
        this.submitted = true;
        if (this.dynamicFormGroup.invalid) {
            console.log('final value invalid:::', this.dynamicFormGroup.controls);
            return;
        }

        console.log('final value:::', this.dynamicFormGroup.value);
        this.editPreviousValue = this.dynamicFormGroup.value;
    }


    createNewFormControlFb(input, object) {
        if (input.settings[3].value) {
            // tslint:disable-next-line:max-line-length
            return this.fb.control(this.editPreviousValue ? this.editDynamicFormPatchValue(object, input.id) : undefined,
                input.type === FormType.TEXT ? this.inputTypeTextValidation(input) : [Validators.required]);
        } else {
            return this.fb.control(this.editPreviousValue ? this.editDynamicFormPatchValue(object, input.id) : undefined,
                input.type === FormType.TEXT ? this.inputTypeTextValidation(input) : []);
        }
    }


    createNewFormControlFbAddress(input, controlName, object) {
        if (input.settings[3].value) {
            // tslint:disable-next-line:max-line-length
            return this.fb.control(this.editPreviousValue ? this.editDynamicFormPatchValue(object, controlName) : undefined,
                [Validators.required]);
        } else {
            return this.fb.control(this.editPreviousValue ? this.editDynamicFormPatchValue(object, controlName) : undefined);
        }
    }

    editDynamicFormPatchValue(object, controlName) {
        const formValue = object[controlName];
        return formValue;
    }

    initializeArray() {
        this.config.forEach(c => {
            if (c.type === FormType.FORM_ARRAY) {
                const formArray = (this.dynamicFormGroup.controls[c.id] as FormArray);
                if (ObjectUtil.isEmpty(this.editPreviousValue)) {
                    formArray.push(this.createGroup(c.fields, this.editPreviousValue));
                } else {
                    const prevList = this.editPreviousValue[c.id];
                    if (prevList.length < 1) {
                        formArray.push(this.createGroup(c.fields, this.editPreviousValue));
                    } else {
                        prevList.forEach((p, index) => {
                            formArray.push(this.createGroup(c.fields, p));
                        });
                    }

                }


            }
        });


    }

    addControlInArray(control) {
        const field = this.createGroup(control.fields, {});
        (this.dynamicFormGroup.controls[control.id] as FormArray).push(field);
    }

    removeControlInArray(event) {
        (this.dynamicFormGroup.controls[event.control.id] as FormArray).removeAt(event.index);

    }

    inputTypeTextValidation(input) {
        const validation = [];
        const validationType = this.INPUT_TYPE.filter(i => i.value === input.settings[5].value)[0].id;
        if (validationType === 'Email') {
            validation.push(Validators.email);
        } else if (validationType === 'Alphabet') {
            validation.push(Validators.pattern(Pattern.ALPHABET_ONLY));
        } else if (validationType === 'Numeric') {
            validation.push(Validators.pattern(Pattern.NUMBER_DOUBLE));
        }
        if (input.settings[3].value) {
            validation.push(Validators.required);
        }
        const maxLength = input.settings[4].value;
        validation.push(Validators.maxLength(maxLength));
        return validation;
    }
}
