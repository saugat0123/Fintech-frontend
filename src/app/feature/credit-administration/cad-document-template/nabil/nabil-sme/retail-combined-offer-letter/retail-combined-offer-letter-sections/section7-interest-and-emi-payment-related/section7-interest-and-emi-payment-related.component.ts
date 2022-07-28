import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';
import {
    RetailLoanNameConstant
} from '../../../../../../cad-view/template-data/retail-template-data/retail-const/retail-loan-name-constants';

@Component({
    selector: 'app-section7-interest-and-emi-payment-related',
    templateUrl: './section7-interest-and-emi-payment-related.component.html',
    styleUrls: ['./section7-interest-and-emi-payment-related.component.scss']
})
export class Section7InterestAndEmiPaymentRelatedComponent implements OnInit {
    @Input() cadData;
    section7Data;
    loanName: Array<any> = new Array<any>();
    loanNepaliName: Array<any> = new Array<any>();
    isLoanSelected: boolean;
    isRegularBasis: boolean;
    isCaseBasis: boolean;
    isPODSelected: boolean;
    isEducationSelected: boolean;
    tempInformation;
    isEducationClassE = false;
    isEducationClassA = false;
    loanNepaliNameEducation: any = [];
    loanNameMainNepaliWithoutEducation: any = [];
    loanNepaliWithoutPersonalEducation: any = [];
    loanNameWithoutPersonalLoan: any = [];
    loanNepaliNameWithoutEducation: any = [];
    loanNepaliNameShare: any = [];
    loanNepaliNameShareWithoutEducation: any = [];
    onlyEducationLoan: any = [];
    onlyPersonalLoan: any = [];
    personalLoanCaseBasisArray: Array<any> = new Array<any>();
    loanNameConstant = RetailLoanNameConstant;

