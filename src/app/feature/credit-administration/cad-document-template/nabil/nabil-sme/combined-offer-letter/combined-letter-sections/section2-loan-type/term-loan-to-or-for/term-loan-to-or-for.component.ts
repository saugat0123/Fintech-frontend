import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../../../model/customerApprovedLoanCadDocumentation';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';

@Component({
    selector: 'app-term-loan-to-or-for',
    templateUrl: './term-loan-to-or-for.component.html',
    styleUrls: ['./term-loan-to-or-for.component.scss']
})
export class TermLoanToOrForComponent implements OnInit {
    @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
    form: FormGroup;
    tempData;
    loanAmount;
    loanAmountInWord;
    termLoanFreeText: any = {};
    termLoanForTermLoanToOrFor; termLoanTypeTermLoanToOrFor; complementaryOtherTermLoanToOrFor = false;
    emiPaymentTypeTermLoanToOrFor; interestSubAgTermLoanToOrFor; paymentTermLoanToOrFor;

    constructor(private formBuilder: FormBuilder,
                private engToNepWord: NepaliCurrencyWordPipe,
                private currencyFormatPipe: CurrencyFormatterPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
    ) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
            this.tempData = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].initialInformation);
            const totalLoanAmount = this.customerApprovedDoc.assignedLoan[0].proposal.proposedLimit;
            this.loanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount));
            this.loanAmountInWord = this.engToNepWord.transform(totalLoanAmount);
            this.fillForm();
        }
        if (!ObjectUtil.isEmpty(this.tempData.termLoanForm)) {
            this.termLoanForTermLoanToOrFor = this.tempData.termLoanForm.termLoanFor;
            this.termLoanTypeTermLoanToOrFor = this.tempData.termLoanForm.termLoanType;
            this.emiPaymentTypeTermLoanToOrFor = this.tempData.termLoanForm.emiPaymentType;
            this.interestSubAgTermLoanToOrFor = this.tempData.termLoanForm.subsidyOrAgricultureLoan;
            this.paymentTermLoanToOrFor = this.tempData.termLoanForm.paymentTerms;
            if (this.tempData.termLoanForm.complementaryOther === true) {
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
        if (!ObjectUtil.isEmpty(this.tempData.termLoanForm)) {
            this.form.patchValue({
                // Term Loan to/for
                SNOfParentLimitVehicleLoan: [undefined],
                purposeLoanVehicleLoan: this.tempData.termLoanForm.purposeOfLoanCT ? this.tempData.termLoanForm.purposeOfLoanCT : '',
                purposeLoanVehicleLoanInEng: this.tempData.termLoanForm.purposeOfLoan ? this.tempData.termLoanForm.purposeOfLoan : '',
                loanAmountVehicleLoan: this.loanAmount ? this.loanAmount : '',
                loanAmountInWordVehicleLoan: this.loanAmountInWord ? this.loanAmountInWord : '',
                // For New EMI Term Loan
                newEMIBaseRateVehicleLoan: this.tempData.termLoanForm.baseRateCT ? this.tempData.termLoanForm.baseRateCT : '',
                newEMIPremiumRateVehicleLoan: this.tempData.termLoanForm.premiumRateCT ? this.tempData.termLoanForm.premiumRateCT : '',
                newEMIInterestRateVehicleLoan: this.tempData.termLoanForm.interestRateCT ? this.tempData.termLoanForm.interestRateCT : '',
                newEMIAmountVehicleLoan: this.tempData.termLoanForm.emiInfigureCT ? this.tempData.termLoanForm.emiInfigureCT : '',
                newEMIAmountInWordVehicleLoan: this.tempData.termLoanForm.emiInWordsCT ? this.tempData.termLoanForm.emiInWordsCT : '',
                // tslint:disable-next-line:max-line-length
                newEMINoOfInstallmentVehicleLoan: this.tempData.termLoanForm.numberOfInstallmentCT ? this.tempData.termLoanForm.numberOfInstallmentCT : '',
                newEMILoanPurposeVehicleLoan: this.tempData.termLoanForm.purposeOfLoanCT ? this.tempData.termLoanForm.purposeOfLoanCT : '',
                // tslint:disable-next-line:max-line-length
                newEMIServiceChargeVehicleLoan: this.tempData.termLoanForm.serviceChargeCT ? this.tempData.termLoanForm.serviceChargeCT : '',
                newEMILoanTenureVehicleLoan: this.tempData.termLoanForm.tenureOfLoanCT ? this.tempData.termLoanForm.tenureOfLoanCT : '',
                // For EMI Term Loan at the time of Annual Review of other credit limits
                annualEMIBaseRateVehicleLoan: this.tempData.termLoanForm.baseRateCT ? this.tempData.termLoanForm.baseRateCT : '',
                annualEMIPremiumRateVehicleLoan: this.tempData.termLoanForm.premiumRateCT ? this.tempData.termLoanForm.premiumRateCT : '',
                // tslint:disable-next-line:max-line-length
                annualEMIInterestRateVehicleLoan: this.tempData.termLoanForm.interestRateCT ? this.tempData.termLoanForm.interestRateCT : '',
                annualEMIAmountVehicleLoan: this.tempData.termLoanForm.emiInfigureCT ? this.tempData.termLoanForm.emiInfigureCT : '',
                annualEMIAmountInWordVehicleLoan: this.tempData.termLoanForm.emiInWordsCT ? this.tempData.termLoanForm.emiInWordsCT : '',
                annualEMILoanExpiryDateVehicleLoan: this.tempData.termLoanForm.dateOfExpiryCT ? this.tempData.termLoanForm.dateOfExpiryCT : '',
                // For New Installment Basis Term Loan
                newInstallmentBaseRateVehicleLoan: this.tempData.termLoanForm.baseRateCT ? this.tempData.termLoanForm.baseRateCT : '',
                newInstallmentPremiumRateVehicleLoan: this.tempData.termLoanForm.premiumRateCT ? this.tempData.termLoanForm.premiumRateCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentInterestRateVehicleLoan: this.tempData.termLoanForm.interestRateCT ? this.tempData.termLoanForm.interestRateCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentTotalInterestRateVehicleLoan: this.tempData.termLoanForm.subsidyInterestRate ? this.tempData.termLoanForm.subsidyInterestRateCT : '',
                newInstallmentLoanTenureVehicleLoan: this.tempData.termLoanForm.tenureOfLoanCT ? this.tempData.termLoanForm.tenureOfLoanCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentPaymentAmountVehicleLoan: this.tempData.termLoanForm.paymentAmountFigureCT ? this.tempData.termLoanForm.paymentAmountFigureCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentPaymentAmountInWordVehicleLoan: this.tempData.termLoanForm.paymentAmountWordsCT ? this.tempData.termLoanForm.paymentAmountWordsCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentNoOfPaymentVehicleLoan: this.tempData.termLoanForm.numberOfPayments ? this.tempData.termLoanForm.numberOfPaymentsCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentLoanPurposeVehicleLoan: this.tempData.termLoanForm.purposeOfLoanCT ? this.tempData.termLoanForm.purposeOfLoanCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentServiceChargeVehicleLoan: this.tempData.termLoanForm.serviceChargeCT ? this.tempData.termLoanForm.serviceChargeCT : '',
                // For Installment Basis Term Loan at the time of Annual Review of other credit limits
                annualInstallmentBaseRateVehicleLoan: this.tempData.termLoanForm.baseRateCT ? this.tempData.termLoanForm.baseRateCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentPremiumRateVehicleLoan: this.tempData.termLoanForm.premiumRateCT ? this.tempData.termLoanForm.premiumRateCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentInterestRateVehicleLoan: this.tempData.termLoanForm.interestRateCT ? this.tempData.termLoanForm.interestRateCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentTotalInterestRateVehicleLoan: this.tempData.termLoanForm.subsidyInterestRate ? this.tempData.termLoanForm.subsidyInterestRateCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentPaymentAmountVehicleLoan: this.tempData.termLoanForm.paymentAmountFigureCT ? this.tempData.termLoanForm.paymentAmountFigureCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentPaymentAmountInWordVehicleLoan: this.tempData.termLoanForm.paymentAmountWordsCT ? this.tempData.termLoanForm.paymentAmountWordsCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentNoOfPaymentVehicleLoan: this.tempData.termLoanForm.numberOfPayments ? this.tempData.termLoanForm.numberOfPaymentsCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentLoanExpiryDateVehicleLoan: this.tempData.termLoanForm.dateOfExpiryCT ? this.tempData.termLoanForm.dateOfExpiryCT : '',
            });
        }
    }

    setFreeTextTermLoan() {
        this.termLoanFreeText = {
            freeText10: this.form.get('freeTextTen').value,
            freeText11: this.form.get('freeTextEleven').value,
            freeText12: this.form.get('freeTextTwelve').value,
        };
        return this.termLoanFreeText;
    }
}

