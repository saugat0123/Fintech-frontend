import {Component, OnInit, TemplateRef} from '@angular/core';
import {Questions} from '../../modal/question';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {Scheme} from '../../modal/scheme';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
    schemeApi: string;
    questionApi: string;
    schemeID: number;
    totalObtainablePoints: number;
    existingQuestionList: boolean;
    newQuestionList: boolean;
    task: string;
    questionList: Array<Questions> = new Array<Questions>();
    schemeList: Array<Scheme> = new Array<Scheme>();
    qsnContent: Questions = new Questions();
    addEditQuestionForm: FormGroup;
    questionAnswerForm: FormGroup;

    private modalRef: NgbModalRef;

    constructor(private formBuilder: FormBuilder,
                private commonService: CommonService,
                private router: Router,
                private modalService: NgbModal) {

        this.questionAnswerForm = this.formBuilder.group({
            schemeId: [undefined, Validators.required],
            schemeTotal: [undefined],
            questionForm: this.formBuilder.array([])
        });

    }

    ngOnInit() {
        this.schemeApi = 'v1/companies/1/schemes';
        this.getSchemeList();
        this.existingQuestionList = false;
        this.newQuestionList = false;
    }

    getSchemeList() {
        this.commonService.getByGetAllPageable(this.schemeApi, 1, 10).subscribe((response: any) => {
            this.schemeList = response.detail.content;
        });
    }

    addQuestionField() {
        const control = <FormArray>this.questionAnswerForm.controls.questionForm;
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
        const control = <FormArray>this.questionAnswerForm.controls.questionForm;
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

    onChangeSchemeOption() {
        this.clearFormArray();
        this.totalObtainablePoints = 0;
        this.schemeID = this.questionAnswerForm.get('schemeId').value;
        this.questionApi = 'v1/companies/0/schemes/' + this.schemeID + '/questions';

        this.commonService.getByGetAllPageable(this.questionApi, 1, 10).subscribe((response: any) => {
            this.questionList = response.detail;

            this.questionList.forEach(qsn => {
                this.totalObtainablePoints = this.totalObtainablePoints + qsn.maximumPoints;
            });

            if (this.questionList.length !== 0) {
                this.existingQuestionList = true;
                this.newQuestionList = false;
            } else {
                this.clearFormArray();
                this.newQuestionList = true;
                this.existingQuestionList = false;
                this.addQuestionField();
            }
        });
    }

    clearFormArray() {
        const control = <FormArray>this.questionAnswerForm.controls.questionForm;
        control.controls = [];
    }

    buildForm() {
        this.addEditQuestionForm = this.formBuilder.group({
            id: [this.qsnContent.id === undefined ? 0 : this.qsnContent.id, Validators.required],
            answers: this.formBuilder.array([]),
            description: [this.qsnContent.description === undefined ? '' : this.qsnContent.description, Validators.required],
            version: [this.qsnContent.version === undefined ? '' : this.qsnContent.version],
            scheme: this.formBuilder.group({
                id: [this.schemeID]
            })
        });
        if (this.task === 'Edit') {
            this.setAnswers(this.qsnContent);
        } else {
            this.addAnswerFieldForEdit();
        }
    }

    setAnswers(qsnContent) {
        const control = <FormArray>this.addEditQuestionForm.controls.answers;
        qsnContent.answers.forEach(ans => {
            control.push(this.formBuilder.group({
                    id: ans.id,
                    description: ans.description,
                    points: ans.points,
                    version: ans.version
                })
            );
        });
    }

    openEditQuestion(qsnContent: Questions, template: TemplateRef<any>) {
        this.task = 'Edit';
        this.qsnContent = qsnContent;
        this.buildForm();

        this.modalRef = this.modalService.open(template, {backdrop: 'static'});
    }

    openAddQuestion(template: TemplateRef<any>) {
        this.task = 'Add';
        this.qsnContent = new Questions();
        this.buildForm();

        this.modalRef = this.modalService.open(template, {backdrop: 'static'});
    }

    addAnswerFieldForEdit() {
        const control = <FormArray>this.addEditQuestionForm.controls.answers;
        control.push(
            this.formBuilder.group({
                description: [undefined, Validators.required],
                points: [undefined, Validators.required]
            })
        );
    }

    deleteAnswerFieldForEdit(index) {
        const control = <FormArray>this.addEditQuestionForm.controls.answers;
        control.removeAt(index);
    }

    onSave() {
        this.questionList = this.questionAnswerForm.value.questionForm;
        this.commonService.saveQuestion(this.questionList, this.questionApi).subscribe(result => {

                alert('success !!');
                this.questionList = new Array<Questions>();
                this.router.navigate(['home/question']);
                this.onChangeSchemeOption();

            }, error => {
                this.questionList = new Array<Questions>();
                alert('failed !!');
                this.router.navigate(['home/question']);
            }
        );
    }

    onUpdate(newQsnContent) {
        this.qsnContent = this.addEditQuestionForm.value;
        this.commonService.updateQuestion(newQsnContent, this.questionApi + '/' + this.qsnContent.id).subscribe(result => {

                alert('success !!');
                this.questionList = new Array<Questions>();
                this.router.navigate(['home/question']);
                this.onChangeSchemeOption();
                this.modalService.dismissAll('Close modal');

            }, error => {
                alert('failed !!');
                this.questionList = new Array<Questions>();
                this.router.navigate(['home/question']);
                this.modalService.dismissAll('Close modal');
            }
        );
    }

}
