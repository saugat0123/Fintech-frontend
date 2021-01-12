import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NbDialogRef} from '@nebular/theme';

@Component({
    selector: 'app-add-additional-document',
    templateUrl: './add-additional-document.component.html',
    styleUrls: ['./add-additional-document.component.scss']
})
export class AddAdditionalDocumentComponent implements OnInit {
    addDocForm: FormGroup;

    constructor(private formBuilder: FormBuilder,
                private dialogRef: NbDialogRef<AddAdditionalDocumentComponent>) {
    }

    ngOnInit() {
        this.buildForm();
    }

    buildForm() {
        this.addDocForm = this.formBuilder.group({
            docName: [undefined, [Validators.required]],
            docPath: [undefined],
            uploadOn: [new Date()],
            remarks: [undefined]
        });
    }

    addDocInput(event) {
        console.log(event);
        console.log(event);
        alert(event);
    }

    submit() {

    }

    onClose() {
        this.dialogRef.close();
    }
}
