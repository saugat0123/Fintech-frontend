import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EligibilityCriteria} from '../../../modal/eligibility-criteria';
import {GeneralQuestionService} from './general-question.service';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: 'app-general-question',
    templateUrl: './general-question.component.html',
    styleUrls: ['./general-question.component.scss']
})
export class GeneralQuestionComponent implements OnInit {
    spinner = false;
    page = 1;
    size = 10;
    task: string;
    formulaPattern = '';

    generalQuestionForm: FormGroup;
    submitted = false;
    showCriteriaList = false;
    addOrEditCriteria = false;
    invalidFormula = false;

    pageable: Pageable = new Pageable();
    eligibilityCriteria: EligibilityCriteria = new EligibilityCriteria();
    criteriaList: Array<EligibilityCriteria> = new Array<EligibilityCriteria>();

    constructor(private formBuilder: FormBuilder,
                private generalQuestionService: GeneralQuestionService,
                private toastService: ToastService,
                private overlay: NgxSpinnerService) {
    }

    static loadData(other: GeneralQuestionComponent) {
        other.spinner = true;
        other.generalQuestionService.getAllEligibilityCriteria(other.page, other.size).subscribe((response: any) => {
            other.criteriaList = response.detail.content;
            other.pageable = PaginationUtils.getPageable(response.detail);
            if (other.criteriaList.length !== 0) {
                other.showCriteriaList = true;
            } else {
                other.buildForm();
                other.task = 'Add';
                other.addOrEditCriteria = true;
            }

            other.spinner = false;
        }, error => {
            console.log(error);
            other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Criteria List !'));
            other.spinner = false;
        });
    }

    ngOnInit() {
        GeneralQuestionComponent.loadData(this);
    }

    changePage(page: number) {
        this.page = page;

        GeneralQuestionComponent.loadData(this);
    }

    addQuestionField() {
        const control = this.generalQuestionForm.controls.questions as FormArray;
        control.push(
            this.formBuilder.group({
                operandCharacter: [undefined, Validators.required],
                description: [undefined, Validators.required],
                appearanceOrder: [undefined, Validators.required],
                status: ['ACTIVE', Validators.required]
            })
        );
    }

    buildForm() {
        this.generalQuestionForm = this.formBuilder.group({
            id: [this.eligibilityCriteria.id === undefined ? undefined : this.eligibilityCriteria.id],
            status: [this.eligibilityCriteria.status === undefined ? 'ACTIVE' : this.eligibilityCriteria.status, Validators.required],
            percentageOfAmount: [this.eligibilityCriteria.percentageOfAmount === undefined ?
                undefined : this.eligibilityCriteria.percentageOfAmount, Validators.required],
            formula: [this.eligibilityCriteria.formula === undefined ? '' : this.eligibilityCriteria.formula,
                [Validators.required]],
            version: [this.eligibilityCriteria.version === undefined ? undefined : this.eligibilityCriteria.version],
            questions: this.formBuilder.array([])
        });
        if (this.task === 'Update') {
            this.setQuestions(this.eligibilityCriteria);
        } else {
            this.addQuestionField();
        }
    }

    setQuestions(eligibilityCriteria) {
        const control = this.generalQuestionForm.controls.questions as FormArray;
        eligibilityCriteria.questions.forEach(qsn => {
            if (qsn.status !== 'DELETED') {
                control.push(this.formBuilder.group({
                        id: [qsn.id, Validators.required],
                        description: [qsn.description, Validators.required],
                        operandCharacter: [qsn.operandCharacter, Validators.required],
                        appearanceOrder: [qsn.appearanceOrder, Validators.required],
                        status: [qsn.status, Validators.required],
                        version: [qsn.version, Validators.required]
                    })
                );
            }
        });
        this.setFormulaPattern();
    }

    setFormulaPattern() {
        const operandsArray = [];
        (this.generalQuestionForm.get('questions') as FormArray).controls.forEach(operand => {
            operandsArray.push(operand.value.operandCharacter);
        });
        const operands = operandsArray.join('');
        this.formulaPattern = `[${operands}\\(\\)\\+\\-\\/\\*\\^\\I\\.\\ \\d]+`;
        this.invalidFormula = false;
        // In case you want to implement an operand character at least once :: ^(?=.*a)(?=.*b)(?=.*c)[\(\)\+\-\/\*\.\ \d]*
    }

    deleteQuestionField(index) {
        const control = this.generalQuestionForm.controls.questions as FormArray;
        control.removeAt(index);
        this.setFormulaPattern();
    }

    addCriteria() {
        this.task = 'Add';
        this.eligibilityCriteria = new EligibilityCriteria();
        this.buildForm();
        this.showCriteriaList = false;
        this.addOrEditCriteria = true;
    }

    editCriteria(criteria: EligibilityCriteria) {
        this.task = 'Update';
        this.eligibilityCriteria = criteria;
        this.buildForm();
        this.showCriteriaList = false;
        this.addOrEditCriteria = true;
    }

    onSave() {
        this.spinner = true;
        this.submitted = true;
        if (this.generalQuestionForm.invalid) {
            this.spinner = false;
            return;
        }
        this.eligibilityCriteria = this.generalQuestionForm.value;
        this.generalQuestionService.saveEligibilityCriteria(this.eligibilityCriteria).subscribe(() => {
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Criteria !'));
            this.eligibilityCriteria = new EligibilityCriteria();
            GeneralQuestionComponent.loadData(this);
        }, errorResponse => {
            console.log(errorResponse.error);
            console.log(errorResponse.error.message);
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.ERROR, errorResponse.error.message));
            this.invalidFormula = true;
        });
        this.submitted = false;
    }

    onUpdate() {
        this.spinner = true;
        this.submitted = true;
        if (this.generalQuestionForm.invalid) {
            this.spinner = false;
            return;
        }
        this.eligibilityCriteria = this.generalQuestionForm.value;
        this.generalQuestionService.updateEligibilityCriteria(this.eligibilityCriteria, this.eligibilityCriteria.id).subscribe(() => {
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Criteria !'));
            GeneralQuestionComponent.loadData(this);
        }, errorResponse => {
            console.log(errorResponse.error.message);
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.ERROR, errorResponse.error.message));
            this.invalidFormula = true;
        });
        this.submitted = false;
    }

    onDelete(criteriaId) {
        if (confirm('Are you sure you want to delete this Criteria?')) {
            this.generalQuestionService.deleteEligibilityCriteria(criteriaId).subscribe(() => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Deleted Criteria !'));
                GeneralQuestionComponent.loadData(this);
            }, error => {
                console.log(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Delete Criteria !'));
            });
        }
    }
}
