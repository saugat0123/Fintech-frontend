import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../../../model/customerApprovedLoanCadDocumentation';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';

@Component({
    selector: 'app-auto-loan',
    templateUrl: './auto-loan.component.html',
    styleUrls: ['./auto-loan.component.scss']
})
export class AutoLoanComponent implements OnInit {
    @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
    form: FormGroup;
    tempData;
    loanAmount;
    loanAmountInWord;
    autoLoanFreeText: any = {};
    complementaryOtherAutoLoan = false; vehiclePurchaseAutoLoan = false; vehicleRegistrationAutoLoan = false;
    loanOptionAutoLoan; autoLoanTypeAutoLoan; emiPaymentTypeAutoLoan; paymentsTermsAutoLoan;
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
        if (!ObjectUtil.isEmpty(this.tempData.autoLoanMasterForm)) {
            this.loanOptionAutoLoan = this.tempData.smeGlobalForm.loanOption;
            this.autoLoanTypeAutoLoan = this.tempData.autoLoanMasterForm.autoLoanType;
            this.emiPaymentTypeAutoLoan = this.tempData.autoLoanMasterForm.emiPaymentType;
            this.paymentsTermsAutoLoan = this.tempData.autoLoanMasterForm.paymentTerms;
            if (this.tempData.autoLoanMasterForm.complementaryOther === true) {
                this.complementaryOtherAutoLoan = true;
            }
            if (this.tempData.autoLoanMasterForm.vehiclePurchased === true) {
                this.vehiclePurchaseAutoLoan = true;
            }
            if (this.tempData.autoLoanMasterForm.vehicleRegistered === true) {
                this.vehicleRegistrationAutoLoan = true;
            }
        }
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
            this.form.patchValue({
                // Auto Loan
                // SNOfParentLimitAutoLoan: [undefined],
                loanAmountAutoLoan: this.loanAmount ? this.loanAmount : '',
                loanAmountInWordAutoLoan: this.loanAmountInWord ? this.loanAmountInWord : '',
                // For New EMI Term Loan
                // tslint:disable-next-line:max-line-length
                newEMIDrawingPowerAutoLoan: this.tempData.autoLoanMasterForm.drawingPower ? this.tempData.autoLoanMasterForm.drawingPowerCT : '',
                newEMIBaseRateAutoLoan: this.tempData.autoLoanMasterForm.baseRate ? this.tempData.autoLoanMasterForm.baseRateCT : '',
                newEMIPremiumRateAutoLoan: this.tempData.autoLoanMasterForm.premiumRate ? this.tempData.autoLoanMasterForm.premiumRateCT : '',
                // tslint:disable-next-line:max-line-length
                newEMIInterestRateAutoLoan: this.tempData.autoLoanMasterForm.interestRate ? this.tempData.autoLoanMasterForm.interestRateCT : '',
                newEMIAmountAutoLoan: this.tempData.autoLoanMasterForm.emiInfigure ? this.tempData.autoLoanMasterForm.emiInfigureCT : '',
                // tslint:disable-next-line:max-line-length
                newEMIAmountInWordAutoLoan: this.tempData.autoLoanMasterForm.emiInWords ? this.tempData.autoLoanMasterForm.emiInWordsCT : '',
                // tslint:disable-next-line:max-line-length
                newEMINoOfInstallmentAutoLoan: this.tempData.autoLoanMasterForm.numberOfInstallment ? this.tempData.autoLoanMasterForm.numberOfInstallmentCT : '',
                // tslint:disable-next-line:max-line-length
                newEMILoanPurposeAutoLoan: this.tempData.autoLoanMasterForm.purposeOfLoan ? this.tempData.autoLoanMasterForm.purposeOfLoanCT : '',
                // tslint:disable-next-line:max-line-length
                newEMIServiceChargeAutoLoan: this.tempData.autoLoanMasterForm.serviceCharge ? this.tempData.autoLoanMasterForm.serviceChargeCT : '',
                newEMILoanTenureAutoLoan: this.tempData.autoLoanMasterForm.tenureOfLoan ? this.tempData.autoLoanMasterForm.tenureOfLoanCT : '',
                // For EMI Term Loan at the time of Annual Review of other credit limits
                annualEMIBaseRateAutoLoan: this.tempData.autoLoanMasterForm.baseRate ? this.tempData.autoLoanMasterForm.baseRateCT : '',
                // tslint:disable-next-line:max-line-length
                annualEMIPremiumRateAutoLoan: this.tempData.autoLoanMasterForm.premiumRate ? this.tempData.autoLoanMasterForm.premiumRateCT : '',
                // tslint:disable-next-line:max-line-length
                annualEMIInterestRateAutoLoan: this.tempData.autoLoanMasterForm.interestRate ? this.tempData.autoLoanMasterForm.interestRateCT : '',
                annualEMIAmountAutoLoan: this.tempData.autoLoanMasterForm.emiInfigure ? this.tempData.autoLoanMasterForm.emiInfigureCT : '',
                annualEMIAmountInWordAutoLoan: this.tempData.autoLoanMasterForm.emiInWords ? this.tempData.autoLoanMasterForm.emiInWordsCT : '',
                // tslint:disable-next-line:max-line-length
                annualEMILoanExpiryDateAutoLoan: this.tempData.autoLoanMasterForm.dateOfExpiry ? this.tempData.autoLoanMasterForm.dateOfExpiryCT : '',
                // For New Installment Basis Term Loan
                // tslint:disable-next-line:max-line-length
                newInstallmentBaseRateAutoLoan: this.tempData.autoLoanMasterForm.baseRate ? this.tempData.autoLoanMasterForm.baseRateCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentPremiumRateAutoLoan: this.tempData.autoLoanMasterForm.premiumRate ? this.tempData.autoLoanMasterForm.premiumRateCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentInterestRateAutoLoan: this.tempData.autoLoanMasterForm.interestRate ? this.tempData.autoLoanMasterForm.interestRateCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentLoanTenureAutoLoan: this.tempData.autoLoanMasterForm.tenureOfLoan ? this.tempData.autoLoanMasterForm.tenureOfLoanCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentPaymentAmountAutoLoan: this.tempData.autoLoanMasterForm.paymentAmountFigure ? this.tempData.autoLoanMasterForm.paymentAmountFigureCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentPaymentAmountInWordAutoLoan: this.tempData.autoLoanMasterForm.paymentAmountWords ? this.tempData.autoLoanMasterForm.paymentAmountWordsCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentNoOfPaymentAutoLoan: this.tempData.autoLoanMasterForm.numberOfPayments ? this.tempData.autoLoanMasterForm.numberOfPaymentsCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentLoanPurposeAutoLoan: this.tempData.autoLoanMasterForm.purposeOfLoan ? this.tempData.autoLoanMasterForm.purposeOfLoanCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentServiceChargeAutoLoan: this.tempData.autoLoanMasterForm.serviceCharge ? this.tempData.autoLoanMasterForm.serviceChargeCT : '',
                // For Installment Basis Term Loan at the time of Annual Review of other credit limits
                annualInstallmentBaseRateAutoLoan: this.tempData.autoLoanMasterForm.baseRate ? this.tempData.autoLoanMasterForm.baseRateCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentPremiumRateAutoLoan: this.tempData.autoLoanMasterForm.premiumRate ? this.tempData.autoLoanMasterForm.premiumRateCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentInterestRateAutoLoan: this.tempData.autoLoanMasterForm.interestRate ? this.tempData.autoLoanMasterForm.interestRateCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentPaymentAmountAutoLoan: this.tempData.autoLoanMasterForm.paymentAmountFigure ? this.tempData.autoLoanMasterForm.paymentAmountFigureCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentPaymentAmountInWordAutoLoan: this.tempData.autoLoanMasterForm.paymentAmountWords ? this.tempData.autoLoanMasterForm.paymentAmountWordsCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentNoOfPaymentAutoLoan: this.tempData.autoLoanMasterForm.numberOfPayments ? this.tempData.autoLoanMasterForm.numberOfPaymentsCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentLoanExpiryDateAutoLoan: this.tempData.autoLoanMasterForm.dateOfExpiry ? this.tempData.autoLoanMasterForm.dateOfExpiryCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentDrawingPowerAutoLoan: this.tempData.autoLoanMasterForm.drawingPowerCT ? this.tempData.autoLoanMasterForm.drawingPowerCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentNameOfDealerAutoLoan: this.tempData.autoLoanMasterForm.nameOfDealer ? this.tempData.autoLoanMasterForm.nameOfDealerCT : '',
            });
        }
    }
    setFreeTextAutoLoan() {
        this.autoLoanFreeText = {
            freeText14: this.form.get('freeTextFourteen').value,
        };
        return this.autoLoanFreeText;
    }
}
