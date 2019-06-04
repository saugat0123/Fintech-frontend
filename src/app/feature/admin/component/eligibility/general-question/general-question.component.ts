import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-general-question',
    templateUrl: './general-question.component.html',
    styleUrls: ['./general-question.component.scss']
})
export class GeneralQuestionComponent implements OnInit {
    generalQuestionForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.generalQuestionForm = this.formBuilder.group({
            questions: this.formBuilder.array([
                this.formBuilder.group({
                    questionIdentifier: [undefined, Validators.required],
                    description: [undefined, Validators.required],
                    appearanceOrder: [undefined, Validators.required]
                })
            ])
        });
    }

    addQuestionField() {
        const control = this.generalQuestionForm.controls.questions as FormArray;
        control.push(
            this.formBuilder.group({
                questionIdentifier: [undefined, Validators.required],
                description: [undefined, Validators.required],
                appearanceOrder: [undefined, Validators.required]
            })
        );
    }

    deleteQuestionField(index) {
        const control = this.generalQuestionForm.controls.questions as FormArray;
        control.removeAt(index);
    }

}
