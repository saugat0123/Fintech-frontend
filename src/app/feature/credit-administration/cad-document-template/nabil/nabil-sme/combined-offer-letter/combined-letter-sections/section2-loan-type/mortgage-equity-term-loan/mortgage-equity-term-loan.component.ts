import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-mortgage-equity-term-loan',
    templateUrl: './mortgage-equity-term-loan.component.html',
    styleUrls: ['./mortgage-equity-term-loan.component.scss']
})
export class MortgageEquityTermLoanComponent implements OnInit {
    @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
    @Input() loanData;
    @Input() index;
    form: FormGroup;
    tempData;
    mortgageEquity: any = {};
    termLoanForMortgageEquityTerm; mortgageTypeMortgageEquityTerm; complementaryOtherMortgageEquityTerm = false;
    emiPaymentTypeMortgageEquityTerm; interestSubAgMortgageEquityTerm; paymentTermMortgageEquityTerm;
    loanOptionMortgageEquityTerm; drawingPowerMortgageEquityTerm; termLoanTypeMortgageEquityTerm; complementaryOtherMortgageEquityTermName;
    tempInformation;
    newEMIAutoPopulateMortgageTerm = 'निकासा भएको पछिल्लोे महिना देखि किस्ता भुक्तानी मिति हुनेछ';

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
        if (!ObjectUtil.isEmpty(this.tempData.mortgageEquityTermForm)) {
            this.termLoanForMortgageEquityTerm = this.tempData.mortgageEquityTermForm.termLoanFor;
            this.mortgageTypeMortgageEquityTerm = this.tempData.mortgageEquityTermForm.mortgageType;
            this.termLoanTypeMortgageEquityTerm = this.tempData.mortgageEquityTermForm.termLoanType;
            this.emiPaymentTypeMortgageEquityTerm = this.tempData.mortgageEquityTermForm.emiPaymentType;
            this.interestSubAgMortgageEquityTerm = this.tempData.mortgageEquityTermForm.subsidyOrAgricultureLoan;
            this.paymentTermMortgageEquityTerm = this.tempData.mortgageEquityTermForm.paymentTerms;
            this.complementaryOtherMortgageEquityTermName = this.tempData.mortgageEquityTermForm.complimentaryLoanSelected;
            this.drawingPowerMortgageEquityTerm = this.tempData.mortgageEquityTermForm.drawingPowerBasis;
            this.loanOptionMortgageEquityTerm = this.tempData.smeGlobalForm.loanOption;
            if (this.tempData.mortgageEquityTermForm.complementaryOther === true) {
                this.complementaryOtherMortgageEquityTerm = true;
            }
        }
        this.setFreeTextMortgage();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            // Mortgage Term Loan / Equity Mortgage Term Loan
            SNOfParentLimitMortgageTerm: [undefined],
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
                annualInstallmentLoanExpiryDateMortgageTerm: this.tempData.mortgageEquityTermForm.dateOfExpiryCT ? this.tempData.mortgageEquityTermForm.dateOfExpiryCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentDrawingPowerMortgageTerm: this.tempData.mortgageEquityTermForm.drawingPowerInPercentageCT ? this.tempData.mortgageEquityTermForm.drawingPowerInPercentageCT : '',
                // tslint:disable-next-line:max-line-length
                annualInstallmentDrawingPowerMortgageTerm1: this.tempData.mortgageEquityTermForm.drawingPowerInPercentageCT ? this.tempData.mortgageEquityTermForm.drawingPowerInPercentageCT : '',
            });
            this.patchFreeText();
        }
    }

    setFreeTextMortgage() {
        this.mortgageEquity = {
            freeText13: this.form.get('freeTextThirteen').value ? this.form.get('freeTextThirteen').value : '',
            // tslint:disable-next-line:max-line-length
            newEMIAutoPopulateMortgageTerm1: this.form.get('newEMIAutoPopulateMortgageTerm').value ? this.form.get('newEMIAutoPopulateMortgageTerm').value : '',
        };
        return this.mortgageEquity;
    }
    patchFreeText() {
        if (!ObjectUtil.isEmpty(this.tempInformation)) {
            if (this.newEMIAutoPopulateMortgageTerm === this.tempInformation.section2.newEMIAutoPopulateMortgageTerm1) {
                this.newEMIAutoPopulateMortgageTerm = 'निकासा भएको पछिल्लोे महिना देखि किस्ता भुक्तानी मिति हुनेछ';
            }
            if (this.tempInformation.section2.newEMIAutoPopulateMortgageTerm1 !== this.newEMIAutoPopulateMortgageTerm) {
                this.newEMIAutoPopulateMortgageTerm = this.tempInformation.section2.newEMIAutoPopulateMortgageTerm1;
            }
        }
        this.form.patchValue({
            freeTextThirteen: this.tempInformation ? this.tempInformation.section2.freeText13 : '',
            // tslint:disable-next-line:max-line-length
            newEMIAutoPopulateMortgageTerm: !ObjectUtil.isEmpty(this.newEMIAutoPopulateMortgageTerm) ? this.newEMIAutoPopulateMortgageTerm : '',
        });
    }

}
