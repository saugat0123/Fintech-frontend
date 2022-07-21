import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';

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
    loanNepaliNameEducation: Array<any> = new Array<any>();
    loanNameMainNepaliWithoutEducation: Array<any> = new Array<any>();
    loanNepaliWithoutPersonalEducation: Array<any> = new Array<any>();
    loanNameWithoutPersonalLoan: Array<any> = new Array<any>();
    loanNepaliNameWithoutEducation: Array<any> = new Array<any>();
    loanNepaliNameShare: Array<any> = new Array<any>();
    loanNepaliNameShareWithoutEducation: Array<any> = new Array<any>();
    personalLoanCaseBasisArray: Array<any> = new Array<any>();

    constructor(
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
            this.cadData.assignedLoan.forEach(val => {
                if (!this.loanName.includes(val.loan.name)) {
                    this.loanName.push(val.loan.name);
                    this.loanNepaliName.push(val.loan.nepaliName);
                }
            });
        }
        if (!ObjectUtil.isEmpty(this.loanNepaliName)) {
            this.loanNepaliNameEducation = this.loanNepaliName.filter((val: any) =>
            val === 'शिक्षा ऋण' || val === 'धिताे कर्जा' || val === 'आवास कर्जा' || val === 'सवारी साधन कर्जा' || val === 'व्यक्तिगत ऋण');
            this.loanNepaliWithoutPersonalEducation = this.loanNepaliName.filter((val: any) =>
            val === 'धिताे कर्जा' || val === 'आवास कर्जा' || val === 'सवारी साधन कर्जा');
            this.loanNameWithoutPersonalLoan = this.loanNepaliName.filter((val: any) =>
            val === 'शिक्षा ऋण' || val === 'धिताे कर्जा' || val === 'आवास कर्जा' || val === 'सवारी साधन कर्जा');
            this.loanNameMainNepaliWithoutEducation = this.loanNepaliName.filter((val: any) =>
                val === 'धिताे कर्जा' || val === 'आवास कर्जा' || val === 'सवारी साधन कर्जा' || val === 'व्यक्तिगत ऋण');
            this.loanNepaliNameWithoutEducation = this.loanNepaliName.filter((val: any) =>
                val === 'व्यक्तिगत ओभरड्राफ्ट' || val === 'व्यक्तिगत ओभरड्राफ्ट बिना धिताे' || val === 'नबिल सहयात्री कर्जा');
            this.loanNepaliNameShare = this.loanNepaliName.filter((val: any) =>
                val === 'सेयर कर्जा डिमाण्ड' || val === ' नबिल सेयर कर्जा' || val === 'शिक्षा ऋण');
            this.loanNepaliNameShareWithoutEducation = this.loanNepaliName.filter((val: any) =>
                val === 'सेयर कर्जा डिमाण्ड' || val === ' नबिल सेयर कर्जा');
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
