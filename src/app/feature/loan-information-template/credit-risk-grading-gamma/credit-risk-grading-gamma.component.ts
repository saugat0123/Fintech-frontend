import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {CrgGroup} from '../../credit-risk-grading/model/CrgGroup';
import {CrgGroupService} from '../../credit-risk-grading/service/crg-group.service';
import {CrgQuestion} from '../../credit-risk-grading/model/CrgQuestion';
import {RiskGradingService} from '../../credit-risk-grading/service/risk-grading.service';
import {ToastService} from '../../../@core/utils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {CreditRiskGradingGamma} from '../../admin/modal/creditRiskGradingGamma';
import {ActivatedRoute} from '@angular/router';
import {Status} from '../../../@core/Status';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-credit-risk-grading-gamma',
    templateUrl: './credit-risk-grading-gamma.component.html',
    styleUrls: ['./credit-risk-grading-gamma.component.scss']
})
export class CreditRiskGradingGammaComponent implements OnInit {
    @Input() formData: CreditRiskGradingGamma;
    @Input() fromProfile: boolean;
    @Input() loanConfigId: number;
    @Output() crgDataEmitter = new EventEmitter();
    @Input() creditHistory: number;
    totalPointsColspan = 2;
    creditRiskGrading: FormGroup = new FormGroup({});
    creditRiskGrading1: FormGroup = new FormGroup({});
    creditRiskData: CreditRiskGradingGamma = new CreditRiskGradingGamma();
    creditRiskDataValue;
    points: any;

    crgQuestionsList: Array<CrgQuestion> = [];
    riskGroupArray = [];
    groupLabelMap: Map<number, string> = new Map<number, string>();
    // groupLabelMapped: Map<string, string> = new Map(Array.from(this.groupLabelMap).map(([key, value]) => {
    //     return [key, value];
    // }));
    groupWeightageMap: Map<number, string> = new Map<number, string>();

    totalPointMapper: Map<string, number>;
    totalGroupPointMapper = [];
    totalPoints = 0;
    grading: string;
    formDataForEdit;
    crgGammaData: any;
    crgGammaTest: any;
    spinner = false;


    constructor(
        private crgGroupService: CrgGroupService,
        private questionService: RiskGradingService,
        private toastService: ToastService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        console.log('formData', this.formData);
        this.spinner = true;
        this.getGroupList();
        if (!this.fromProfile) {
            this.totalPointsColspan = 2;
        }
        this.spinner = true;
        this.questionService.getAllQuestionsByFid(this.loanConfigId, this.creditHistory).subscribe((res: any) => {
            this.spinner = false;
            const questionsList = res.detail;
            this.crgQuestionsList = questionsList.filter(q => {
                return q.status === Status.ACTIVE;
            });
            this.buildFormAndCheckEdit();
        }, error => {
            this.spinner = false;
            console.log(error);
            this.toastService.show(new Alert(AlertType.DANGER, 'Error fetching question list!'));
        });
        /*const customerType = this.route.snapshot.queryParamMap.get('customerType');
        let customerTypeParam = '';
        if (customerType) {
            customerTypeParam = customerType === 'INDIVIDUAL' ? CustomerType.INDIVIDUAL : CustomerType.INSTITUTION;
        } else {
            customerTypeParam = this.route.snapshot.queryParamMap.get('loanCategory');
        }*/
        this.spinner = false;
    }

    getGroupList() {
        this.spinner = true;
        this.crgGroupService.getAll().subscribe((res: any) => {
            this.riskGroupArray = res.detail;
            this.spinner = false;
            this.riskGroupArray.forEach((value: CrgGroup) => {
                this.groupLabelMap.set(value.id, value.label);
                this.groupWeightageMap.set(value.id, value.weightage);
            });
        });
    }

