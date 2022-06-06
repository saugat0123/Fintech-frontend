import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
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
export class CreditRiskGradingGammaComponent implements OnInit, OnChanges {
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
    riskGroupArray1: Array<CrgGroup> = [];
    groupLabelMap: Map<number, string> = new Map<number, string>();
    // groupLabelMapped: Map<string, string> = new Map(Array.from(this.groupLabelMap).map(([key, value]) => {
    //     return [key, value];
    // }));
    groupWeightageMap: Map<number, string> = new Map<number, string>();

    totalPointMapper: Map<string, number>;
    totalPoints = 0;
    grading: string;
    formDataForEdit;
    crgGammaData: any;
    crgGammaTest: any;


    constructor(
        private crgGroupService: CrgGroupService,
        private questionService: RiskGradingService,
        private toastService: ToastService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        /*const customerType = this.route.snapshot.queryParamMap.get('customerType');
        let customerTypeParam = '';
        if (customerType) {
            customerTypeParam = customerType === 'INDIVIDUAL' ? CustomerType.INDIVIDUAL : CustomerType.INSTITUTION;
        } else {
            customerTypeParam = this.route.snapshot.queryParamMap.get('loanCategory');
        }*/
    }

    getGroupList() {
        this.crgGroupService.getAll().subscribe((res: any) => {
            this.riskGroupArray = res.detail;
            this.riskGroupArray1 = res.detail;
            console.log('riskGroupArray', this.riskGroupArray);
            this.riskGroupArray.forEach((value: CrgGroup) => {
                this.groupLabelMap.set(value.id, value.label);
                this.groupWeightageMap.set(value.id, value.weightage);
            });
        });
    }

    buildFormAndCheckEdit() {
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

        // this.crgQuestionsList.forEach((value, index) => {
        //     if (this.formDataForEdit !== undefined) {
        //         this.totalPointMapper.set(value.description, this.formDataForEdit[value.description]);
        //     }
        //     if (!groupId.includes(value.crgGroupId)) {
        //         groupId.push(value.crgGroupId);
        //     }
        //     crgFormGroupObject[value.description] = null;
        //     crgFormGroupObject[`${value.description}Parameter`] = null;
        // });
        // console.log('groupId', groupId);
        // const groupData = [];
        // groupId.forEach(gid => {
        //     this.riskGroupArray1.forEach(ca => {
        //         if (ca.id === gid) {
        //             const data = {
        //                 id: ca.id,
        //                 name: ca.label
        //             };
        //             if (!groupData.includes(gid)) {
        //                 groupData.push(data);
        //             }
        //         }
        //     });
        // });

        this.riskGroupArray1.forEach(ca1 => {
            const crgData = this.crgQuestionsList.filter(cqu => (cqu.crgGroupId === ca1.id && cqu.status === 'ACTIVE'));
            console.log('crgData', crgData);
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

        // this.creditRiskGrading = this.formBuilder.group({
        //     groupName: [undefined],
        //     weightage: [undefined],
        //     gammaQuestionAnswer: this.formBuilder.group({})
        // });
        const dummyArray = [];
        console.log('crgGammaData', this.crgGammaData);
        this.crgGammaData.forEach((cgd, i) => {
            const crgFormGroupObject1 = {
                groupName: null,
                weightage: null,
                gammaQuestionAnswer: null,
            };
            const questionAnswer = {
            };
            cgd.gammaQuestion.forEach((value) => {
                questionAnswer[value.description] = null;
                questionAnswer[`${value.description}Parameter`] = null;
            });
            crgFormGroupObject1.groupName = cgd.groupName;
            crgFormGroupObject1.weightage = cgd.weightage;
            crgFormGroupObject1.gammaQuestionAnswer = questionAnswer;
            dummyArray.push(crgFormGroupObject1);
        });
        console.log('dummyArraydummyArray', dummyArray);
        dummyArray.forEach((da: any) => {
            crgFormGroupObject.groupObject.push(this.formBuilder.group(da));
        });
        // crgFormGroupObject.groupObject = dummyArray;
        console.log('crgFormGroupObject  crgFormGroupObject', crgFormGroupObject);
        console.log('crgGammaData123123', this.crgGammaData);
        // this.crgGammaTest = crgFormGroupObject;
        console.log('crgGammaTest', this.crgGammaTest);
        // crgFormGroupObject.groupObject === this.crgGammaData;

        // this.crgGammaData.forEach((da: any) => {
        //     crgFormGroupObject.groupObject.push(this.formBuilder.group(da));
        // });

        console.log('crgFormGroupObject', crgFormGroupObject);




        // console.log('crgGammaData latest', this.crgGammaData);
        // // this.creditRiskGrading = this.formBuilder.group(crgFormGroupObject);
        this.creditRiskGrading = this.formBuilder.group(crgFormGroupObject);
        console.log('etsts', this.creditRiskGrading.get('groupObject')['controls']);
        console.log('Before patch', this.creditRiskGrading);
        // if (this.formDataForEdit !== undefined) {
        //     this.totalPoints = this.formDataForEdit.totalPoint;
        //     this.grading = this.formDataForEdit.grade;
        //     this.creditRiskGrading.patchValue(this.formDataForEdit);
        //     this.calculateTotalViaMap();
        // }
        // console.log('After patch data', crgFormGroupObject);

    }

    onChangeOption(field, point, parameter, groupId) {
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
    }

    onSubmit() {
        if (!ObjectUtil.isEmpty(this.formData)) {
            this.creditRiskData = this.formData;
        }
        this.creditRiskData.data = JSON.stringify(this.creditRiskGrading.value);
        this.crgDataEmitter.emit(this.creditRiskData);
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.getGroupList();
        if (!this.fromProfile) {
            this.totalPointsColspan = 2;
        }
        this.questionService.getAllQuestionsByFid(this.loanConfigId, this.creditHistory).subscribe((res: any) => {
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

    parseKeys(obj): string[] {
        if (!ObjectUtil.isEmpty(obj)) {
            return Object.keys(obj);
        }
        return [];
    }
}
