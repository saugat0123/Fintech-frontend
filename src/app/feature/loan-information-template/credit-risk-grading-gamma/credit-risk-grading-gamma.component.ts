import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
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
    totalPointsColspan = 4;
    creditRiskGrading: FormGroup = new FormGroup({});
    creditRiskData: CreditRiskGradingGamma = new CreditRiskGradingGamma();
    points: any;

    crgQuestionsList: Array<CrgQuestion> = [];
    riskGroupArray = [];
    groupLabelMap: Map<number, string> = new Map<number, string>();
    groupWeightageMap: Map<number, string> = new Map<number, string>();

    totalPointMapper: Map<string, number>;
    totalPoints = 0;
    grading: string;
    formDataForEdit;
    premiumRange: string;

    constructor(
        private crgGroupService: CrgGroupService,
        private questionService: RiskGradingService,
        private toastService: ToastService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.getGroupList();
        if (!this.fromProfile) {
            this.totalPointsColspan = 2;
        }
        /*const customerType = this.route.snapshot.queryParamMap.get('customerType');
        let customerTypeParam = '';
        if (customerType) {
            customerTypeParam = customerType === 'INDIVIDUAL' ? CustomerType.INDIVIDUAL : CustomerType.INSTITUTION;
        } else {
            customerTypeParam = this.route.snapshot.queryParamMap.get('loanCategory');
        }*/

        this.questionService.getAllQuestions(this.loanConfigId).subscribe((res: any) => {
            const questionsList = res.detail;
            this.crgQuestionsList = questionsList.filter(q => {
                return q.status === Status.ACTIVE;
            });
            this.buildFormAndCheckEdit();
        }, error => {
            console.log(error);
            this.toastService.show(new Alert(AlertType.DANGER, 'Error fetching question list!'));
        });
    }

    getGroupList() {
        this.crgGroupService.getAll().subscribe((res: any) => {
            this.riskGroupArray = res.detail;
            this.riskGroupArray.forEach((value: CrgGroup) => {
                this.groupLabelMap.set(value.id, value.label);
                this.groupWeightageMap.set(value.id, value.weightage);
            });
        });
    }

    buildFormAndCheckEdit() {
        const crgFormGroupObject = {
            totalPoint: 0,
            grade: null,
            premiumRange: null,
        };
        this.totalPointMapper = new Map<string, number>();
        if (!ObjectUtil.isEmpty(this.formData)) {
            this.formDataForEdit = JSON.parse(this.formData.data);
        }

        this.crgQuestionsList.forEach((value, index) => {
            if (this.formDataForEdit !== undefined) {
                let point = 0;
                value.answers.forEach(v => {
                    if (this.formDataForEdit[value.description] === v.id) {
                        point = v.points;
                    }
                });
                this.totalPointMapper.set(value.description, point);
            }
            crgFormGroupObject[value.description] = null;
            crgFormGroupObject[`${value.description}Parameter`] = null;
        });

        this.creditRiskGrading = this.formBuilder.group(crgFormGroupObject);

        if (this.formDataForEdit !== undefined) {
            this.totalPoints = this.formDataForEdit.totalPoint;
            this.grading = this.formDataForEdit.grade;
            this.creditRiskGrading.patchValue(this.formDataForEdit);
            this.calculateTotalViaMap();
            this.calculatePremiumRange();
        }
    }

    onChangeOption(field, point, parameter) {
        this.totalPointMapper.set(field, point);
        this.creditRiskGrading.get(`${field}Parameter`).patchValue(parameter);
        this.calculateTotalViaMap();
        this.calculatePremiumRange();
    }

    calculateTotalViaMap() {
        if (this.totalPointMapper.size === this.crgQuestionsList.length) {
            let total = 0;
            this.totalPointMapper.forEach(data => {
                total = total + Number(data);
            });
            this.totalPoints = total;
            this.creditRiskGrading.get('totalPoint').patchValue(this.totalPoints);
            if (this.totalPoints > 85) {
                this.grading = 'A';
            } else if (this.totalPoints > 70 && this.totalPoints <= 85) {
                this.grading = 'B';
            } else if (this.totalPoints >= 60 && this.totalPoints <= 70) {
                this.grading = 'C';
            } else if (this.totalPoints < 60) {
                this.grading = 'D';
            }
            this.creditRiskGrading.get('grade').patchValue(this.grading);
        }
    }

    calculatePremiumRange() {
        if (this.totalPointMapper.size === this.crgQuestionsList.length) {
            let total = 0;
            this.totalPointMapper.forEach(data => {
                total = total + Number(data);
            });
            this.totalPoints = total;
            this.creditRiskGrading.get('totalPoint').patchValue(this.totalPoints);
            if (this.totalPoints > 85) {
                this.premiumRange = '4.00% to 4.50%';
            } else if (this.totalPoints > 70 && this.totalPoints <= 85) {
                this.premiumRange = '4.60% to 5.20%';
            } else if (this.totalPoints >= 60 && this.totalPoints <= 70) {
                this.premiumRange = '5.30% to 6.00%';
            } else if (this.totalPoints < 60) {
                this.premiumRange = '6.20% to 7.50%';
            }
            this.creditRiskGrading.get('premiumRange').patchValue(this.premiumRange);
        }
    }

    onSubmit() {
        if (!ObjectUtil.isEmpty(this.formData)) {
            this.creditRiskData = this.formData;
        }
        this.creditRiskData.data = JSON.stringify(this.creditRiskGrading.value);
        this.crgDataEmitter.emit(this.creditRiskData.data);
    }
}