    buildFormAndCheckEdit() {
        this.spinner = true;
        this.crgGammaData = [];
        const crgFormGroupObject = {
            totalPoint: 0,
            grade: null,
            groupObject: this.formBuilder.array([])
        };

        this.totalPointMapper = new Map<string, number>();
        if (!ObjectUtil.isEmpty(this.formData)) {
            this.formDataForEdit = JSON.parse(this.formData.data);
        }
        this.riskGroupArray.forEach(ca1 => {
            const crgData = this.crgQuestionsList.filter(cqu => (cqu.crgGroupId === ca1.id && cqu.status === 'ACTIVE'));
            if (crgData.length > 0) {
                if (!this.crgGammaData.includes(crgData)) {
                    const data = {
                        groupName: ca1.label,
                        weightage: ca1.weightage,
                        gammaQuestion: crgData
                    };
                    this.crgGammaData.push(data);
                }
            }
        });
        this.crgGammaData.forEach((cgd, i) => {
            const gammaQuestionObject = {
                groupName: [null],
                weightage: [null],
                gammaQuestionAnswer: this.formBuilder.group({}),
                groupTotal: [0]
            };
            const questionAnswer = {
            };
            const pointMapper = new Map<string, number>();
            cgd.gammaQuestion.forEach((value) => {
                if (!ObjectUtil.isEmpty(this.formDataForEdit)) {
                    this.totalPointMapper.set(value.description,
                        this.formDataForEdit.groupObject[i].gammaQuestionAnswer[value.description]);
                    pointMapper.set(value.description, this.formDataForEdit.groupObject[i].gammaQuestionAnswer[value.description]);
                }
                questionAnswer[value.description] = null;
                questionAnswer[`${value.description}Parameter`] = null;
            });
            this.totalGroupPointMapper.push(pointMapper);
            gammaQuestionObject.groupName = cgd.groupName;
            gammaQuestionObject.weightage = cgd.weightage;
            gammaQuestionObject.gammaQuestionAnswer = this.formBuilder.group(questionAnswer);
            crgFormGroupObject.groupObject.push(this.formBuilder.group(gammaQuestionObject));
        });
        this.creditRiskGrading = this.formBuilder.group(crgFormGroupObject);
        if (!ObjectUtil.isEmpty(this.formDataForEdit)) {
            this.totalPoints = this.formDataForEdit.totalPoint;
            this.grading = this.formDataForEdit.grade;
            this.creditRiskGrading.get('groupObject').patchValue(this.formDataForEdit.groupObject);
            // this.calculateTotalViaMap();
        }
        this.spinner = false;
        console.log('creditRiskGrading', this.creditRiskGrading.value);
    }

    onChangeOption(field, point, parameter, index, groupName) {
        this.totalPointMapper.set(field, point);
        this.totalGroupPointMapper[index].set(field, point);
        this.creditRiskGrading.get(['groupObject', index, 'gammaQuestionAnswer']).get(field).patchValue(point);
        this.creditRiskGrading.get(['groupObject', index, 'gammaQuestionAnswer']).get(`${field}Parameter`).patchValue(parameter);
        this.calculateGroupTotal();
        this.calculateTotalViaMap();
    }

    calculateTotalViaMap() {
        let total = 0;
        this.totalPointMapper.forEach(data => {
            total = total + Number(data);
        });
        this.totalPoints = total;
        this.creditRiskGrading.get('totalPoint').patchValue(this.totalPoints);
        if (this.totalPoints >= 90) {
            this.grading = 'Virtually zero risk, Accept';
        } else if (this.totalPoints >= 75 && this.totalPoints < 90) {
            this.grading = 'Lower risk, Accept';
        } else if (this.totalPoints >= 65 && this.totalPoints < 75) {
            this.grading = 'Low risk, Accept';
        } else if (this.totalPoints >= 55 && this.totalPoints < 65) {
            this.grading = 'Moderate risk, Accept';
        } else if (this.totalPoints >= 45) {
            this.grading = 'Average risk, Accept';
        } else if (this.totalPoints >= 35) {
            this.grading = 'High risk risk, To be approved from  one level CAD authority';
        } else if (this.totalPoints >= 25) {
            this.grading = 'Pre-default risk, Minimum approving authority to be  CCO';
        } else if (this.totalPoints < 25) {
            this.grading = 'Default risk, Decline';
        }
        this.creditRiskGrading.get('grade').patchValue(this.grading);
        console.log('creditRiskGrading', this.creditRiskGrading.value);
    }

    onSubmit() {
        if (!ObjectUtil.isEmpty(this.formData)) {
            this.creditRiskData = this.formData;
        }
        this.creditRiskData.data = JSON.stringify(this.creditRiskGrading.value);
        this.crgDataEmitter.emit(this.creditRiskData);
    }

    // ngOnChanges(changes: SimpleChanges): void {
    //
    // }

    parseKeys(obj): string[] {
        if (!ObjectUtil.isEmpty(obj)) {
            return Object.keys(obj);
        }
        return [];
    }

    private calculateGroupTotal() {
        this.totalGroupPointMapper.forEach((tg, i) => {
            let total = 0;
            tg.forEach(gt => {
                total += Number(gt);
            });
            this.creditRiskGrading.get(['groupObject', i, 'groupTotal']).patchValue(total);
        });
    }
}
