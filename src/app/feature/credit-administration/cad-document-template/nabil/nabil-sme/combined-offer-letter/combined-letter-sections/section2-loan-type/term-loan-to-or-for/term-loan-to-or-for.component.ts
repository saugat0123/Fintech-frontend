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
    @Input() letterData;
    @Input() pointNumber;
    @Input() termLoanData;
    form: FormGroup;
    tempData;
    termLoanFreeText: Array<any> = new Array<any>();
    tempInformation;
    newEMISubsequentVehicleLoan = 'निकासा भएको पछिल्लोे महिना देखि किस्ता भुक्तानी मिति हुनेछ';
    constructor(private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
            this.tempData = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].initialInformation);
            this.tempInformation = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].supportedInformation);
            this.fillForm();
        }
    }

    buildForm() {
        this.form = this.formBuilder.group({
            termLoanDetails: this.formBuilder.array([]),
        });
        for (let val = 0; val < this.loanData.length; val++) {
            this.setForm();
        }
    }

    setForm() {
        (this.form.get('termLoanDetails') as FormArray).push(
            this.formBuilder.group({
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
            annualInstallmentPaymentAmountVehicleLoan: [undefined],
            annualInstallmentPaymentAmountInWordVehicleLoan: [undefined],
            annualInstallmentNoOfPaymentVehicleLoan: [undefined],
            annualInstallmentLoanExpiryDateVehicleLoan: [undefined],
            // termLoanFreeText: this.formBuilder.array([]),
            SNOfParentLimitVehicleLoan: [undefined],
            newEMISubsequentVehicleLoan: [undefined],
            freeTextTen: [undefined],
            freeTextEleven: [undefined],
            freeTextTwelve: [undefined],
        })
    )
    }

    fillForm() {
        if (!ObjectUtil.isEmpty(this.termLoanData)) {
            console.log('Term Loan Data:', this.termLoanData);
            for (let i = 0; i < this.termLoanData.length; i++) {
                this.form.get(['termLoanDetails', i, 'purposeLoanVehicleLoan']).patchValue(this.termLoanData[i].purposeOfLoanCT);
                this.form.get(['termLoanDetails', i, 'purposeLoanVehicleLoanInEng']).patchValue(this.termLoanData[i].purposeOfLoan);
                this.form.get(['termLoanDetails', i, 'newEMIBaseRateVehicleLoan']).patchValue(this.termLoanData[i].baseRateCT);
                this.form.get(['termLoanDetails', i, 'newEMIPremiumRateVehicleLoan']).patchValue(this.termLoanData[i].premiumRateCT);
                this.form.get(['termLoanDetails', i, 'newEMIInterestRateVehicleLoan']).patchValue(this.termLoanData[i].interestRateCT);
                this.form.get(['termLoanDetails', i, 'newEMIAmountVehicleLoan']).patchValue(this.termLoanData[i].emiInfigureCT);
                this.form.get(['termLoanDetails', i, 'newEMIAmountInWordVehicleLoan']).patchValue(this.termLoanData[i].emiInWordsCT);
                this.form.get(['termLoanDetails', i, 'newEMINoOfInstallmentVehicleLoan']).patchValue(this.termLoanData[i].numberOfInstallmentCT);
                this.form.get(['termLoanDetails', i, 'newEMIServiceChargeVehicleLoan']).patchValue(this.termLoanData[i].serviceChargeCT);
                this.form.get(['termLoanDetails', i, 'newEMILoanTenureVehicleLoan']).patchValue(this.termLoanData[i].tenureOfLoanCT);
                this.form.get(['termLoanDetails', i, 'annualEMIBaseRateVehicleLoan']).patchValue(this.termLoanData[i].baseRateCT);
                this.form.get(['termLoanDetails', i, 'annualEMIPremiumRateVehicleLoan']).patchValue(this.termLoanData[i].premiumRateCT);
                this.form.get(['termLoanDetails', i, 'annualEMIInterestRateVehicleLoan']).patchValue(this.termLoanData[i].interestRateCT);
                this.form.get(['termLoanDetails', i, 'annualEMIAmountVehicleLoan']).patchValue(this.termLoanData[i].emiInfigureCT);
                this.form.get(['termLoanDetails', i, 'annualEMIAmountInWordVehicleLoan']).patchValue(this.termLoanData[i].emiInWordsCT);
                this.form.get(['termLoanDetails', i, 'annualEMILoanExpiryDateVehicleLoan']).patchValue(this.termLoanData[i].dateOfExpiryCT);
                this.form.get(['termLoanDetails', i, 'newInstallmentBaseRateVehicleLoan']).patchValue(this.termLoanData[i].baseRateCT);
                this.form.get(['termLoanDetails', i, 'newInstallmentPremiumRateVehicleLoan']).patchValue(this.termLoanData[i].premiumRateCT);
                this.form.get(['termLoanDetails', i, 'newInstallmentInterestRateVehicleLoan']).patchValue(this.termLoanData[i].interestRateCT);
                this.form.get(['termLoanDetails', i, 'newInstallmentLoanTenureVehicleLoan']).patchValue(this.termLoanData[i].tenureOfLoanCT);
                this.form.get(['termLoanDetails', i, 'newInstallmentPaymentAmountVehicleLoan']).patchValue(this.termLoanData[i].paymentAmountFigureCT);
                this.form.get(['termLoanDetails', i, 'newInstallmentPaymentAmountInWordVehicleLoan']).patchValue(this.termLoanData[i].paymentAmountWordsCT);
                this.form.get(['termLoanDetails', i, 'newInstallmentNoOfPaymentVehicleLoan']).patchValue(this.termLoanData[i].numberOfPaymentsCT);
                if (this.termLoanData[i].termLoanFor === 'VEHICLE') {
                    this.form.get(['termLoanDetails', i, 'newInstallmentLoanPurposeVehicleLoan']).patchValue('सवारी साधन खरिद गर्ने');
                    this.form.get(['termLoanDetails', i, 'newEMILoanPurposeVehicleLoan']).patchValue('सवारी साधन खरिद गर्ने');
                } else {
                this.form.get(['termLoanDetails', i, 'newInstallmentLoanPurposeVehicleLoan']).patchValue(this.termLoanData[i].purposeOfLoanCT);
                this.form.get(['termLoanDetails', i, 'newEMILoanPurposeVehicleLoan']).patchValue(this.termLoanData[i].purposeOfLoanCT);
                }
               this.form.get(['termLoanDetails', i, 'newInstallmentServiceChargeVehicleLoan']).patchValue(this.termLoanData[i].serviceChargeCT);
                this.form.get(['termLoanDetails', i, 'annualInstallmentBaseRateVehicleLoan']).patchValue(this.termLoanData[i].baseRateCT);
                this.form.get(['termLoanDetails', i, 'annualInstallmentPremiumRateVehicleLoan']).patchValue(this.termLoanData[i].premiumRateCT);
                this.form.get(['termLoanDetails', i, 'annualInstallmentInterestRateVehicleLoan']).patchValue(this.termLoanData[i].interestRateCT);
                this.form.get(['termLoanDetails', i, 'annualInstallmentPaymentAmountVehicleLoan']).patchValue(this.termLoanData[i].paymentAmountFigureCT);
                this.form.get(['termLoanDetails', i, 'annualInstallmentPaymentAmountInWordVehicleLoan']).patchValue(this.termLoanData[i].paymentAmountWordsCT);
                this.form.get(['termLoanDetails', i, 'annualInstallmentNoOfPaymentVehicleLoan']).patchValue(this.termLoanData[i].numberOfPaymentsCT);
                this.form.get(['termLoanDetails', i, 'annualInstallmentLoanExpiryDateVehicleLoan']).patchValue(this.termLoanData[i].dateOfExpiryCT);
                this.form.get(['termLoanDetails', i, 'SNOfParentLimitVehicleLoan']).patchValue(
                    this.tempInformation ? this.tempInformation.section2.termLoanFreeText[i].SNOfParentLimitVehicleLoan : '');
                this.form.get(['termLoanDetails', i, 'newEMISubsequentVehicleLoan']).patchValue(
                    this.tempInformation ? this.tempInformation.section2.termLoanFreeText[i].newEMISubsequentVehicleLoan : 'निकासा भएको पछिल्लोे महिना देखि किस्ता भुक्तानी मिति हुनेछ');
                this.form.get(['termLoanDetails', i, 'freeTextTen']).patchValue(
                    this.tempInformation ? this.tempInformation.section2.termLoanFreeText[i].freeTextTen : '');
                this.form.get(['termLoanDetails', i, 'freeTextEleven']).patchValue(
                    this.tempInformation ? this.tempInformation.section2.termLoanFreeText[i].freeTextEleven : '');
                this.form.get(['termLoanDetails', i, 'freeTextTwelve']).patchValue(
                    this.tempInformation ? this.tempInformation.section2.termLoanFreeText[i].freeTextTwelve : '');
            }
        }
    }

    setFreeTextTermLoan() {
        for (let val = 0; val < this.loanData.length; val++) {
            const tempFreeText = {
                SNOfParentLimitVehicleLoan: this.form.get(['termLoanDetails', val, 'SNOfParentLimitVehicleLoan']) ? this.form.get(['termLoanDetails', val, 'SNOfParentLimitVehicleLoan']).value : '',
                newEMISubsequentVehicleLoan: this.form.get(['termLoanDetails', val, 'newEMISubsequentVehicleLoan']) ? this.form.get(['termLoanDetails', val, 'newEMISubsequentVehicleLoan']).value : '',
                freeTextTen: this.form.get(['termLoanDetails', val, 'freeTextTen']) ? this.form.get(['termLoanDetails', val, 'freeTextTen']).value : '',
                freeTextEleven: this.form.get(['termLoanDetails', val, 'freeTextEleven']) ? this.form.get(['termLoanDetails', val, 'freeTextEleven']).value : '',
                freeTextTwelve: this.form.get(['termLoanDetails', val, 'freeTextTwelve']) ? this.form.get(['termLoanDetails', val, 'freeTextTwelve']).value : '',
               };
            this.termLoanFreeText.push(tempFreeText);
        }
        return this.termLoanFreeText;
    }
}

