import {Component, Input, OnInit} from '@angular/core';
import {MawCreditRiskGrading} from '../../../model/MawCreditRiskGrading';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-maw-credit-risk-grading',
    templateUrl: './maw-credit-risk-grading.component.html',
    styleUrls: ['./maw-credit-risk-grading.component.scss']
})
export class MawCreditRiskGradingComponent implements OnInit {
    @Input() mawCreditRiskGradingData: MawCreditRiskGrading;

    scoresArray = [20, 15, 10, 0];
    scoresArrayCoA = [50, 30, 15, 5];
    mawCreditRiskGradingForm: FormGroup;

    totalCompetencyOfBurrowersMap: Map<string, number> = new Map<string, number>();
    totalFinancialSourceMap: Map<string, number> = new Map<string, number>();
    totalSecurityRealizationMap: Map<string, number> = new Map<string, number>();
    totalConductOfAccountMap: Map<string, number> = new Map<string, number>();

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.mawCreditRiskGradingForm = this.formBuilder.group({
            // Competency of Burrowers--
            reputationGivenScore: [undefined],
            reputationNegativeScore: [0],
            reputationJustification: [undefined],

            qualificationOfKeyPersonGivenScore: [undefined],
            qualificationOfKeyPersonNegativeScore: [0],
            qualificationOfKeyPersonJustification: [undefined],

            ageOfBurrowersOrKeyPersonGivenScore: [undefined],
            ageOfBurrowersOrKeyPersonNegativeScore: [0],
            ageOfBurrowersOrKeyPersonJustification: [undefined],

            workExperienceInSimilarBusinessGivenScore: [undefined],
            workExperienceInSimilarBusinessNegativeScore: [0],
            workExperienceInSimilarBusinessJustification: [undefined],

            netWorthGivenScore: [undefined],
            netWorthNegativeScore: [0],
            netWorthJustification: [undefined],

            totalCompetencyOfBurrowers: [undefined],
            weightedCompetencyOfBurrowers: [undefined],

            // Financial/Repayment Source
            debtEquityRatioGivenScore: [undefined],
            debtEquityRatioNegativeScore: [0],
            debtEquityRatioJustification: [undefined],

            futureIncomeCoverageRatioGivenScore: [undefined],
            futureIncomeCoverageRatioNegativeScore: [0],
            futureIncomeCoverageRatioJustification: [undefined],

            presentIncomeRatioGivenScore: [undefined],
            presentIncomeRatioNegativeScore: [0],
            presentIncomeRatioJustification: [undefined],

            secondarySourceOfRepaymentGivenScore: [undefined],
            secondarySourceOfRepaymentNegativeScore: [0],
            secondarySourceOfRepaymentJustification: [undefined],

            totalFinancialSource: [undefined],
            weightedFinancialSource: [undefined],

            // Security Realization
            loanTenureGivenScore: [undefined],
            loanTenureNegativeScore: [0],
            loanTenureJustification: [undefined],

            securityLocationGivenScore: [undefined],
            securityLocationNegativeScore: [0],
            securityLocationJustification: [undefined],

            ownershipGivenScore: [undefined],
            ownershipNegativeScore: [0],
            ownershipJustification: [undefined],

            accessToLandGivenScore: [undefined],
            accessToLandNegativeScore: [0],
            accessToLandJustification: [undefined],

            totalSecurityRealization: [undefined],
            weightedSecurityRealization: [undefined],

            // Conduct of Account
            debtServicingTrackRecordOnGivenScore: [undefined],
            debtServicingTrackRecordOnNegativeScore: [0],
            debtServicingTrackRecordOnJustification: [undefined],

            debtServiceTrackRecordOffGivenScore: [undefined],
            debtServiceTrackRecordOffNegativeScore: [0],
            debtServiceTrackRecordOffJustification: [undefined],

            totalConductOfAccount: [undefined],
            weightedConductOfAccount: [undefined],

            creditRiskScore: [undefined],
            remarks: [undefined]
        });
        if (!ObjectUtil.isEmpty(this.mawCreditRiskGradingData)) {
            this.mawCreditRiskGradingForm.patchValue(JSON.parse(this.mawCreditRiskGradingData.data));
        }
    }

    onChangePoints(criteria: string, field, givenPoint: number, negativePoint: number) {
        switch (criteria) {
            case 'CompetencyOfBurrowers':
                const netCompetencyOfBurrowers = Number(givenPoint - negativePoint);
                this.totalCompetencyOfBurrowersMap.set(field, netCompetencyOfBurrowers);
                if (this.totalCompetencyOfBurrowersMap.size === 5) {
                    let total = 0;
                    this.totalCompetencyOfBurrowersMap.forEach(value => {
                        total = total + value;
                    });
                    this.mawCreditRiskGradingForm.get('totalCompetencyOfBurrowers').patchValue(total);
                    const weighted = (25 / 100) * total;
                    this.mawCreditRiskGradingForm.get('weightedCompetencyOfBurrowers').patchValue(weighted);
                }
                break;

            case 'FinancialSource':
                const netFinancialSource = givenPoint - negativePoint;
                this.totalFinancialSourceMap.set(field, netFinancialSource);
                if (this.totalFinancialSourceMap.size === 4) {
                    let total = 0;
                    this.totalFinancialSourceMap.forEach(value => {
                        total = total + value;
                    });
                    this.mawCreditRiskGradingForm.get('totalFinancialSource').patchValue(total);
                    const weighted = (25 / 100) * total;
                    this.mawCreditRiskGradingForm.get('weightedFinancialSource').patchValue(weighted);
                }
                break;

            case 'SecurityRealization':
                const netSecurityRealization = givenPoint - negativePoint;
                this.totalSecurityRealizationMap.set(field, netSecurityRealization);
                if (this.totalSecurityRealizationMap.size === 4) {
                    let total = 0;
                    this.totalSecurityRealizationMap.forEach(value => {
                        total = total + value;
                    });
                    this.mawCreditRiskGradingForm.get('totalSecurityRealization').patchValue(total);
                    const weighted = (25 / 100) * total;
                    this.mawCreditRiskGradingForm.get('weightedSecurityRealization').patchValue(weighted);
                }
                break;

            case 'ConductOfAccount':
                const netConductOfAccount = givenPoint - negativePoint;
                this.totalConductOfAccountMap.set(field, netConductOfAccount);
                if (this.totalConductOfAccountMap.size === 2) {
                    let total = 0;
                    this.totalConductOfAccountMap.forEach(value => {
                        total = total + value;
                    });
                    this.mawCreditRiskGradingForm.get('totalConductOfAccount').patchValue(total);
                    const weighted = (25 / 100) * total;
                    this.mawCreditRiskGradingForm.get('weightedConductOfAccount').patchValue(weighted);
                }
                break;
        }
        const crg = Number(this.mawCreditRiskGradingForm.get('weightedCompetencyOfBurrowers').value) +
            Number(this.mawCreditRiskGradingForm.get('weightedFinancialSource').value) +
            Number(this.mawCreditRiskGradingForm.get('weightedSecurityRealization').value) +
            Number(this.mawCreditRiskGradingForm.get('weightedConductOfAccount').value);

        this.mawCreditRiskGradingForm.get('creditRiskScore').patchValue(crg);
    }

    onSubmit() {
        if (ObjectUtil.isEmpty(this.mawCreditRiskGradingData)) {
            this.mawCreditRiskGradingData = new MawCreditRiskGrading();
        }
        this.mawCreditRiskGradingData.data = JSON.stringify(this.mawCreditRiskGradingForm.value);
    }
}
