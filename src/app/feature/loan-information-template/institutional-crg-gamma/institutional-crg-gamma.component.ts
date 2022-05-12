import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CreditRiskGradingGamma} from '../../admin/modal/creditRiskGradingGamma';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CrgQuestion} from '../../credit-risk-grading/model/CrgQuestion';
import {CrgGroupService} from '../../credit-risk-grading/service/crg-group.service';
import {RiskGradingService} from '../../credit-risk-grading/service/risk-grading.service';
import {ToastService} from '../../../@core/utils';
import {ActivatedRoute} from '@angular/router';
import {Status} from '../../../@core/Status';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {CrgGroup} from '../../credit-risk-grading/model/CrgGroup';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {CustomerInfoService} from '../../customer/service/customer-info.service';

@Component({
    selector: 'app-institutional-crg-gamma',
    templateUrl: './institutional-crg-gamma.component.html',
    styleUrls: ['./institutional-crg-gamma.component.scss']
})
export class InstitutionalCrgGammaComponent implements OnInit {
    formData: CreditRiskGradingGamma;
    @Input() fromProfile: boolean;
    @Input() loanConfigId: number;
    @Output() crgDataEmitter = new EventEmitter();
    totalPointsColspan = 2;
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
    customerInfoId: any;
    customerFinancialData: any;
    fiscalYears: Array<any> = new Array<any>();
    thresholePoint : any;
    groupLabelTotalPoint = {
        'Financials based on audited': undefined,
        'Sector': undefined,
        'The Management': undefined,
    };
    groupTotalPoint = {};

    constructor(
        private crgGroupService: CrgGroupService,
        private questionService: RiskGradingService,
        private toastService: ToastService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private loanFormService: CustomerInfoService
    ) {
    }

    ngOnInit() {
        this.buildFormAndCheckEdit();
        this.getGroupList();

        if (!this.fromProfile) {
            this.totalPointsColspan = 2;
        }
        this.questionService.getAllQuestions(0).subscribe((res: any) => {
            const questionsList = res.detail;
            console.log(res.detail, 'GID');
            this.crgQuestionsList = questionsList.filter(q => {
                return q.status === Status.ACTIVE;
            });
            this.buildFormAndCheckEdit();
            this.route.queryParamMap.subscribe(q => {
                console.log(q.get('id'));
                this.customerInfoId = q.get('id');
                if (!ObjectUtil.isEmpty(this.customerInfoId)) {
                    this.loanFormService.detail(this.customerInfoId).subscribe(rs => {
                        this.formData = rs.detail.crgGamma;
                        this.buildFormAndCheckEdit();
                    });
                }
            });

        }, error => {
            console.log(error);
            this.toastService.show(new Alert(AlertType.DANGER, 'Error fetching question list!'));
        });


    }

    getGroupList() {
        this.crgGroupService.getAll().subscribe((res: any) => {
            console.log(res,'GROUP');
            this.riskGroupArray = res.detail;
            this.riskGroupArray.forEach((value: CrgGroup) => {
                this.groupTotalPoint[value.label]['jh'] = 0;
                this.groupLabelMap.set(value.id, value.label);
                this.groupWeightageMap.set(value.id, value.weightage);
            });
        });
    }

    buildFormAndCheckEdit() {
        const crgFormGroupObject = {
            totalPoint: 0,
            grade: null,
            thresholePoint: null
        };
        this.totalPointMapper = new Map<string, number>();
        if (!ObjectUtil.isEmpty(this.formData)) {
            this.formDataForEdit = JSON.parse(this.formData.data);
        }

        this.crgQuestionsList.forEach((value, index) => {
            if (this.formDataForEdit !== undefined) {
                this.totalPointMapper.set(value.description, this.formDataForEdit[value.description]);
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
        }
    }

    onChangeOption(field, point, parameter, grpId) {
        console.log(field,point,parameter, grpId);
        this.calculateGroupTotalPoint(grpId,point);
        this.totalPointMapper.set(field, point);
        this.creditRiskGrading.get(`${field}Parameter`).patchValue(parameter);
        this.calculateTotalViaMap();
    }

    calculateTotalViaMap() {
        let total = 0;
        this.totalPointMapper.forEach(data => {
            total = total + Number(data);
        });
        this.totalPoints = total;
        console.log(this.totalPoints, 'POINTS');
        this.calculateThreshold(total);
        this.creditRiskGrading.get('totalPoint').patchValue(this.totalPoints);
        if (this.totalPoints >= 90) {
            this.grading = 'Excellent';
        } else if (this.totalPoints >= 75 && this.totalPoints < 90) {
            this.grading = 'Very Good';
        } else if (this.totalPoints >= 65 && this.totalPoints < 75) {
            this.grading = 'Good';
        } else if (this.totalPoints >= 50 && this.totalPoints < 65) {
            this.grading = 'Acceptable';
        } else if (this.totalPoints < 50) {
            this.grading = 'Not Eligible for new loans';
        }
        this.creditRiskGrading.get('grade').patchValue(this.grading);
    }


    //things to do
    calculateThreshold(point: number) {
        console.log(point);
        if (point >= 90) {
            this.patchThresholePoint('CCBL 1');
        } else if (point >= 80) {
            this.thresholePoint = 'CCBL 2';
            this.patchThresholePoint('CCBL 2');
        } else if (point >= 70) {
            this.thresholePoint = 'CCBL 3';
            this.patchThresholePoint('CCBL 3');
        } else if (point >= 60) {
            this.thresholePoint = 'CCBL 4';
            this.patchThresholePoint('CCBL 4');
        } else if (point >= 45) {
            this.thresholePoint = 'CCBL 5';
            this.patchThresholePoint('CCBL 5');
        } else if (point >= 35) {
            this.thresholePoint = 'CCBL 6';
            this.patchThresholePoint('CCBL 6');
        } else if (point >= 25) {
            this.thresholePoint = 'CCBL 7';
            this.patchThresholePoint('CCBL 7');
        }
    }


    patchThresholePoint(value: any)
    {
        this.creditRiskGrading.get('thresholePoint').patchValue(value);
    }

    calculateGroupTotalPoint(groupId, point){
        this.groupTotalPoint[this.groupLabelMap.get(groupId)] += Number(point);

    }

    onSubmit() {
        if (!ObjectUtil.isEmpty(this.formData)) {
            this.creditRiskData = this.formData;
        }
        this.creditRiskData.data = JSON.stringify(this.creditRiskGrading.value);
        this.crgDataEmitter.emit(this.creditRiskData.data);
    }


}
