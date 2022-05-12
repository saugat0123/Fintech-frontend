import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Editor} from '../utils/constants/editor';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../utils/ObjectUtil';

@Component({
    selector: 'app-ck-editor',
    templateUrl: './ck-editor.component.html',
    styleUrls: ['./ck-editor.component.scss']
})
export class CkEditorComponent implements OnInit {

    ckeConfig = Editor.CK_CONFIG;
    @Input() label; // pass label from parent class
    @Input()
    controlName: any; // optional
    @Input() placeHolder;
    @Output() ckValue: EventEmitter<any> = new EventEmitter();
     form: FormGroup;
    @Input() required = true;
    submitted = false;
    @Input() defaultValue: any; // optional
    @Input() editedData: any;

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit() {
            this.buildForm();
            if (!ObjectUtil.isEmpty(this.editedData)){
                this.form.patchValue({
                    value: this.editedData ? this.editedData : ''
                });
            } else {
            this.form.patchValue({
                value: this.defaultValue ? this.defaultValue : ''
            });
            }
    }

    buildForm(){
        this.form = this.formBuilder.group({
            value: [undefined, this.required ? Validators.required : '']
        });
    }

    // call this method from parent class using @ViewChild decorator;
    onSubmit() {
        this.submitted = true;
        if(!this.form.invalid) {
        this.ckValue.emit(this.form.get('value').value);
        } else {
            return;
        }
    }

}
