import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-term-loan-to-or-for',
    templateUrl: './term-loan-to-or-for.component.html',
    styleUrls: ['./term-loan-to-or-for.component.scss']
})
export class TermLoanToOrForComponent implements OnInit {
    @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
    @Input() loanData;
    @Input() index;
    @Input() data;
    form: FormGroup;
    tempData;
    termLoanFreeText: any = {};
    termLoanForTermLoanToOrFor; termLoanTypeTermLoanToOrFor; complementaryOtherTermLoanToOrFor = false;
    emiPaymentTypeTermLoanToOrFor; interestSubAgTermLoanToOrFor; paymentTermLoanToOrFor; complementaryOtherTermLoanToOrForName;

    constructor(private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
            this.tempData = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].initialInformation);
            this.fillForm();
        }
        if (!ObjectUtil.isEmpty(this.data)) {
            this.termLoanForTermLoanToOrFor = this.data.termLoanFor;
            this.termLoanTypeTermLoanToOrFor = this.data.termLoanType;
            this.emiPaymentTypeTermLoanToOrFor = this.data.emiPaymentType;
            this.interestSubAgTermLoanToOrFor = this.data.subsidyOrAgricultureLoan;
            this.complementaryOtherTermLoanToOrForName = this.data.complimentaryLoanSelected;
            this.paymentTermLoanToOrFor = this.data.paymentTerms;
            if (this.data.complementaryOther === true) {
                this.complementaryOtherTermLoanToOrFor = true;
            }
        }
    }

    buildForm() {
        this.form = this.formBuilder.group({
            // Term Loan to/for
            SNOfParentLimitVehicleLoan: [undefined],
            purposeLoanVehicleLoan: [undefined],
            purposeLoanVehicleLoanInEng: [undefined],
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
            annualInstallmentLoanExpiryDateVehicleLoan: [undefined],
            // Free Text
            freeTextTen: [undefined],
            freeTextEleven: [undefined],
            freeTextTwelve: [undefined],
        });
    }

    fillForm() {
        if (!ObjectUtil.isEmpty(this.data)) {
            this.form.patchValue({
                // Term Loan to/for
                SNOfParentLimitVehicleLoan: [undefined],
                purposeLoanVehicleLoan: this.data.purposeOfLoanCT ? this.data.purposeOfLoanCT : '',
                purposeLoanVehicleLoanInEng: this.data.purposeOfLoan ? this.data.purposeOfLoan : '',
                // For New EMI Term Loan
                newEMIBaseRateVehicleLoan: this.data.baseRateCT ? this.data.baseRateCT : '',
                newEMIPremiumRateVehicleLoan: this.data.premiumRateCT ? this.data.premiumRateCT : '',
                newEMIInterestRateVehicleLoan: this.data.interestRateCT ? this.data.interestRateCT : '',
                newEMIAmountVehicleLoan: this.data.emiInfigureCT ? this.data.emiInfigureCT : '',
                newEMIAmountInWordVehicleLoan: this.data.emiInWordsCT ? this.data.emiInWordsCT : '',
                // tslint:disable-next-line:max-line-length
                newEMINoOfInstallmentVehicleLoan: this.data.numberOfInstallmentCT ? this.data.numberOfInstallmentCT : '',
                newEMILoanPurposeVehicleLoan: this.data.purposeOfLoanCT ? this.data.purposeOfLoanCT : '',
                // tslint:disable-next-line:max-line-length
                newEMIServiceChargeVehicleLoan: this.data.serviceChargeCT ? this.data.serviceChargeCT : '',
                newEMILoanTenureVehicleLoan: this.data.tenureOfLoanCT ? this.data.tenureOfLoanCT : '',
                // For EMI Term Loan at the time of Annual Review of other credit limits
                annualEMIBaseRateVehicleLoan: this.data.baseRateCT ? this.data.baseRateCT : '',
                annualEMIPremiumRateVehicleLoan: this.data.premiumRateCT ? this.data.premiumRateCT : '',
                // tslint:disable-next-line:max-line-length
                annualEMIInterestRateVehicleLoan: this.data.interestRateCT ? this.data.interestRateCT : '',
                annualEMIAmountVehicleLoan: this.data.emiInfigureCT ? this.data.emiInfigureCT : '',
                annualEMIAmountInWordVehicleLoan: this.data.emiInWordsCT ? this.data.emiInWordsCT : '',
                annualEMILoanExpiryDateVehicleLoan: this.data.dateOfExpiryCT ? this.data.dateOfExpiryCT : '',
                // For New Installment Basis Term Loan
                newInstallmentBaseRateVehicleLoan: this.data.baseRateCT ? this.data.baseRateCT : '',
                newInstallmentPremiumRateVehicleLoan: this.data.premiumRateCT ? this.data.premiumRateCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentInterestRateVehicleLoan: this.data.interestRateCT ? this.data.interestRateCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentTotalInterestRateVehicleLoan: this.data.subsidyInterestRate ? this.data.subsidyInterestRateCT : '',
                newInstallmentLoanTenureVehicleLoan: this.data.tenureOfLoanCT ? this.data.tenureOfLoanCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentPaymentAmountVehicleLoan: this.data.paymentAmountFigureCT ? this.data.paymentAmountFigureCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentPaymentAmountInWordVehicleLoan: this.data.paymentAmountWordsCT ? this.data.paymentAmountWordsCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentNoOfPaymentVehicleLoan: this.data.numberOfPayments ? this.data.numberOfPaymentsCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentLoanPurposeVehicleLoan: this.data.purposeOfLoanCT ? this.data.purposeOfLoanCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentServiceChargeVehicleLoan: this.data.serviceChargeCT ? this.data.serviceChargeCT : '',
                // For Installment Basis Term Loan at the time of Annual Review of other credit limits
                annualInstallmentBaseRateVehicleLoan: this.data.baseRateCT ? this.data.baseRateCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentPremiumRateVehicleLoan: this.data.premiumRateCT ? this.data.premiumRateCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentInterestRateVehicleLoan: this.data.interestRateCT ? this.data.interestRateCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentTotalInterestRateVehicleLoan: this.data.subsidyInterestRate ? this.data.subsidyInterestRateCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentPaymentAmountVehicleLoan: this.data.paymentAmountFigureCT ? this.data.paymentAmountFigureCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentPaymentAmountInWordVehicleLoan: this.data.paymentAmountWordsCT ? this.data.paymentAmountWordsCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentNoOfPaymentVehicleLoan: this.data.numberOfPayments ? this.data.numberOfPaymentsCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentLoanExpiryDateVehicleLoan: this.data.dateOfExpiryCT ? this.data.dateOfExpiryCT : '',
            });
        }
    }

    setFreeTextTermLoan() {
        this.termLoanFreeText = {
            freeText10: this.form.get('freeTextTen').value ? this.form.get('freeTextTen').value : '',
            freeText11: this.form.get('freeTextEleven').value ? this.form.get('freeTextEleven').value : '',
            freeText12: this.form.get('freeTextTwelve').value ? this.form.get('freeTextTwelve').value : '',
        };
        return this.termLoanFreeText;
    }
}

