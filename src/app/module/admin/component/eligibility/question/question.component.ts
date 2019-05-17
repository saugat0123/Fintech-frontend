import {Component, OnInit, TemplateRef} from '@angular/core';
import {Questions} from '../../../modal/question';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../../../shared-service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {LoanConfig} from '../../../modal/loan-config';

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
    loanConfigApi: string;
    questionApi: string;
    loanConfigID: number;
    totalObtainablePoints: number;
    existingQuestionList: boolean;
    newQuestionList: boolean;
    task: string;
    questionList: Array<Questions> = new Array<Questions>();
    schemeList: Array<LoanConfig> = new Array<LoanConfig>();
    qsnContent: Questions = new Questions();
    addEditQuestionForm: FormGroup;
    questionAnswerForm: FormGroup;

    private modalRef: NgbModalRef;

    constructor(private formBuilder: FormBuilder,
                private commonService: CommonService,
                private router: Router,
                private modalService: NgbModal) {

        this.questionAnswerForm = this.formBuilder.group({
            loanConfigID: [undefined, Validators.required],
            questionForm: this.formBuilder.array([])
        });

    }

    ngOnInit() {
        this.loanConfigApi = 'v1/config/getAll';
        this.getSchemeList();
        this.existingQuestionList = false;
        this.newQuestionList = false;
    }

    getSchemeList() {
        this.commonService.getByGetAllPageable(this.loanConfigApi, 1, 10).subscribe((response: any) => {
            this.schemeList = response.detail;
        });
    }

    addQuestionField() {
        const control = <FormArray>this.questionAnswerForm.controls.questionForm;
        control.push(
            this.formBuilder.group({
                status: ['ACTIVE'],
                answers: this.formBuilder.array([]),
                description: [undefined, Validators.required],
                loanConfig: this.formBuilder.group({
                    id: [this.loanConfigID]
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
                points: [undefined, Validators.required],
                status: ['ACTIVE']
            })
        );
    }

    deleteAnswerField(control, index) {
        control.removeAt(index);
    }

    onChangeSchemeOption() {
        this.clearFormArray();
        this.totalObtainablePoints = 0;
        this.loanConfigID = this.questionAnswerForm.get('loanConfigID').value;
        this.questionApi = 'v1/loan-configs/' + this.loanConfigID + '/questions';

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
            status: [this.qsnContent.status === undefined ? 'ACTIVE' : this.qsnContent.status, Validators.required],
            id: [this.qsnContent.id === undefined ? 0 : this.qsnContent.id, Validators.required],
            answers: this.formBuilder.array([]),
            description: [this.qsnContent.description === undefined ? '' : this.qsnContent.description, Validators.required],
            version: [this.qsnContent.version === undefined ? 1 : this.qsnContent.version],
            new: [this.qsnContent.new === undefined ? 'true' : this.qsnContent.new],
            loanConfig: this.formBuilder.group({
                id: [this.loanConfigID]
            })
        });
        if (this.task === 'Update') {
            this.setAnswers(this.qsnContent);
        } else {
            this.addAnswerFieldForEdit();
        }
    }

    setAnswers(qsnContent) {
        const control = <FormArray>this.addEditQuestionForm.controls.answers;
        qsnContent.answers.forEach(ans => {
            if (ans.status !== 'DELETED') {
                control.push(this.formBuilder.group({
                        id: ans.id,
                        description: ans.description,
                        points: ans.points,
                        version: ans.version,
                        status: ans.status
                    })
                );
            }
        });
    }

    openEditQuestion(qsnContent: Questions, template: TemplateRef<any>) {
        this.task = 'Update';
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
                points: [undefined, Validators.required],
                status: ['ACTIVE']
            })
        );
    }

    deleteAnswerFieldForEdit(index) {
        const control = <FormArray>this.addEditQuestionForm.controls.answers;
        control.removeAt(index);
    }

    onSave() {
        this.questionList = this.questionAnswerForm.value.questionForm;
        console.log(this.questionList);
        this.commonService.saveQuestion(this.questionList, this.questionApi).subscribe(result => {

                alert('success !!');
                this.questionList = new Array<Questions>();
                this.router.navigate(['home/eligibility/question']);
                this.onChangeSchemeOption();

            }, error => {
                this.questionList = new Array<Questions>();
                alert('failed !!');
                this.router.navigate(['home/eligibility/question']);
            }
        );
    }

    onUpdate(newQsnContent) {
        this.commonService.updateQuestion(newQsnContent, this.questionApi + '/' + newQsnContent.id).subscribe(result => {

                alert('success !!');
                this.questionList = new Array<Questions>();
                this.qsnContent = new Questions();
                this.router.navigate(['home/eligibility/question']);
                this.onChangeSchemeOption();
                this.modalService.dismissAll('Close modal');

            }, error => {
                alert('failed !!');
                this.questionList = new Array<Questions>();
                this.router.navigate(['home/eligibility/question']);
                this.modalService.dismissAll('Close modal');
            }
        );
    }

    onDelete(qsnContent) {
        if (confirm('Are you sure to delete this question?')) {
            qsnContent.status = 'DELETED';
            this.onUpdate(qsnContent);
        }
    }

}
