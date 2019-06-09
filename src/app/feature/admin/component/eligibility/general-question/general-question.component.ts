import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EligibilityCriteria} from '../../../modal/eligibility-criteria';
import {GeneralQuestionService} from './general-question.service';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';

@Component({
    selector: 'app-general-question',
    templateUrl: './general-question.component.html',
    styleUrls: ['./general-question.component.scss']
})
export class GeneralQuestionComponent implements OnInit {
    page = 1;
    size = 10;
    task: string;
    formula: string;

    generalQuestionForm: FormGroup;
    showCriteriaList = false;
    addOrEditCriteria = false;

    eligibilityCriteria: EligibilityCriteria = new EligibilityCriteria();
    criteriaList: Array<EligibilityCriteria> = new Array<EligibilityCriteria>();

    constructor(private formBuilder: FormBuilder,
                private generalQuestionService: GeneralQuestionService,
                private toastService: ToastService) {
    }

    ngOnInit() {
        this.formula = '';
        this.getCriteriaList();
    }

    getCriteriaList() {
        this.generalQuestionService.getAllEligibilityCriteria(this.page, this.size).subscribe((response: any) => {
            this.criteriaList = response.detail.content;
            if (this.criteriaList.length !== 0) {
                this.showCriteriaList = true;
            } else {
                this.buildForm();
                this.task = 'Add';
                this.addOrEditCriteria = true;
            }
        });
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
            id: [this.eligibilityCriteria.id === undefined ? undefined : this.eligibilityCriteria.id, Validators.required],
            status: [this.eligibilityCriteria.status === undefined ? 'ACTIVE' : this.eligibilityCriteria.status, Validators.required],
            percentageOfAmount: [this.eligibilityCriteria.percentageOfAmount === undefined ?
                undefined : this.eligibilityCriteria.percentageOfAmount, Validators.required],
            thresholdAmount: [this.eligibilityCriteria.thresholdAmount === undefined ?
                undefined : this.eligibilityCriteria.thresholdAmount, Validators.required],
            version: [this.eligibilityCriteria.version === undefined ? undefined : this.eligibilityCriteria.version, Validators.required],
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
        eligibilityCriteria.questions.forEach( qsn => {
            if (qsn.status  !== 'DELETED') {
                control.push(this.formBuilder.group({
                    id: qsn.id,
                    description: qsn.description,
                    operandCharacter: qsn.operandCharacter,
                    appearanceOrder: qsn.appearanceOrder,
                    status: qsn.status,
                    version: qsn.version
                })
                );
            }
        });
    }

    deleteQuestionField(index) {
        const control = this.generalQuestionForm.controls.questions as FormArray;
        control.removeAt(index);
        this.changeOption();
    }

    changeOption() {
        this.formula = '';
        const formulaParent = document.getElementById('formulaParent').children;
        for (let i = 0; i < formulaParent.length; i++) {
            const childParent = formulaParent[i].children;
            for (let j = 0; j < childParent.length; j++) {
                this.formula = this.formula + (childParent[j] as HTMLInputElement).value;
            }
        }
    }

    setValuesInOption() {
        let f = 0;
        const formulaArray = this.formula.split('', this.formula.length);
        const formulaParent = document.getElementById('formulaParent').children;
            for (let i = 0; i < formulaParent.length; i++) {
                const childParent = formulaParent[i].children;
                for (let j = 0; j < childParent.length; j++) {
                    (childParent[j] as HTMLInputElement).value = formulaArray[f];
                    // console.log('value at index', formulaArray[f]);
                    f++;
                }
            }
    }

    addCriteria() {
        this.task = 'Add';
        this.eligibilityCriteria = new EligibilityCriteria();
        this.formula = '';
        this.buildForm();
        this.showCriteriaList = false;
        this.addOrEditCriteria = true;
    }

    editCriteria(criteria: EligibilityCriteria) {
        this.task = 'Update';
        this.eligibilityCriteria = criteria;
        this.formula = criteria.formula;
        this.buildForm();
        this.showCriteriaList = false;
        this.addOrEditCriteria = true;
    }

    onSave() {
        if (this.generalQuestionForm.invalid) { alert('Please dont leave the fields blank !!'); return; }
        this.eligibilityCriteria = this.generalQuestionForm.value;
        this.eligibilityCriteria.formula = this.formula;
        this.generalQuestionService.saveEligibilityCriteria(this.eligibilityCriteria).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Criteria !!'));
            this.eligibilityCriteria = new EligibilityCriteria();
            this.getCriteriaList();
        }, error => {
            console.log(error);
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Unable to Saved Criteria !!'));
            this.eligibilityCriteria = new EligibilityCriteria();
        });
    }

    onUpdate() {
        if (this.generalQuestionForm.invalid) { alert('Please dont leave the fields blank !!'); return; }
        this.eligibilityCriteria = this.generalQuestionForm.value;
        this.eligibilityCriteria.formula = this.formula;
        this.generalQuestionService.updateEligibilityCriteria(this.eligibilityCriteria, this.eligibilityCriteria.id).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Criteria !!'));
            this.getCriteriaList();
        }, error => {
            console.log(error);
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Unable to Update Criteria !!'));
        });
    }

    onDelete(criteriaId) {
        if (confirm('Are you sure you want to delete this Criteria?')) {
            this.generalQuestionService.deleteEligibilityCriteria(criteriaId).subscribe(() => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Deleted Criteria !!'));
                this.getCriteriaList();
            }, error => {
                console.log(error);
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Unable to Delete Criteria !!'));
            });
        }
    }
}
