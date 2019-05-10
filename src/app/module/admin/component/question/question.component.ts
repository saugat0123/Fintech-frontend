import {Component, OnInit} from '@angular/core';
import {Questions} from '../../modal/question';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';
import {Scheme} from '../../modal/scheme';
import {Router} from '@angular/router';

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
    schemeApi: string;
    questionApi: string;
    schemeID: number;
    questionID: number;
    updateButton: boolean;
    saveButton: boolean;
    questionList: Array<Questions> = new Array<Questions>();
    schemeList: Array<Scheme> = new Array<Scheme>();
    questions: Array<Questions> = new Array<Questions>();
    qsnContent: Questions = new Questions();
    questionAnswerForm: FormGroup;

    constructor(private formBuilder: FormBuilder,
                private commonService: CommonService,
                private dataService: CommonDataService,
                private router: Router) {

        this.questionAnswerForm = this.formBuilder.group({
            schemeId: [undefined, Validators.required],
            questionForm: this.formBuilder.array([])
        });

    }

    ngOnInit() {
        this.schemeApi = 'v1/companies/3/schemes';
        this.getSchemeList();
        this.updateButton = false;
        this.saveButton = false;
    }

    addQuestionField() {
        let control = <FormArray>this.questionAnswerForm.controls.questionForm;
        control.push(
            this.formBuilder.group({
                answers: this.formBuilder.array([]),
                description: [undefined, Validators.required],
                scheme: this.formBuilder.group({
                    id: [this.schemeID]
                })
            })
        );
    }

    deleteQuestionField(index) {
        let control = <FormArray>this.questionAnswerForm.controls.questionForm;
        control.removeAt(index);
    }

    addAnswerField(control) {
        control.push(
            this.formBuilder.group({
                description: [undefined, Validators.required],
                points: [undefined, Validators.required]
            })
        );
    }

    deleteAnswerField(control, index) {
        control.removeAt(index);
    }

    getSchemeList() {
        this.commonService.getByGetAllPageable(this.schemeApi, 1, 10).subscribe((response: any) => {
            this.schemeList = response.detail.content;
        });
    }

    setQuestions() {
        let control = <FormArray>this.questionAnswerForm.controls.questionForm;
        this.questionList.forEach(qsn => {
            control.push(this.formBuilder.group({
                    id: qsn.id,
                    description: qsn.description,
                    version: qsn.version,
                    answers: this.setAnswers(qsn),
                    scheme: this.formBuilder.group({
                        id: [this.schemeID]
                    })
                })
            );
        });
    }

    setAnswers(qsn) {
        let arr = new FormArray([]);
        qsn.answers.forEach(ans => {
            arr.push(this.formBuilder.group({
                description: ans.description,
                version: ans.version,
                points: ans.points
            }));
        });
        return arr;
    }

    onChangeSchemeOption() {
        this.clearFormArray();
        this.schemeID = this.questionAnswerForm.get('schemeId').value;
        this.questionApi = 'v1/companies/0/schemes/' + this.schemeID + '/questions';

        this.commonService.getByGetAllPageable(this.questionApi, 1, 10).subscribe((response: any) => {
            this.questionList = response.detail;
            this.setQuestions();

            if (this.questionList.length !== 0) {
                this.updateButton = true;
                this.saveButton = false;
            } else {
                this.saveButton = true;
                this.updateButton = false;
                this.addQuestionField();
            }
            this.questionAnswerForm.value.questionForm = this.questionList;
            console.log(this.questionAnswerForm.value.questionForm);
        });
    }

    clearFormArray() {
        let control = <FormArray>this.questionAnswerForm.controls.questionForm;
        control.controls = [];
    }

    onSave() {
        this.questions = this.questionAnswerForm.value.questionForm;
        console.log(this.questions);
        console.log(this.questionApi);
        this.commonService.saveQuestion(this.questions, this.questionApi).subscribe(result => {

                alert('success !!');
                this.questions = new Array<Questions>();
                this.router.navigate(['home/question']);
                this.onChangeSchemeOption();

            }, error => {
                this.questions = new Array<Questions>();
                alert('failed !!');
                this.questions = new Array<Questions>();
                this.router.navigate(['home/question']);
            }
        );
    }

    onUpdate(qsnID, qsnContent) {
        this.qsnContent = qsnContent;
        this.questionID = qsnID;
        this.commonService.updateQuestion(this.qsnContent, this.questionApi + '/' + this.questionID).subscribe(result => {

                alert('success !!');
                this.questions = new Array<Questions>();
                this.router.navigate(['home/question']);
                this.onChangeSchemeOption();

            }, error => {
                this.questions = new Array<Questions>();
                alert('failed !!');
                this.questions = new Array<Questions>();
                this.router.navigate(['home/question']);
            }
        );
    }

}
