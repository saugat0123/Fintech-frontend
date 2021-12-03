import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-term-loan-to-or-for',
    templateUrl: './term-loan-to-or-for.component.html',
    styleUrls: ['./term-loan-to-or-for.component.scss']
})
export class TermLoanToOrForComponent implements OnInit {
    form: FormGroup;

    constructor(private formBuilder: FormBuilder,
    ) {}

    ngOnInit() {
        this.buildForm();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            // Term Loan to/for
            SNOfParentLimitVehicleLoan: [undefined],
            purposeLoanVehicleLoan: [undefined],
            purposeLoanVehicleLoanInEng: [undefined],
            loanAmountVehicleLoan: [undefined],
            loanAmountInWordVehicleLoan: [undefined],
            // For New EMI Term Loan
            newEMIBaseRateVehicleLoan: [undefined],
            newEMIPremiumRateVehicleLoan: [undefined],
            newEMIInterestRateVehicleLoan: [undefined],
            newEMIAmountVehicleLoan: [undefined],
            newEMIAmountInWordVehicleLoan: [undefined],
            newEMINoOfInstallmentVehicleLoan: [undefined],
            newEMISubsequentVehicleLoan: [undefined],
            newEMILoanPurposeVehicleLoan: [undefined],
            newEMIServiceChargeVehicleLoan: [undefined],
            newEMILoanTenureVehicleLoan: [undefined],
            // For EMI Term Loan at the time of Annual Review of other credit limits
            annualEMIBaseRateVehicleLoan: [undefined],
            annualEMIPremiumRateVehicleLoan: [undefined],
            annualEMIInterestRateVehicleLoan: [undefined],
            annualEMIAmountVehicleLoan: [undefined],
            annualEMIAmountInWordVehicleLoan: [undefined],
            annualEMILoanExpiryDateVehicleLoan: [undefined],
            // For New Installment Basis Term Loan
            newInstallmentBaseRateVehicleLoan: [undefined],
            newInstallmentPremiumRateVehicleLoan: [undefined],
            newInstallmentInterestRateVehicleLoan: [undefined],
            newInstallmentTotalInterestRateVehicleLoan: [undefined],
            newInstallmentLoanTenureVehicleLoan: [undefined],
            newInstallmentPaymentAmountVehicleLoan: [undefined],
            newInstallmentPaymentAmountInWordVehicleLoan: [undefined],
            newInstallmentNoOfPaymentVehicleLoan: [undefined],
            newInstallmentPaymentTypeVehicleLoan: [undefined],
            newInstallmentPaymentDurationVehicleLoan: [undefined],
            newInstallmentLoanPurposeVehicleLoan: [undefined],
            newInstallmentServiceChargeVehicleLoan: [undefined],
            // For Installment Basis Term Loan at the time of Annual Review of other credit limits
            annualInstallmentBaseRateVehicleLoan: [undefined],
            annualInstallmentPremiumRateVehicleLoan: [undefined],
            annualInstallmentInterestRateVehicleLoan: [undefined],
            annualInstallmentTotalInterestRateVehicleLoan: [undefined],
            annualInstallmentPaymentAmountVehicleLoan: [undefined],
            annualInstallmentPaymentAmountInWordVehicleLoan: [undefined],
            annualInstallmentNoOfPaymentVehicleLoan: [undefined],
            annualInstallmentPaymentTypeVehicleLoan: [undefined],
            annualInstallmentLoanExpiryDateVehicleLoan: [undefined],
            // Free Text
            freeTextTen: [undefined],
            freeTextEleven: [undefined],
            freeTextTwelve: [undefined],
        });
    }

}
