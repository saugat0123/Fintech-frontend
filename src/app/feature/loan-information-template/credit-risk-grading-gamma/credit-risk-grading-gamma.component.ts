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
    @Input() creditHistory: number;
    @Input() loanDataReady: boolean;
    totalPointsColspan = 2;
    creditRiskGrading: FormGroup = new FormGroup({});
    creditRiskData: CreditRiskGradingGamma = new CreditRiskGradingGamma();
    creditRiskDataValue;
    points: any;
    a = 0;
    b = 1;

    crgQuestionsList: Array<CrgQuestion> = [];
    // crgQuestionsList1: Array<CrgQuestion> = [];
    riskGroupArray = [];
    // riskGroupArray1 = [];
    groupLabelMap: Map<number, string> = new Map<number, string>();
    groupWeightageMap: Map<number, string> = new Map<number, string>();

    totalWithHistoryPointMapper: Map<string, number>;
    totalWithoutHistoryPointMapper: Map<string, number>;
    totalGroupPointMapper = [];
    totalPoints = 0;
    grading: string;
    formDataForEdit;
    crgGammaData: any;
    spinner = false;
    viewLoad = false;
    withCreditHistoryData;
    withoutCreditHistoryData: any;
    withHistoryAns: any;
    withoutHistoryAns: any;
    questions = [[], []];
    answers = [[] , []];


    constructor(
        private crgGroupService: CrgGroupService,
        private questionService: RiskGradingService,
        private toastService: ToastService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        console.log('loanConfigId', this.loanConfigId);
        console.log('fromProfile', this.fromProfile);
        console.log('called ngOninti');
        console.log('loanDataReady loanDataReady' , this.loanDataReady);
        this.getQuestionList();
    }

    getGroupList(crgQuestionsList) {
        this.spinner = true;
        this.crgGroupService.getAll().subscribe((res: any) => {
            this.riskGroupArray = res.detail;
            console.log('group Array', res.detail);
            this.spinner = false;
            this.riskGroupArray.forEach((value: CrgGroup) => {
                this.groupLabelMap.set(value.id, value.label);
                this.groupWeightageMap.set(value.id, value.weightage);
            });
        }, () => {
        }, () => {
            this.buildFormAndCheckEdit(crgQuestionsList);
        });
    }

    buildFormAndCheckEdit(questionList) {
        // list of questions
        console.log('questionList questionList', questionList);
        this.spinner = true;
        this.crgGammaData = [];
        this.withCreditHistoryData = [];
        this.withoutCreditHistoryData = [];
        this.withHistoryAns = [];
        this.withoutHistoryAns = [];
        const crgFormGroupObject = {
            totalPoint: 0,
            grade: null,
            groupObject: this.formBuilder.array([]),
            // withoutCreditGroupObject: this.formBuilder.array([])
        };

        this.totalWithHistoryPointMapper = new Map<string, number>();
        if (!ObjectUtil.isEmpty(this.formData)) {
            this.formDataForEdit = JSON.parse(this.formData.data);
        }
        const withHistory = questionList.filter(cqu => (cqu.fid === 0));
        const withoutHistory = questionList.filter(cqu => (cqu.fid === 1));
        console.log('questionWithIdOne', withHistory);
        console.log('questionWithIdZero', withoutHistory);
        //multiple group codes
        this.riskGroupArray.forEach((ca1) => {
            //with data can have multiple question of multiple group
            const withData = withHistory.filter(cqu => (cqu.crgGroupId === ca1.id));
            console.log('withData', withData);
            const withoutData = withoutHistory.filter(cqu => (cqu.crgGroupId === ca1.id));
            if (withData.length > 0) {
                // const ansData = {
                //     answers: null
                // };
                //removing inactive answers
                withData.forEach(cd => {
                    const cData = cd.answers.filter(a => a.status === 'ACTIVE');
                    cd.answers = cData;
                    // ansData.answers = cData;
                });
                // this.withHistoryAns.push(ansData);
                if (!this.withCreditHistoryData.includes(withData)) {
                    const wData = {
                        groupName: ca1.label,
                        weightage: ca1.weightage,
                        gammaQuestion: [] = withData
                    };
                    this.withCreditHistoryData.push(wData);
                }
            }
            if (withoutData.length > 0) {
                const ansData = {
                    answers: null
                };
                withoutData.forEach(c => {
                    const cData = c.answers.filter(a => a.status === 'ACTIVE');
                    c.answers = cData;
                    ansData.answers = cData;
                });
                if (!this.withoutCreditHistoryData.includes(withoutData)) {
                    const woData = {
                        groupName: ca1.label,
                        weightage: ca1.weightage,
                        gammaQuestion: [] = withoutData
                    };
                    this.withoutCreditHistoryData.push(woData);
                }
            }
        });
        console.log('withCreditHistoryData withCreditHistoryData', this.withCreditHistoryData);
        console.log('withoutCreditHistoryData', this.withoutCreditHistoryData);
        // console.log('crgGammaData', this.crgGammaData);
        const historyData = [];
        const withoutHistoryData = [];
        const questions = [];
        const nonHisQuestion = [];
        // let testFormGroup: FormGroup;
        this.withCreditHistoryData.forEach((cgd, i) => {
            const answer = [];
            const gammaQuestionObject: FormGroup = this.formBuilder.group({
                groupName: null,
                weightage: null,
                groupTotal: 0
            });
            const questionAnswer: any = {};
            const pointMapper = new Map<string, number>();
            cgd.gammaQuestion.forEach((value) => {
                    if (!this.withHistoryAns.includes(value.answers)) {
                        console.log('I am called');
                        answer.push(value.answers);
                    }
                    if (!ObjectUtil.isEmpty(this.formDataForEdit)) {
                        this.totalWithHistoryPointMapper.set(value.description,
                            this.formDataForEdit.withCreditGroupObject[i].gammaQuestionAnswer[value.description]);
                        pointMapper.set(value.description,
                            this.formDataForEdit.withCreditGroupObject[i].gammaQuestionAnswer[value.description]);
                    }
                    questionAnswer[value.description] = null;
                    // questionAnswer[`${value.description}Parameter`] = null;
            });
            this.withHistoryAns.push(answer);
            this.totalGroupPointMapper.push(pointMapper);
            gammaQuestionObject.get('groupName').patchValue(cgd.groupName);
            gammaQuestionObject.get('weightage').patchValue(cgd.weightage);
            questions.push(Object.keys(questionAnswer));
            console.log('questionAnswer ======================', this.formBuilder.group(questionAnswer));
            gammaQuestionObject.addControl('gammaQuestionAnswer', this.formBuilder.group(questionAnswer));
            console.log('gammaQuestionObject gammaQuestionObject', gammaQuestionObject);
            historyData.push(gammaQuestionObject);
        });
        this.questions[0].push(questions);
        crgFormGroupObject.groupObject.push(this.formBuilder.array(historyData));
        this.withoutCreditHistoryData.forEach((cgd, i) => {
            const answerNon = [];
            const gammaQuestionObject: FormGroup = this.formBuilder.group({
                groupName: null,
                weightage: null,
                groupTotal: 0
            });
            const questionAnswer = {
            };
            const pointMapper = new Map<string, number>();
            cgd.gammaQuestion.forEach((value) => {
                if (!this.withHistoryAns.includes(value.answers)) {
                    console.log('without history');
                    answerNon.push(value.answers);
                }
                if (!ObjectUtil.isEmpty(this.formDataForEdit)) {
                    this.totalWithoutHistoryPointMapper.set(value.description,
                        this.formDataForEdit.withoutCreditGroupObject[i].gammaQuestionAnswer[value.description]);
                    pointMapper.set(value.description,
                        this.formDataForEdit.withoutCreditGroupObject[i].gammaQuestionAnswer[value.description]);
                }
                questionAnswer[value.description] = null;
                // questionAnswer[`${value.description}Parameter`] = null;
            });
            this.withoutHistoryAns.push(answerNon);
            this.totalGroupPointMapper.push(pointMapper);
            gammaQuestionObject.get('groupName').patchValue(cgd.groupName);
            gammaQuestionObject.get('weightage').patchValue(cgd.weightage);
            nonHisQuestion.push(Object.keys(questionAnswer));
            gammaQuestionObject.addControl('gammaQuestionAnswer', this.formBuilder.group(questionAnswer));
            withoutHistoryData.push(gammaQuestionObject);
        });
        this.questions[1].push(nonHisQuestion);

        console.log('withHistoryAns', this.withHistoryAns);
        console.log('asdasdasdasd', this.questions);
        this.answers[0].push(this.withHistoryAns);
        this.answers[1].push(this.withoutHistoryAns);
        console.log('answers', this.answers);
        console.log('totalPointMapper', this.totalWithoutHistoryPointMapper);
        crgFormGroupObject.groupObject.push(this.formBuilder.array(withoutHistoryData));
        this.creditRiskGrading = this.formBuilder.group(crgFormGroupObject);
        if (!ObjectUtil.isEmpty(this.formDataForEdit)) {
            this.totalPoints = this.formDataForEdit.totalPoint;
            this.grading = this.formDataForEdit.grade;
            this.creditRiskGrading.get('groupObject').patchValue(this.formDataForEdit.groupObject);
            // this.calculateTotalViaMap();
        }
        // const control = this.creditRiskGrading.get('groupObject') as FormArray;

        this.spinner = false;
        console.log('creditRiskGrading', this.creditRiskGrading);
    }

    onChangeOption(field, point, parameter, history: number) {
        console.log(history);
        if (history === 0) {
            this.totalWithHistoryPointMapper.set(field, point);
        } else {
            this.totalWithoutHistoryPointMapper.set(field, point);
        }
        console.log(this.totalWithHistoryPointMapper, this.totalWithoutHistoryPointMapper);
    }

    calculateTotalViaMap(history: number) {
        let total = 0;
        if (history === 0) {
            this.totalWithHistoryPointMapper.forEach(data => {
                total = total + Number(data);
            });
        } else {
            this.totalWithoutHistoryPointMapper.forEach(data => {
                total = total + Number(data);
            });
        }
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

    parseKeys(obj): string[] {
        console.log('obj', obj);
        if (!ObjectUtil.isEmpty(obj)) {
            return Object.keys(obj);
        }
    }

    calculateGroupTotal() {
        this.totalGroupPointMapper.forEach((tg, i) => {
            let total = 0;
            tg.forEach(gt => {
                total += Number(gt);
            });
            this.creditRiskGrading.get(['groupObject', i, 'groupTotal']).patchValue(total);
        });
    }

    getQuestionList() {
        this.spinner = true;
        this.questionService.getAllQuestions(this.loanConfigId).subscribe((res: any) => {
            const questionsList = res.detail;
            this.crgQuestionsList = questionsList.filter(q => {
                return q.status === Status.ACTIVE;
            });
            console.log('initial question', questionsList);
            // this.spinner = false;
        }, error => {
            this.spinner = false;
            console.log(error);
            this.toastService.show(new Alert(AlertType.DANGER, 'Error fetching question list!'));
        }, () => {
            this.getGroupList(this.crgQuestionsList);
            // if (this.riskGroupArray.length > 0) {
            //     this.buildFormAndCheckEdit(this.crgQuestionsList);
            // }
            this.spinner = false;
        });
    }

    click(data, ans, i, ii) {
        this.creditRiskGrading.get(['groupObject', i, ii]).get('gammaQuestionAnswer').get(ans).patchValue(data);
        //total point
        const keys = this.parseKeys(this.creditRiskGrading.get(['groupObject', i, ii]).get('gammaQuestionAnswer').value);
        let total = 0;
        keys.forEach((k) => {
            if (!ObjectUtil.isEmpty(this.creditRiskGrading.get(['groupObject', i, ii]).get('gammaQuestionAnswer').get(k).value)) {
                total += Number(this.creditRiskGrading.get(['groupObject', i, ii]).get('gammaQuestionAnswer').get(k).value);
            }
        });
        this.creditRiskGrading.get(['groupObject', i, ii]).get('groupTotal').patchValue(total);
        let finalTotal = 0;
        this.creditRiskGrading.get(['groupObject', i]).value.forEach((d) => {
            finalTotal += Number(d.groupTotal);
        });
        this.creditRiskGrading.get('totalPoint').patchValue(finalTotal);
    }

}
