import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-section2-loan-type',
    templateUrl: './section2-loan-type.component.html',
    styleUrls: ['./section2-loan-type.component.scss']
})
export class Section2LoanTypeComponent implements OnInit {
    @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
    form: FormGroup;
    tempData;

    constructor(private formBuilder: FormBuilder,
    ) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
            this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
            this.fillForm();
        }
    }

    buildForm() {
        this.form = this.formBuilder.group({
            // Irrevocable letter of credit facility
            SNOfParentLimitIrrevocable: [undefined],
            loanAmountIrrevocable: [undefined],
            loanAmountInWordIrrevocable: [undefined],
            marginInPercentageIrrevocable: [undefined],
            commissionRateIrrevocable: [undefined],
            commissionAmountIrrevocable: [undefined],
            commissionRateForFirstQuarterIrrevocable: [undefined],
            commissionRateForOtherQuarterIrrevocable: [undefined],
            loanExpiryDateIrrevocable: [undefined],
            loanExpiryDateIrrevocable2: [undefined],
            // Customer Acceptance for Time Letter of Credit
            SNOfParentLimitTimeLetter: [undefined],
            loanAmountTimeLetter: [undefined],
            loanAmountInWordTimeLetter: [undefined],
            marginInPercentageTimeLetter: [undefined],
            commissionRateQuarterlyTimeLetter: [undefined],
            commissionAmountTimeLetter: [undefined],
            loanExpiryDateTimeLetter: [undefined],
            loanExpiryDateTimeLetter2: [undefined],
            // Import Bills Discounting
            loanDaysBillsDiscounting: [undefined],
            loanDaysBillsDiscountingInEng: [undefined],
            SNOfParentLimitBillsDiscounting: [undefined],
            loanAmountBillsDiscounting: [undefined],
            loanAmountInWordBillsDiscounting: [undefined],
            marginInPercentageBillsDiscounting: [undefined],
            loanExpiryDateBillsDiscounting: [undefined],
            // Import Loan/ Trust Receipt Loan
            loanDaysLoanTrust: [undefined],
            loanDaysLoanTrustInEng: [undefined],
            SNOfParentLimitLoanTrust: [undefined],
            loanAmountLoanTrust: [undefined],
            loanAmountInWordLoanTrust: [undefined],
            drawingPowerLoanTrust: [undefined],
            baseRateLoanTrust: [undefined],
            premiumRateLoanTrust: [undefined],
            interestRateLoanTrust: [undefined],
            totalInterestRateLoanTrust: [undefined],
            remainDaysLoanTrust: [undefined],
            loanExpiryDateLoanTrust: [undefined],
            // Revolving/One off basis Short Term Loan
            loanDaysShortTermLoan: [undefined],
            loanDaysShortTermLoanInEng: [undefined],
            SNOfParentLimitShortTermLoan: [undefined],
            loanMonthsShortTermLoan: [undefined],
            loanMonthsShortTermLoanInEng: [undefined],
            loanAmountShortTermLoan: [undefined],
            loanAmountInWordShortTermLoan: [undefined],
            ARDaysShortTermLoan: [undefined],
            drawingPowerShortTermLoan: [undefined],
            baseRateShortTermLoan: [undefined],
            premiumRateShortTermLoan: [undefined],
            interestRateShortTermLoan: [undefined],
            totalInterestRateShortTermLoan: [undefined],
            remainDaysShortTermLoan: [undefined],
            loanExpiryDateShortTermLoan: [undefined],
            // Demand Loan for working capital
            SNOfParentLimitDemandLoan: [undefined],
            loanAmountDemandLoan: [undefined],
            LoanAmountInWordDemandLoan: [undefined],
            ARDaysDemandLoan: [undefined],
            drawingPowerDemandLoan: [undefined],
            baseRateDemandLoan: [undefined],
            premiumRateDemandLoan: [undefined],
            interestRateDemandLoan: [undefined],
            totalInterestRateDemandLoan: [undefined],
            loanExpiryDateDemandLoan: [undefined],
            // Pre-Export Loan
            SNOfParentLimitPreExport: [undefined],
            loanAmountPreExport: [undefined],
            loanAmountInWordPreExport: [undefined],
            drawingPower1PreExport: [undefined],
            drawingPower2PreExport: [undefined],
            sulkaPreExport: [undefined],
            interestRatePreExport: [undefined],
            loanExpiryDatePreExport: [undefined],
            // Documentary Bill Purchase/Negotiation
            SNOfParentLimitDocumentaryBill: [undefined],
            loanAmountDocumentaryBill: [undefined],
            loanAmountInWordDocumentaryBill: [undefined],
            marginInPercentageDocumentaryBill: [undefined],
            drawingPowerDocumentaryBill: [undefined],
            InterestRateDocumentaryBill: [undefined],
            loanPaymentDocumentaryBill: [undefined],
            loanExpiryDateDocumentaryBill: [undefined],
            // Overdraft Loan for Working Capital requirement
            loanAmountOverdraftLoan: [undefined],
            loanAmountInWordOverdraftLoan: [undefined],
            ARDaysOverdraftLoan: [undefined],
            drawingPowerOverdraftLoan: [undefined],
            baseRateOverdraftLoan: [undefined],
            premiumRateOverdraftLoan: [undefined],
            interestRateOverdraftLoan: [undefined],
            totalInterestRateOverdraftLoan: [undefined],
            loanExpiryDateOverdraftLoan: [undefined],
            // Mortgage Overdraft/ Other Overdraft/ Equity Mortgaged Overdraft
            loanAmountMortgageOverdraft: [undefined],
            loanAmountInWordMortgageOverdraft: [undefined],
            drawingPowerMortgageOverdraft: [undefined],
            baseRateMortgageOverdraft: [undefined],
            premiumRateMortgageOverdraft: [undefined],
            interestRateMortgageOverdraft: [undefined],
            totalInterestRateMortgageOverdraft: [undefined],
            loanExpiryDateMortgageOverdraft: [undefined],
            // Overdraft Facility against Fixed Deposit/ Lien on Deposit Account
            nameOfFacilityOverdraftFacility: [undefined],
            nameOfFacilityOverdraftFacilityInEng: [undefined],
            loanAmountOverdraftFacility: [undefined],
            loanAmountInWordOverdraftFacility: [undefined],
            nameOfFDHolderOverdraftFacility: [undefined],
            FDAmountOverdraftFacility: [undefined],
            nameOfBankOverdraftFacility: [undefined],
            nameOfDepositorOverdraftFacility: [undefined],
            accountTypeOverdraftFacility: [undefined],
            accountNoOverdraftFacility: [undefined],
            amountOverdraftFacility: [undefined],
            drawingPowerOverdraftFacility: [undefined],
            additionalPremiumOverdraftFacility: [undefined],
            couponInterestRateOverdraftFacility: [undefined],
            baseRateOverdraftFacility: [undefined],
            premiumRateOverdraftFacility: [undefined],
            interestRateOverdraftFacility: [undefined],
            loanExpiryDateOverdraftFacility: [undefined],
            // Overdraft Facility against Bond
            nameOfFacilityAgainstBond: [undefined],
            nameOfFacilityAgainstBondInEng: [undefined],
            loanAmountAgainstBond: [undefined],
            loanAmountInWordAgainstBond: [undefined],
            ownerNameAgainstBond: [undefined],
            bondAmountAgainstBond: [undefined],
            bondTypeAgainstBond: [undefined],
            totalInterestRateAgainstBond: [undefined],
            baseRateAgainstBond: [undefined],
            premiumRateAgainstBond: [undefined],
            interestRateAgainstBond: [undefined],
            loanExpiryDateAgainstBond: [undefined],
            // Bridge Gap Loan
            SNOfParentLimitBridgeGap: [undefined],
            loanAmountBridgeGap: [undefined],
            loanAmountInWordBridgeGap: [undefined],
            baseRateBridgeGap: [undefined],
            premiumRateBridgeGap: [undefined],
            interestRateBridgeGap: [undefined],
            totalInterestRateBridgeGap: [undefined],
            // Bank Guarantee
            SNOfParentLimitBankGuarantee: [undefined],
            loanAmountBankGuarantee: [undefined],
            loanAmountInWordBankGuarantee: [undefined],
            nameOfBankBankGuarantee: [undefined],
            marginInPercentageBankGuarantee: [undefined],
            commission1BankGuarantee: [undefined],
            commission1BankGuarantee1: [undefined],
            serviceChargeBankGuarantee: [undefined],
            minimumServiceChargeBankGuarantee1: [undefined],
            commission2BankGuarantee: [undefined],
            commission2BankGuarantee1: [undefined],
            minimumServiceChargeBankGuarantee2: [undefined],
            loanExpiryDateBankGuarantee1: [undefined],
            // Bills Purchase
            SNOfParentLimitBillsPurchase: [undefined],
            loanAmountBillsPurchase: [undefined],
            loanAmountInWordBillsPurchase: [undefined],
            marginInPercentageBillsPurchase: [undefined],
            commissionBillsPurchase: [undefined],
            commissionAmountBillsPurchase: [undefined],
            loanExpiryDateBillsPurchase: [undefined],
            // other Input Fields
            SNOfFacility: [undefined],
            freeTextOne: [undefined],
            freeTextTwo: [undefined],
            freeTextThree: [undefined],
            freeTextFour: [undefined],
            freeTextFive: [undefined],
            freeTextSix: [undefined],
            freeTextSeven: [undefined],
            freeTextEight: [undefined],
            freeTextNine: [undefined],
            freeTextFifteen: [undefined],
            freeTextSixteen: [undefined],
        });
    }

    fillForm() {
        this.form.patchValue({
            // Irrevocable letter of credit facility
            // SNOfParentLimitIrrevocable: [undefined],
            loanAmountIrrevocable: this.tempData.letterOfCreditForm.loanAmountCT ? this.tempData.letterOfCreditForm.loanAmountCT : '',
            loanAmountInWordIrrevocable: this.tempData.letterOfCreditForm.loanAmountAmountWordsCT ? this.tempData.letterOfCreditForm.loanAmountAmountWordsCT : '',
            marginInPercentageIrrevocable: this.tempData.letterOfCreditForm.marginInPercentageCT ? this.tempData.letterOfCreditForm.marginInPercentageCT : '',
            commissionRateIrrevocable: this.tempData.letterOfCreditForm.commissionRateCT ? this.tempData.letterOfCreditForm.commissionRateCT : '',
            commissionAmountIrrevocable: this.tempData.letterOfCreditForm.minimumCommissionRateCT ? this.tempData.letterOfCreditForm.minimumCommissionRateCT : '',
            commissionRateForFirstQuarterIrrevocable: this.tempData.letterOfCreditForm.commissionRateFirstQuarterCT ? this.tempData.letterOfCreditForm.commissionRateFirstQuarterCT : '',
            commissionRateForOtherQuarterIrrevocable: this.tempData.letterOfCreditForm.commissionRateOtherQuarterCT ? this.tempData.letterOfCreditForm.commissionRateOtherQuarterCT : '',
            loanExpiryDateIrrevocable: this.tempData.letterOfCreditForm.dateOfExpiryCT ? this.tempData.letterOfCreditForm.dateOfExpiryCT : '',
            // loanExpiryDateIrrevocable2:  this.tempData.letterOfCreditForm.loanAmountCT ? this.tempData.letterOfCreditForm.loanAmountCT : '' ,
        });
    }

}
