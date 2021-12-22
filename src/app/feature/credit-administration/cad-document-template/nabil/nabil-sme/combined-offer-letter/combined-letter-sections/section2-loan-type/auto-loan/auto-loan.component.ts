import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
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
    @Input() index;
    @Input() data;
    form: FormGroup;
    tempData;
    autoLoanFreeText: any = {};
    complementaryOtherAutoLoan = false; vehiclePurchaseAutoLoan = false; vehicleRegistrationAutoLoan = false;
    loanOptionAutoLoan; autoLoanTypeAutoLoan; emiPaymentTypeAutoLoan; paymentsTermsAutoLoan;
    constructor(private formBuilder: FormBuilder,
    ) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
            this.tempData = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].initialInformation);
            this.fillForm();
        }
        this.getConditions();
    }

    getConditions() {
        if (!ObjectUtil.isEmpty(this.data)) {
            this.loanOptionAutoLoan = this.tempData.smeGlobalForm.loanOption;
            this.autoLoanTypeAutoLoan = this.data.autoLoanType;
            this.emiPaymentTypeAutoLoan = this.data.emiPaymentType;
            this.paymentsTermsAutoLoan = this.data.paymentTerms;
            if (this.data.complementaryOther === true) {
                this.complementaryOtherAutoLoan = true;
            }
            if (this.data.vehiclePurchased === true) {
                this.vehiclePurchaseAutoLoan = true;
            }
            if (this.data.vehicleRegistered === true) {
                this.vehicleRegistrationAutoLoan = true;
            }
        }
    }

    buildForm() {
        this.form = this.formBuilder.group({
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
            // Free Text
            freeTextFourteen: [undefined]
        });
    }

    fillForm() {
        if (!ObjectUtil.isEmpty(this.tempData.autoLoanMasterForm)) {
            for (let i = 0; i < this.tempData.autoLoanMasterForm['autoLoanFormArray'].length; i++ ) {
                this.form.patchValue({
                    // Auto Loan
                    // SNOfParentLimitAutoLoan: [undefined],
                    // For New EMI Term Loan
                    // tslint:disable-next-line:max-line-length
                    newEMIDrawingPowerAutoLoan: this.data.drawingPower ? this.data.drawingPowerCT : '',
                    // tslint:disable-next-line:max-line-length
                    newEMIBaseRateAutoLoan: this.data.baseRate ? this.data.baseRateCT : '',
                    // tslint:disable-next-line:max-line-length
                    newEMIPremiumRateAutoLoan: this.data.premiumRate ? this.data.premiumRateCT : '',
                    // tslint:disable-next-line:max-line-length
                    newEMIInterestRateAutoLoan: this.data.interestRate ? this.data.interestRateCT : '',
                    // tslint:disable-next-line:max-line-length
                    newEMIAmountAutoLoan: this.data.emiInfigure ? this.data.emiInfigureCT : '',
                    // tslint:disable-next-line:max-line-length
                    newEMIAmountInWordAutoLoan: this.data.emiInWords ? this.data.emiInWordsCT : '',
                    // tslint:disable-next-line:max-line-length
                    newEMINoOfInstallmentAutoLoan: this.data.numberOfInstallment ? this.data.numberOfInstallmentCT : '',
                    // tslint:disable-next-line:max-line-length
                    newEMILoanPurposeAutoLoan: this.data.purposeOfLoan ? this.data.purposeOfLoanCT : '',
                    // tslint:disable-next-line:max-line-length
                    newEMIServiceChargeAutoLoan: this.data.serviceCharge ? this.data.serviceChargeCT : '',
                    // tslint:disable-next-line:max-line-length
                    newEMILoanTenureAutoLoan: this.data.tenureOfLoan ? this.data.tenureOfLoanCT : '',
                    // For EMI Term Loan at the time of Annual Review of other credit limits
                    // tslint:disable-next-line:max-line-length
                    annualEMIBaseRateAutoLoan: this.data.baseRate ? this.data.baseRateCT : '',
                    // tslint:disable-next-line:max-line-length
                    annualEMIPremiumRateAutoLoan: this.data.premiumRate ? this.data.premiumRateCT : '',
                    // tslint:disable-next-line:max-line-length
                    annualEMIInterestRateAutoLoan: this.data.interestRate ? this.data.interestRateCT : '',
                    // tslint:disable-next-line:max-line-length
                    annualEMIAmountAutoLoan: this.data.emiInfigure ? this.data.emiInfigureCT : '',
                    // tslint:disable-next-line:max-line-length
                    annualEMIAmountInWordAutoLoan: this.data.emiInWords ? this.data.emiInWordsCT : '',
                    // tslint:disable-next-line:max-line-length
                    annualEMILoanExpiryDateAutoLoan: this.data.dateOfExpiry ? this.data.dateOfExpiryCT : '',
                    // For New Installment Basis Term Loan
                    // tslint:disable-next-line:max-line-length
                    newInstallmentBaseRateAutoLoan: this.data.baseRate ? this.data.baseRateCT : '',
                    // tslint:disable-next-line:max-line-length
                    newInstallmentPremiumRateAutoLoan: this.data.premiumRate ? this.data.premiumRateCT : '',
                    // tslint:disable-next-line:max-line-length
                    newInstallmentInterestRateAutoLoan: this.data.interestRate ? this.data.interestRateCT : '',
                    // tslint:disable-next-line:max-line-length
                    newInstallmentLoanTenureAutoLoan: this.data.tenureOfLoan ? this.data.tenureOfLoanCT : '',
                    // tslint:disable-next-line:max-line-length
                    newInstallmentPaymentAmountAutoLoan: this.data.paymentAmountFigure ? this.data.paymentAmountFigureCT : '',
                    // tslint:disable-next-line:max-line-length
                    newInstallmentPaymentAmountInWordAutoLoan: this.data.paymentAmountWords ? this.data.paymentAmountWordsCT : '',
                    // tslint:disable-next-line:max-line-length
                    newInstallmentNoOfPaymentAutoLoan: this.data.numberOfPayments ? this.data.numberOfPaymentsCT : '',
                    // tslint:disable-next-line:max-line-length
                    newInstallmentLoanPurposeAutoLoan: this.data.purposeOfLoan ? this.data.purposeOfLoanCT : '',
                    // tslint:disable-next-line:max-line-length
                    newInstallmentServiceChargeAutoLoan: this.data.serviceCharge ? this.data.serviceChargeCT : '',
                    // For Installment Basis Term Loan at the time of Annual Review of other credit limits
                    // tslint:disable-next-line:max-line-length
                    annualInstallmentBaseRateAutoLoan: this.data.baseRate ? this.data.baseRateCT : '',
                    // tslint:disable-next-line:max-line-length
                    annualInstallmentPremiumRateAutoLoan: this.data.premiumRate ? this.data.premiumRateCT : '',
                    // tslint:disable-next-line:max-line-length
                    annualInstallmentInterestRateAutoLoan: this.data.interestRate ? this.data.interestRateCT : '',
                    // tslint:disable-next-line:max-line-length
                    annualInstallmentPaymentAmountAutoLoan: this.data.paymentAmountFigure ? this.data.paymentAmountFigureCT : '',
                    // tslint:disable-next-line:max-line-length
                    annualInstallmentPaymentAmountInWordAutoLoan: this.data.paymentAmountWords ? this.data.paymentAmountWordsCT : '',
                    // tslint:disable-next-line:max-line-length
                    annualInstallmentNoOfPaymentAutoLoan: this.data.numberOfPayments ? this.data.numberOfPaymentsCT : '',
                    // tslint:disable-next-line:max-line-length
                    annualInstallmentLoanExpiryDateAutoLoan: this.data.dateOfExpiry ? this.data.dateOfExpiryCT : '',
                    // tslint:disable-next-line:max-line-length
                    annualInstallmentDrawingPowerAutoLoan: this.data.drawingPowerCT ? this.data.drawingPowerCT : '',
                    // tslint:disable-next-line:max-line-length
                    annualInstallmentNameOfDealerAutoLoan: this.data.nameOfDealer ? this.data.nameOfDealerCT : '',
                });
            }
        }
    }
    setFreeTextAutoLoan() {
        this.autoLoanFreeText = {
            freeText14: this.form.get('freeTextFourteen').value ? this.form.get('freeTextFourteen').value : '',
        };
        return this.autoLoanFreeText;
    }
}
