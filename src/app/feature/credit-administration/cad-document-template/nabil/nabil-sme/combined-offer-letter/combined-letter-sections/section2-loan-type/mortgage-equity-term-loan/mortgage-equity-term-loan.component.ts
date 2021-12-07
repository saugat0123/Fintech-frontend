import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../../../model/customerApprovedLoanCadDocumentation';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-mortgage-equity-term-loan',
    templateUrl: './mortgage-equity-term-loan.component.html',
    styleUrls: ['./mortgage-equity-term-loan.component.scss']
})
export class MortgageEquityTermLoanComponent implements OnInit {
    @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
    form: FormGroup;
    tempData;
    loanAmount;
    loanAmountInWord;

    constructor(private formBuilder: FormBuilder,
                private engToNepWord: NepaliCurrencyWordPipe
    ) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
            this.tempData = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].initialInformation);
            this.loanAmount = String(this.customerApprovedDoc.assignedLoan[0].proposal.proposedLimit);
            this.loanAmountInWord = this.engToNepWord.transform(this.loanAmount);
            this.fillForm();
        }
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

    fillForm() {
        if (!ObjectUtil.isEmpty(this.tempData.mortgageEquityTermForm)) {
            this.form.patchValue({
                // Mortgage Term Loan / Equity Mortgage Term Loan
                SNOfParentLimitMortgageTerm: [undefined],
                loanAmountMortgageTerm: this.loanAmount ? this.loanAmount : '',
                loanAmountInWordMortgageTerm: this.loanAmountInWord ? this.loanAmountInWord : '',
                // tslint:disable-next-line:max-line-length
                drawingPowerMortgageTerm: this.tempData.mortgageEquityTermForm.drawingPowerInPercentageCT ? this.tempData.mortgageEquityTermForm.drawingPowerInPercentageCT : '',
                // For New EMI Term Loan
                // tslint:disable-next-line:max-line-length
                newEMIBaseRateMortgageTerm: this.tempData.mortgageEquityTermForm.baseRateCT ? this.tempData.mortgageEquityTermForm.baseRateCT : '',
                // tslint:disable-next-line:max-line-length
                newEMIPremiumRateMortgageTerm: this.tempData.mortgageEquityTermForm.premiumRateCT ? this.tempData.mortgageEquityTermForm.premiumRateCT : '',
                // tslint:disable-next-line:max-line-length
                newEMIInterestRateMortgageTerm: this.tempData.mortgageEquityTermForm.interestRateCT ? this.tempData.mortgageEquityTermForm.interestRateCT : '',
                // tslint:disable-next-line:max-line-length
                newEMIAmountMortgageTerm: this.tempData.mortgageEquityTermForm.emiInFigureCT ? this.tempData.mortgageEquityTermForm.emiInFigureCT : '',
                // tslint:disable-next-line:max-line-length
                newEMIAmountInWordMortgageTerm: this.tempData.mortgageEquityTermForm.emiInWordsCT ? this.tempData.mortgageEquityTermForm.emiInWordsCT : '',
                // tslint:disable-next-line:max-line-length
                newEMINoOfInstallmentMortgageTerm: this.tempData.mortgageEquityTermForm.totalNumberOfInstallmentCT ? this.tempData.mortgageEquityTermForm.totalNumberOfInstallmentCT : '',
                // tslint:disable-next-line:max-line-length
                newEMILoanPurposeMortgageTerm: this.tempData.mortgageEquityTermForm.purposeOfLoanCT ? this.tempData.mortgageEquityTermForm.purposeOfLoanCT : '',
                // tslint:disable-next-line:max-line-length
                newEMIServiceChargeMortgageTerm: this.tempData.mortgageEquityTermForm.serviceChargeCT ? this.tempData.mortgageEquityTermForm.serviceChargeCT : '',
                // tslint:disable-next-line:max-line-length
                newEMILoanTenureMortgageTerm: this.tempData.mortgageEquityTermForm.tenureOfLoanCT ? this.tempData.mortgageEquityTermForm.tenureOfLoanCT : '',
                // For EMI Term Loan at the time of Annual Review of other credit limits
                // tslint:disable-next-line:max-line-length
                annualEMIBaseRateMortgageTerm: this.tempData.mortgageEquityTermForm.baseRateCT ? this.tempData.mortgageEquityTermForm.baseRateCT : '',
                // tslint:disable-next-line:max-line-length
                annualEMIPremiumRateMortgageTerm: this.tempData.mortgageEquityTermForm.premiumRateCT ? this.tempData.mortgageEquityTermForm.premiumRateCT : '',
                // tslint:disable-next-line:max-line-length
                annualEMIInterestRateMortgageTerm: this.tempData.mortgageEquityTermForm.interestRateCT ? this.tempData.mortgageEquityTermForm.interestRateCT : '',
                // tslint:disable-next-line:max-line-length
                annualEMIAmountMortgageTerm: this.tempData.mortgageEquityTermForm.emiInFigureCT ? this.tempData.mortgageEquityTermForm.emiInFigureCT : '',
                // tslint:disable-next-line:max-line-length
                annualEMIAmountInWordMortgageTerm: this.tempData.mortgageEquityTermForm.emiInWordsCT ? this.tempData.mortgageEquityTermForm.emiInWordsCT : '',
                // tslint:disable-next-line:max-line-length
                annualEMILoanExpiryDateMortgageTerm: this.tempData.mortgageEquityTermForm.dateOfExpiryCT ? this.tempData.mortgageEquityTermForm.dateOfExpiryCT : '',
                // For New Installment Basis Term Loan
                // tslint:disable-next-line:max-line-length
                newInstallmentBaseRateMortgageTerm: this.tempData.mortgageEquityTermForm.baseRateCT ? this.tempData.mortgageEquityTermForm.baseRateCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentPremiumRateMortgageTerm: this.tempData.mortgageEquityTermForm.premiumRateCT ? this.tempData.mortgageEquityTermForm.premiumRateCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentInterestRateMortgageTerm: this.tempData.mortgageEquityTermForm.interestRateCT ? this.tempData.mortgageEquityTermForm.interestRateCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentTotalInterestRateMortgageTerm: this.tempData.mortgageEquityTermForm.interestRateCT ? this.tempData.mortgageEquityTermForm.interestRateCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentLoanTenureMortgageTerm: this.tempData.mortgageEquityTermForm.tenureOfLoanCT ? this.tempData.mortgageEquityTermForm.tenureOfLoanCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentPaymentAmountMortgageTerm: this.tempData.mortgageEquityTermForm.paymentAmountInFigure ? this.tempData.mortgageEquityTermForm.paymentAmountInFigureCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentPaymentAmountInWordMortgageTerm: this.tempData.mortgageEquityTermForm.paymentAmountInWords ? this.tempData.mortgageEquityTermForm.paymentAmountInWordsCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentNoOfPaymentMortgageTerm: this.tempData.mortgageEquityTermForm.totalNumberOfPayments ? this.tempData.mortgageEquityTermForm.totalNumberOfPaymentsCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentPaymentTypeMortgageTerm: this.tempData.mortgageEquityTermForm.paymentTermsCT ? this.tempData.mortgageEquityTermForm.paymentTermsCT : '',
                // tslint:disable-next-line:max-line-length
                // newInstallmentPaymentDurationMortgageTerm: this.tempData.mortgageEquityTermForm.dateOfExpiryCT ? this.tempData.mortgageEquityTermForm.dateOfExpiryCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentLoanPurposeMortgageTerm: this.tempData.mortgageEquityTermForm.purposeOfLoanCT ? this.tempData.mortgageEquityTermForm.purposeOfLoanCT : '',
                // tslint:disable-next-line:max-line-length
                newInstallmentServiceChargeMortgageTerm: this.tempData.mortgageEquityTermForm.serviceChargeCT ? this.tempData.mortgageEquityTermForm.serviceChargeCT : '',
                // For Installment Basis Term Loan at the time of Annual Review of other credit limits
                // tslint:disable-next-line:max-line-length
                annualInstallmentBaseRateMortgageTerm: this.tempData.mortgageEquityTermForm.baseRateCT ? this.tempData.mortgageEquityTermForm.baseRateCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentPremiumRateMortgageTerm: this.tempData.mortgageEquityTermForm.premiumRateCT ? this.tempData.mortgageEquityTermForm.premiumRateCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentInterestRateMortgageTerm: this.tempData.mortgageEquityTermForm.interestRateCT ? this.tempData.mortgageEquityTermForm.interestRateCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentTotalInterestRateMortgageTerm: this.tempData.mortgageEquityTermForm.interestRateCT ? this.tempData.mortgageEquityTermForm.interestRateCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentPaymentAmountMortgageTerm: this.tempData.mortgageEquityTermForm.paymentAmountInFigure ? this.tempData.mortgageEquityTermForm.paymentAmountInFigureCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentPaymentAmountInWordMortgageTerm: this.tempData.mortgageEquityTermForm.paymentAmountInWords ? this.tempData.mortgageEquityTermForm.paymentAmountInWordsCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentNoOfPaymentMortgageTerm: this.tempData.mortgageEquityTermForm.totalNumberOfPayments ? this.tempData.mortgageEquityTermForm.totalNumberOfPaymentsCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentPaymentTypeMortgageTerm: this.tempData.mortgageEquityTermForm.paymentTermsCT ? this.tempData.mortgageEquityTermForm.paymentTermsCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentLoanExpiryDateMortgageTerm: this.tempData.mortgageEquityTermForm.dateOfExpiryCT ? this.tempData.mortgageEquityTermForm.dateOfExpiryCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentDrawingPowerMortgageTerm: this.tempData.mortgageEquityTermForm.drawingPowerInPercentageCT ? this.tempData.mortgageEquityTermForm.drawingPowerInPercentageCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentDrawingPowerMortgageTerm1: this.tempData.mortgageEquityTermForm.drawingPowerInPercentageCT ? this.tempData.mortgageEquityTermForm.drawingPowerInPercentageCT : '',
            });
        }
    }

}
