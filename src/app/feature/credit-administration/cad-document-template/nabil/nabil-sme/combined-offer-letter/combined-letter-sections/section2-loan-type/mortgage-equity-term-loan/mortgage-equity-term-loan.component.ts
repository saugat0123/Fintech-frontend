import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-mortgage-equity-term-loan',
    templateUrl: './mortgage-equity-term-loan.component.html',
    styleUrls: ['./mortgage-equity-term-loan.component.scss']
})
export class MortgageEquityTermLoanComponent implements OnInit {
    form: FormGroup;

    constructor(private formBuilder: FormBuilder,
    ) {
    }

    ngOnInit() {
        this.buildForm();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            // Mortgage Term Loan / Equity Mortgage Term Loan
            SNOfParentLimitMortgageTerm: [undefined],
            loanAmountMortgageTerm: [undefined],
            loanAmountInWordMortgageTerm: [undefined],
            drawingPowerMortgageTerm: [undefined],
            // For New EMI Term Loan
            newEMIBaseRateMortgageTerm: [undefined],
            newEMIPremiumRateMortgageTerm: [undefined],
            newEMIInterestRateMortgageTerm: [undefined],
            newEMIAmountMortgageTerm: [undefined],
            newEMIAmountInWordMortgageTerm: [undefined],
            newEMINoOfInstallmentMortgageTerm: [undefined],
            newEMIAutoPopulateMortgageTerm: [undefined],
            newEMILoanPurposeMortgageTerm: [undefined],
            newEMIServiceChargeMortgageTerm: [undefined],
            newEMILoanTenureMortgageTerm: [undefined],
            // For EMI Term Loan at the time of Annual Review of other credit limits
            annualEMIBaseRateMortgageTerm: [undefined],
            annualEMIPremiumRateMortgageTerm: [undefined],
            annualEMIInterestRateMortgageTerm: [undefined],
            annualEMIAmountMortgageTerm: [undefined],
            annualEMIAmountInWordMortgageTerm: [undefined],
            annualEMILoanExpiryDateMortgageTerm: [undefined],
            // For New Installment Basis Term Loan
            newInstallmentBaseRateMortgageTerm: [undefined],
            newInstallmentPremiumRateMortgageTerm: [undefined],
            newInstallmentInterestRateMortgageTerm: [undefined],
            newInstallmentTotalInterestRateMortgageTerm: [undefined],
            newInstallmentLoanTenureMortgageTerm: [undefined],
            newInstallmentPaymentAmountMortgageTerm: [undefined],
            newInstallmentPaymentAmountInWordMortgageTerm: [undefined],
            newInstallmentNoOfPaymentMortgageTerm: [undefined],
            newInstallmentPaymentTypeMortgageTerm: [undefined],
            newInstallmentPaymentDurationMortgageTerm: [undefined],
            newInstallmentLoanPurposeMortgageTerm: [undefined],
            newInstallmentServiceChargeMortgageTerm: [undefined],
            // For Installment Basis Term Loan at the time of Annual Review of other credit limits
            annualInstallmentBaseRateMortgageTerm: [undefined],
            annualInstallmentPremiumRateMortgageTerm: [undefined],
            annualInstallmentInterestRateMortgageTerm: [undefined],
            annualInstallmentTotalInterestRateMortgageTerm: [undefined],
            annualInstallmentPaymentAmountMortgageTerm: [undefined],
            annualInstallmentPaymentAmountInWordMortgageTerm: [undefined],
            annualInstallmentNoOfPaymentMortgageTerm: [undefined],
            annualInstallmentPaymentTypeMortgageTerm: [undefined],
            annualInstallmentLoanExpiryDateMortgageTerm: [undefined],
            annualInstallmentDrawingPowerMortgageTerm: [undefined],
            annualInstallmentDrawingPowerMortgageTerm1: [undefined],
            // Free Text
            freeTextThirteen: [undefined],
        });
    }

}
