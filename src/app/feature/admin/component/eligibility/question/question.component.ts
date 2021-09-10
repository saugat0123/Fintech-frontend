import {Component, OnInit, TemplateRef} from '@angular/core';
import {Questions} from '../../../modal/question';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {LoanConfig} from '../../../modal/loan-config';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {LoanConfigService} from '../../loan-config/loan-config.service';
import {QuestionService} from '../../../../service/question.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
    loanConfigId: number;
    totalObtainablePoints: number;
    collapsedIndex = null;
    existingQuestionList: boolean;
    newQuestionList: boolean;
    task: string;
    questionList: Array<Questions> = new Array<Questions>();
    schemeList: Array<LoanConfig> = new Array<LoanConfig>();
    qsnContent: Questions = new Questions();
    addEditQuestionForm: FormGroup;
    questionAnswerForm: FormGroup;
    spinner = false;

    private modalRef: NgbModalRef;

    constructor(private formBuilder: FormBuilder,
                private questionService: QuestionService,
                private loanConfigService: LoanConfigService,
                private router: Router,
                private modalService: NgbModal,
                private toastService: ToastService) {}

    ngOnInit() {
        this.questionAnswerForm = this.formBuilder.group({
            loanConfigId: [undefined, Validators.required],
            questionForm: this.formBuilder.array([])
        });
        this.getSchemeList();
        this.existingQuestionList = false;
        this.newQuestionList = false;
    }

    getSchemeList() {
        this.loanConfigService.getAll().subscribe((response: any) => {
            this.schemeList = response.detail;
        });
    }

    addQuestionField() {
        const control = this.questionAnswerForm.controls.questionForm as FormArray;
        control.push(
            this.formBuilder.group({
                status: ['ACTIVE'],
                answers: this.formBuilder.array([]),
                description: [undefined, Validators.required],
                appearanceOrder: [undefined, Validators.required],
                loanConfig: this.formBuilder.group({
                    id: [this.loanConfigId]
                })
            })
        );
    }

    deleteQuestionField(index) {
        const control = this.questionAnswerForm.controls.questionForm as FormArray;
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
        this.loanConfigId = this.questionAnswerForm.get('loanConfigId').value;

        this.questionService.getAllQuestions(this.loanConfigId).subscribe((response: any) => {
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
        const control = this.questionAnswerForm.controls.questionForm as FormArray;
        control.controls = [];
    }

    buildForm() {
        this.addEditQuestionForm = this.formBuilder.group({
            status: [this.qsnContent.status === undefined ? 'ACTIVE' : this.qsnContent.status, Validators.required],
            id: [this.qsnContent.id === undefined ? 0 : this.qsnContent.id, Validators.required],
            answers: this.formBuilder.array([]),
            description: [this.qsnContent.description === undefined ? '' : this.qsnContent.description, Validators.required],
            version: [this.qsnContent.version === undefined ? 1 : this.qsnContent.version],
            appearanceOrder: [this.qsnContent.appearanceOrder === undefined ? 0 : this.qsnContent.appearanceOrder],
            new: [this.qsnContent.new === undefined ? 'true' : this.qsnContent.new],
            loanConfig: this.formBuilder.group({
                id: [this.loanConfigId]
            })
        });
        if (this.task === 'Update') {
            this.setAnswers(this.qsnContent);
        } else {
            this.addAnswerFieldForEdit();
        }
    }

    setAnswers(qsnContent) {
        const control = this.addEditQuestionForm.controls.answers as FormArray;
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

        this.modalRef = this.modalService.open(template, {size: 'lg', backdrop: 'static'});
    }

    openAddQuestion(template: TemplateRef<any>) {
        this.task = 'Add';
        this.qsnContent = new Questions();
        this.buildForm();

        this.modalRef = this.modalService.open(template, {size: 'lg', backdrop: 'static'});
    }

    addAnswerFieldForEdit() {
        const control = this.addEditQuestionForm.controls.answers as FormArray;
        control.push(
            this.formBuilder.group({
                description: [undefined, Validators.required],
                points: [undefined, Validators.required],
                status: ['ACTIVE']
            })
        );
    }

    deleteAnswerFieldForEdit(index) {
        const control = this.addEditQuestionForm.controls.answers as FormArray;
        control.removeAt(index);
    }

    onSave() {
        this.spinner = true;
        if (this.questionAnswerForm.invalid) {
            this.spinner= false;
            return;
        }
        this.questionList = this.questionAnswerForm.value.questionForm;
        this.questionService.saveQuestionList(this.questionList, this.loanConfigId).subscribe(() => {

                this.spinner = false;
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Questions'));

                this.questionList = new Array<Questions>();

                this.onChangeSchemeOption();

            }, error => {
                console.log(error);
                this.spinner = false;
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Question'));

                this.questionList = new Array<Questions>();
            }
        );
    }

    onUpdate(newQsnContent) {
        if (newQsnContent.invalid) { return; }
        this.questionService.editQuestion(newQsnContent, this.loanConfigId, newQsnContent.id).subscribe(() => {

                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Questions'));
                this.questionList = new Array<Questions>();
                this.qsnContent = new Questions();
                this.onChangeSchemeOption();
                this.modalService.dismissAll('Close modal');

            }, error => {
                console.log(error);
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Unable to Update Question'));
                this.questionList = new Array<Questions>();
            }
        );
    }

    openCollapsible(index) {
        if (ObjectUtil.isEmpty(this.collapsedIndex)) {
            this.collapsedIndex = index;
        } else {
            if (this.collapsedIndex !== index) {
                this.collapsedIndex = index;
            } else {
                this.collapsedIndex = null;
            }
        }
    }

    onDelete(qsnContent) {
        if (confirm('Are you sure to delete this question?')) {
            this.questionService.deleteQuestion(this.loanConfigId, qsnContent.id).subscribe(() => {

                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Deleted Questions'));
                    this.questionList = new Array<Questions>();
                    this.qsnContent = new Questions();
                    this.onChangeSchemeOption();

                }, error => {
                    console.log(error);
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Unable to Delete Question'));
                    this.questionList = new Array<Questions>();
                }
            );
        }
    }
}