    constructor(
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        const loanNameArray = [];
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
            this.cadData.assignedLoan.forEach(val => {
                if (!this.loanName.includes(val.loan.name)) {
                    loanNameArray.push({
                        name: val.loan.name,
                        nepaliName: val.loan.nepaliName
                    });
                    this.loanName.push(val.loan.name);
                    this.loanNepaliName.push(val.loan.nepaliName);
                }
            });
        }
        if (!ObjectUtil.isEmpty(loanNameArray)) {
            const tempLoanNepaliNameEducation = loanNameArray.filter((val: any) =>
            val.name === this.loanNameConstant.EDUCATION_LOAN_COMBINED ||
                val.name === this.loanNameConstant.MORTGAGE_LOAN_COMBINED ||
                val.name === this.loanNameConstant.HOME_LOAN_COMBINED ||
                val.name === this.loanNameConstant.AUTO_LOAN_COMBINED ||
                val.name === this.loanNameConstant.PERSONAL_LOAN_COMBINED);
            this.loanNepaliNameEducation = this.getNepaliLoanName(tempLoanNepaliNameEducation);
            const tempLoanNepaliWithoutPersonalEducation = loanNameArray.filter((val: any) =>
            val.name === this.loanNameConstant.MORTGAGE_LOAN_COMBINED ||
                val.name === this.loanNameConstant.HOME_LOAN_COMBINED ||
                val.name === this.loanNameConstant.AUTO_LOAN_COMBINED);
            this.loanNepaliWithoutPersonalEducation = this.getNepaliLoanName(tempLoanNepaliWithoutPersonalEducation);
            const tempLoanNameWithoutPersonalLoan = loanNameArray.filter((val: any) =>
            val.name === this.loanNameConstant.EDUCATION_LOAN_COMBINED ||
                val.name === this.loanNameConstant.MORTGAGE_LOAN_COMBINED ||
                val.name === this.loanNameConstant.HOME_LOAN_COMBINED ||
                val.name === this.loanNameConstant.AUTO_LOAN_COMBINED);
            this.loanNameWithoutPersonalLoan = this.getNepaliLoanName(tempLoanNameWithoutPersonalLoan);
            const tempLoanNameMainNepaliWithoutEducation = loanNameArray.filter((val: any) =>
                val.name === this.loanNameConstant.MORTGAGE_LOAN_COMBINED ||
                val.name === this.loanNameConstant.HOME_LOAN_COMBINED ||
                val.name === this.loanNameConstant.AUTO_LOAN_COMBINED ||
                val.name === this.loanNameConstant.PERSONAL_LOAN_COMBINED);
            this.loanNameMainNepaliWithoutEducation = this.getNepaliLoanName(tempLoanNameMainNepaliWithoutEducation);
            const tempLoanNepaliNameWithoutEducation = loanNameArray.filter((val: any) =>
                val.name === this.loanNameConstant.PERSONAL_OVERDRAFT_COMBINED ||
                val.name === this.loanNameConstant.NABIL_SAHAYATRI_KARJA ||
                val.name === this.loanNameConstant.PERSONAL_OVERDRAFT_WITHOUT_COLLATERAL_COMBINED);
            this.loanNepaliNameWithoutEducation = this.getNepaliLoanName(tempLoanNepaliNameWithoutEducation);
            const tempLoanNepaliNameShare = loanNameArray.filter((val: any) =>
                val.name === this.loanNameConstant.SHARE_LOAN_DEMAND_COMBINED ||
                val.name === this.loanNameConstant.NABIL_SHARE_LOAN_POD_COMBINED ||
                val.name === this.loanNameConstant.EDUCATION_LOAN_COMBINED);
            this.loanNepaliNameShare = this.getNepaliLoanName(tempLoanNepaliNameShare);
            const tempLoanNepaliNameShareWithoutEducation = loanNameArray.filter((val: any) =>
                val.name === this.loanNameConstant.SHARE_LOAN_DEMAND_COMBINED ||
                val.name === this.loanNameConstant.NABIL_SHARE_LOAN_POD_COMBINED);
            this.loanNepaliNameShareWithoutEducation = this.getNepaliLoanName(tempLoanNepaliNameShareWithoutEducation);
            const tempOnlyEducation = loanNameArray.filter((val: any) =>
                val.name === this.loanNameConstant.EDUCATION_LOAN_COMBINED);
            this.onlyEducationLoan = this.getNepaliLoanName(tempOnlyEducation);
            const tempOnlyPersonal = loanNameArray.filter((val: any) =>
                val.name === this.loanNameConstant.PERSONAL_LOAN_COMBINED);
            this.onlyPersonalLoan = this.getNepaliLoanName(tempOnlyPersonal);
        }
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
            if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList[0].initialInformation)) {
                this.section7Data = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
            }
            if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList[0].supportedInformation)) {
                this.tempInformation = JSON.parse(this.cadData.offerDocumentList[0].supportedInformation);
            }
        }
        this.checkCondition();
    }

    getNepaliLoanName(loanArray) {
        if (!ObjectUtil.isEmpty(loanArray)) {
            const returnLoanNameArray = [];
            loanArray.forEach((val: any) => {
                returnLoanNameArray.push(val.nepaliName);
            });
            return returnLoanNameArray ? returnLoanNameArray : '';
        }
    }

    checkCondition() {
        if (!ObjectUtil.isEmpty(this.section7Data) &&
        !ObjectUtil.isEmpty(this.section7Data.educationLoanForm) &&
        !ObjectUtil.isEmpty(this.section7Data.educationLoanForm.educationLoanCombinedFormArray)) {
            this.section7Data.educationLoanForm.educationLoanCombinedFormArray.forEach((val: any) => {
                if (val.securityType === 'LAND' || val.securityType === 'LAND_BUILDING') {
                    this.isEducationClassE = true;
                }
                if (val.securityType === 'TD') {
                    this.isEducationClassA = true;
                }
            });
        }
        this.loanName.forEach(val => {
            if (val === 'MORTGAGE LOAN COMBINED' || val === 'HOME LOAN COMBINED' ||
                val === 'AUTO LOAN COMBINED') {
                this.isLoanSelected = true;
            }
            if (val === 'PERSONAL LOAN COMBINED') {
                if (!ObjectUtil.isEmpty(this.section7Data) && !ObjectUtil.isEmpty(this.section7Data.personalLoanCombinedForm)
                    && !ObjectUtil.isEmpty(this.section7Data.personalLoanCombinedForm.personalLoanCombinedFormArray)) {
                    this.personalLoanCaseBasisArray = this.section7Data.personalLoanCombinedForm.personalLoanCombinedFormArray.filter((v: any) =>
                    v.repaymentCase === 'ON_CASE_BASIS');
                    this.section7Data.personalLoanCombinedForm.personalLoanCombinedFormArray.forEach(value => {
                        if (value.repaymentCase === 'REGULAR_BASIS') {
                            this.isRegularBasis = true;
                        }
                        if (value.repaymentCase === 'ON_CASE_BASIS') {
                            this.isCaseBasis = true;
                        }
                    });
                }
            }
            if (val === 'PERSONAL OVERDRAFT COMBINED' || val === 'NABIL SAHAYATRI KARJA' ||
                val === 'PERSONAL OVERDRAFT WITHOUT COLLATERAL COMBINED') {
                this.isPODSelected = true;
            }
            if (val === 'SHARE LOAN DEMAND COMBINED' || val === 'NABIL SHARE LOAN POD COMBINED') {
                this.isEducationSelected = true;
            }
        });
    }
}
