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
    fiscalYears: Array<any> =  new Array<any>();

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
                        this.getCustomerFinancialData(this.customerInfoId);
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
            grade: null
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
        console.log('jhgfghjkjhgfghjkjhgfghjklkjh: ', this.creditRiskGrading.value);
    }

    onChangeOption(field, point, parameter) {
        console.log(parameter);
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

    // things to do --- financial mapping with institutional CRG
    getCustomerFinancialData(id: any): void
    {
        this.loanFormService.detail(id).subscribe(res=>
        {
            console.log(JSON.parse(res.detail.financial.data));
            const keyIndicatorsData = JSON.parse(res.detail.financial.data);
            this.fiscalYears = keyIndicatorsData.fiscalYear;
            console.log(this.fiscalYears[0]);

        })
    }

    onSubmit() {
        if (!ObjectUtil.isEmpty(this.formData)) {
            this.creditRiskData = this.formData;
        }
        this.creditRiskData.data = JSON.stringify(this.creditRiskGrading.value);
        this.crgDataEmitter.emit(this.creditRiskData.data);
    }
}
