import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-home-loan-compliance-status',
    templateUrl: './home-loan-compliance-status.component.html',
    styleUrls: ['./home-loan-compliance-status.component.scss']
})
export class HomeLoanComplianceStatusComponent implements OnInit {
    @Input() loanHolderData;
    @Input() landSecurityDetails;
    loanHolder;
    proposal;
    landAndBuilding;
    requirementUMI;
    requirementDTI;
    requirementLTV;
    positionUMI;
    positionDTI;
    positionLTV;
    landMarketValue: Array<any> = new Array<any>();
    landAndBuildingMarketValue: Array<any> = new Array<any>();
    landConsideredValue: Array<any> = new Array<any>();
    totalLandMarketVal = 0;
    totalLandAndBuildingMarketVal = 0;
    totalBuildingConsideredValue = 0;
    compiledWithUMI: boolean;
    compiledWithDTI: boolean;
    compiledWithLTV: boolean;

    constructor() {
    }

    ngOnInit() {
        this.loanHolder = JSON.parse(this.loanHolderData.financial.data);
        this.setWithCreditHistoryRequiredParameter();
        this.setWithOutCreditHistoryRequiredParameter();
        this.setLTV();
        this.setCompiledWithValue();
       /* if (this.withCreditHistory) {
            this.setWithCreditHistoryRequiredParameter();
        } else {
            this.setWithOutCreditHistoryRequiredParameter();
        }*/
    }
    setWithCreditHistoryRequiredParameter() {
        this.requirementUMI = 1.25;
        this.requirementDTI = 50;
        this.requirementLTV = 60;
    }
    setWithOutCreditHistoryRequiredParameter() {
        this.positionUMI = (this.loanHolder.initialForm.totalNetMonthlyIncome / this.loanHolder.initialForm.emiWithProposal).toFixed(2);
        const totalEMI = Number(this.loanHolder.initialForm.emiWithProposal) +
            Number(this.loanHolder.initialForm.existingObligationOtherBank);
        this.positionDTI = (totalEMI / this.loanHolder.initialForm.totalIncome).toFixed(2);
    }
    setLTV() {
        const securityData = this.landSecurityDetails;
        if (!ObjectUtil.isEmpty(securityData)) {
            if (securityData.selectedArray !== undefined) {
                securityData.selectedArray.filter(f => {
                    if (f.indexOf('LandSecurity') !== -1) {
                        securityData.initialForm.landDetails.forEach(val => {
                            this.landMarketValue.push(val.marketValue);
                        });
                    }
                    if (f.indexOf('Land and Building Security') !== -1) {
                        securityData.initialForm.landBuilding.forEach(val => {
                            this.landAndBuildingMarketValue.push(val.marketValue);
                            this.landConsideredValue.push(val.considerValue);
                        });
                    }
                });
            }
        }
        if (!ObjectUtil.isEmpty(this.landMarketValue)) {
            this.landMarketValue.forEach((v: any) => {
                this.totalLandMarketVal += Number(v);
            });
        }
        if (!ObjectUtil.isEmpty(this.landAndBuildingMarketValue)) {
            this.landAndBuildingMarketValue.forEach((v: any) => {
                this.totalLandAndBuildingMarketVal += v;
            });
        }
        if (!ObjectUtil.isEmpty(this.landConsideredValue)) {
            this.landConsideredValue.forEach((v: any) => {
                this.totalBuildingConsideredValue += v;
            });
        }
        const  totalOfLandAndBuilding = Number(this.totalLandAndBuildingMarketVal) +
            Number(this.totalLandMarketVal) + Number(this.totalBuildingConsideredValue);
        const proposalLimit = this.loanHolderData.proposal.proposedLimit;
        this.positionLTV = (proposalLimit / totalOfLandAndBuilding).toFixed(2);
    }
    setCompiledWithValue() {
        if (this.positionUMI > this.requirementUMI) {
            this.compiledWithUMI = true;
        }
        if (this.requirementDTI > this.positionDTI) {
            this.compiledWithDTI = true;
        }
        if (this.requirementLTV > this.positionLTV) {
            this.compiledWithLTV = true;
        }
    }
}
