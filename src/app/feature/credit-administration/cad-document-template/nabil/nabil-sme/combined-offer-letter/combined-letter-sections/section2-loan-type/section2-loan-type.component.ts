import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';
import {NepaliCurrencyWordPipe} from '../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {TermLoanToOrForComponent} from './term-loan-to-or-for/term-loan-to-or-for.component';
import {MortgageEquityTermLoanComponent} from './mortgage-equity-term-loan/mortgage-equity-term-loan.component';
import {AutoLoanComponent} from './auto-loan/auto-loan.component';
import {LoanNameConstant} from '../../../../../../cad-view/template-data/nabil-sme-template-data/sme-costant/loan-name-constant';
import {CurrencyFormatterPipe} from '../../../../../../../../@core/pipe/currency-formatter.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {json} from 'd3';

@Component({
    selector: 'app-section2-loan-type',
    templateUrl: './section2-loan-type.component.html',
    styleUrls: ['./section2-loan-type.component.scss']
})
export class Section2LoanTypeComponent implements OnInit {
    @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
    form: FormGroup;
    tempData;
    tempInformation;
    loanData = [];
    freeTextVal: any = {};
    @ViewChild('termLoanToOrForComponent', {static: false}) termLoanToOrForComponent: TermLoanToOrForComponent;
    @ViewChild('mortgageEquityTermLoanComponent', {static: false}) mortgageEquityTermLoanComponent: MortgageEquityTermLoanComponent;
    @ViewChild('autoLoanComponent', {static: false}) autoLoanComponent: AutoLoanComponent;
    FDName;
    DepName;
    BondName;
    FDNames: Array<String> = [];
    allFDNames;
    DepNames: Array<String> = [];
    allDepNames;
    BondNames: Array<String> = [];
    allBondNames;
    loanNameConstant = LoanNameConstant;
    isCustomerAcceptance = false;
    isIrrevocableLetter = false;
    isBillDiscounting = false;
    isLoanTrustReceiptLoan = false;
    isRevolvingShortTermLoan = false;
    isDemandLoanWorkingCapital = false;
    isPreExportLoan = false;
    isDocumentaryBillPurchase = false;
    isOverdraftLoanWorkingCapital = false;
    isEquityMortgageOverdraft = false;
    isOverDraftFacilityFixedDeposit = false;
    isOverdraftFacilityAgainstBond = false;
    isBridgeGapLoan = false;
    isTermLoanToOrFor = false;
    isEquityMortgageTermLoan = false;
    isAutoLoanMaster = false;
    isBankGuarantee = false;
    isBillPurchase = false;
    // SME Global Form
    hypothecationGlobal;
    // Irrevocable letter of credit facility
    loanOptionIrrevocable;
    commissionTypeIrrevocable;
    complementaryOtherIrrevocable = false;
    // Customer Acceptance for Time Letter of Credit
    loanOptionTimeLetter;
    complementaryOtherTimeLetter = false;
    // Import Bills Discounting
    loanOptionBillDiscounting;
    complementaryOtherBillDiscounting = false;
    // Import Loan/ Trust Receipt Loan
    loanOptionImportLoanTrust;
    complementaryOtherImportLoanTrust = false;
    interestSubsidyAgImportLoanTrust;
    // Revolving/One off basis Short Term Loan
    loanRevolvingBasisShortTermLoan;
    loanOptionShortTermLoan;
    complementaryOtherShortTermLoan = false;
    arFinancingShortTermLoan = false;
    interestSubsidyAgShortTermLoan;
    // Demand Loan for working capital
    complementaryOtherDemandLoan = false;
    arFinancingDemandLoan = false;
    interestSubsidyAgDemandLoan;
    // Pre- Export Loan
    complementaryOtherPreExportLoan = false;
    // Documentary Bill Purchase/Negotiation
    complementaryOtherDocumentaryBill = false;
    // Overdraft Loan for Working Capital requirement
    arFinancingOverdraftLoanWorking = false;
    interestSubsidyAgOverdraftLoanWorking;
    // Mortgage Overdraft/ Other Overdraft/ Equity Mortgaged Overdraft
    loanSubTypeEquityMortgage;
    drawingBasisEquityMortgage;
    mortgageTypeEquityMortgage;
    interestSubsidyAgEquityMortgage;
    // Overdraft Facility against Fixed Deposit/ Lien on Deposit Account
    subLoanOptionOverdraftFixedForm;
    holdingBankOverdraftFixedForm;
    letterOfSetOffOverdraftFixedForm;
    interestRateTypeOverdraftFixedForm;
    interestSubsidyAgOverdraftFixedForm;
    checkAdditionalPremiumRateOverdraftFixedForm = false;
    accountTypeOverdraftFixedForm;
    // Overdraft Facility against Bond
    letterOfSetOffFacilityAgainstBond;
    interestSubsidyAgFacilityAgainstBond;
    interestRateTypeFacilityAgainstBond;
    // Bridge Gap Loan
    complementaryOtherBridgeGapLoan = false;
    interestSubsidyAgBridgeGapLoan = false;
    // Bank Guarantee
    complementaryOtherBankGuarantee = false;
    securityTypeBankGuarantee;
    guaranteeTypeBankGuarantee;
    commissionTypeBankGuarantee;
    // Bills Purchase
    complementaryOtherBillPurchase = false;

