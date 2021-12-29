import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
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
    @Input() data2;
    form: FormGroup;
    tempData;
    termLoanFreeText: any = [];
    // termLoanFreeText: any = {};
    termLoanForTermLoanToOrFor; termLoanTypeTermLoanToOrFor; complementaryOtherTermLoanToOrFor = false;
    emiPaymentTypeTermLoanToOrFor; interestSubAgTermLoanToOrFor; paymentTermLoanToOrFor; complementaryOtherTermLoanToOrForName;
    tempInformation;
    newEMISubsequentVehicleLoan = 'निकासा भएको पछिल्लोे महिना देखि किस्ता भुक्तानी मिति हुनेछ';
    constructor(private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        this.buildForm();
        this.buildFreeText();
        if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
            this.tempData = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].initialInformation);
            this.tempInformation = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].supportedInformation);
            // this.setFreeTextTermLoan();
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
            purposeLoanVehicleLoan: [undefined],
            purposeLoanVehicleLoanInEng: [undefined],
            // For New EMI Term Loan
            newEMIBaseRateVehicleLoan: [undefined],
            newEMIPremiumRateVehicleLoan: [undefined],
            newEMIInterestRateVehicleLoan: [undefined],
            newEMIAmountVehicleLoan: [undefined],
            newEMIAmountInWordVehicleLoan: [undefined],
            newEMINoOfInstallmentVehicleLoan: [undefined],
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
            termLoanFreeText: this.formBuilder.array([]),
        });
        this.termLoanFreeText = this.form.get('termLoanFreeText') as FormArray;
    }

    buildFreeText() {
        (this.form.get('termLoanFreeText') as FormArray).push(
            this.formBuilder.group({
                // Free Text
                SNOfParentLimitVehicleLoan: [undefined],
                newEMISubsequentVehicleLoan: [undefined],
                freeTextTen: [undefined],
                freeTextEleven: [undefined],
                freeTextTwelve: [undefined],
            })
        );
    }

    fillForm() {
        if (!ObjectUtil.isEmpty(this.data)) {
            this.form.patchValue({
                // Term Loan to/for
                purposeLoanVehicleLoan: this.data.purposeOfLoanCT ? this.data.purposeOfLoanCT : '',
                purposeLoanVehicleLoanInEng: this.data.purposeOfLoan ? this.data.purposeOfLoan : '',
                // For New EMI Term Loan
                newEMIBaseRateVehicleLoan: this.data.baseRateCT ? this.data.baseRateCT : '',
                newEMIPremiumRateVehicleLoan: this.data.premiumRateCT ? this.data.premiumRateCT : '',
                newEMIInterestRateVehicleLoan: this.data.interestRateCT ? this.data.interestRateCT : '',
                newEMIAmountVehicleLoan: this.data.emiInfigureCT ? this.data.emiInfigureCT : '',
                newEMIAmountInWordVehicleLoan: this.data.emiInWordsCT ? this.data.emiInWordsCT : '',
                newEMINoOfInstallmentVehicleLoan: this.data.numberOfInstallmentCT ? this.data.numberOfInstallmentCT : '',
                newEMILoanPurposeVehicleLoan: this.data.purposeOfLoanCT ? this.data.purposeOfLoanCT : '',
                newEMIServiceChargeVehicleLoan: this.data.serviceChargeCT ? this.data.serviceChargeCT : '',
                newEMILoanTenureVehicleLoan: this.data.tenureOfLoanCT ? this.data.tenureOfLoanCT : '',
                // For EMI Term Loan at the time of Annual Review of other credit limits
                annualEMIBaseRateVehicleLoan: this.data.baseRateCT ? this.data.baseRateCT : '',
                annualEMIPremiumRateVehicleLoan: this.data.premiumRateCT ? this.data.premiumRateCT : '',
                annualEMIInterestRateVehicleLoan: this.data.interestRateCT ? this.data.interestRateCT : '',
                annualEMIAmountVehicleLoan: this.data.emiInfigureCT ? this.data.emiInfigureCT : '',
                annualEMIAmountInWordVehicleLoan: this.data.emiInWordsCT ? this.data.emiInWordsCT : '',
                annualEMILoanExpiryDateVehicleLoan: this.data.dateOfExpiryCT ? this.data.dateOfExpiryCT : '',
                // For New Installment Basis Term Loan
                newInstallmentBaseRateVehicleLoan: this.data.baseRateCT ? this.data.baseRateCT : '',
                newInstallmentPremiumRateVehicleLoan: this.data.premiumRateCT ? this.data.premiumRateCT : '',
                newInstallmentInterestRateVehicleLoan: this.data.interestRateCT ? this.data.interestRateCT : '',
                newInstallmentTotalInterestRateVehicleLoan: this.data.subsidyInterestRate ? this.data.subsidyInterestRateCT : '',
                newInstallmentLoanTenureVehicleLoan: this.data.tenureOfLoanCT ? this.data.tenureOfLoanCT : '',
                newInstallmentPaymentAmountVehicleLoan: this.data.paymentAmountFigureCT ? this.data.paymentAmountFigureCT : '',
                newInstallmentPaymentAmountInWordVehicleLoan: this.data.paymentAmountWordsCT ? this.data.paymentAmountWordsCT : '',
                newInstallmentNoOfPaymentVehicleLoan: this.data.numberOfPayments ? this.data.numberOfPaymentsCT : '',
                newInstallmentLoanPurposeVehicleLoan: this.data.purposeOfLoanCT ? this.data.purposeOfLoanCT : '',
                newInstallmentServiceChargeVehicleLoan: this.data.serviceChargeCT ? this.data.serviceChargeCT : '',
                // For Installment Basis Term Loan at the time of Annual Review of other credit limits
                annualInstallmentBaseRateVehicleLoan: this.data.baseRateCT ? this.data.baseRateCT : '',
                annualInstallmentPremiumRateVehicleLoan: this.data.premiumRateCT ? this.data.premiumRateCT : '',
                annualInstallmentInterestRateVehicleLoan: this.data.interestRateCT ? this.data.interestRateCT : '',
                annualInstallmentTotalInterestRateVehicleLoan: this.data.subsidyInterestRate ? this.data.subsidyInterestRateCT : '',
                annualInstallmentPaymentAmountVehicleLoan: this.data.paymentAmountFigureCT ? this.data.paymentAmountFigureCT : '',
                annualInstallmentPaymentAmountInWordVehicleLoan: this.data.paymentAmountWordsCT ? this.data.paymentAmountWordsCT : '',
                annualInstallmentNoOfPaymentVehicleLoan: this.data.numberOfPayments ? this.data.numberOfPaymentsCT : '',
                annualInstallmentLoanExpiryDateVehicleLoan: this.data.dateOfExpiryCT ? this.data.dateOfExpiryCT : '',
            });
            // this.patchFreeText();
        }
    }

    // setFreeTextTermLoan() {
    //     this.termLoanFreeText = {
    //        /* freeText10: this.form.get(['termLoanFreeText', index, 'freeTextTen']).value ? this.form.get(['termLoanFreeText', index, 'freeTextTen']).value : '',
    //         freeText11: this.form.get(['termLoanFreeText', index, 'freeTextEleven']).value ? this.form.get(['termLoanFreeText', index, 'freeTextEleven']).value : '',
    //         freeText12: this.form.get(['termLoanFreeText', index, 'freeTextTwelve']).value ? this.form.get(['termLoanFreeText', index, 'freeTextTwelve']).value : '',
    //         // tslint:disable-next-line:max-line-length
    //         newEMISubsequentVehicleLoan1: this.form.get(['termLoanFreeText', index, 'newEMISubsequentVehicleLoan']).value ? this.form.get(['termLoanFreeText', index, 'newEMISubsequentVehicleLoan']).value : '',
    //         SNLimitVehicleLoan: this.form.get(['termLoanFreeText', index, 'SNOfParentLimitVehicleLoan']).value ? this.form.get(['termLoanFreeText', index, 'SNOfParentLimitVehicleLoan']).value : '',*/
    //         freeText10: this.form.get('freeTextTen').value ? this.form.get('freeTextTen').value : '',
    //         freeText11: this.form.get('freeTextEleven').value ? this.form.get('freeTextEleven').value : '',
    //         freeText12: this.form.get('freeTextTwelve').value ? this.form.get('freeTextTwelve').value : '',
    //         // tslint:disable-next-line:max-line-length
    //         newEMISubsequentVehicleLoan1: this.form.get('newEMISubsequentVehicleLoan').value ? this.form.get('newEMISubsequentVehicleLoan').value : '',
    //         SNLimitVehicleLoan: this.form.get('SNOfParentLimitVehicleLoan').value ? this.form.get('SNOfParentLimitVehicleLoan').value : '',
    //     };
    //     return this.termLoanFreeText;
    // }
    patchFreeText() {
        this.form.patchValue({
            freeTextTen: this.tempInformation ? this.tempInformation.section2.freeText10 : '',
            freeTextEleven: this.tempInformation ? this.tempInformation.section2.freeText11 : '',
            freeTextTwelve: this.tempInformation ? this.tempInformation.section2.freeText12 : '',
            SNOfParentLimitVehicleLoan: this.tempInformation ? this.tempInformation.section2.SNLimitVehicleLoan : '',
            newEMISubsequentVehicleLoan: !ObjectUtil.isEmpty( this.newEMISubsequentVehicleLoan) ? this.newEMISubsequentVehicleLoan : '',
        });
        if (!ObjectUtil.isEmpty(this.tempInformation)) {
            if (this.newEMISubsequentVehicleLoan === this.tempInformation.section2.newEMISubsequentVehicleLoan1) {
                this.newEMISubsequentVehicleLoan = 'निकासा भएको पछिल्लोे महिना देखि किस्ता भुक्तानी मिति हुनेछ';
            }
            if (this.tempInformation.section2.newEMISubsequentVehicleLoan1 !== this.newEMISubsequentVehicleLoan) {
                this.newEMISubsequentVehicleLoan = this.tempInformation.section2.newEMISubsequentVehicleLoan1;
            }
        }
    }
}

