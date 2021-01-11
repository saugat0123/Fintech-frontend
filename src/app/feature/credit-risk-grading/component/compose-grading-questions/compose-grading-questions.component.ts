import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CrgGroupService} from '../../service/crg-group.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RiskGradingService} from '../../service/risk-grading.service';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ToastService} from '../../../../@core/utils';
import {Router} from '@angular/router';
import {CrgQuestion} from '../../model/CrgQuestion';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {CrgGroup} from '../../model/CrgGroup';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';
import {LoanConfig} from '../../../admin/modal/loan-config';

@Component({
    selector: 'app-compose-grading-questions',
    templateUrl: './compose-grading-questions.component.html',
    styleUrls: ['./compose-grading-questions.component.scss']
})
export class ComposeGradingQuestionsComponent implements OnInit {
    schemeList: Array<LoanConfig> = new Array<LoanConfig>();
    loanConfigId: number;
    riskGroupArray = [];
    collapsedIndex = null;
    totalObtainablePoints: number;
    existingQuestionList: boolean;
    newQuestionList: boolean;
    task: string;
    questionList: Array<CrgQuestion> = new Array<CrgQuestion>();
    qsnContent: CrgQuestion = new CrgQuestion();
    addEditQuestionForm: FormGroup;
    questionAnswerForm: FormGroup;
    groupMap: Map<number, string> = new Map<number, string>();

    private modalRef: NgbModalRef;

    constructor(private crgGroupService: CrgGroupService,
                private questionService: RiskGradingService,
                private loanConfigService: LoanConfigService,
                private formBuilder: FormBuilder,
                private router: Router,
                private modalService: NgbModal,
                private toastService: ToastService) {
    }

    ngOnInit() {
        this.buildSetupForm();
        this.getSchemeList();
        this.getGroupList();
        this.existingQuestionList = false;
        this.newQuestionList = false;
    }

    getSchemeList() {
        this.loanConfigService.getAll().subscribe((response: any) => {
            this.schemeList = response.detail;
        });
    }

    getGroupList() {
        this.crgGroupService.getAll().subscribe((res: any) => {
            this.riskGroupArray = res.detail;
            this.riskGroupArray.forEach( (value: CrgGroup) => {
                this.groupMap.set(value.id, value.label);
            });
        });
    }

    buildSetupForm() {
        this.questionAnswerForm = this.formBuilder.group({
            loanConfigId: [undefined],
            questionForm: this.formBuilder.array([])
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
                crgGroupId: [undefined, Validators.required],
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

    onChangeLoanCategory(event?) {
        this.loanConfigId = event;
        this.clearFormArray();
        this.fetchQuestionList();
    }

    fetchQuestionList() {
        this.totalObtainablePoints = 0;
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
            crgGroupId: [this.qsnContent.crgGroupId === undefined ? undefined : this.qsnContent.crgGroupId],
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

    openEditQuestion(qsnContent: CrgQuestion, template: TemplateRef<any>) {
        this.task = 'Update';
        this.qsnContent = qsnContent;
        this.buildForm();

        this.modalRef = this.modalService.open(template, {size: 'lg', backdrop: 'static'});
    }

    openAddQuestion(template: TemplateRef<any>) {
        this.task = 'Add';
        this.qsnContent = new CrgQuestion();
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

    onSave() {
        if (this.questionAnswerForm.invalid) {
            return;
        }
        this.questionList = this.questionAnswerForm.value.questionForm;
        this.questionService.saveQuestionList(this.questionList, 1).subscribe(() => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Questions'));
                this.questionList = new Array<CrgQuestion>();
                this.fetchQuestionList();

            }, error => {
                console.log(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Question'));
                this.questionList = new Array<CrgQuestion>();
            }
        );
    }

    onUpdate(newQsnContent) {
        if (newQsnContent.invalid) {
            return;
        }
        this.questionService.editQuestion(newQsnContent.value, this.loanConfigId, newQsnContent.value.id).subscribe(() => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Questions'));
                this.questionList = new Array<CrgQuestion>();
                this.qsnContent = new CrgQuestion();
                this.fetchQuestionList();
                this.modalService.dismissAll('Close modal');

            }, error => {
                console.log(error);
                this.modalService.dismissAll('Close modal');
                this.toastService.show(new Alert(AlertType.DANGER, 'Unable to Update Question'));
                this.questionList = new Array<CrgQuestion>();
            }
        );
    }

    onDelete(qsnContent) {
        if (confirm('Are you sure to delete this question?')) {
            this.questionService.deleteQuestion(this.loanConfigId, qsnContent.id).subscribe(() => {

                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Deleted Questions'));
                    this.questionList = new Array<CrgQuestion>();
                    this.qsnContent = new CrgQuestion();
                    this.fetchQuestionList();

                }, error => {
                    console.log(error);
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Unable to Delete Question'));
                    this.questionList = new Array<CrgQuestion>();
                }
            );
        }
    }
}
