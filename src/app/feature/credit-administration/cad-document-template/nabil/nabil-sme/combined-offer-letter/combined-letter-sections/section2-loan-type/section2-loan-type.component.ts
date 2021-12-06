import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';
import {NepaliCurrencyWordPipe} from '../../../../../../../../@core/pipe/nepali-currency-word.pipe';

@Component({
    selector: 'app-section2-loan-type',
    templateUrl: './section2-loan-type.component.html',
    styleUrls: ['./section2-loan-type.component.scss']
})
export class Section2LoanTypeComponent implements OnInit {
    @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
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
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
            this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
            this.loanAmount = String(this.cadOfferLetterApprovedDoc.assignedLoan[0].proposal.proposedLimit);
            this.loanAmountInWord = this.engToNepWord.transform( this.loanAmount);
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
            commissionAPGBankGuarantee: [undefined],
            commissionBidBondBankGuarantee: [undefined],
            serviceChargeBankGuarantee: [undefined],
            minimumServiceChargeBankGuarantee: [undefined],
            commissionAPG1BankGuarantee: [undefined],
            commissionBidBond1BankGuarantee: [undefined],
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
        if ( !ObjectUtil.isEmpty(this.tempData.letterOfCreditForm)) {
            this.form.patchValue({
                // Irrevocable letter of credit facility
                // SNOfParentLimitIrrevocable: [undefined],
                loanAmountIrrevocable: this.loanAmount ? this.loanAmount : '',
                loanAmountInWordIrrevocable: this.loanAmountInWord ? this.loanAmountInWord : '',
                // tslint:disable-next-line:max-line-length
                marginInPercentageIrrevocable: this.tempData.letterOfCreditForm.marginInPercentageCT ? this.tempData.letterOfCreditForm.marginInPercentageCT : '',
                // tslint:disable-next-line:max-line-length
                commissionRateIrrevocable: this.tempData.letterOfCreditForm.commissionRateCT ? this.tempData.letterOfCreditForm.commissionRateCT : '',
                // tslint:disable-next-line:max-line-length
                commissionAmountIrrevocable: this.tempData.letterOfCreditForm.minimumCommissionRateCT ? this.tempData.letterOfCreditForm.minimumCommissionRateCT : '',
                // tslint:disable-next-line:max-line-length
                commissionRateForFirstQuarterIrrevocable: this.tempData.letterOfCreditForm.commissionRateFirstQuarterCT ? this.tempData.letterOfCreditForm.commissionRateFirstQuarterCT : '',
                // tslint:disable-next-line:max-line-length
                commissionRateForOtherQuarterIrrevocable: this.tempData.letterOfCreditForm.commissionRateOtherQuarterCT ? this.tempData.letterOfCreditForm.commissionRateOtherQuarterCT : '',
                // tslint:disable-next-line:max-line-length
                loanExpiryDateIrrevocable: this.tempData.letterOfCreditForm.dateOfExpiryCT ? this.tempData.letterOfCreditForm.dateOfExpiryCT : '',
                // tslint:disable-next-line:max-line-length
                // loanExpiryDateIrrevocable2:  this.tempData.letterOfCreditForm.loanAmountCT ? this.tempData.letterOfCreditForm.loanAmountCT : '' ,
            });
        }
        if ( !ObjectUtil.isEmpty(this.tempData.timeLetterCreditForm)) {
            this.timeLetterCreditFormPatchValue();
        }
        if ( !ObjectUtil.isEmpty(this.tempData.importBillsDiscountForm)) {
            this.importBillsDiscountFormPatchValue();
        }
        if ( !ObjectUtil.isEmpty(this.tempData.importTrustForm)) {
            this.importTrustFormPatchValue();
        }
        if ( !ObjectUtil.isEmpty(this.tempData.revolvingShortTermForm)) {
            this.revolvingShortTermFormPatchValue();
        }
        if ( !ObjectUtil.isEmpty(this.tempData.demandLoanForm)) {
            this.demandLoanFormPatchValue();
        }
        if ( !ObjectUtil.isEmpty(this.tempData.preExportForm)) {
            this.preExportFormPatchValue();
        }
        if ( !ObjectUtil.isEmpty(this.tempData.documentaryBillPurchaseForm)) {
            this.documentaryBillPurchaseFormPatchValue();
        }
        if ( !ObjectUtil.isEmpty(this.tempData.overdraftLoanForm)) {
            this.overdraftLoanFormPatchValue();
        }
        if ( !ObjectUtil.isEmpty(this.tempData.equityMortgageForm)) {
            this.equityMortgageFormPatchValue();
        }
        if ( !ObjectUtil.isEmpty(this.tempData.overdraftFixedForm)) {
            this.overdraftFixedFormPatchValue();
        }
        if ( !ObjectUtil.isEmpty(this.tempData.overDraftFacilityForm)) {
            this.overDraftFacilityFormPatchValue();
        }
        if ( !ObjectUtil.isEmpty(this.tempData.bridgeGapLoanForm)) {
            this.bridgeGapLoanFormPatchValue();
        }
        if ( !ObjectUtil.isEmpty(this.tempData.bankGuaranteeForm)) {
            this.bankGuaranteeFormPatchValue();
        }
        if ( !ObjectUtil.isEmpty(this.tempData.billPurchaseForm)) {
            this.billPurchaseFormPatchValue();
        }
    }

    timeLetterCreditFormPatchValue() {
        this.form.patchValue({
            // Customer Acceptance for Time Letter of Credit
            // SNOfParentLimitTimeLetter: [undefined],
            loanAmountTimeLetter: this.loanAmount ? this.loanAmount : '',
            loanAmountInWordTimeLetter: this.loanAmountInWord ? this.loanAmountInWord : '',
            // tslint:disable-next-line:max-line-length
            marginInPercentageTimeLetter: this.tempData.timeLetterCreditForm.marginInPercentageCT ? this.tempData.timeLetterCreditForm.marginInPercentageCT : '',
            // tslint:disable-next-line:max-line-length
            commissionRateQuarterlyTimeLetter: this.tempData.timeLetterCreditForm.commissionRateCT ? this.tempData.timeLetterCreditForm.commissionRateCT : '',
            // tslint:disable-next-line:max-line-length
            commissionAmountTimeLetter: this.tempData.timeLetterCreditForm.minimumCommissionAmountCT ? this.tempData.timeLetterCreditForm.minimumCommissionAmountCT : '',
            // tslint:disable-next-line:max-line-length
            loanExpiryDateTimeLetter: this.tempData.timeLetterCreditForm.dateOfExpiryCT ? this.tempData.timeLetterCreditForm.dateOfExpiryCT : '',
            // tslint:disable-next-line:max-line-length
            // loanExpiryDateTimeLetter2: this.tempData.timeLetterCreditForm.loanAmount ? this.tempData.timeLetterCreditForm.loanAmountCT : '',
        });
    }
    importBillsDiscountFormPatchValue() {
        this.form.patchValue({
            // Import Bills Discounting
            // tslint:disable-next-line:max-line-length
            loanDaysBillsDiscounting: this.tempData.importBillsDiscountForm.loanPeriodInDaysCT ? this.tempData.importBillsDiscountForm.loanPeriodInDaysCT : '',
            // tslint:disable-next-line:max-line-length
            loanDaysBillsDiscountingInEng: this.tempData.importBillsDiscountForm.loanPeriodInDays ? this.tempData.importBillsDiscountForm.loanPeriodInDays : '',
            // SNOfParentLimitBillsDiscounting: [undefined],
            loanAmountBillsDiscounting: this.loanAmount ? this.loanAmount : '',
            loanAmountInWordBillsDiscounting: this.loanAmountInWord ? this.loanAmountInWord : '',
            // tslint:disable-next-line:max-line-length
            marginInPercentageBillsDiscounting: this.tempData.importBillsDiscountForm.marginInPercentageCT ? this.tempData.importBillsDiscountForm.marginInPercentageCT : '',
            // tslint:disable-next-line:max-line-length
            loanExpiryDateBillsDiscounting: this.tempData.importBillsDiscountForm.dateOfExpiryCT ? this.tempData.importBillsDiscountForm.dateOfExpiryCT : '',

        });
    }

    importTrustFormPatchValue() {
        this.form.patchValue({
            // Import Loan/ Trust Receipt Loan
            loanDaysLoanTrust: this.tempData.importTrustForm.loanPeriodCT ? this.tempData.importTrustForm.loanPeriodCT : '',
            loanDaysLoanTrustInEng: this.tempData.importTrustForm.loanPeriod ? this.tempData.importTrustForm.loanPeriod : '',
            // SNOfParentLimitLoanTrust: [undefined],
            loanAmountLoanTrust:  this.loanAmount ? this.loanAmount : '',
            loanAmountInWordLoanTrust: this.loanAmountInWord ? this.loanAmountInWord : '',
            drawingPowerLoanTrust: this.tempData.importTrustForm.drawingPowerCT ? this.tempData.importTrustForm.drawingPowerCT : '',
            baseRateLoanTrust: this.tempData.importTrustForm.baseRateCT ? this.tempData.importTrustForm.baseRateCT : '',
            premiumRateLoanTrust: this.tempData.importTrustForm.premiumRateCT ? this.tempData.importTrustForm.premiumRateCT : '',
            interestRateLoanTrust: this.tempData.importTrustForm.interestRateCT ? this.tempData.importTrustForm.interestRateCT : '',
            totalInterestRateLoanTrust: this.tempData.importTrustForm.interestRateCT ? this.tempData.importTrustForm.interestRateCT : '',
            // remainDaysLoanTrust: [undefined],
            loanExpiryDateLoanTrust: this.tempData.importTrustForm.dateOfExpiryCT ? this.tempData.importTrustForm.dateOfExpiryCT : '',

        });
    }

    revolvingShortTermFormPatchValue() {
        this.form.patchValue({
            // Revolving/One off basis Short Term Loan
            // tslint:disable-next-line:max-line-length
            loanDaysShortTermLoan: this.tempData.revolvingShortTermForm.loanRevolvingPeriodCT ? this.tempData.revolvingShortTermForm.loanRevolvingPeriodCT : '',
            // tslint:disable-next-line:max-line-length
            loanDaysShortTermLoanInEng: this.tempData.revolvingShortTermForm.loanRevolvingPeriod ? this.tempData.revolvingShortTermForm.loanRevolvingPeriod : '',
            // SNOfParentLimitShortTermLoan: [undefined],
            // tslint:disable-next-line:max-line-length
            loanMonthsShortTermLoan: this.tempData.revolvingShortTermForm.loanRevolvingPeriodCT ? this.tempData.revolvingShortTermForm.loanRevolvingPeriodCT : '',
            // tslint:disable-next-line:max-line-length
            loanMonthsShortTermLoanInEng: this.tempData.revolvingShortTermForm.loanRevolvingPeriod ? this.tempData.revolvingShortTermForm.loanRevolvingPeriod : '',
            loanAmountShortTermLoan:  this.loanAmount ? this.loanAmount : '',
            loanAmountInWordShortTermLoan: this.loanAmountInWord ? this.loanAmountInWord : '',
            ARDaysShortTermLoan: this.tempData.revolvingShortTermForm.arDaysCT ? this.tempData.revolvingShortTermForm.arDaysCT : '',
            // tslint:disable-next-line:max-line-length
            drawingPowerShortTermLoan: this.tempData.revolvingShortTermForm.drawingPowerCT ? this.tempData.revolvingShortTermForm.drawingPowerCT : '',
            baseRateShortTermLoan: this.tempData.revolvingShortTermForm.baseRateCT ? this.tempData.revolvingShortTermForm.baseRateCT : '',
            // tslint:disable-next-line:max-line-length
            premiumRateShortTermLoan: this.tempData.revolvingShortTermForm.premiumRateCT ? this.tempData.revolvingShortTermForm.premiumRateCT : '',
            // tslint:disable-next-line:max-line-length
            interestRateShortTermLoan: this.tempData.revolvingShortTermForm.interestRateCT ? this.tempData.revolvingShortTermForm.interestRateCT : '',
            // tslint:disable-next-line:max-line-length
            totalInterestRateShortTermLoan: this.tempData.revolvingShortTermForm.interestRateCT ? this.tempData.revolvingShortTermForm.interestRateCT : '',
            // remainDaysShortTermLoan: [undefined],
            // tslint:disable-next-line:max-line-length
            loanExpiryDateShortTermLoan: this.tempData.revolvingShortTermForm.dateOfExpiryCT ? this.tempData.revolvingShortTermForm.dateOfExpiryCT : '',
        });
    }

    demandLoanFormPatchValue() {
        this.form.patchValue({
            // Demand Loan for working capital
            SNOfParentLimitDemandLoan: [undefined],
            loanAmountDemandLoan:  this.loanAmount ? this.loanAmount : '',
            LoanAmountInWordDemandLoan: this.loanAmountInWord ? this.loanAmountInWord : '',
            ARDaysDemandLoan: this.tempData.demandLoanForm.arDaysCT ? this.tempData.demandLoanForm.arDaysCT : '',
            drawingPowerDemandLoan: this.tempData.demandLoanForm.drawingPowerCT ? this.tempData.demandLoanForm.drawingPowerCT : '',
            baseRateDemandLoan: this.tempData.demandLoanForm.baseRateCT ? this.tempData.demandLoanForm.baseRateCT : '',
            premiumRateDemandLoan: this.tempData.demandLoanForm.premiumRateCT ? this.tempData.demandLoanForm.premiumRateCT : '',
            interestRateDemandLoan: this.tempData.demandLoanForm.interestRateCT ? this.tempData.demandLoanForm.interestRateCT : '',
            totalInterestRateDemandLoan: this.tempData.demandLoanForm.interestRateCT ? this.tempData.demandLoanForm.interestRateCT : '',
            loanExpiryDateDemandLoan: this.tempData.demandLoanForm.dateOfExpiryCT ? this.tempData.demandLoanForm.dateOfExpiryCT : '',
        });
    }

    preExportFormPatchValue() {
        this.form.patchValue({
            // Pre-Export Loan
            // SNOfParentLimitPreExport: [undefined],
            loanAmountPreExport:  this.loanAmount ? this.loanAmount : '',
            loanAmountInWordPreExport: this.loanAmountInWord ? this.loanAmountInWord : '',
            drawingPower1PreExport: this.tempData.preExportForm.drawingPowerCT ? this.tempData.preExportForm.drawingPowerCT : '',
            drawingPower2PreExport: this.tempData.preExportForm.drawingPowerCT ? this.tempData.preExportForm.drawingPowerCT : '',
            // sulkaPreExport: [undefined],
            // interestRatePreExport: [undefined],
            loanExpiryDatePreExport: this.tempData.preExportForm.dateOfExpiryCT ? this.tempData.preExportForm.dateOfExpiryCT : '',
        });
    }

    documentaryBillPurchaseFormPatchValue() {
        this.form.patchValue({
            // Documentary Bill Purchase/Negotiation
            // SNOfParentLimitDocumentaryBill: [undefined],
            loanAmountDocumentaryBill:  this.loanAmount ? this.loanAmount : '',
            loanAmountInWordDocumentaryBill: this.loanAmountInWord ? this.loanAmountInWord : '',
            // tslint:disable-next-line:max-line-length
            marginInPercentageDocumentaryBill: this.tempData.documentaryBillPurchaseForm.marginInPercentageCT ? this.tempData.documentaryBillPurchaseForm.marginInPercentageCT : '',
            // tslint:disable-next-line:max-line-length
            drawingPowerDocumentaryBill: this.tempData.documentaryBillPurchaseForm.drawingPowerCT ? this.tempData.documentaryBillPurchaseForm.drawingPowerCT : '',
            // InterestRateDocumentaryBill: [undefined],
            // loanPaymentDocumentaryBill: [undefined],
            // tslint:disable-next-line:max-line-length
            loanExpiryDateDocumentaryBill: this.tempData.documentaryBillPurchaseForm.dateOfExpiryCT ? this.tempData.documentaryBillPurchaseForm.dateOfExpiryCT : '',
        });
    }

    overdraftLoanFormPatchValue() {
        this.form.patchValue({
            // Overdraft Loan for Working Capital requirement
            loanAmountOverdraftLoan:  this.loanAmount ? this.loanAmount : '',
            loanAmountInWordOverdraftLoan: this.loanAmountInWord ? this.loanAmountInWord : '',
            ARDaysOverdraftLoan: this.tempData.overdraftLoanForm.arDaysCT ? this.tempData.overdraftLoanForm.arDaysCT : '',
            drawingPowerOverdraftLoan: this.tempData.overdraftLoanForm.drawingPowerCT ? this.tempData.overdraftLoanForm.drawingPowerCT : '',
            baseRateOverdraftLoan: this.tempData.overdraftLoanForm.baseRateCT ? this.tempData.overdraftLoanForm.baseRateCT : '',
            premiumRateOverdraftLoan: this.tempData.overdraftLoanForm.premiumRateCT ? this.tempData.overdraftLoanForm.premiumRateCT : '',
            interestRateOverdraftLoan: this.tempData.overdraftLoanForm.interestRateCT ? this.tempData.overdraftLoanForm.interestRateCT : '',
            // tslint:disable-next-line:max-line-length
            totalInterestRateOverdraftLoan: this.tempData.overdraftLoanForm.interestRateCT ? this.tempData.overdraftLoanForm.interestRateCT : '',
            loanExpiryDateOverdraftLoan: this.tempData.overdraftLoanForm.dateOfExpiryCT ? this.tempData.overdraftLoanForm.dateOfExpiryCT : '',
        });
    }

    equityMortgageFormPatchValue() {
        this.form.patchValue({
            // Mortgage Overdraft/ Other Overdraft/ Equity Mortgaged Overdraft
            loanAmountMortgageOverdraft:  this.loanAmount ? this.loanAmount : '',
            loanAmountInWordMortgageOverdraft: this.loanAmountInWord ? this.loanAmountInWord : '',
            // tslint:disable-next-line:max-line-length
            drawingPowerMortgageOverdraft: this.tempData.equityMortgageForm.drawingPowerCT ? this.tempData.equityMortgageForm.drawingPowerCT : '',
            baseRateMortgageOverdraft: this.tempData.equityMortgageForm.baseRateCT ? this.tempData.equityMortgageForm.baseRateCT : '',
            premiumRateMortgageOverdraft: this.tempData.equityMortgageForm.premiumRateCT ? this.tempData.equityMortgageForm.premiumRateCT : '',
            // tslint:disable-next-line:max-line-length
            interestRateMortgageOverdraft: this.tempData.equityMortgageForm.interestRateCT ? this.tempData.equityMortgageForm.interestRateCT : '',
            // tslint:disable-next-line:max-line-length
            totalInterestRateMortgageOverdraft: this.tempData.equityMortgageForm.interestRateCT ? this.tempData.equityMortgageForm.interestRateCT : '',
            // tslint:disable-next-line:max-line-length
            loanExpiryDateMortgageOverdraft: this.tempData.equityMortgageForm.dateOfExpiryCT ? this.tempData.equityMortgageForm.dateOfExpiryCT : '',
        });
    }

    overdraftFixedFormPatchValue() {
        this.form.patchValue({
            // Overdraft Facility against Fixed Deposit/ Lien on Deposit Account
            // tslint:disable-next-line:max-line-length
            nameOfFacilityOverdraftFacility: this.tempData.overdraftFixedForm.nameOfFacilityCT ? this.tempData.overdraftFixedForm.nameOfFacilityCT : '',
            // tslint:disable-next-line:max-line-length
            nameOfFacilityOverdraftFacilityInEng: this.tempData.overdraftFixedForm.nameOfFacility ? this.tempData.overdraftFixedForm.nameOfFacility : '',
            loanAmountOverdraftFacility:  this.loanAmount ? this.loanAmount : '',
            loanAmountInWordOverdraftFacility: this.loanAmountInWord ? this.loanAmountInWord : '',
            // tslint:disable-next-line:max-line-length
            // nameOfFDHolderOverdraftFacility: this.tempData.overdraftFixedForm.fdHolderDetails ? this.tempData.overdraftFixedForm.nameOfFDHolderCT.fdHolderDetails[0].nameOfFDHolderCT : '',
            // tslint:disable-next-line:max-line-length
            FDAmountOverdraftFacility: this.tempData.overdraftFixedForm.FdAmountInFigureCT ? this.tempData.overdraftFixedForm.FdAmountInFigureCT : '',
            nameOfBankOverdraftFacility: this.tempData.overdraftFixedForm.holdingBankCT ? this.tempData.overdraftFixedForm.holdingBankCT : '',
            // tslint:disable-next-line:max-line-length
            // nameOfDepositorOverdraftFacility: this.tempData.overdraftFixedForm.depositorDetails ? this.tempData.overdraftFixedForm.depositorDetails[0].nameOfDepositorsCT : '',
            accountTypeOverdraftFacility: this.tempData.overdraftFixedForm.accountTypeCT ? this.tempData.overdraftFixedForm.accountTypeCT : '',
            // tslint:disable-next-line:max-line-length
            accountNoOverdraftFacility: this.tempData.overdraftFixedForm.accountNumberCT ? this.tempData.overdraftFixedForm.accountNumberCT : '',
            amountOverdraftFacility: this.tempData.overdraftFixedForm.amountInFigureCT ? this.tempData.overdraftFixedForm.amountInFigureCT : '',
            // tslint:disable-next-line:max-line-length
            drawingPowerOverdraftFacility: this.tempData.overdraftFixedForm.drawingPowerCT ? this.tempData.overdraftFixedForm.drawingPowerCT : '',
            // tslint:disable-next-line:max-line-length
            additionalPremiumOverdraftFacility: this.tempData.overdraftFixedForm.additionalPremiumRateCT ? this.tempData.overdraftFixedForm.additionalPremiumRateCT : '',
            // tslint:disable-next-line:max-line-length
            couponInterestRateOverdraftFacility: this.tempData.overdraftFixedForm.totalInterestRateCT ? this.tempData.overdraftFixedForm.totalInterestRateCT : '',
            baseRateOverdraftFacility: this.tempData.overdraftFixedForm.baseRateCT ? this.tempData.overdraftFixedForm.baseRateCT : '',
            premiumRateOverdraftFacility: this.tempData.overdraftFixedForm.premiumRateCT ? this.tempData.overdraftFixedForm.premiumRateCT : '',
            // tslint:disable-next-line:max-line-length
            interestRateOverdraftFacility: this.tempData.overdraftFixedForm.interestRateCT ? this.tempData.overdraftFixedForm.interestRateCT : '',
            // tslint:disable-next-line:max-line-length
            loanExpiryDateOverdraftFacility: this.tempData.overdraftFixedForm.dateOfExpiryCT ? this.tempData.overdraftFixedForm.dateOfExpiryCT : '',
        });
    }

    overDraftFacilityFormPatchValue() {
        this.form.patchValue({
            // Overdraft Facility against Bond
            // tslint:disable-next-line:max-line-length
            nameOfFacilityAgainstBond: this.tempData.overDraftFacilityForm.nameOfFacilityCT ? this.tempData.overDraftFacilityForm.nameOfFacilityCT : '',
            // tslint:disable-next-line:max-line-length
            nameOfFacilityAgainstBondInEng: this.tempData.overDraftFacilityForm.nameOfFacility ? this.tempData.overDraftFacilityForm.nameOfFacility : '',
            loanAmountAgainstBond:  this.loanAmount ? this.loanAmount : '',
            loanAmountInWordAgainstBond: this.loanAmountInWord ? this.loanAmountInWord : '',
            // tslint:disable-next-line:max-line-length
            // ownerNameAgainstBond: this.tempData.overDraftFacilityForm.bondDetails ? this.tempData.overDraftFacilityForm.bondDetails[0].bondOwnerNameCT : '',
            bondAmountAgainstBond: this.tempData.overDraftFacilityForm.bondAmountCT ? this.tempData.overDraftFacilityForm.bondAmountCT : '',
            bondTypeAgainstBond: this.tempData.overDraftFacilityForm.bondTypeCT ? this.tempData.overDraftFacilityForm.bondTypeCT : '',
            // tslint:disable-next-line:max-line-length
            totalInterestRateAgainstBond: this.tempData.overDraftFacilityForm.interestRateCT ? this.tempData.overDraftFacilityForm.interestRateCT : '',
            baseRateAgainstBond: this.tempData.overDraftFacilityForm.baseRateCT ? this.tempData.overDraftFacilityForm.baseRateCT : '',
            premiumRateAgainstBond: this.tempData.overDraftFacilityForm.premiumRateCT ? this.tempData.overDraftFacilityForm.premiumRateCT : '',
            // tslint:disable-next-line:max-line-length
            interestRateAgainstBond: this.tempData.overDraftFacilityForm.interestRateCT ? this.tempData.overDraftFacilityForm.interestRateCT : '',
            // tslint:disable-next-line:max-line-length
            loanExpiryDateAgainstBond: this.tempData.overDraftFacilityForm.dateOfExpiryCT ? this.tempData.overDraftFacilityForm.dateOfExpiryCT : '',
        });
    }

    bridgeGapLoanFormPatchValue() {
        this.form.patchValue({
            // Bridge Gap Loan
            // SNOfParentLimitBridgeGap: [undefined],
            loanAmountBridgeGap:  this.loanAmount ? this.loanAmount : '',
            loanAmountInWordBridgeGap: this.loanAmountInWord ? this.loanAmountInWord : '',
            baseRateBridgeGap: this.tempData.bridgeGapLoanForm.baseRateCT ? this.tempData.bridgeGapLoanForm.baseRateCT : '',
            premiumRateBridgeGap: this.tempData.bridgeGapLoanForm.premiumRateCT ? this.tempData.bridgeGapLoanForm.premiumRateCT : '',
            interestRateBridgeGap: this.tempData.bridgeGapLoanForm.interestRateCT ? this.tempData.bridgeGapLoanForm.interestRateCT : '',
            // tslint:disable-next-line:max-line-length
            totalInterestRateBridgeGap: this.tempData.bridgeGapLoanForm.totalInterestRateCT ? this.tempData.bridgeGapLoanForm.totalInterestRateCT : '',
        });
    }

    bankGuaranteeFormPatchValue() {
        this.form.patchValue({
            // Bank Guarantee
            // SNOfParentLimitBankGuarantee: [undefined],
            loanAmountBankGuarantee:  this.loanAmount ? this.loanAmount : '',
            loanAmountInWordBankGuarantee: this.loanAmountInWord ? this.loanAmountInWord : '',
            // tslint:disable-next-line:max-line-length
            nameOfBankBankGuarantee: this.tempData.bankGuaranteeForm.nameOfHoldingBankCT ? this.tempData.bankGuaranteeForm.nameOfHoldingBankCT : '',
            // tslint:disable-next-line:max-line-length
            marginInPercentageBankGuarantee: this.tempData.bankGuaranteeForm.marginInPercentageCT ? this.tempData.bankGuaranteeForm.marginInPercentageCT : '',
            // tslint:disable-next-line:max-line-length
            commissionAPGBankGuarantee: this.tempData.bankGuaranteeForm.commissionInPercentageAPGCT ? this.tempData.bankGuaranteeForm.commissionInPercentageAPGCT : '',
            // tslint:disable-next-line:max-line-length
            commissionBidBondBankGuarantee: this.tempData.bankGuaranteeForm.commissionInPercentageBidBondCT ? this.tempData.bankGuaranteeForm.commissionInPercentageBidBondCT : '',
            // tslint:disable-next-line:max-line-length
            serviceChargeBankGuarantee: this.tempData.bankGuaranteeForm.serviceChargeInPercentCT ? this.tempData.bankGuaranteeForm.serviceChargeInPercentCT : '',
            // tslint:disable-next-line:max-line-length
            minimumServiceChargeBankGuarantee: this.tempData.bankGuaranteeForm.minServiceChargeInFigure1CT ? this.tempData.bankGuaranteeForm.minServiceChargeInFigure1CT : '',
            // tslint:disable-next-line:max-line-length
            commissionAPG1BankGuarantee: this.tempData.bankGuaranteeForm.commissionInPercentage2APGCT ? this.tempData.bankGuaranteeForm.commissionInPercentage2APGCT : '',
            // tslint:disable-next-line:max-line-length
            commissionBidBond1BankGuarantee: this.tempData.bankGuaranteeForm.commissionInPercentage2BidBondCT ? this.tempData.bankGuaranteeForm.commissionInPercentage2BidBondCT : '',
            loanExpiryDateBankGuarantee1: this.tempData.bankGuaranteeForm.dateOfExpiryCT ? this.tempData.bankGuaranteeForm.dateOfExpiryCT : '',
        });
    }

    billPurchaseFormPatchValue() {
        this.form.patchValue({
            // Bills Purchase
            // SNOfParentLimitBillsPurchase: [undefined],
            loanAmountBillsPurchase:  this.loanAmount ? this.loanAmount : '',
            loanAmountInWordBillsPurchase: this.loanAmountInWord ? this.loanAmountInWord : '',
            // tslint:disable-next-line:max-line-length
            marginInPercentageBillsPurchase: this.tempData.billPurchaseForm.marginInPercentageCT ? this.tempData.billPurchaseForm.marginInPercentageCT : '',
            commissionBillsPurchase: this.tempData.billPurchaseForm.commissionCT ? this.tempData.billPurchaseForm.commissionCT : '',
            // tslint:disable-next-line:max-line-length
            commissionAmountBillsPurchase: this.tempData.billPurchaseForm.minCommissionAmountInFigCT ? this.tempData.billPurchaseForm.minCommissionAmountInFigCT : '',
            loanExpiryDateBillsPurchase: this.tempData.billPurchaseForm.dateOfExpiryCT ? this.tempData.billPurchaseForm.dateOfExpiryCT : '',
        });
    }
}
