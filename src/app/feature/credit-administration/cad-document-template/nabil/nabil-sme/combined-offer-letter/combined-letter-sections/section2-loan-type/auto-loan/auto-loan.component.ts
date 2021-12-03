import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-auto-loan',
    templateUrl: './auto-loan.component.html',
    styleUrls: ['./auto-loan.component.scss']
})
export class AutoLoanComponent implements OnInit {
    form: FormGroup;

    constructor(private formBuilder: FormBuilder,
    ) {
    }

    ngOnInit() {
        this.buildForm();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            // Auto Loan
            SNOfParentLimitAutoLoan: [undefined],
            loanAmountAutoLoan: [undefined],
            loanAmountInWordAutoLoan: [undefined],
            // For New EMI Term Loan
            newEMIDrawingPowerAutoLoan: [undefined],
            newEMIBaseRateAutoLoan: [undefined],
            newEMIPremiumRateAutoLoan: [undefined],
            newEMIInterestRateAutoLoan: [undefined],
            newEMIAmountAutoLoan: [undefined],
            newEMIAmountInWordAutoLoan: [undefined],
            newEMINoOfInstallmentAutoLoan: [undefined],
            newEMIAutoPopulateAutoLoan: [undefined],
            newEMILoanPurposeAutoLoan: [undefined],
            newEMIServiceChargeAutoLoan: [undefined],
            newEMILoanTenureAutoLoan: [undefined],
            // For EMI Term Loan at the time of Annual Review of other credit limits
            annualEMIBaseRateAutoLoan: [undefined],
            annualEMIPremiumRateAutoLoan: [undefined],
            annualEMIInterestRateAutoLoan: [undefined],
            annualEMIAmountAutoLoan: [undefined],
            annualEMIAmountInWordAutoLoan: [undefined],
            annualEMILoanExpiryDateAutoLoan: [undefined],
            // For New Installment Basis Term Loan
            newInstallmentBaseRateAutoLoan: [undefined],
            newInstallmentPremiumRateAutoLoan: [undefined],
            newInstallmentInterestRateAutoLoan: [undefined],
            newInstallmentLoanTenureAutoLoan: [undefined],
            newInstallmentPaymentAmountAutoLoan: [undefined],
            newInstallmentPaymentAmountInWordAutoLoan: [undefined],
            newInstallmentNoOfPaymentAutoLoan: [undefined],
            newInstallmentPaymentTypeAutoLoan: [undefined],
            newInstallmentPaymentDurationAutoLoan: [undefined],
            newInstallmentLoanPurposeAutoLoan: [undefined],
            newInstallmentServiceChargeAutoLoan: [undefined],
            // For Installment Basis Term Loan at the time of Annual Review of other credit limits
            annualInstallmentBaseRateAutoLoan: [undefined],
            annualInstallmentPremiumRateAutoLoan: [undefined],
            annualInstallmentInterestRateAutoLoan: [undefined],
            annualInstallmentPaymentAmountAutoLoan: [undefined],
            annualInstallmentPaymentAmountInWordAutoLoan: [undefined],
            annualInstallmentNoOfPaymentAutoLoan: [undefined],
            annualInstallmentPaymentTypeAutoLoan: [undefined],
            annualInstallmentLoanExpiryDateAutoLoan: [undefined],
            annualInstallmentDrawingPowerAutoLoan: [undefined],
            annualInstallmentNameOfDealerAutoLoan: [undefined],
            // Free Text
            freeTextFourteen: [undefined]
        });
    }

}