    constructor(private formBuilder: FormBuilder,
                private engToNepWord: NepaliCurrencyWordPipe,
                private currencyFormatPipe: CurrencyFormatterPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
    ) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
            this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
            this.tempInformation = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation);
            this.hypothecationGlobal = this.tempData.smeGlobalForm.hypothecation;
            this.getFDName();
            this.getDepName();
            this.getBondName();
            this.getLoanName();
            this.checkLoanName();
            this.setFreeText();
        }
    }

    buildForm() {
        this.form = this.formBuilder.group({
            // Irrevocable letter of credit facility
            SNOfParentLimitIrrevocable: [undefined],
            marginInPercentageIrrevocable: [undefined],
            commissionRateIrrevocable: [undefined],
            commissionAmountIrrevocable: [undefined],
            commissionRateForFirstQuarterIrrevocable: [undefined],
            commissionRateForOtherQuarterIrrevocable: [undefined],
            loanExpiryDateIrrevocable: [undefined],
            loanExpiryDateIrrevocable2: [undefined],
            // Customer Acceptance for Time Letter of Credit
            SNOfParentLimitTimeLetter: [undefined],
            marginInPercentageTimeLetter: [undefined],
            commissionRateQuarterlyTimeLetter: [undefined],
            commissionAmountTimeLetter: [undefined],
            loanExpiryDateTimeLetter: [undefined],
            loanExpiryDateTimeLetter2: [undefined],
            // Import Bills Discounting
            loanDaysBillsDiscounting: [undefined],
            loanDaysBillsDiscountingInEng: [undefined],
            SNOfParentLimitBillsDiscounting: [undefined],
            marginInPercentageBillsDiscounting: [undefined],
            loanExpiryDateBillsDiscounting: [undefined],
            // Import Loan/ Trust Receipt Loan
            loanDaysLoanTrust: [undefined],
            loanDaysLoanTrustInEng: [undefined],
            SNOfParentLimitLoanTrust: [undefined],
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
            ARDaysDemandLoan: [undefined],
            drawingPowerDemandLoan: [undefined],
            baseRateDemandLoan: [undefined],
            premiumRateDemandLoan: [undefined],
            interestRateDemandLoan: [undefined],
            totalInterestRateDemandLoan: [undefined],
            loanExpiryDateDemandLoan: [undefined],
            // Pre-Export Loan
            SNOfParentLimitPreExport: [undefined],
            drawingPower1PreExport: [undefined],
            drawingPower2PreExport: [undefined],
            sulkaPreExport: [undefined],
            interestRatePreExport: [undefined],
            loanExpiryDatePreExport: [undefined],
            // Documentary Bill Purchase/Negotiation
            SNOfParentLimitDocumentaryBill: [undefined],
            marginInPercentageDocumentaryBill: [undefined],
            drawingPowerDocumentaryBill: [undefined],
            InterestRateDocumentaryBill: [undefined],
            loanPaymentDocumentaryBill: [undefined],
            loanExpiryDateDocumentaryBill: [undefined],
            // Overdraft Loan for Working Capital requirement
            ARDaysOverdraftLoan: [undefined],
            drawingPowerOverdraftLoan: [undefined],
            baseRateOverdraftLoan: [undefined],
            premiumRateOverdraftLoan: [undefined],
            interestRateOverdraftLoan: [undefined],
            totalInterestRateOverdraftLoan: [undefined],
            loanExpiryDateOverdraftLoan: [undefined],
            // Mortgage Overdraft/ Other Overdraft/ Equity Mortgaged Overdraft
            drawingPowerMortgageOverdraft: [undefined],
            baseRateMortgageOverdraft: [undefined],
            premiumRateMortgageOverdraft: [undefined],
            interestRateMortgageOverdraft: [undefined],
            totalInterestRateMortgageOverdraft: [undefined],
            loanExpiryDateMortgageOverdraft: [undefined],
            // Overdraft Facility against Fixed Deposit/ Lien on Deposit Account
            nameOfFacilityOverdraftFacility: [undefined],
            nameOfFacilityOverdraftFacilityInEng: [undefined],
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
            baseRateBridgeGap: [undefined],
            premiumRateBridgeGap: [undefined],
            interestRateBridgeGap: [undefined],
            totalInterestRateBridgeGap: [undefined],
            // Bank Guarantee
            SNOfParentLimitBankGuarantee: [undefined],
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

    getLoanName() {
        this.cadOfferLetterApprovedDoc.assignedLoan.forEach(val => {
            const loanName = val.loan.name;
            const loanAmount = val.proposal.proposedLimit;
            const tempLoan = {
                loanName: loanName,
                loanAmount: loanAmount,
                loanAmountNp: this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(loanAmount)),
                loanAmountWords: this.engToNepWord.transform(loanAmount)
            };
            this.loanData.push(tempLoan);
        });
    }

    getFDName() {
        if (!ObjectUtil.isEmpty(this.tempData.overdraftFixedForm)) {
            if (this.tempData.overdraftFixedForm['fdHolderDetails'].length === 1) {
                const temp = this.tempData.overdraftFixedForm['fdHolderDetails'][0].nameOfFDHolderCT;
                this.FDName = temp;
            } else if (this.tempData.overdraftFixedForm['fdHolderDetails'].length === 2) {
                for (let i = 0; i < this.tempData.overdraftFixedForm['fdHolderDetails'].length; i++ ) {
                    const temp = this.tempData.overdraftFixedForm['fdHolderDetails'][i].nameOfFDHolderCT;
                    this.FDNames.push(temp);
                }
                this.allFDNames = this.FDNames.join(' र ');
                this.FDName = this.allFDNames;
            } else {
                for (let i = 0; i < this.tempData.overdraftFixedForm['fdHolderDetails'].length - 1; i++ ) {
                    const temp = this.tempData.overdraftFixedForm['fdHolderDetails'][i].nameOfFDHolderCT;
                    this.FDNames.push(temp);
                }
                this.allFDNames = this.FDNames.join(' , ');
                // tslint:disable-next-line:max-line-length
                const temp1 = this.tempData.overdraftFixedForm['fdHolderDetails'][this.tempData.overdraftFixedForm['fdHolderDetails'].length - 1].nameOfFDHolderCT;
                this.FDName = this.allFDNames + ' र ' + temp1;
            }
        }
    }

    getDepName() {
        if (!ObjectUtil.isEmpty(this.tempData.overdraftFixedForm)) {
            if (this.tempData.overdraftFixedForm['depositorDetails'].length === 1) {
                const temp = this.tempData.overdraftFixedForm['depositorDetails'][0].nameOfDepositorsCT;
                this.DepName = temp;
            } else if (this.tempData.overdraftFixedForm['depositorDetails'].length === 2) {
                for (let i = 0; i < this.tempData.overdraftFixedForm['depositorDetails'].length; i++ ) {
                    const temp = this.tempData.overdraftFixedForm['depositorDetails'][i].nameOfDepositorsCT;
                    this.DepNames.push(temp);
                }
                this.allDepNames = this.DepNames.join(' र ');
                this.DepName = this.allDepNames;
            } else {
                for (let i = 0; i < this.tempData.overdraftFixedForm['depositorDetails'].length - 1; i++ ) {
                    const temp = this.tempData.overdraftFixedForm['depositorDetails'][i].nameOfDepositorsCT;
                    this.DepNames.push(temp);
                }
                this.allDepNames = this.DepNames.join(' , ');
                // tslint:disable-next-line:max-line-length
                const temp1 = this.tempData.overdraftFixedForm['depositorDetails'][this.tempData.overdraftFixedForm['depositorDetails'].length - 1].nameOfDepositorsCT;
                this.DepName = this.allDepNames + ' र ' + temp1;
            }
        }
    }

    getBondName() {
        if (!ObjectUtil.isEmpty(this.tempData.overDraftFacilityForm)) {
            if (this.tempData.overDraftFacilityForm['bondDetails'].length === 1) {
                const temp = this.tempData.overDraftFacilityForm['bondDetails'][0].bondOwnerNameCT;
                this.BondName = temp;
            } else if (this.tempData.overDraftFacilityForm['bondDetails'].length === 2) {
                for (let i = 0; i < this.tempData.overDraftFacilityForm['bondDetails'].length; i++ ) {
                    const temp = this.tempData.overDraftFacilityForm['bondDetails'][i].bondOwnerNameCT;
                    this.BondNames.push(temp);
                }
                this.allBondNames = this.BondNames.join(' र ');
                this.BondName = this.allBondNames;
            } else {
                for (let i = 0; i < this.tempData.overDraftFacilityForm['bondDetails'].length - 1; i++ ) {
                    const temp = this.tempData.overDraftFacilityForm['bondDetails'][i].bondOwnerNameCT;
                    this.BondNames.push(temp);
                }
                this.allBondNames = this.BondNames.join(' , ');
                // tslint:disable-next-line:max-line-length
                const temp1 = this.tempData.overDraftFacilityForm['bondDetails'][this.tempData.overDraftFacilityForm['bondDetails'].length - 1].bondOwnerNameCT;
                this.BondName = this.allBondNames + ' र ' + temp1;
            }
        }
    }

    private checkLoanName(): void {
        if (this.loanData.length > 0) {
            this.loanData.forEach(v => {
                // tslint:disable-next-line:max-line-length
                if (v.loanName === LoanNameConstant.CUSTOMER_ACCEPTANCE_FOR_TIME_LETTER_OF_CREDIT && !ObjectUtil.isEmpty(this.tempData.timeLetterCreditForm)) {
                    this.isCustomerAcceptance = true;
                    this.loanOptionTimeLetter = this.tempData.timeLetterCreditForm.loanOption;
                    if (this.tempData.timeLetterCreditForm.complementryOther === true) {
                        this.complementaryOtherTimeLetter = true;
                    }
                    this.timeLetterCreditFormPatchValue();
                }
                // tslint:disable-next-line:max-line-length
                if (v.loanName === LoanNameConstant.IRREVOCABLE_LETTER_OF_CREDIT_FACILITY && !ObjectUtil.isEmpty(this.tempData.letterOfCreditForm)) {
                    this.isIrrevocableLetter = true;
                    this.loanOptionIrrevocable = this.tempData.letterOfCreditForm.loanOption;
                    this.commissionTypeIrrevocable = this.tempData.letterOfCreditForm.commissionType;
                    if (this.tempData.letterOfCreditForm.complementryOther === true) {
                        this.complementaryOtherIrrevocable = true;
                    }
                    this.irrevocableLetterOfCredit();
                }
                // tslint:disable-next-line:max-line-length
                if (v.loanName === LoanNameConstant.IMPORT_BILLS_DISCOUNTING && !ObjectUtil.isEmpty(this.tempData.importBillsDiscountForm)) {
                    this.isBillDiscounting = true;
                    this.loanOptionBillDiscounting = this.tempData.importBillsDiscountForm.loanOption;
                    if (this.tempData.importBillsDiscountForm.complementryOther === true) {
                        this.complementaryOtherBillDiscounting = true;
                    }
                    this.importBillsDiscountFormPatchValue();
                }
                if (v.loanName === LoanNameConstant.IMPORT_LOAN_TRUST_RECEIPT_LOAN && !ObjectUtil.isEmpty(this.tempData.importLoanTrust)) {
                    this.isLoanTrustReceiptLoan = true;
                    this.loanOptionImportLoanTrust = this.tempData.importLoanTrust.loanOption;
                    this.interestSubsidyAgImportLoanTrust = this.tempData.importLoanTrust.subsidyOrAgricultureLoan;
                    if (this.tempData.importLoanTrust.complementryOther === true) {
                        this.complementaryOtherImportLoanTrust = true;
                    }
                    this.importTrustFormPatchValue();
                }
                if (v.loanName === LoanNameConstant.SHORT_TERM_LOAN && !ObjectUtil.isEmpty(this.tempData.revolvingShortTermLoan)) {
                    this.isRevolvingShortTermLoan = true;
                    this.loanOptionShortTermLoan = this.tempData.revolvingShortTermLoan.loanOption;
                    this.loanRevolvingBasisShortTermLoan = this.tempData.revolvingShortTermLoan.loanRevolvingBasis;
                    this.interestSubsidyAgShortTermLoan = this.tempData.revolvingShortTermLoan.subsidyOrAgricultureLoan;
                    if (this.tempData.revolvingShortTermLoan.complementaryOther === true) {
                        this.complementaryOtherShortTermLoan = true;
                    }
                    if (this.tempData.revolvingShortTermLoan.arFinancing === true) {
                        this.arFinancingShortTermLoan = true;
                    }
                    this.revolvingShortTermFormPatchValue();
                }
                if (v.loanName === LoanNameConstant.DEMAND_LOAN_FOR_WORKING_CAPITAL && !ObjectUtil.isEmpty(this.tempData.demandLoanForm)) {
                    this.isDemandLoanWorkingCapital = true;
                    this.interestSubsidyAgDemandLoan = this.tempData.demandLoanForm.subsidyOrAgricultureLoan;
                    if (this.tempData.demandLoanForm.complementryOther === true) {
                        this.complementaryOtherDemandLoan = true;
                    }
                    if (this.tempData.demandLoanForm.arFinancing === true) {
                        this.arFinancingDemandLoan = true;
                    }
                    this.demandLoanFormPatchValue();
                }
                if (v.loanName === LoanNameConstant.PRE_EXPORT_LOAN && !ObjectUtil.isEmpty(this.tempData.preExportForm)) {
                    this.isPreExportLoan = true;
                    if (this.tempData.preExportForm.complementryOther === true) {
                        this.complementaryOtherPreExportLoan = true;
                    }
                    this.preExportFormPatchValue();
                }
                if (v.loanName === LoanNameConstant.DOCUMENTARY_BILL_PURCHASE_NEGOTIATION &&
                    !ObjectUtil.isEmpty(this.tempData.documentaryBillPurchase)) {
                    this.isDocumentaryBillPurchase = true;
                    if (this.tempData.documentaryBillPurchase.complementryOther === true) {
                        this.complementaryOtherDocumentaryBill = true;
                    }
                    this.documentaryBillPurchaseFormPatchValue();
                }
                if (v.loanName === LoanNameConstant.OVERDRAFT_LOAN_FOR_WORKING_CAPITAL_REQUIREMENT &&
                    !ObjectUtil.isEmpty(this.tempData.overdraftLoanForm)) {
                    this.isOverdraftLoanWorkingCapital = true;
                    this.interestSubsidyAgOverdraftLoanWorking = this.tempData.overdraftLoanForm.subsidyOrAgricultureLoan;
                    if (this.tempData.overdraftLoanForm.arFinancing === true) {
                        this.arFinancingOverdraftLoanWorking = true;
                    }
                    this.overdraftLoanFormPatchValue();
                }
                if (v.loanName === LoanNameConstant.MORTGAGE_OVERDRAFT || v.loanName === LoanNameConstant.EQUITY_MORTGAGED_OVERDRAFT &&
                    !ObjectUtil.isEmpty(this.tempData.equityMortgaged)) {
                    this.isEquityMortgageOverdraft = true;
                    this.loanSubTypeEquityMortgage = this.tempData.equityMortgaged.loanSubType;
                    this.drawingBasisEquityMortgage = this.tempData.equityMortgaged.drawingBasis;
                    this.mortgageTypeEquityMortgage = this.tempData.equityMortgaged.mortgageType;
                    this.interestSubsidyAgEquityMortgage = this.tempData.equityMortgaged.subsidyOrAgricultureLoan;
                    this.equityMortgageFormPatchValue();
                }
                // tslint:disable-next-line:max-line-length
                if (v.loanName === LoanNameConstant.OVERDRAFT_FACILITY_FIXED_DEPOSIT || v.loanName === LoanNameConstant.OVERDRAFT_FACILITY_LIEN_ON_DEPOSIT_ACCOUNT ||
                    v.loanName === LoanNameConstant.STL_AGAINST_FIXED_DEPOSIT ||
                    v.loanName === LoanNameConstant.STL_LIEN_ON_DEPOSIT_ACCOUNT ||
                    v.loanName === LoanNameConstant.DL_AGAINST_FIXED_DEPOSIT ||
                    v.loanName === LoanNameConstant.DL_LIEN_ON_DEPOSIT_ACCOUNT &&
                    !ObjectUtil.isEmpty(this.tempData.overdraftFixedForm)) {
                    this.isOverDraftFacilityFixedDeposit = true;
                    this.subLoanOptionOverdraftFixedForm = this.tempData.overdraftFixedForm.subLoanOption;
                    this.holdingBankOverdraftFixedForm = this.tempData.overdraftFixedForm.holdingBank;
                    this.letterOfSetOffOverdraftFixedForm = this.tempData.overdraftFixedForm.letterOfSetOff;
                    this.interestRateTypeOverdraftFixedForm = this.tempData.overdraftFixedForm.interestRateType;
                    this.interestSubsidyAgOverdraftFixedForm = this.tempData.overdraftFixedForm.subsidyOrAgricultureLoan;
                    this.accountTypeOverdraftFixedForm = this.tempData.overdraftFixedForm.accountType;
                    if (this.tempData.overdraftFixedForm.checkAdditionalPremiumRate === true) {
                        this.checkAdditionalPremiumRateOverdraftFixedForm = true;
                    }
                    this.overdraftFixedFormPatchValue();
                }
                // tslint:disable-next-line:max-line-length
                if (v.loanName === LoanNameConstant.OVERDRAFT_FACILITY_AGAINST_BOND || v.loanName === LoanNameConstant.STL_FACILITY_AGAINST_BOND ||
                    v.loanName === LoanNameConstant.DL_FACILITY_AGAINST_BOND && !ObjectUtil.isEmpty(this.tempData.overDraftFacilityForm)) {
                    this.isOverdraftFacilityAgainstBond = true;
                    this.letterOfSetOffFacilityAgainstBond = this.tempData.overDraftFacilityForm.letterOfSetOffUsed;
                    this.interestSubsidyAgFacilityAgainstBond = this.tempData.overDraftFacilityForm.subsidyOrAgricultureLoan;
                    this.interestRateTypeFacilityAgainstBond = this.tempData.overDraftFacilityForm.interestRateType;
                    this.overDraftFacilityFormPatchValue();
                }
                if (v.loanName === LoanNameConstant.BRIDGE_GAP_LOAN && !ObjectUtil.isEmpty(this.tempData.bridgeGapLoan)) {
                    this.isBridgeGapLoan = true;
                    if (this.tempData.bridgeGapLoan.interestSubsidy === true) {
                        this.interestSubsidyAgBridgeGapLoan = true;
                    }
                    if (this.tempData.bridgeGapLoan.complementryOther === true) {
                        this.complementaryOtherBridgeGapLoan = true;
                    }
                    this.bridgeGapLoanFormPatchValue();
                }
                if (v.loanName === LoanNameConstant.TERM_LOAN_TO_FOR_PURCHASE_OF_VEHICLE) {
                    this.isTermLoanToOrFor = true;
                }
                if (v.loanName === LoanNameConstant.MORTGAGE_TERM_LOAN_EQUITY_MORTGAGE_TERM_LOAN) {
                    this.isEquityMortgageTermLoan = true;
                }
                if (v.loanName === LoanNameConstant.AUTO_LOAN) {
                    this.isAutoLoanMaster = true;
                }
                if (v.loanName === LoanNameConstant.BANK_GUARANTEE && !ObjectUtil.isEmpty(this.tempData.bankGuarantee)) {
                    this.isBankGuarantee = true;
                    this.securityTypeBankGuarantee = this.tempData.bankGuarantee.securityType;
                    this.guaranteeTypeBankGuarantee = this.tempData.bankGuarantee.guaranteeType;
                    this.commissionTypeBankGuarantee = this.tempData.bankGuarantee.commissionType;
                    if (this.tempData.bankGuarantee.complementryOther === true) {
                        this.complementaryOtherBankGuarantee = true;
                    }
                    this.bankGuaranteeFormPatchValue();
                }
                if (v.loanName === LoanNameConstant.BILLS_PURCHASE && !ObjectUtil.isEmpty(this.tempData.billPurchaseForm)) {
                    this.isBillPurchase = true;
                    if (this.tempData.billPurchaseForm.complementryOther === true) {
                        this.complementaryOtherBillPurchase = true;
                    }
                    this.billPurchaseFormPatchValue();
                }
            });
        }
    }

    irrevocableLetterOfCredit() {
        this.form.patchValue({
            // Irrevocable letter of credit facility
            // SNOfParentLimitIrrevocable: [undefined],
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
        });
    }


    timeLetterCreditFormPatchValue() {
        this.form.patchValue({
            // Customer Acceptance for Time Letter of Credit
            // SNOfParentLimitTimeLetter: [undefined],
            // tslint:disable-next-line:max-line-length
            marginInPercentageTimeLetter: this.tempData.timeLetterCreditForm.marginInPercentageCT ? this.tempData.timeLetterCreditForm.marginInPercentageCT : '',
            // tslint:disable-next-line:max-line-length
            commissionRateQuarterlyTimeLetter: this.tempData.timeLetterCreditForm.commissionRateCT ? this.tempData.timeLetterCreditForm.commissionRateCT : '',
            // tslint:disable-next-line:max-line-length
            commissionAmountTimeLetter: this.tempData.timeLetterCreditForm.minimumCommissionAmountCT ? this.tempData.timeLetterCreditForm.minimumCommissionAmountCT : '',
            // tslint:disable-next-line:max-line-length
            loanExpiryDateTimeLetter: this.tempData.timeLetterCreditForm.dateOfExpiryCT ? this.tempData.timeLetterCreditForm.dateOfExpiryCT : '',
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
            // tslint:disable-next-line:max-line-length
            marginInPercentageBillsDiscounting: this.tempData.importBillsDiscountForm.marginInPercentageCT ? this.tempData.importBillsDiscountForm.marginInPercentageCT : '',
            // tslint:disable-next-line:max-line-length
            loanExpiryDateBillsDiscounting: this.tempData.importBillsDiscountForm.dateOfExpiryCT ? this.tempData.importBillsDiscountForm.dateOfExpiryCT : '',

        });
    }

    importTrustFormPatchValue() {
        this.form.patchValue({
            // Import Loan/ Trust Receipt Loan
            loanDaysLoanTrust: this.tempData.importLoanTrust.loanPeriodCT ? this.tempData.importLoanTrust.loanPeriodCT : '',
            loanDaysLoanTrustInEng: this.tempData.importLoanTrust.loanPeriod ? this.tempData.importLoanTrust.loanPeriod : '',
            // SNOfParentLimitLoanTrust: [undefined],
            drawingPowerLoanTrust: this.tempData.importLoanTrust.drawingPowerCT ? this.tempData.importLoanTrust.drawingPowerCT : '',
            baseRateLoanTrust: this.tempData.importLoanTrust.baseRateCT ? this.tempData.importLoanTrust.baseRateCT : '',
            premiumRateLoanTrust: this.tempData.importLoanTrust.premiumRateCT ? this.tempData.importLoanTrust.premiumRateCT : '',
            interestRateLoanTrust: this.tempData.importLoanTrust.interestRateCT ? this.tempData.importLoanTrust.interestRateCT : '',
            totalInterestRateLoanTrust: this.tempData.importLoanTrust.interestRateCT ? this.tempData.importLoanTrust.interestRateCT : '',
            // remainDaysLoanTrust: [undefined],
            loanExpiryDateLoanTrust: this.tempData.importLoanTrust.dateOfExpiryCT ? this.tempData.importLoanTrust.dateOfExpiryCT : '',
        });
    }

    revolvingShortTermFormPatchValue() {
        this.form.patchValue({
            // Revolving/One off basis Short Term Loan
            // tslint:disable-next-line:max-line-length
            loanDaysShortTermLoan: this.tempData.revolvingShortTermLoan.loanRevolvingPeriodCT ? this.tempData.revolvingShortTermLoan.loanRevolvingPeriodCT : '',
            // tslint:disable-next-line:max-line-length
            loanDaysShortTermLoanInEng: this.tempData.revolvingShortTermLoan.loanRevolvingPeriod ? this.tempData.revolvingShortTermLoan.loanRevolvingPeriod : '',
            // SNOfParentLimitShortTermLoan: [undefined],
            // tslint:disable-next-line:max-line-length
            loanMonthsShortTermLoan: this.tempData.revolvingShortTermLoan.loanRevolvingPeriodCT ? this.tempData.revolvingShortTermLoan.loanRevolvingPeriodCT : '',
            // tslint:disable-next-line:max-line-length
            loanMonthsShortTermLoanInEng: this.tempData.revolvingShortTermLoan.loanRevolvingPeriod ? this.tempData.revolvingShortTermLoan.loanRevolvingPeriod : '',
            ARDaysShortTermLoan: this.tempData.revolvingShortTermLoan.arDaysCT ? this.tempData.revolvingShortTermLoan.arDaysCT : '',
            // tslint:disable-next-line:max-line-length
            drawingPowerShortTermLoan: this.tempData.revolvingShortTermLoan.drawingPowerCT ? this.tempData.revolvingShortTermLoan.drawingPowerCT : '',
            baseRateShortTermLoan: this.tempData.revolvingShortTermLoan.baseRateCT ? this.tempData.revolvingShortTermLoan.baseRateCT : '',
            // tslint:disable-next-line:max-line-length
            premiumRateShortTermLoan: this.tempData.revolvingShortTermLoan.premiumRateCT ? this.tempData.revolvingShortTermLoan.premiumRateCT : '',
            // tslint:disable-next-line:max-line-length
            interestRateShortTermLoan: this.tempData.revolvingShortTermLoan.interestRateCT ? this.tempData.revolvingShortTermLoan.interestRateCT : '',
            // tslint:disable-next-line:max-line-length
            totalInterestRateShortTermLoan: this.tempData.revolvingShortTermLoan.interestRateCT ? this.tempData.revolvingShortTermLoan.interestRateCT : '',
            // tslint:disable-next-line:max-line-length
            loanExpiryDateShortTermLoan: this.tempData.revolvingShortTermLoan.dateOfExpiryCT ? this.tempData.revolvingShortTermLoan.dateOfExpiryCT : '',
        });
    }

    demandLoanFormPatchValue() {
        this.form.patchValue({
            // Demand Loan for working capital
            SNOfParentLimitDemandLoan: [undefined],
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
            drawingPower1PreExport: this.tempData.preExportForm.drawingPowerCT ? this.tempData.preExportForm.drawingPowerCT : '',
            drawingPower2PreExport: this.tempData.preExportForm.drawingPowerCT ? this.tempData.preExportForm.drawingPowerCT : '',
            loanExpiryDatePreExport: this.tempData.preExportForm.dateOfExpiryCT ? this.tempData.preExportForm.dateOfExpiryCT : '',
        });
    }

    documentaryBillPurchaseFormPatchValue() {
        this.form.patchValue({
            // Documentary Bill Purchase/Negotiation
            // SNOfParentLimitDocumentaryBill: [undefined],
            // tslint:disable-next-line:max-line-length
            marginInPercentageDocumentaryBill: this.tempData.documentaryBillPurchase.marginInPercentageCT ? this.tempData.documentaryBillPurchase.marginInPercentageCT : '',
            // tslint:disable-next-line:max-line-length
            drawingPowerDocumentaryBill: this.tempData.documentaryBillPurchase.drawingPowerCT ? this.tempData.documentaryBillPurchase.drawingPowerCT : '',
            // tslint:disable-next-line:max-line-length
            loanExpiryDateDocumentaryBill: this.tempData.documentaryBillPurchase.dateOfExpiryCT ? this.tempData.documentaryBillPurchase.dateOfExpiryCT : '',
        });
    }

    overdraftLoanFormPatchValue() {
        this.form.patchValue({
            // Overdraft Loan for Working Capital requirement
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
            // tslint:disable-next-line:max-line-length
            drawingPowerMortgageOverdraft: this.tempData.equityMortgaged.drawingPowerCT ? this.tempData.equityMortgaged.drawingPowerCT : '',
            baseRateMortgageOverdraft: this.tempData.equityMortgaged.baseRateCT ? this.tempData.equityMortgaged.baseRateCT : '',
            premiumRateMortgageOverdraft: this.tempData.equityMortgaged.premiumRateCT ? this.tempData.equityMortgaged.premiumRateCT : '',
            // tslint:disable-next-line:max-line-length
            interestRateMortgageOverdraft: this.tempData.equityMortgaged.interestRateCT ? this.tempData.equityMortgaged.interestRateCT : '',
            // tslint:disable-next-line:max-line-length
            totalInterestRateMortgageOverdraft: this.tempData.equityMortgaged.interestRateCT ? this.tempData.equityMortgaged.interestRateCT : '',
            // tslint:disable-next-line:max-line-length
            loanExpiryDateMortgageOverdraft: this.tempData.equityMortgaged.dateOfExpiryCT ? this.tempData.equityMortgaged.dateOfExpiryCT : '',
        });
    }

    overdraftFixedFormPatchValue() {
        this.form.patchValue({
            // Overdraft Facility against Fixed Deposit/ Lien on Deposit Account
            // tslint:disable-next-line:max-line-length
            nameOfFacilityOverdraftFacility: this.tempData.overdraftFixedForm.nameOfFacilityCT ? this.tempData.overdraftFixedForm.nameOfFacilityCT : '',
            // tslint:disable-next-line:max-line-length
            nameOfFacilityOverdraftFacilityInEng: this.tempData.overdraftFixedForm.nameOfFacility ? this.tempData.overdraftFixedForm.nameOfFacility : '',
            // tslint:disable-next-line:max-line-length
            nameOfFDHolderOverdraftFacility: this.FDName ? this.FDName : '',
            // tslint:disable-next-line:max-line-length
            FDAmountOverdraftFacility: this.tempData.overdraftFixedForm.FdAmountInFigureCT ? this.tempData.overdraftFixedForm.FdAmountInFigureCT : '',
            // tslint:disable-next-line:max-line-length
            nameOfBankOverdraftFacility: this.tempData.overdraftFixedForm.nameOfHoldingBankCT ? this.tempData.overdraftFixedForm.nameOfHoldingBankCT : '',
            // tslint:disable-next-line:max-line-length
            nameOfDepositorOverdraftFacility: this.DepName ? this.DepName : '',
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
            // tslint:disable-next-line:max-line-length
            ownerNameAgainstBond: this.BondName ? this.BondName : '',
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
            baseRateBridgeGap: this.tempData.bridgeGapLoan.baseRateCT ? this.tempData.bridgeGapLoan.baseRateCT : '',
            premiumRateBridgeGap: this.tempData.bridgeGapLoan.premiumRateCT ? this.tempData.bridgeGapLoan.premiumRateCT : '',
            interestRateBridgeGap: this.tempData.bridgeGapLoan.interestRateCT ? this.tempData.bridgeGapLoan.interestRateCT : '',
            // tslint:disable-next-line:max-line-length
            totalInterestRateBridgeGap: this.tempData.bridgeGapLoan.totalInterestRateCT ? this.tempData.bridgeGapLoan.totalInterestRateCT : '',
        });
    }

    bankGuaranteeFormPatchValue() {
        this.form.patchValue({
            // Bank Guarantee
            // SNOfParentLimitBankGuarantee: [undefined],
            // tslint:disable-next-line:max-line-length
            nameOfBankBankGuarantee: this.tempData.bankGuarantee.nameOfHoldingBankCT ? this.tempData.bankGuarantee.nameOfHoldingBankCT : '',
            // tslint:disable-next-line:max-line-length
            marginInPercentageBankGuarantee: this.tempData.bankGuarantee.marginInPercentageCT ? this.tempData.bankGuarantee.marginInPercentageCT : '',
            // tslint:disable-next-line:max-line-length
            commissionAPGBankGuarantee: this.tempData.bankGuarantee.commissionInPercentageAPGCT ? this.tempData.bankGuarantee.commissionInPercentageAPGCT : '',
            // tslint:disable-next-line:max-line-length
            commissionBidBondBankGuarantee: this.tempData.bankGuarantee.commissionInPercentageBidBondCT ? this.tempData.bankGuarantee.commissionInPercentageBidBondCT : '',
            // tslint:disable-next-line:max-line-length
            serviceChargeBankGuarantee: this.tempData.bankGuarantee.serviceChargeInPercentCT ? this.tempData.bankGuarantee.serviceChargeInPercentCT : '',
            // tslint:disable-next-line:max-line-length
            minimumServiceChargeBankGuarantee: this.tempData.bankGuarantee.minServiceChargeInFigure1CT ? this.tempData.bankGuarantee.minServiceChargeInFigure1CT : '',
            // tslint:disable-next-line:max-line-length
            commissionAPG1BankGuarantee: this.tempData.bankGuarantee.commissionInPercentage2APGCT ? this.tempData.bankGuarantee.commissionInPercentage2APGCT : '',
            // tslint:disable-next-line:max-line-length
            commissionBidBond1BankGuarantee: this.tempData.bankGuarantee.commissionInPercentage2BidBondCT ? this.tempData.bankGuarantee.commissionInPercentage2BidBondCT : '',
            loanExpiryDateBankGuarantee1: this.tempData.bankGuarantee.dateOfExpiryCT ? this.tempData.bankGuarantee.dateOfExpiryCT : '',
        });
    }

    billPurchaseFormPatchValue() {
        this.form.patchValue({
            // Bills Purchase
            // SNOfParentLimitBillsPurchase: [undefined],
            // tslint:disable-next-line:max-line-length
            marginInPercentageBillsPurchase: this.tempData.billPurchaseForm.marginInPercentageCT ? this.tempData.billPurchaseForm.marginInPercentageCT : '',
            commissionBillsPurchase: this.tempData.billPurchaseForm.commissionCT ? this.tempData.billPurchaseForm.commissionCT : '',
            // tslint:disable-next-line:max-line-length
            commissionAmountBillsPurchase: this.tempData.billPurchaseForm.minCommissionAmountInFigCT ? this.tempData.billPurchaseForm.minCommissionAmountInFigCT : '',
            loanExpiryDateBillsPurchase: this.tempData.billPurchaseForm.dateOfExpiryCT ? this.tempData.billPurchaseForm.dateOfExpiryCT : '',
        });
    }

    setTextAreaValue() {
        // const tempTermLoanFreeVal = this.termLoanToOrForComponent.setFreeTextTermLoan();
        // const tempAutoLoanFreeVal = this.autoLoanComponent.setFreeTextAutoLoan();
        // const tempMortgageEquity = this.mortgageEquityTermLoanComponent.setFreeTextMortgage();
        this.freeTextVal = {
            loanExpiryIrrevocable: this.form.get('loanExpiryDateIrrevocable2').value ? this.form.get('loanExpiryDateIrrevocable2').value : '',
            loanExpiryTimeLetter: this.form.get('loanExpiryDateTimeLetter2').value ? this.form.get('loanExpiryDateTimeLetter2').value : '',
            freeText1: this.form.get('freeTextOne').value ? this.form.get('freeTextOne').value : '',
            freeText2: this.form.get('freeTextTwo').value ? this.form.get('freeTextTwo').value : '',
            remainingDaysShortTerms: this.form.get('remainDaysShortTermLoan').value ? this.form.get('remainDaysShortTermLoan').value : '',
            freeText3: this.form.get('freeTextThree').value ? this.form.get('freeTextThree').value : '',
            freeText4: this.form.get('freeTextFour').value ? this.form.get('freeTextFour').value : '',
            freeText5: this.form.get('freeTextFive').value ? this.form.get('freeTextFive').value : '',
            SulkaPreExport: this.form.get('sulkaPreExport').value ? this.form.get('sulkaPreExport').value : '',
            interestRatePre: this.form.get('interestRatePreExport').value ? this.form.get('interestRatePreExport').value : '',
            // tslint:disable-next-line:max-line-length
            interestRateDocumentary: this.form.get('InterestRateDocumentaryBill').value ? this.form.get('InterestRateDocumentaryBill').value : '',
            // tslint:disable-next-line:max-line-length
            loanPaymentDocumentary: this.form.get('loanPaymentDocumentaryBill').value ? this.form.get('loanPaymentDocumentaryBill').value : '',
            freeText6: this.form.get('freeTextSix').value ? this.form.get('freeTextSix').value : '',
            freeText7: this.form.get('freeTextSeven').value ? this.form.get('freeTextSeven').value : '',
            freeText8: this.form.get('freeTextEight').value ? this.form.get('freeTextEight').value : '',
            freeText9: this.form.get('freeTextNine').value ? this.form.get('freeTextNine').value : '',
            // freeText10: tempTermLoanFreeVal.freeText10,
            // freeText11: tempTermLoanFreeVal.freeText11,
            // freeText12: tempTermLoanFreeVal.freeText12,
            // freeText13: tempMortgageEquity.freeText13,
            // freeText14: tempAutoLoanFreeVal.freeText14,
            freeText15: this.form.get('freeTextFifteen').value ? this.form.get('freeTextFifteen').value : '',
            freeText16: this.form.get('freeTextSixteen').value ? this.form.get('freeTextSixteen').value : '',
            snOfFacility: this.form.get('SNOfFacility').value ? this.form.get('SNOfFacility').value : '',
        };
        return this.freeTextVal;
    }

    setFreeText() {
        this.form.patchValue({
            freeTextOne: this.tempInformation.section2.freeText1 ? this.tempInformation.section2.freeText1 : '',
            freeTextTwo: this.tempInformation.section2.freeText2 ? this.tempInformation.section2.freeText2 : '',
            freeTextThree: this.tempInformation.section2.freeText3 ? this.tempInformation.section2.freeText3 : '',
            freeTextFour: this.tempInformation.section2.freeText4 ? this.tempInformation.section2.freeText4 : '',
            freeTextFive: this.tempInformation.section2.freeText5 ? this.tempInformation.section2.freeText5 : '',
            freeTextSix: this.tempInformation.section2.freeText6 ? this.tempInformation.section2.freeText6 : '',
            freeTextSeven: this.tempInformation.section2.freeText7 ? this.tempInformation.section2.freeText7 : '',
            freeTextEight: this.tempInformation.section2.freeText8 ? this.tempInformation.section2.freeText8 : '',
            freeTextNine: this.tempInformation.section2.freeText9 ? this.tempInformation.section2.freeText9 : '',
            freeTextFifteen: this.tempInformation.section2.freeText15 ? this.tempInformation.section2.freeText15 : '',
            freeTextSixteen: this.tempInformation.section2.freeText16 ? this.tempInformation.section2.freeText16 : '',
            // tslint:disable-next-line:max-line-length
            loanExpiryDateIrrevocable2: this.tempInformation.section2.loanExpiryIrrevocable ? this.tempInformation.section2.loanExpiryIrrevocable : '',
            // tslint:disable-next-line:max-line-length
            loanExpiryDateTimeLetter2: this.tempInformation.section2.loanExpiryTimeLetter ? this.tempInformation.section2.loanExpiryTimeLetter : '',
            // tslint:disable-next-line:max-line-length
            remainDaysShortTermLoan: this.tempInformation.section2.remainingDaysShortTerms ? this.tempInformation.section2.remainingDaysShortTerms : '',
            interestRatePreExport: this.tempInformation.section2.interestRatePre ? this.tempInformation.section2.interestRatePre : '',
            sulkaPreExport: this.tempInformation.section2.SulkaPreExport ? this.tempInformation.section2.SulkaPreExport : '',
            // tslint:disable-next-line:max-line-length
            InterestRateDocumentaryBill: this.tempInformation.section2.interestRateDocumentary ? this.tempInformation.section2.interestRateDocumentary : '',
            // tslint:disable-next-line:max-line-length
            loanPaymentDocumentaryBill: this.tempInformation.section2.loanPaymentDocumentary ? this.tempInformation.section2.loanPaymentDocumentary : '',
            SNOfFacility: this.tempInformation.section2.snOfFacility ? this.tempInformation.section2.snOfFacility : '',
        });
    }
}
