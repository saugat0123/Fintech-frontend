import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-auto-loan',
    templateUrl: './auto-loan.component.html',
    styleUrls: ['./auto-loan.component.scss']
})
export class AutoLoanComponent implements OnInit {
    @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
    @Input() loanData;
    // @Input() index;
    // @Input() data;
    @Input() pointNumber;
    @Input() autoLoanData;
    form: FormGroup;
    tempData;
    autoLoanFreeText: Array<any> = new Array<any>();
    tempInformation;
    newEMIAutoPopulateAutoLoan = 'निकासा भएको पछिल्लोे महिना देखि किस्ता भुक्तानी मिति हुनेछ';
    constructor(private formBuilder: FormBuilder,
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
            autoLoanDetails: this.formBuilder.array([]),
        });
        for (let val = 0; val < this.loanData.length; val++) {
            this.setForm();
        }
    }

    setForm() {
        (this.form.get('autoLoanDetails') as FormArray).push(this.formBuilder.group({
                // Auto Loan
                SNOfParentLimitAutoLoan: [undefined],
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
                newInstallmentLoanPurposeAutoLoan: [undefined],
                newInstallmentServiceChargeAutoLoan: [undefined],
                // For Installment Basis Term Loan at the time of Annual Review of other credit limits
                annualInstallmentBaseRateAutoLoan: [undefined],
                annualInstallmentPremiumRateAutoLoan: [undefined],
                annualInstallmentInterestRateAutoLoan: [undefined],
                annualInstallmentPaymentAmountAutoLoan: [undefined],
                annualInstallmentPaymentAmountInWordAutoLoan: [undefined],
                annualInstallmentNoOfPaymentAutoLoan: [undefined],
                annualInstallmentLoanExpiryDateAutoLoan: [undefined],
                annualInstallmentDrawingPowerAutoLoan: [undefined],
                annualInstallmentNameOfDealerAutoLoan: [undefined],
                loanAmountInFigure: [undefined],
                loanAmountInWords: [undefined],
                // Free Text
                freeTextFourteen: [undefined],
                disbursementClause: [undefined],
            })
        );
    }

    fillForm() {
        if (!ObjectUtil.isEmpty(this.autoLoanData)) {
            for (let i = 0; i < this.autoLoanData.length; i++ ) {
                this.form.get(['autoLoanDetails', i, 'newEMIDrawingPowerAutoLoan']).patchValue(this.autoLoanData[i].drawingPowerCT);
                this.form.get(['autoLoanDetails', i, 'newEMIBaseRateAutoLoan']).patchValue(this.autoLoanData[i].baseRateCT);
                this.form.get(['autoLoanDetails', i, 'newEMIPremiumRateAutoLoan']).patchValue(this.autoLoanData[i].premiumRateCT);
                this.form.get(['autoLoanDetails', i, 'newEMIInterestRateAutoLoan']).patchValue(this.autoLoanData[i].interestRateCT);
                this.form.get(['autoLoanDetails', i, 'newEMIAmountAutoLoan']).patchValue(this.autoLoanData[i].emiInfigureCT);
                this.form.get(['autoLoanDetails', i, 'newEMIAmountInWordAutoLoan']).patchValue(this.autoLoanData[i].emiInWordsCT);
                this.form.get(['autoLoanDetails', i, 'newEMINoOfInstallmentAutoLoan']).patchValue(this.autoLoanData[i].numberOfInstallmentCT);
                this.form.get(['autoLoanDetails', i, 'newEMILoanPurposeAutoLoan']).patchValue(this.autoLoanData[i].purposeOfLoanCT);
                this.form.get(['autoLoanDetails', i, 'newEMIServiceChargeAutoLoan']).patchValue(this.autoLoanData[i].serviceChargeCT);
                this.form.get(['autoLoanDetails', i, 'newEMILoanTenureAutoLoan']).patchValue(this.autoLoanData[i].tenureOfLoanCT);
                this.form.get(['autoLoanDetails', i, 'annualEMIBaseRateAutoLoan']).patchValue(this.autoLoanData[i].baseRateCT);
                this.form.get(['autoLoanDetails', i, 'annualEMIPremiumRateAutoLoan']).patchValue(this.autoLoanData[i].premiumRateCT);
                this.form.get(['autoLoanDetails', i, 'annualEMIInterestRateAutoLoan']).patchValue(this.autoLoanData[i].interestRateCT);
                this.form.get(['autoLoanDetails', i, 'annualEMIAmountAutoLoan']).patchValue(this.autoLoanData[i].emiInfigureCT);
                this.form.get(['autoLoanDetails', i, 'annualEMIAmountInWordAutoLoan']).patchValue(this.autoLoanData[i].emiInWordsCT);
                this.form.get(['autoLoanDetails', i, 'annualEMILoanExpiryDateAutoLoan']).patchValue(this.autoLoanData[i].dateOfExpiryCT);
                this.form.get(['autoLoanDetails', i, 'newInstallmentBaseRateAutoLoan']).patchValue(this.autoLoanData[i].baseRateCT);
                this.form.get(['autoLoanDetails', i, 'newInstallmentPremiumRateAutoLoan']).patchValue(this.autoLoanData[i].premiumRateCT);
                this.form.get(['autoLoanDetails', i, 'newInstallmentInterestRateAutoLoan']).patchValue(this.autoLoanData[i].interestRateCT);
                this.form.get(['autoLoanDetails', i, 'newInstallmentLoanTenureAutoLoan']).patchValue(this.autoLoanData[i].tenureOfLoanCT);
                this.form.get(['autoLoanDetails', i, 'newInstallmentPaymentAmountAutoLoan']).patchValue(this.autoLoanData[i].paymentAmountFigureCT);
                this.form.get(['autoLoanDetails', i, 'newInstallmentPaymentAmountInWordAutoLoan']).patchValue(this.autoLoanData[i].paymentAmountWordsCT);
                this.form.get(['autoLoanDetails', i, 'newInstallmentNoOfPaymentAutoLoan']).patchValue(this.autoLoanData[i].numberOfPaymentsCT);
                this.form.get(['autoLoanDetails', i, 'newInstallmentLoanPurposeAutoLoan']).patchValue(this.autoLoanData[i].purposeOfLoanCT);
                this.form.get(['autoLoanDetails', i, 'newInstallmentServiceChargeAutoLoan']).patchValue(this.autoLoanData[i].serviceChargeCT);
                this.form.get(['autoLoanDetails', i, 'annualInstallmentBaseRateAutoLoan']).patchValue(this.autoLoanData[i].baseRateCT);
                this.form.get(['autoLoanDetails', i, 'annualInstallmentPremiumRateAutoLoan']).patchValue(this.autoLoanData[i].premiumRateCT);
                this.form.get(['autoLoanDetails', i, 'annualInstallmentInterestRateAutoLoan']).patchValue(this.autoLoanData[i].interestRateCT);
                this.form.get(['autoLoanDetails', i, 'annualInstallmentPaymentAmountAutoLoan']).patchValue(this.autoLoanData[i].paymentAmountFigureCT);
                this.form.get(['autoLoanDetails', i, 'annualInstallmentPaymentAmountInWordAutoLoan']).patchValue(this.autoLoanData[i].paymentAmountWordsCT);
                this.form.get(['autoLoanDetails', i, 'annualInstallmentNoOfPaymentAutoLoan']).patchValue(this.autoLoanData[i].numberOfPaymentsCT);
                this.form.get(['autoLoanDetails', i, 'annualInstallmentLoanExpiryDateAutoLoan']).patchValue(this.autoLoanData[i].dateOfExpiryCT);
                this.form.get(['autoLoanDetails', i, 'annualInstallmentDrawingPowerAutoLoan']).patchValue(this.autoLoanData[i].drawingPowerCT);
                this.form.get(['autoLoanDetails', i, 'annualInstallmentNameOfDealerAutoLoan']).patchValue(this.autoLoanData[i].nameOfDealerCT);
                this.form.get(['autoLoanDetails', i, 'loanAmountInFigure']).patchValue(this.loanData[i].loanAmountNp);
                this.form.get(['autoLoanDetails', i, 'loanAmountInWords']).patchValue(this.loanData[i].loanAmountWords);
                this.form.get(['autoLoanDetails', i, 'SNOfParentLimitAutoLoan']).patchValue(
                    this.tempInformation ? this.tempInformation.section2.autoLoanFreeText[i].SNOfParentLimitAutoLoan : '');
                this.form.get(['autoLoanDetails', i, 'freeTextFourteen']).patchValue(
                    this.tempInformation ? this.tempInformation.section2.autoLoanFreeText[i].freeText14 : '');
                this.form.get(['autoLoanDetails', i, 'newEMIAutoPopulateAutoLoan']).patchValue(
                    this.tempInformation ?
                        this.tempInformation.section2.autoLoanFreeText[i].newEMIAutoPopulateAutoLoan1 :
                        'निकासा भएको पछिल्लोे महिना देखि किस्ता भुक्तानी मिति हुनेछ');
                this.form.get(['autoLoanDetails', i, 'disbursementClause']).patchValue(
                    this.tempInformation ? this.tempInformation.section2.autoLoanFreeText[i].disbursementClause : '');
            }
            }
        }

    setFreeTextAutoLoan() {
        for (let val = 0; val < this.loanData.length; val++) {
            const tempFreeText = {
                SNOfParentLimitAutoLoan: this.form.get(['autoLoanDetails', val, 'SNOfParentLimitAutoLoan']).value ? this.form.get(['autoLoanDetails', val, 'SNOfParentLimitAutoLoan']).value : '',
                freeText14: this.form.get(['autoLoanDetails', val, 'freeTextFourteen']).value ? this.form.get(['autoLoanDetails', val, 'freeTextFourteen']).value : '',
                newEMIAutoPopulateAutoLoan1: this.form.get(['autoLoanDetails', val, 'newEMIAutoPopulateAutoLoan']).value ? this.form.get(['autoLoanDetails', val, 'newEMIAutoPopulateAutoLoan']).value : '',
                disbursementClause: this.form.get(['autoLoanDetails', val, 'disbursementClause']).value ? this.form.get(['autoLoanDetails', val, 'disbursementClause']).value : '',
            };
            this.autoLoanFreeText.push(tempFreeText);
        }
        return this.autoLoanFreeText;
    }
}
