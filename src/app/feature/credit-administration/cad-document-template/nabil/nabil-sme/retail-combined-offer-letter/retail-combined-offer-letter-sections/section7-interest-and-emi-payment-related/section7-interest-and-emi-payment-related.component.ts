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
    form: FormGroup;
    section7Data;
    loanName: Array<any> = new Array<any>();
    isLoanSelected: boolean;
    isRegularBasis: boolean;
    isCaseBasis: boolean;
    isPODSelected: boolean;
    isEducationSelected: boolean;

    constructor(
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
            this.cadData.assignedLoan.forEach(val => {
                this.loanName.push(val.loan.name);
            });
        }
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
            this.section7Data = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
        }
        this.buildForm();
        this.checkCondition();
    }

    checkCondition() {
        this.loanName.forEach(val => {
            if (val === 'MORTGAGE LOAN COMBINED' || val === 'HOME LOAN COMBINED' ||
                val === 'AUTO LOAN COMBINED' || val === 'EDUCATION LOAN COMBINED') {
                this.isLoanSelected = true;
            }
            if (val === 'PERSONAL LOAN COMBINED') {
                if (!ObjectUtil.isEmpty(this.section7Data) && !ObjectUtil.isEmpty(this.section7Data.personalLoanCombinedForm)
                    && !ObjectUtil.isEmpty(this.section7Data.personalLoanCombinedForm.personalLoanCombinedFormArray)) {
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
            if (val === 'EDUCATION LOAN COMBINED' || val === 'SHARE LOAN DEMAND COMBINED') {
                this.isEducationSelected = true;
            }
        });
    }

    buildForm() {
        return this.form = this.formBuilder.group({
            freeDate: [undefined]
        });
    }
}