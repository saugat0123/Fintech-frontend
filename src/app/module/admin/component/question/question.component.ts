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
    questionList: Array<Questions> = new Array<Questions>();
    schemeList: Array<Scheme> = new Array<Scheme>();
    questions: Array<Questions> = new Array<Questions>();
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
    }

    addQuestionField() {
        let control = <FormArray>this.questionAnswerForm.controls.questionForm;
        control.push(
            this.formBuilder.group({
                answerForm: this.formBuilder.array([]),
                qsnDescription: [undefined, Validators.required],
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
                ansDescription: [undefined, Validators.required],
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
                    qsnDescription: qsn.description,
                    answerForm: this.setAnswers(qsn),
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
                ansDescription: ans.description,
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
            this.questions = this.questionAnswerForm.value.questionForm;
        });
    }

    clearFormArray() {
        let control = <FormArray>this.questionAnswerForm.controls.questionForm;
        control.controls = [];
    }

    onSubmit() {
        this.commonService.saveOrEditQuestion(this.questions, this.questionApi).subscribe(result => {
                alert('success !!');
                this.questions = new Array<Questions>();
                this.router.navigate(['home/question']);
            }, error => {
                this.questions = new Array<Questions>();
                alert('success !!');
                this.questions = new Array<Questions>();
                this.router.navigate(['home/question']);
            }
        );
    }

}
