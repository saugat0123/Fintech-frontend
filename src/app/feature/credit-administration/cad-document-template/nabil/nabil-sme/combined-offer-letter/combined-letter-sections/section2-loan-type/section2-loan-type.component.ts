import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormArray} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';
import {NepaliCurrencyWordPipe} from '../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {TermLoanToOrForComponent} from './term-loan-to-or-for/term-loan-to-or-for.component';
import {MortgageEquityTermLoanComponent} from './mortgage-equity-term-loan/mortgage-equity-term-loan.component';
import {AutoLoanComponent} from './auto-loan/auto-loan.component';
import {LoanNameConstant} from '../../../../../../cad-view/template-data/nabil-sme-template-data/sme-costant/loan-name-constant';
import {CurrencyFormatterPipe} from '../../../../../../../../@core/pipe/currency-formatter.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';

// @ts-ignore
@Component({
    selector: 'app-section2-loan-type',
    templateUrl: './section2-loan-type.component.html',
    styleUrls: ['./section2-loan-type.component.scss']
})
export class Section2LoanTypeComponent implements OnInit {
    @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
    form: FormGroup;
    initialData;
    tempData;
    tempInformation;
    loanData = [];
    freeTextVal: any = {};
    termLoanFreeText = [];
    @ViewChild('termLoanToOrForComponent', {static: false}) termLoanToOrForComponent: TermLoanToOrForComponent;
    @ViewChild('mortgageEquityTermLoanComponent', {static: false}) mortgageEquityTermLoanComponent: MortgageEquityTermLoanComponent;
    @ViewChild('autoLoanComponent', {static: false}) autoLoanComponent: AutoLoanComponent;
    FDName;
    DepName;
    BondName;
    finalBondName = [];
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
    issubsidyOrAgricultureLoan;
    // Irrevocable letter of credit facility
    loanOptionIrrevocable;
    commissionTypeIrrevocable;
    complementaryOtherIrrevocable = false;
    complementaryOtherIrrevocableTeName;
    // Customer Acceptance for Time Letter of Credit
    loanOptionTimeLetter;
    complementaryOtherTimeLetter = false;
    complementaryOtherTimeLetterName;
    // Import Bills Discounting
    loanOptionBillDiscounting;
    complementaryOtherBillDiscounting = false;
    complementaryOtherBillDiscountingName;
    // Import Loan/ Trust Receipt Loan
    loanOptionImportLoanTrust;
    complementaryOtherImportLoanTrust = false;
    complementaryOtherImportLoanTrustName;
    interestSubsidyAgImportLoanTrust;
    // Revolving/One off basis Short Term Loan
    loanRevolvingBasisShortTermLoan;
    loanOptionShortTermLoan;
    complementaryOtherShortTermLoan = false;
    complementaryOtherShortTermLoanName;
    arFinancing = false;
    interestSubsidyAgShortTermLoan;
    // Demand Loan for working capital
    complementaryOtherDemandLoan = false;
    complementaryOtherDemandLoanName;
    arFinancingDemandLoan = false;
    interestSubsidyAgDemandLoan;
    // Pre- Export Loan
    complementaryOtherPreExportLoan = false;
    complementaryOtherPreExportLoanName;
    // Documentary Bill Purchase/Negotiation
    complementaryOtherDocumentaryBill = false;
    complementaryOtherDocumentaryBillName;
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
    complementaryOtherBridgeGapLoanName;
    interestSubsidyAgBridgeGapLoan = false;
    // Bank Guarantee
    complementaryOtherBankGuarantee = false;
    complementaryOtherBankGuaranteeName;
    securityTypeBankGuarantee;
    guaranteeTypeBankGuarantee;
    commissionTypeBankGuarantee;
    // Bills Purchase
    complementaryOtherBillPurchase = false;
    complementaryOtherBillPurchaseName;
    autoLoanDetails = [];
    termLoanDetails = [];
    finalLoanDetails = [];
    overdraftAgainstBond = [];
    autoLoanData;
    termLoanData;
    temp;
    documentaryBillPurchase = [];
    documentaryFreeText: Array<any> = new Array<any>();
    billsPurchase = [];
    billPurchaseFreeText: Array<any> = new Array<any>();
    equityMortgageOverdraft = [];
    mortgageOverdraft = [];
    importBillsDiscounting = [];
    importBillsFreeText: Array<any> = new Array<any>();
    irrevocableLetter = [];
    irrevocableLetterOfCreditFreeText: Array<any> = new Array<any>();
    importLoanTrustReceipt = [];
    importLoanTrustReceiptFreeText: Array<any> = new Array<any>();
    revolvingShortTerm = [];
    revolvingShortTermFreeText: Array<any> = new Array<any>();
    customerAccentanceLetterOfCredit = [];
    customerAccentanceLetterOfCreditFreeText: Array<any> = new Array<any>();
    demandLoan = [];
    demandLoanFreeText: Array<any> = new Array<any>();
    bridgeGap = [];
    bridgeGapLoanFreeText: Array<any> = new Array<any>();
    overdraftLoanForWorkingCapitalLoan = [];
    preExportLoan = [];
    preExportLoanFreeText: Array <any> = new Array<any>();

    constructor(private formBuilder: FormBuilder,
                private engToNepWord: NepaliCurrencyWordPipe,
                private currencyFormatPipe: CurrencyFormatterPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
    ) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
            this.initialData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
        }
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
            this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
            this.tempInformation = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation);
            this.hypothecationGlobal = this.tempData.smeGlobalForm.hypothecation;
            this.arFinancing = this.tempData.smeGlobalForm.arFinancing;
            if (!ObjectUtil.isEmpty(this.tempData)) {
                this.autoLoanData = !ObjectUtil.isEmpty(this.tempData.autoLoanMasterForm) ?
                    this.tempData.autoLoanMasterForm.autoLoanFormArray : [];
                this.termLoanData = !ObjectUtil.isEmpty(this.tempData.termLoanForm) ?
                    this.tempData.termLoanForm.termLoanDetails : [];
            }
            this.getFDName();
            this.getDepName();
            this.getBondName();
            this.getLoanName();
            this.checkLoanName();
            this.setFreeText();
        }
        console.log('Temp Data:', this.tempData);
        console.log('Free Information:', this.tempInformation);
        this.issubsidyOrAgricultureLoan = this.tempData.smeGlobalForm.subsidyOrAgricultureLoan;
    }

    buildForm() {
        this.form = this.formBuilder.group({
            // Irrevocable letter of credit facility
            irrevocableLetterOfCredit: this.formBuilder.array([]),

            // Customer Acceptance for Time Letter of Credit
            customerAcceptanceLetterOfCredit: this.formBuilder.array([]),

            // Import Bills Discounting
            importBillsDiscounting: this.formBuilder.array([]),

            // Import Loan/ Trust Receipt Loan
            importLoanTrustReceiptLoan: this.formBuilder.array([]),

            // Revolving/One off basis Short Term Loan
            revolvingShortTermLoan: this.formBuilder.array([]),

            // Demand Loan for working capital
            demandLoan: this.formBuilder.array([]),

            // Pre-Export Loan
            preExportLoan: this.formBuilder.array([]),

            // Documentary Bill Purchase/Negotiation
            documentaryBillPurchaseNegotiation: this.formBuilder.array([]),

            // Overdraft Loan for Working Capital requirement
            overdraftLoanForWorkingCapital: this.formBuilder.array([]),

            // Mortgage Overdraft/ Other Overdraft/ Equity Mortgaged Overdraft
            equityMortgageOverdraft: this.formBuilder.array([]),
            mortgageOverdraft: this.formBuilder.array([]),

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
            overdraftFacilityAgainstBond: this.formBuilder.array([]),

            // Bridge Gap Loan
            bridgeGapLoan: this.formBuilder.array([]),

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
            billsPurchase: this.formBuilder.array([]),

            // other Input Fields
            SNOfFacility: [undefined],
            freeTextSixteen: [undefined],
        });
        this.setOverdraftFacilityAgainstBond();
        this.setDocumentaryBillPurchaseNegotiation();
        this.setBillsPurchase();
        this.setEquityMortgageOverdraft();
        this.setMortgageOverdraft();
        this.setImportBillsDiscounting();
        this.setIrrevocableLetterOfCredit();
        this.setImportLoanTrustReceiptLoan();
        this.setRevolvingShortTermLoan();
        this.customerAcceptanceLetterOfCredit();
        this.demandLoanWorkingCapital();
        this.bridgeGapLoan();
        this.overdraftLoanForWorkingCapital();
        this.preExportLoanForm();
    }
    preExportLoanForm() {
        if (!ObjectUtil.isEmpty(this.initialData) &&
            !ObjectUtil.isEmpty(this.initialData.preExportForm) &&
            !ObjectUtil.isEmpty(this.initialData.preExportForm.termLoanDetails)) {
            for (let a = 0; a < this.initialData.preExportForm.termLoanDetails.length; a++) {
                (this.form.get('preExportLoan') as FormArray).push(this.setPreExportLoanForm());
            }
        }
    }
    overdraftLoanForWorkingCapital() {
        if (!ObjectUtil.isEmpty(this.initialData) &&
            !ObjectUtil.isEmpty(this.initialData.overdraftLoanForm) &&
            !ObjectUtil.isEmpty(this.initialData.overdraftLoanForm.overdraftLoanFormArray)) {
            for (let a = 0; a < this.initialData.overdraftLoanForm.overdraftLoanFormArray.length; a++) {
                (this.form.get('overdraftLoanForWorkingCapital') as FormArray).push(this.setOverdraftLoanForWorkingCapitalForm());
            }
        }
    }
    bridgeGapLoan() {
        if (!ObjectUtil.isEmpty(this.initialData) &&
            !ObjectUtil.isEmpty(this.initialData.bridgeGapLoan) &&
            !ObjectUtil.isEmpty(this.initialData.bridgeGapLoan.bridgeGapDetails)) {
            for (let a = 0; a < this.initialData.bridgeGapLoan.bridgeGapDetails.length; a++) {
                (this.form.get('bridgeGapLoan') as FormArray).push(this.setBridgeGapLoanForm());
            }
        }
    }
    demandLoanWorkingCapital() {
        if (!ObjectUtil.isEmpty(this.initialData) &&
            !ObjectUtil.isEmpty(this.initialData.demandLoanForm) &&
            !ObjectUtil.isEmpty(this.initialData.demandLoanForm.demandLoanFormArray)) {
            for (let a = 0; a < this.initialData.demandLoanForm.demandLoanFormArray.length; a++) {
                (this.form.get('demandLoan') as FormArray).push(this.setDemandLoanForm());
            }
        }
    }
    customerAcceptanceLetterOfCredit() {
        if (!ObjectUtil.isEmpty(this.initialData) &&
            !ObjectUtil.isEmpty(this.initialData.timeLetterCreditForm) &&
            !ObjectUtil.isEmpty(this.initialData.timeLetterCreditForm.timeLetterCreditFormArray)) {
            for (let a = 0; a < this.initialData.timeLetterCreditForm.timeLetterCreditFormArray.length; a++) {
                (this.form.get('customerAcceptanceLetterOfCredit') as FormArray).push(this.setCustomerAcceptanceLetterOfCreditForm());
            }
        }
    }
    setRevolvingShortTermLoan() {
        if (!ObjectUtil.isEmpty(this.initialData) &&
            !ObjectUtil.isEmpty(this.initialData.revolvingShortTermLoan) &&
            !ObjectUtil.isEmpty(this.initialData.revolvingShortTermLoan.revolvingShortTermLoanFormArray)) {
            for (let a = 0; a < this.initialData.revolvingShortTermLoan.revolvingShortTermLoanFormArray.length; a++) {
                (this.form.get('revolvingShortTermLoan') as FormArray).push(this.setRevolvingShortTermLoanForm());
            }
        }
    }
    setImportLoanTrustReceiptLoan() {
        if (!ObjectUtil.isEmpty(this.initialData) &&
            !ObjectUtil.isEmpty(this.initialData.importLoanTrust) &&
            !ObjectUtil.isEmpty(this.initialData.importLoanTrust.importLoanTrustFormArray)) {
            for (let a = 0; a < this.initialData.importLoanTrust.importLoanTrustFormArray.length; a++) {
                (this.form.get('importLoanTrustReceiptLoan') as FormArray).push(this.setImportLoanTrustReceiptLoanForm());
            }
        }
    }
    setIrrevocableLetterOfCredit() {
        if (!ObjectUtil.isEmpty(this.initialData) &&
            !ObjectUtil.isEmpty(this.initialData.letterOfCreditForm) &&
            !ObjectUtil.isEmpty(this.initialData.letterOfCreditForm.letterOfCreditFormArray)) {
            for (let a = 0; a < this.initialData.letterOfCreditForm.letterOfCreditFormArray.length; a++) {
                (this.form.get('irrevocableLetterOfCredit') as FormArray).push(this.setIrrevocableLetterOfCreditForm());
            }
        }
    }
    setImportBillsDiscounting() {
        if (!ObjectUtil.isEmpty(this.initialData) &&
            !ObjectUtil.isEmpty(this.initialData.importBillsDiscountForm) &&
            !ObjectUtil.isEmpty(this.initialData.importBillsDiscountForm.importBillsDiscountFormArray)) {
            for (let a = 0; a < this.initialData.importBillsDiscountForm.importBillsDiscountFormArray.length; a++) {
                (this.form.get('importBillsDiscounting') as FormArray).push(this.setImportBillsDiscountForm());
            }
        }
    }
    setMortgageOverdraft() {
        if (!ObjectUtil.isEmpty(this.initialData) &&
            !ObjectUtil.isEmpty(this.initialData.equityMortgaged) &&
            !ObjectUtil.isEmpty(this.initialData.equityMortgaged.mortgageOverdraftFormArray)) {
            for (let a = 0; a < this.initialData.equityMortgaged.mortgageOverdraftFormArray.length; a++) {
                (this.form.get('mortgageOverdraft') as FormArray).push(this.setEquityMortgageOverdraftForm());
            }
        }
    }
    setEquityMortgageOverdraft() {
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
            this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
        }
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.equityMortgaged) &&
            !ObjectUtil.isEmpty(this.tempData.equityMortgaged.equityMortgagedFormArray)) {
            for (let a = 0; a < this.tempData.equityMortgaged.equityMortgagedFormArray.length; a++) {
                (this.form.get('equityMortgageOverdraft') as FormArray).push(this.setEquityMortgageOverdraftForm());
            }
        }
    }
    setBillsPurchase() {
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
            this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
        }
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.billPurchaseForm) &&
            !ObjectUtil.isEmpty(this.tempData.billPurchaseForm.billPurchaseFormArray)) {
            for (let a = 0; a < this.tempData.billPurchaseForm.billPurchaseFormArray.length; a++) {
                (this.form.get('billsPurchase') as FormArray).push(this.setBillsPurchaseForm());
            }
        }
    }
    setDocumentaryBillPurchaseNegotiation() {
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
            this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
        }
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.documentaryBillPurchase) &&
            !ObjectUtil.isEmpty(this.tempData.documentaryBillPurchase.documentaryBillPurchaseFormArray)) {
            for (let a = 0; a < this.tempData.documentaryBillPurchase.documentaryBillPurchaseFormArray.length; a++) {
                (this.form.get('documentaryBillPurchaseNegotiation') as FormArray).push(this.setDocumentaryBillPurchaseForm());
            }
        }
    }
    setOverdraftFacilityAgainstBond() {
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
            this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
        }
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.overDraftFacilityForm) &&
            !ObjectUtil.isEmpty(this.tempData.overDraftFacilityForm.overdraftFacilityDetails)) {
            for (let a = 0; a < this.tempData.overDraftFacilityForm.overdraftFacilityDetails.length; a++) {
                (this.form.get('overdraftFacilityAgainstBond') as FormArray).push(this.setOverdraftBondForm());
            }
        }
    }
    setPreExportLoanForm() {
        return this.formBuilder.group({
            SNOfParentLimitPreExport: [undefined],
            drawingPower1PreExport: [undefined],
            drawingPower2PreExport: [undefined],
            sulkaPreExport: [undefined],
            interestRatePreExport: [undefined],
            loanExpiryDatePreExport: [undefined],
            freeTextFour: [undefined],
            freeTextFive: [undefined],
        });
    }
    setOverdraftLoanForWorkingCapitalForm() {
        return this.formBuilder.group({
            ARDaysOverdraftLoan: [undefined],
            drawingPowerOverdraftLoan: [undefined],
            baseRateOverdraftLoan: [undefined],
            premiumRateOverdraftLoan: [undefined],
            interestRateOverdraftLoan: [undefined],
            totalInterestRateOverdraftLoan: [undefined],
            loanExpiryDateOverdraftLoan: [undefined],
        });
    }
    setBridgeGapLoanForm() {
        return this.formBuilder.group({
            SNOfParentLimitBridgeGap: [undefined],
            baseRateBridgeGap: [undefined],
            premiumRateBridgeGap: [undefined],
            interestRateBridgeGap: [undefined],
            totalInterestRateBridgeGap: [undefined],
            freeTextSix: [undefined],
            freeTextSeven: [undefined],
            freeTextEight: [undefined],
            freeTextNine: [undefined],
        });
    }
    setDemandLoanForm() {
        return this.formBuilder.group({
            SNOfParentLimitDemandLoan: [undefined],
            ARDaysDemandLoan: [undefined],
            drawingPowerDemandLoan: [undefined],
            baseRateDemandLoan: [undefined],
            premiumRateDemandLoan: [undefined],
            interestRateDemandLoan: [undefined],
            totalInterestRateDemandLoan: [undefined],
            loanExpiryDateDemandLoan: [undefined],
        });
    }
    setCustomerAcceptanceLetterOfCreditForm() {
        return this.formBuilder.group({
            marginInPercentageTimeLetter: [undefined],
            commissionRateQuarterlyTimeLetter: [undefined],
            commissionAmountTimeLetter: [undefined],
            loanExpiryDateTimeLetter: [undefined],
            SNOfParentLimitTimeLetter: [undefined],
            loanExpiryDateTimeLetter2: [undefined],
        });
    }
    setRevolvingShortTermLoanForm() {
        return this.formBuilder.group({
            loanDaysShortTermLoan: [undefined],
            loanDaysShortTermLoanInEng: [undefined],
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
            SNOfParentLimitShortTermLoan: [undefined],
            freeTextThree: [undefined],
        });
    }
    setImportLoanTrustReceiptLoanForm() {
        return this.formBuilder.group({
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
            freeTextTwo: [undefined]
        });
    }
    setIrrevocableLetterOfCreditForm() {
        return this.formBuilder.group({
            SNOfParentLimitIrrevocable: [undefined],
            marginInPercentageIrrevocable: [undefined],
            commissionRateIrrevocable: [undefined],
            commissionAmountIrrevocable: [undefined],
            commissionRateForFirstQuarterIrrevocable: [undefined],
            commissionRateForOtherQuarterIrrevocable: [undefined],
            loanExpiryDateIrrevocable: [undefined],
            loanExpiryDateIrrevocable2: [undefined]
        });
    }
    setImportBillsDiscountForm() {
        return this.formBuilder.group({
            loanDaysBillsDiscounting: [undefined],
            loanDaysBillsDiscountingInEng: [undefined],
            marginInPercentageBillsDiscounting: [undefined],
            loanExpiryDateBillsDiscounting: [undefined],
            SNOfParentLimitBillsDiscounting: [undefined],
            freeTextOne: [undefined]
        });
    }
    setEquityMortgageOverdraftForm() {
        return this.formBuilder.group({
            drawingPowerMortgageOverdraft: [undefined],
            baseRateMortgageOverdraft: [undefined],
            premiumRateMortgageOverdraft: [undefined],
            interestRateMortgageOverdraft: [undefined],
            totalInterestRateMortgageOverdraft: [undefined],
            loanExpiryDateMortgageOverdraft: [undefined],
        });
    }
    setBillsPurchaseForm() {
        return this.formBuilder.group({
            SNOfParentLimitBillsPurchase: [undefined],
            marginInPercentageBillsPurchase: [undefined],
            commissionBillsPurchase: [undefined],
            commissionAmountBillsPurchase: [undefined],
            loanExpiryDateBillsPurchase: [undefined],
            freeTextFifteen: [undefined],
        });
    }
    setDocumentaryBillPurchaseForm() {
        return this.formBuilder.group({
            SNOfParentLimitDocumentaryBill: [undefined],
            marginInPercentageDocumentaryBill: [undefined],
            drawingPowerDocumentaryBill: [undefined],
            InterestRateDocumentaryBill: [undefined],
            loanPaymentDocumentaryBill: [undefined],
            loanExpiryDateDocumentaryBill: [undefined],
        });
    }
    setOverdraftBondForm() {
        return this.formBuilder.group({
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
        if (this.loanData.length > 0) {
            this.filterLoanData();
        }
    }

    getFDName() {
        if (!ObjectUtil.isEmpty(this.tempData.overdraftFixedForm)) {
            if (this.tempData.overdraftFixedForm['fdHolderDetails'].length === 1) {
                const temp = this.tempData.overdraftFixedForm['fdHolderDetails'][0].nameOfFDHolderCT;
                this.FDName = temp;
            } else if (this.tempData.overdraftFixedForm['fdHolderDetails'].length === 2) {
                for (let i = 0; i < this.tempData.overdraftFixedForm['fdHolderDetails'].length; i++) {
                    const temp = this.tempData.overdraftFixedForm['fdHolderDetails'][i].nameOfFDHolderCT;
                    this.FDNames.push(temp);
                }
                this.allFDNames = this.FDNames.join(' र ');
                this.FDName = this.allFDNames;
            } else {
                for (let i = 0; i < this.tempData.overdraftFixedForm['fdHolderDetails'].length - 1; i++) {
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
                for (let i = 0; i < this.tempData.overdraftFixedForm['depositorDetails'].length; i++) {
                    const temp = this.tempData.overdraftFixedForm['depositorDetails'][i].nameOfDepositorsCT;
                    this.DepNames.push(temp);
                }
                this.allDepNames = this.DepNames.join(' र ');
                this.DepName = this.allDepNames;
            } else {
                for (let i = 0; i < this.tempData.overdraftFixedForm['depositorDetails'].length - 1; i++) {
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
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.overDraftFacilityForm) &&
            !ObjectUtil.isEmpty(this.tempData.overDraftFacilityForm.overdraftFacilityDetails)) {
            for (let val = 0; val < this.tempData.overDraftFacilityForm.overdraftFacilityDetails.length; val++) {
                if (this.tempData.overDraftFacilityForm.overdraftFacilityDetails[val]['bondDetails'].length === 1) {
                    const temp = this.tempData.overDraftFacilityForm.overdraftFacilityDetails[val]['bondDetails'][0].bondOwnerNameCT;
                    this.BondName = temp;
                } else if (this.tempData.overDraftFacilityForm.overdraftFacilityDetails[val]['bondDetails'].length === 2) {
                    for (let i = 0; i < this.tempData.overDraftFacilityForm.overdraftFacilityDetails[val]['bondDetails'].length; i++) {
                        const temp = this.tempData.overDraftFacilityForm.overdraftFacilityDetails[val]['bondDetails'][i].bondOwnerNameCT;
                        this.BondNames.push(temp);
                    }
                    this.allBondNames = this.BondNames.join(' र ');
                    this.BondName = this.allBondNames;
                } else {
                    for (let i = 0; i < this.tempData.overDraftFacilityForm.overdraftFacilityDetails[val]['bondDetails'].length - 1; i++) {
                        const temp = this.tempData.overDraftFacilityForm.overdraftFacilityDetails[val]['bondDetails'][i].bondOwnerNameCT;
                        this.BondNames.push(temp);
                    }
                    this.allBondNames = this.BondNames.join(' , ');
                    // tslint:disable-next-line:max-line-length
                    const temp1 = this.tempData.overDraftFacilityForm.overdraftFacilityDetails[val]['bondDetails'][this.tempData.overDraftFacilityForm.overdraftFacilityDetails[val]['bondDetails'].length - 1].bondOwnerNameCT;
                    this.BondName = this.allBondNames + ' र ' + temp1;
                }
                this.finalBondName.push(this.BondName);
                this.BondName = '';
                this.allBondNames = '';
                this.BondNames = [];
            }
        }
    }

    private checkLoanName(): void {
        if (this.finalLoanDetails.length > 0) {
            this.finalLoanDetails.forEach(v => {
                // tslint:disable-next-line:max-line-length
                /*if (v.loanName === LoanNameConstant.CUSTOMER_ACCEPTANCE_FOR_TIME_LETTER_OF_CREDIT && !ObjectUtil.isEmpty(this.tempData.timeLetterCreditForm)) {
                    this.isCustomerAcceptance = true;
                    this.loanOptionTimeLetter = this.tempData.timeLetterCreditForm.loanOption;
                    this.complementaryOtherTimeLetterName = this.tempData.timeLetterCreditForm.complimentaryLoanSelected;
                    if (this.tempData.timeLetterCreditForm.complementryOther === true) {
                        this.complementaryOtherTimeLetter = true;
                    }
                    this.timeLetterCreditFormPatchValue();
                }*/
                // tslint:disable-next-line:max-line-length
                /*if (v.loanName === LoanNameConstant.IRREVOCABLE_LETTER_OF_CREDIT_FACILITY && !ObjectUtil.isEmpty(this.tempData.letterOfCreditForm)) {
                    this.isIrrevocableLetter = true;
                    this.loanOptionIrrevocable = this.tempData.letterOfCreditForm.loanOption;
                    this.commissionTypeIrrevocable = this.tempData.letterOfCreditForm.commissionType;
                    this.complementaryOtherIrrevocableTeName = this.tempData.letterOfCreditForm.complimentaryLoanSelected;
                    if (this.tempData.letterOfCreditForm.complementryOther === true) {
                        this.complementaryOtherIrrevocable = true;
                    }
                    this.irrevocableLetterOfCredit();
                }*/
                // tslint:disable-next-line:max-line-length
                /*if (v.loanName === LoanNameConstant.IMPORT_BILLS_DISCOUNTING && !ObjectUtil.isEmpty(this.tempData.importBillsDiscountForm)) {
                    this.isBillDiscounting = true;
                    this.loanOptionBillDiscounting = this.tempData.importBillsDiscountForm.loanOption;
                    this.complementaryOtherBillDiscountingName = this.tempData.importBillsDiscountForm.complimentaryLoanSelected;
                    if (this.tempData.importBillsDiscountForm.complementryOther === true) {
                        this.complementaryOtherBillDiscounting = true;
                    }
                    this.importBillsDiscountFormPatchValue();
                }*/
                /*if (v.loanName === LoanNameConstant.IMPORT_LOAN_TRUST_RECEIPT_LOAN && !ObjectUtil.isEmpty(this.tempData.importLoanTrust)) {
                    this.isLoanTrustReceiptLoan = true;
                    this.loanOptionImportLoanTrust = this.tempData.importLoanTrust.loanOption;
                    this.complementaryOtherImportLoanTrustName = this.tempData.importLoanTrust.complimentaryLoanSelected;
                    this.interestSubsidyAgImportLoanTrust = this.tempData.importLoanTrust.subsidyOrAgricultureLoan;
                    if (this.tempData.importLoanTrust.complementryOther === true) {
                        this.complementaryOtherImportLoanTrust = true;
                    }
                    this.importTrustFormPatchValue();
                }*/
               /* if (v.loanName === LoanNameConstant.SHORT_TERM_LOAN && !ObjectUtil.isEmpty(this.tempData.revolvingShortTermLoan)) {
                    this.isRevolvingShortTermLoan = true;
                    this.loanOptionShortTermLoan = this.tempData.revolvingShortTermLoan.loanOption;
                    this.complementaryOtherShortTermLoanName = this.tempData.revolvingShortTermLoan.complimentaryLoanSelected;
                    this.loanRevolvingBasisShortTermLoan = this.tempData.revolvingShortTermLoan.loanRevolvingBasis;
                    this.interestSubsidyAgShortTermLoan = this.tempData.revolvingShortTermLoan.subsidyOrAgricultureLoan;
                    if (this.tempData.revolvingShortTermLoan.complementaryOther === true) {
                        this.complementaryOtherShortTermLoan = true;
                    }
                    if (this.tempData.revolvingShortTermLoan.arFinancing === true) {
                        this.arFinancingShortTermLoan = true;
                    }
                    this.revolvingShortTermFormPatchValue();
                }*/
                /*if (v.loanName === LoanNameConstant.DEMAND_LOAN_FOR_WORKING_CAPITAL && !ObjectUtil.isEmpty(this.tempData.demandLoanForm)) {
                    this.isDemandLoanWorkingCapital = true;
                    this.interestSubsidyAgDemandLoan = this.tempData.demandLoanForm.subsidyOrAgricultureLoan;
                    this.complementaryOtherDemandLoanName = this.tempData.demandLoanForm.complimentaryLoanSelected;
                    if (this.tempData.demandLoanForm.complementryOther === true) {
                        this.complementaryOtherDemandLoan = true;
                    }
                    if (this.tempData.demandLoanForm.arFinancing === true) {
                        this.arFinancingDemandLoan = true;
                    }
                    this.demandLoanFormPatchValue();
                }*/
                /*if (v.loanName === LoanNameConstant.PRE_EXPORT_LOAN && !ObjectUtil.isEmpty(this.tempData.preExportForm)) {
                    this.isPreExportLoan = true;
                    this.complementaryOtherPreExportLoanName = this.tempData.preExportForm.complimentaryLoanSelected;
                    if (this.tempData.preExportForm.complementaryOther === true) {
                        this.complementaryOtherPreExportLoan = true;
                    }
                    this.preExportFormPatchValue();
                }*/
               /* if (v.loanName === LoanNameConstant.DOCUMENTARY_BILL_PURCHASE_NEGOTIATION &&
                    !ObjectUtil.isEmpty(this.tempData.documentaryBillPurchase)) {
                    this.isDocumentaryBillPurchase = true;
                    this.complementaryOtherDocumentaryBillName = this.tempData.documentaryBillPurchase.complimentaryLoanSelected;
                    if (this.tempData.documentaryBillPurchase.complementryOther === true) {
                        this.complementaryOtherDocumentaryBill = true;
                    }
                    this.documentaryBillPurchaseFormPatchValue();
                }*/
                /*if (v.loanName === LoanNameConstant.OVERDRAFT_LOAN_FOR_WORKING_CAPITAL_REQUIREMENT &&
                    !ObjectUtil.isEmpty(this.tempData.overdraftLoanForm)) {
                    this.isOverdraftLoanWorkingCapital = true;
                    this.interestSubsidyAgOverdraftLoanWorking = this.tempData.overdraftLoanForm.subsidyOrAgricultureLoan;
                    if (this.tempData.overdraftLoanForm.arFinancing === true) {
                        this.arFinancingOverdraftLoanWorking = true;
                    }
                    this.overdraftLoanFormPatchValue();
                }*/
                /*if (v.loanName === LoanNameConstant.MORTGAGE_OVERDRAFT || v.loanName === LoanNameConstant.EQUITY_MORTGAGED_OVERDRAFT &&
                    !ObjectUtil.isEmpty(this.tempData.equityMortgaged)) {
                    this.isEquityMortgageOverdraft = true;
                    this.loanSubTypeEquityMortgage = this.tempData.equityMortgaged.loanSubType;
                    this.drawingBasisEquityMortgage = this.tempData.equityMortgaged.drawingBasis;
                    this.mortgageTypeEquityMortgage = this.tempData.equityMortgaged.mortgageType;
                    this.interestSubsidyAgEquityMortgage = this.tempData.equityMortgaged.subsidyOrAgricultureLoan;
                    this.equityMortgageFormPatchValue();
                }*/
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
                /*if (v.loanName === LoanNameConstant.OVERDRAFT_FACILITY_AGAINST_BOND ||
                v.loanName === LoanNameConstant.STL_FACILITY_AGAINST_BOND ||
                v.loanName === LoanNameConstant.DL_FACILITY_AGAINST_BOND &&
                !ObjectUtil.isEmpty(this.tempData.overDraftFacilityForm.overdraftFacilityDetails)) {
                this.isOverdraftFacilityAgainstBond = true;
                  console.log('Overdraft Facility Form:', this.tempData.overDraftFacilityForm);
                    this.letterOfSetOffFacilityAgainstBond = this.tempData.overDraftFacilityForm.letterOfSetOffUsed;
                    this.interestSubsidyAgFacilityAgainstBond = this.tempData.overDraftFacilityForm.subsidyOrAgricultureLoan;
                    this.interestRateTypeFacilityAgainstBond = this.tempData.overDraftFacilityForm.interestRateType;
                    this.overDraftFacilityFormPatchValue();
                }*/
                /*if (v.loanName === LoanNameConstant.BRIDGE_GAP_LOAN && !ObjectUtil.isEmpty(this.tempData.bridgeGapLoan)) {
                    this.isBridgeGapLoan = true;
                    this.complementaryOtherBridgeGapLoanName = this.tempData.bridgeGapLoan.complimentaryLoanSelected;
                    if (this.tempData.bridgeGapLoan.interestSubsidy === true) {
                        this.interestSubsidyAgBridgeGapLoan = true;
                    }
                    if (this.tempData.bridgeGapLoan.complementryOther === true) {
                        this.complementaryOtherBridgeGapLoan = true;
                    }
                    this.bridgeGapLoanFormPatchValue();
                }*/
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
                    this.complementaryOtherBankGuaranteeName = this.tempData.bankGuarantee.complimentaryLoanSelected;
                    if (this.tempData.bankGuarantee.complementryOther === true) {
                        this.complementaryOtherBankGuarantee = true;
                    }
                    this.bankGuaranteeFormPatchValue();
                }
                /*if (v.loanName === LoanNameConstant.BILLS_PURCHASE && !ObjectUtil.isEmpty(this.tempData.billPurchaseForm)) {
                    this.isBillPurchase = true;
                    this.complementaryOtherBillPurchaseName = this.tempData.billPurchaseForm.complimentaryLoanSelected;
                    if (this.tempData.billPurchaseForm.complementryOther === true) {
                        this.complementaryOtherBillPurchase = true;
                    }
                    this.billPurchaseFormPatchValue();
                }*/
            });
        }
        this.overDraftFacilityFormPatchValue();
        this.documentaryBillPurchaseFormPatchValue();
        this.billPurchaseFormPatchValue();
        this.equityMortgageFormPatchValue();
        this.mortgageOverdraftPatchValue();
        this.importBillsDiscountFormPatchValue();
        this.irrevocableLetterOfCredit();
        this.importTrustFormPatchValue();
        this.revolvingShortTermFormPatchValue();
        this.timeLetterCreditFormPatchValue();
        this.demandLoanFormPatchValue();
        this.bridgeGapLoanFormPatchValue();
        this.overdraftLoanFormPatchValue();
        this.preExportFormPatchValue();
    }

    irrevocableLetterOfCredit() {
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.letterOfCreditForm) &&
            !ObjectUtil.isEmpty(this.tempData.letterOfCreditForm.letterOfCreditFormArray)) {
            for (let val = 0; val < this.tempData.letterOfCreditForm.letterOfCreditFormArray.length; val++) {
                this.form.get(['irrevocableLetterOfCredit', val, 'marginInPercentageIrrevocable']).patchValue(
                    this.tempData.letterOfCreditForm.letterOfCreditFormArray[val] ?
                        this.tempData.letterOfCreditForm.letterOfCreditFormArray[val].marginInPercentageCT : ''
                );
                this.form.get(['irrevocableLetterOfCredit', val, 'commissionRateIrrevocable']).patchValue(
                    this.tempData.letterOfCreditForm.letterOfCreditFormArray[val] ?
                        this.tempData.letterOfCreditForm.letterOfCreditFormArray[val].commissionRateCT : ''
                );
                this.form.get(['irrevocableLetterOfCredit', val, 'commissionAmountIrrevocable']).patchValue(
                    this.tempData.letterOfCreditForm.letterOfCreditFormArray[val] ?
                        this.tempData.letterOfCreditForm.letterOfCreditFormArray[val].minimumCommissionRateCT : ''
                );
                this.form.get(['irrevocableLetterOfCredit', val, 'commissionRateForFirstQuarterIrrevocable']).patchValue(
                    this.tempData.letterOfCreditForm.letterOfCreditFormArray[val] ?
                        this.tempData.letterOfCreditForm.letterOfCreditFormArray[val].commissionRateFirstQuarterCT : ''
                );
                this.form.get(['irrevocableLetterOfCredit', val, 'commissionRateForOtherQuarterIrrevocable']).patchValue(
                    this.tempData.letterOfCreditForm.letterOfCreditFormArray[val] ?
                        this.tempData.letterOfCreditForm.letterOfCreditFormArray[val].commissionRateOtherQuarterCT : ''
                );
                this.form.get(['irrevocableLetterOfCredit', val, 'loanExpiryDateIrrevocable']).patchValue(
                    this.tempData.letterOfCreditForm.letterOfCreditFormArray[val] ?
                        this.tempData.letterOfCreditForm.letterOfCreditFormArray[val].dateOfExpiryCT : ''
                );
            }
        }
    }
    timeLetterCreditFormPatchValue() {
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.timeLetterCreditForm) &&
            !ObjectUtil.isEmpty(this.tempData.timeLetterCreditForm.timeLetterCreditFormArray)) {
            for (let val = 0; val < this.tempData.timeLetterCreditForm.timeLetterCreditFormArray.length; val++) {
                this.form.get(['customerAcceptanceLetterOfCredit', val, 'marginInPercentageTimeLetter']).patchValue(
                    this.tempData.timeLetterCreditForm.timeLetterCreditFormArray[val] ?
                        this.tempData.timeLetterCreditForm.timeLetterCreditFormArray[val].marginInPercentageCT : ''
                );
                this.form.get(['customerAcceptanceLetterOfCredit', val, 'commissionRateQuarterlyTimeLetter']).patchValue(
                    this.tempData.timeLetterCreditForm.timeLetterCreditFormArray[val] ?
                        this.tempData.timeLetterCreditForm.timeLetterCreditFormArray[val].commissionRateCT : ''
                );
                this.form.get(['customerAcceptanceLetterOfCredit', val, 'commissionAmountTimeLetter']).patchValue(
                    this.tempData.timeLetterCreditForm.timeLetterCreditFormArray[val] ?
                        this.tempData.timeLetterCreditForm.timeLetterCreditFormArray[val].minimumCommissionAmountCT : ''
                );
                this.form.get(['customerAcceptanceLetterOfCredit', val, 'loanExpiryDateTimeLetter']).patchValue(
                    this.tempData.timeLetterCreditForm.timeLetterCreditFormArray[val] ?
                        this.tempData.timeLetterCreditForm.timeLetterCreditFormArray[val].dateOfExpiryCT : ''
                );
            }
        }
    }
    importBillsDiscountFormPatchValue() {
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.importBillsDiscountForm) &&
            !ObjectUtil.isEmpty(this.tempData.importBillsDiscountForm.importBillsDiscountFormArray)) {
            for (let val = 0; val < this.tempData.importBillsDiscountForm.importBillsDiscountFormArray.length; val++) {
                this.form.get(['importBillsDiscounting', val, 'loanDaysBillsDiscounting']).patchValue(
                    this.tempData.importBillsDiscountForm.importBillsDiscountFormArray[val] ?
                        this.tempData.importBillsDiscountForm.importBillsDiscountFormArray[val].loanPeriodInDaysCT : ''
                );
                this.form.get(['importBillsDiscounting', val, 'loanDaysBillsDiscountingInEng']).patchValue(
                    this.tempData.importBillsDiscountForm.importBillsDiscountFormArray[val] ?
                        this.tempData.importBillsDiscountForm.importBillsDiscountFormArray[val].loanPeriodInDays : ''
                );
                this.form.get(['importBillsDiscounting', val, 'loanExpiryDateBillsDiscounting']).patchValue(
                    this.tempData.importBillsDiscountForm.importBillsDiscountFormArray[val] ?
                        this.tempData.importBillsDiscountForm.importBillsDiscountFormArray[val].dateOfExpiryCT : ''
                );
                this.form.get(['importBillsDiscounting', val, 'marginInPercentageBillsDiscounting']).patchValue(
                    this.tempData.importBillsDiscountForm.importBillsDiscountFormArray[val] ?
                        this.tempData.importBillsDiscountForm.importBillsDiscountFormArray[val].marginInPercentageCT : ''
                );
            }
        }
    }

    importTrustFormPatchValue() {
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.importLoanTrust) &&
            !ObjectUtil.isEmpty(this.tempData.importLoanTrust.importLoanTrustFormArray)) {
            for (let val = 0; val < this.tempData.importLoanTrust.importLoanTrustFormArray.length; val++) {
                this.form.get(['importLoanTrustReceiptLoan', val, 'loanDaysLoanTrust']).patchValue(
                    this.tempData.importLoanTrust.importLoanTrustFormArray[val] ?
                        this.tempData.importLoanTrust.importLoanTrustFormArray[val].loanPeriodCT : ''
                );
                this.form.get(['importLoanTrustReceiptLoan', val, 'loanDaysLoanTrustInEng']).patchValue(
                    this.tempData.importLoanTrust.importLoanTrustFormArray[val] ?
                        this.tempData.importLoanTrust.importLoanTrustFormArray[val].loanPeriod : ''
                );
                this.form.get(['importLoanTrustReceiptLoan', val, 'drawingPowerLoanTrust']).patchValue(
                    this.tempData.importLoanTrust.importLoanTrustFormArray[val] ?
                        this.tempData.importLoanTrust.importLoanTrustFormArray[val].drawingPowerCT : ''
                );
                this.form.get(['importLoanTrustReceiptLoan', val, 'baseRateLoanTrust']).patchValue(
                    this.tempData.importLoanTrust.importLoanTrustFormArray[val] ?
                        this.tempData.importLoanTrust.importLoanTrustFormArray[val].baseRateCT : ''
                );
                this.form.get(['importLoanTrustReceiptLoan', val, 'premiumRateLoanTrust']).patchValue(
                    this.tempData.importLoanTrust.importLoanTrustFormArray[val] ?
                        this.tempData.importLoanTrust.importLoanTrustFormArray[val].premiumRateCT : ''
                );
                this.form.get(['importLoanTrustReceiptLoan', val, 'interestRateLoanTrust']).patchValue(
                    this.tempData.importLoanTrust.importLoanTrustFormArray[val] ?
                        this.tempData.importLoanTrust.importLoanTrustFormArray[val].interestRateCT : ''
                );
                this.form.get(['importLoanTrustReceiptLoan', val, 'totalInterestRateLoanTrust']).patchValue(
                    this.tempData.importLoanTrust.importLoanTrustFormArray[val] ?
                        this.tempData.importLoanTrust.importLoanTrustFormArray[val].interestRateCT : ''
                );
                this.form.get(['importLoanTrustReceiptLoan', val, 'loanExpiryDateLoanTrust']).patchValue(
                    this.tempData.importLoanTrust.importLoanTrustFormArray[val] ?
                        this.tempData.importLoanTrust.importLoanTrustFormArray[val].dateOfExpiryCT : ''
                );
                this.form.get(['importLoanTrustReceiptLoan', val, 'remainDaysLoanTrust']).patchValue(
                    this.tempData.importLoanTrust.importLoanTrustFormArray[val] ?
                        this.tempData.importLoanTrust.importLoanTrustFormArray[val].loanPeriodCT : ''
                );
            }
        }
    }
    revolvingShortTermFormPatchValue() {
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.revolvingShortTermLoan) &&
            !ObjectUtil.isEmpty(this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray)) {
            for (let val = 0; val < this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray.length; val++) {
                this.form.get(['revolvingShortTermLoan', val, 'loanDaysShortTermLoan']).patchValue(
                    this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val] ?
                        this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val].loanRevolvingPeriodCT : ''
                );
                this.form.get(['revolvingShortTermLoan', val, 'loanDaysShortTermLoanInEng']).patchValue(
                    this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val] ?
                        this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val].loanRevolvingPeriod : ''
                );
                this.form.get(['revolvingShortTermLoan', val, 'loanMonthsShortTermLoan']).patchValue(
                    this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val] ?
                        this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val].loanRevolvingPeriodCT : ''
                );
                this.form.get(['revolvingShortTermLoan', val, 'loanMonthsShortTermLoanInEng']).patchValue(
                    this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val] ?
                        this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val].loanRevolvingPeriod : ''
                );
                this.form.get(['revolvingShortTermLoan', val, 'ARDaysShortTermLoan']).patchValue(
                    this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val] ?
                        this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val].arDaysCT : ''
                );
                this.form.get(['revolvingShortTermLoan', val, 'drawingPowerShortTermLoan']).patchValue(
                    this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val] ?
                        this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val].drawingPowerCT : ''
                );
                this.form.get(['revolvingShortTermLoan', val, 'baseRateShortTermLoan']).patchValue(
                    this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val] ?
                        this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val].baseRateCT : ''
                );
                this.form.get(['revolvingShortTermLoan', val, 'premiumRateShortTermLoan']).patchValue(
                    this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val] ?
                        this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val].premiumRateCT : ''
                );
                this.form.get(['revolvingShortTermLoan', val, 'interestRateShortTermLoan']).patchValue(
                    this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val] ?
                        this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val].interestRateCT : ''
                );
                this.form.get(['revolvingShortTermLoan', val, 'totalInterestRateShortTermLoan']).patchValue(
                    this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val] ?
                        this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val].interestRateCT : ''
                );
                this.form.get(['revolvingShortTermLoan', val, 'loanExpiryDateShortTermLoan']).patchValue(
                    this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val] ?
                        this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val].dateOfExpiryCT : ''
                );
                this.form.get(['revolvingShortTermLoan', val, 'remainDaysShortTermLoan']).patchValue(
                    this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val] ?
                        this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val].loanRevolvingPeriodCT : ''
                );
            }
        }
    }
    demandLoanFormPatchValue() {
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.demandLoanForm) &&
            !ObjectUtil.isEmpty(this.tempData.demandLoanForm.demandLoanFormArray)) {
            for (let val = 0; val < this.tempData.demandLoanForm.demandLoanFormArray.length; val++) {
                this.form.get(['demandLoan', val, 'ARDaysDemandLoan']).patchValue(
                    this.tempData.demandLoanForm.demandLoanFormArray[val] ?
                        this.tempData.demandLoanForm.demandLoanFormArray[val].arDaysCT : ''
                );
                this.form.get(['demandLoan', val, 'drawingPowerDemandLoan']).patchValue(
                    this.tempData.demandLoanForm.demandLoanFormArray[val] ?
                        this.tempData.demandLoanForm.demandLoanFormArray[val].drawingPowerCT : ''
                );
                this.form.get(['demandLoan', val, 'baseRateDemandLoan']).patchValue(
                    this.tempData.demandLoanForm.demandLoanFormArray[val] ?
                        this.tempData.demandLoanForm.demandLoanFormArray[val].baseRateCT : ''
                );
                this.form.get(['demandLoan', val, 'totalInterestRateDemandLoan']).patchValue(
                    this.tempData.demandLoanForm.demandLoanFormArray[val] ?
                        this.tempData.demandLoanForm.demandLoanFormArray[val].interestRateCT : ''
                );
                this.form.get(['demandLoan', val, 'premiumRateDemandLoan']).patchValue(
                    this.tempData.demandLoanForm.demandLoanFormArray[val] ?
                        this.tempData.demandLoanForm.demandLoanFormArray[val].premiumRateCT : ''
                );
                this.form.get(['demandLoan', val, 'interestRateDemandLoan']).patchValue(
                    this.tempData.demandLoanForm.demandLoanFormArray[val] ?
                        this.tempData.demandLoanForm.demandLoanFormArray[val].interestRateCT : ''
                );
                this.form.get(['demandLoan', val, 'loanExpiryDateDemandLoan']).patchValue(
                    this.tempData.demandLoanForm.demandLoanFormArray[val] ?
                        this.tempData.demandLoanForm.demandLoanFormArray[val].dateOfExpiryCT : ''
                );
            }
        }
    }

    preExportFormPatchValue() {
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.preExportForm) &&
            !ObjectUtil.isEmpty(this.tempData.preExportForm.termLoanDetails)) {
            for (let val = 0; val < this.tempData.preExportForm.termLoanDetails.length; val++) {
                this.form.get(['preExportLoan', val, 'drawingPower1PreExport']).patchValue(
                    this.tempData.preExportForm.termLoanDetails[val] ?
                        this.tempData.preExportForm.termLoanDetails[val].drawingPowerCT : ''
                );
                this.form.get(['preExportLoan', val, 'drawingPower2PreExport']).patchValue(
                    this.tempData.preExportForm.termLoanDetails[val] ?
                        this.tempData.preExportForm.termLoanDetails[val].drawingPowerCT : ''
                );
                this.form.get(['preExportLoan', val, 'loanExpiryDatePreExport']).patchValue(
                    this.tempData.preExportForm.termLoanDetails[val] ?
                        this.tempData.preExportForm.termLoanDetails[val].dateOfExpiryCT : ''
                );
            }
        }
    }

    documentaryBillPurchaseFormPatchValue() {
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.documentaryBillPurchase) &&
            !ObjectUtil.isEmpty(this.tempData.documentaryBillPurchase.documentaryBillPurchaseFormArray)) {
            for (let val = 0; val < this.tempData.documentaryBillPurchase.documentaryBillPurchaseFormArray.length; val++) {
                this.form.get(['documentaryBillPurchaseNegotiation', val, 'marginInPercentageDocumentaryBill']).patchValue(
                    this.tempData.documentaryBillPurchase.documentaryBillPurchaseFormArray[val] ?
                        this.tempData.documentaryBillPurchase.documentaryBillPurchaseFormArray[val].marginInPercentageCT : ''
                );
                this.form.get(['documentaryBillPurchaseNegotiation', val, 'drawingPowerDocumentaryBill']).patchValue(
                    this.tempData.documentaryBillPurchase.documentaryBillPurchaseFormArray[val] ?
                        this.tempData.documentaryBillPurchase.documentaryBillPurchaseFormArray[val].drawingPowerCT : ''
                );
                this.form.get(['documentaryBillPurchaseNegotiation', val, 'loanExpiryDateDocumentaryBill']).patchValue(
                    this.tempData.documentaryBillPurchase.documentaryBillPurchaseFormArray[val] ?
                        this.tempData.documentaryBillPurchase.documentaryBillPurchaseFormArray[val].dateOfExpiryCT : ''
                );
            }
        }
    }

    overdraftLoanFormPatchValue() {
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.overdraftLoanForm) &&
            !ObjectUtil.isEmpty(this.tempData.overdraftLoanForm.overdraftLoanFormArray)) {
            for (let index = 0; index < this.tempData.overdraftLoanForm.overdraftLoanFormArray.length; index++) {
                this.form.get(['overdraftLoanForWorkingCapital', index, 'ARDaysOverdraftLoan']).patchValue(
                    this.tempData.overdraftLoanForm.overdraftLoanFormArray[index] ?
                        this.tempData.overdraftLoanForm.overdraftLoanFormArray[index].arDaysCT : '');

                this.form.get(['overdraftLoanForWorkingCapital', index, 'drawingPowerOverdraftLoan']).patchValue(
                    this.tempData.overdraftLoanForm.overdraftLoanFormArray[index] ?
                        this.tempData.overdraftLoanForm.overdraftLoanFormArray[index].drawingPowerCT : '');

                this.form.get(['overdraftLoanForWorkingCapital', index, 'baseRateOverdraftLoan']).patchValue(
                    this.tempData.overdraftLoanForm.overdraftLoanFormArray[index] ?
                        this.tempData.overdraftLoanForm.overdraftLoanFormArray[index].baseRateCT : '');

                this.form.get(['overdraftLoanForWorkingCapital', index, 'premiumRateOverdraftLoan']).patchValue(
                    this.tempData.overdraftLoanForm.overdraftLoanFormArray[index] ?
                        this.tempData.overdraftLoanForm.overdraftLoanFormArray[index].premiumRateCT : '');

                this.form.get(['overdraftLoanForWorkingCapital', index, 'interestRateOverdraftLoan']).patchValue(
                    this.tempData.overdraftLoanForm.overdraftLoanFormArray[index] ?
                        this.tempData.overdraftLoanForm.overdraftLoanFormArray[index].interestRateCT : '');

                this.form.get(['overdraftLoanForWorkingCapital', index, 'totalInterestRateOverdraftLoan']).patchValue(
                    this.tempData.overdraftLoanForm.overdraftLoanFormArray[index] ?
                        this.tempData.overdraftLoanForm.overdraftLoanFormArray[index].interestRateCT : '');

                this.form.get(['overdraftLoanForWorkingCapital', index, 'loanExpiryDateOverdraftLoan']).patchValue(
                    this.tempData.overdraftLoanForm.overdraftLoanFormArray[index] ?
                        this.tempData.overdraftLoanForm.overdraftLoanFormArray[index].dateOfExpiryCT : '');
            }
        }
    }

    equityMortgageFormPatchValue() {
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.equityMortgaged) &&
            !ObjectUtil.isEmpty(this.tempData.equityMortgaged.equityMortgagedFormArray)) {
            for (let val = 0; val < this.tempData.equityMortgaged.equityMortgagedFormArray.length; val++) {
                this.form.get(['equityMortgageOverdraft', val, 'drawingPowerMortgageOverdraft']).patchValue(
                    this.tempData.equityMortgaged.equityMortgagedFormArray[val] ?
                        this.tempData.equityMortgaged.equityMortgagedFormArray[val].drawingPowerCT : ''
                );
                this.form.get(['equityMortgageOverdraft', val, 'baseRateMortgageOverdraft']).patchValue(
                    this.tempData.equityMortgaged.equityMortgagedFormArray[val] ?
                        this.tempData.equityMortgaged.equityMortgagedFormArray[val].baseRateCT : ''
                );
                this.form.get(['equityMortgageOverdraft', val, 'premiumRateMortgageOverdraft']).patchValue(
                    this.tempData.equityMortgaged.equityMortgagedFormArray[val] ?
                        this.tempData.equityMortgaged.equityMortgagedFormArray[val].premiumRateCT : ''
                );
                this.form.get(['equityMortgageOverdraft', val, 'interestRateMortgageOverdraft']).patchValue(
                    this.tempData.equityMortgaged.equityMortgagedFormArray[val] ?
                        this.tempData.equityMortgaged.equityMortgagedFormArray[val].interestRateCT : ''
                );
                this.form.get(['equityMortgageOverdraft', val, 'totalInterestRateMortgageOverdraft']).patchValue(
                    this.tempData.equityMortgaged.equityMortgagedFormArray[val] ?
                        this.tempData.equityMortgaged.equityMortgagedFormArray[val].interestRateCT : ''
                );
                this.form.get(['equityMortgageOverdraft', val, 'loanExpiryDateMortgageOverdraft']).patchValue(
                    this.tempData.equityMortgaged.equityMortgagedFormArray[val] ?
                        this.tempData.equityMortgaged.equityMortgagedFormArray[val].dateOfExpiryCT : ''
                );
            }
        }
    }
    mortgageOverdraftPatchValue() {
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.equityMortgaged) &&
            !ObjectUtil.isEmpty(this.tempData.equityMortgaged.mortgageOverdraftFormArray)) {
            for (let val = 0; val < this.tempData.equityMortgaged.mortgageOverdraftFormArray.length; val++) {
                this.form.get(['mortgageOverdraft', val, 'drawingPowerMortgageOverdraft']).patchValue(
                    this.tempData.equityMortgaged.mortgageOverdraftFormArray[val] ?
                        this.tempData.equityMortgaged.mortgageOverdraftFormArray[val].drawingPowerCT : ''
                );
                this.form.get(['mortgageOverdraft', val, 'baseRateMortgageOverdraft']).patchValue(
                    this.tempData.equityMortgaged.mortgageOverdraftFormArray[val] ?
                        this.tempData.equityMortgaged.mortgageOverdraftFormArray[val].baseRateCT : ''
                );
                this.form.get(['mortgageOverdraft', val, 'premiumRateMortgageOverdraft']).patchValue(
                    this.tempData.equityMortgaged.mortgageOverdraftFormArray[val] ?
                        this.tempData.equityMortgaged.mortgageOverdraftFormArray[val].premiumRateCT : ''
                );
                this.form.get(['mortgageOverdraft', val, 'interestRateMortgageOverdraft']).patchValue(
                    this.tempData.equityMortgaged.mortgageOverdraftFormArray[val] ?
                        this.tempData.equityMortgaged.mortgageOverdraftFormArray[val].interestRateCT : ''
                );
                this.form.get(['mortgageOverdraft', val, 'totalInterestRateMortgageOverdraft']).patchValue(
                    this.tempData.equityMortgaged.mortgageOverdraftFormArray[val] ?
                        this.tempData.equityMortgaged.mortgageOverdraftFormArray[val].interestRateCT : ''
                );
                this.form.get(['mortgageOverdraft', val, 'loanExpiryDateMortgageOverdraft']).patchValue(
                    this.tempData.equityMortgaged.mortgageOverdraftFormArray[val] ?
                        this.tempData.equityMortgaged.mortgageOverdraftFormArray[val].dateOfExpiryCT : ''
                );
            }
        }
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
        if (!ObjectUtil.isEmpty(this.tempData) &&
        !ObjectUtil.isEmpty(this.tempData.overDraftFacilityForm) &&
        !ObjectUtil.isEmpty(this.tempData.overDraftFacilityForm.overdraftFacilityDetails)) {
            for (let index = 0; index < this.tempData.overDraftFacilityForm.overdraftFacilityDetails.length; index++) {
                this.form.get(['overdraftFacilityAgainstBond', index, 'nameOfFacilityAgainstBond']).patchValue(
                    this.tempData.overDraftFacilityForm.overdraftFacilityDetails[index] ?
                        this.tempData.overDraftFacilityForm.overdraftFacilityDetails[index].nameOfFacilityCT : '');

                this.form.get(['overdraftFacilityAgainstBond', index, 'nameOfFacilityAgainstBondInEng']).patchValue(
                    this.tempData.overDraftFacilityForm.overdraftFacilityDetails[index] ?
                        this.tempData.overDraftFacilityForm.overdraftFacilityDetails[index].nameOfFacility : '');

                this.form.get(['overdraftFacilityAgainstBond', index, 'ownerNameAgainstBond']).patchValue(
                    this.finalBondName ? this.finalBondName[index] : '');

                this.form.get(['overdraftFacilityAgainstBond', index, 'bondAmountAgainstBond']).patchValue(
                    this.tempData.overDraftFacilityForm.overdraftFacilityDetails[index] ?
                        this.tempData.overDraftFacilityForm.overdraftFacilityDetails[index].bondAmountCT : '');

                this.form.get(['overdraftFacilityAgainstBond', index, 'bondTypeAgainstBond']).patchValue(
                    this.tempData.overDraftFacilityForm.overdraftFacilityDetails[index] ?
                        this.tempData.overDraftFacilityForm.overdraftFacilityDetails[index].bondTypeCT : '');

                this.form.get(['overdraftFacilityAgainstBond', index, 'totalInterestRateAgainstBond']).patchValue(
                    this.tempData.overDraftFacilityForm.overdraftFacilityDetails[index] ?
                        this.tempData.overDraftFacilityForm.overdraftFacilityDetails[index].interestRateCT : '');

                this.form.get(['overdraftFacilityAgainstBond', index, 'baseRateAgainstBond']).patchValue(
                    this.tempData.overDraftFacilityForm.overdraftFacilityDetails[index] ?
                        this.tempData.overDraftFacilityForm.overdraftFacilityDetails[index].baseRateCT : '');

                this.form.get(['overdraftFacilityAgainstBond', index, 'premiumRateAgainstBond']).patchValue(
                    this.tempData.overDraftFacilityForm.overdraftFacilityDetails[index] ?
                        this.tempData.overDraftFacilityForm.overdraftFacilityDetails[index].premiumRateCT : '');

                this.form.get(['overdraftFacilityAgainstBond', index, 'interestRateAgainstBond']).patchValue(
                    this.tempData.overDraftFacilityForm.overdraftFacilityDetails[index] ?
                        this.tempData.overDraftFacilityForm.overdraftFacilityDetails[index].interestRateCT : '');

                this.form.get(['overdraftFacilityAgainstBond', index, 'loanExpiryDateAgainstBond']).patchValue(
                    this.tempData.overDraftFacilityForm.overdraftFacilityDetails[index] ?
                        this.tempData.overDraftFacilityForm.overdraftFacilityDetails[index].dateOfExpiryCT : '');
            }
        }
    }

    bridgeGapLoanFormPatchValue() {
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.bridgeGapLoan) &&
            !ObjectUtil.isEmpty(this.tempData.bridgeGapLoan.bridgeGapDetails)) {
            for (let index = 0; index < this.tempData.bridgeGapLoan.bridgeGapDetails.length; index++) {
                this.form.get(['bridgeGapLoan', index, 'baseRateBridgeGap']).patchValue(
                    this.tempData.bridgeGapLoan.bridgeGapDetails[index] ?
                        this.tempData.bridgeGapLoan.bridgeGapDetails[index].baseRateCT : '');

                this.form.get(['bridgeGapLoan', index, 'premiumRateBridgeGap']).patchValue(
                    this.tempData.bridgeGapLoan.bridgeGapDetails[index] ?
                        this.tempData.bridgeGapLoan.bridgeGapDetails[index].premiumRateCT : '');

                this.form.get(['bridgeGapLoan', index, 'interestRateBridgeGap']).patchValue(
                    this.tempData.bridgeGapLoan.bridgeGapDetails[index] ?
                        this.tempData.bridgeGapLoan.bridgeGapDetails[index].interestRateCT : '');

                this.form.get(['bridgeGapLoan', index, 'totalInterestRateBridgeGap']).patchValue(
                    this.tempData.bridgeGapLoan.bridgeGapDetails[index] ?
                        this.tempData.bridgeGapLoan.bridgeGapDetails[index].totalInterestRateCT : '');
            }
        }
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
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.billPurchaseForm) &&
            !ObjectUtil.isEmpty(this.tempData.billPurchaseForm.billPurchaseFormArray)) {
            for (let index = 0; index < this.tempData.billPurchaseForm.billPurchaseFormArray.length; index++) {
                this.form.get(['billsPurchase', index, 'marginInPercentageBillsPurchase']).patchValue(
                    this.tempData.billPurchaseForm.billPurchaseFormArray[index] ?
                        this.tempData.billPurchaseForm.billPurchaseFormArray[index].marginInPercentageCT : '');

                this.form.get(['billsPurchase', index, 'commissionBillsPurchase']).patchValue(
                    this.tempData.billPurchaseForm.billPurchaseFormArray[index] ?
                        this.tempData.billPurchaseForm.billPurchaseFormArray[index].commissionCT : '');

                this.form.get(['billsPurchase', index, 'commissionAmountBillsPurchase']).patchValue(
                    this.tempData.billPurchaseForm.billPurchaseFormArray[index] ?
                        this.tempData.billPurchaseForm.billPurchaseFormArray[index].minCommissionAmountInFigCT : '');

                this.form.get(['billsPurchase', index, 'loanExpiryDateBillsPurchase']).patchValue(
                    this.tempData.billPurchaseForm.billPurchaseFormArray[index] ?
                        this.tempData.billPurchaseForm.billPurchaseFormArray[index].dateOfExpiryCT : '');
            }
        }
    }

    setTextAreaValue() {
        let tempTermLoanFreeVal;
        if (this.termLoanDetails.length > 0) {
            tempTermLoanFreeVal = this.termLoanToOrForComponent.setFreeTextTermLoan();
        }
        let tempAutoLoanFreeVal;
        if (this.autoLoanDetails.length > 0) {
            tempAutoLoanFreeVal = this.autoLoanComponent.setFreeTextAutoLoan();
        }
        let tempMortgageEquity;
        if (this.isEquityMortgageTermLoan) {
            tempMortgageEquity = this.mortgageEquityTermLoanComponent.setFreeTextMortgage();
        }
        this.freeTextVal = {
            autoLoanFreeText: !ObjectUtil.isEmpty(tempAutoLoanFreeVal) ? tempAutoLoanFreeVal : '',
            termLoanFreeText: !ObjectUtil.isEmpty(tempTermLoanFreeVal) ? tempTermLoanFreeVal : '',
            // loanExpiryIrrevocable: this.form.get('loanExpiryDateIrrevocable2').value ? this.form.get('loanExpiryDateIrrevocable2').value : '',
            // loanExpiryTimeLetter: this.form.get('loanExpiryDateTimeLetter2').value ? this.form.get('loanExpiryDateTimeLetter2').value : '',
            // freeText1: this.form.get('freeTextOne').value ? this.form.get('freeTextOne').value : '',
            // freeText2: this.form.get('freeTextTwo').value ? this.form.get('freeTextTwo').value : '',
            // remainingDaysShortTerms: this.form.get('remainDaysShortTermLoan').value ? this.form.get('remainDaysShortTermLoan').value : '',
            // freeText3: this.form.get('freeTextThree').value ? this.form.get('freeTextThree').value : '',
            // freeText4: this.form.get('freeTextFour').value ? this.form.get('freeTextFour').value : '',
            // freeText5: this.form.get('freeTextFive').value ? this.form.get('freeTextFive').value : '',
            // SulkaPreExport: this.form.get('sulkaPreExport').value ? this.form.get('sulkaPreExport').value : '',
            // interestRatePre: this.form.get('interestRatePreExport').value ? this.form.get('interestRatePreExport').value : '',
            // tslint:disable-next-line:max-line-length
            /*interestRateDocumentary: this.documentaryFreeText2(),
            // tslint:disable-next-line:max-line-length
            loanPaymentDocumentary: this.documentaryFreeText3(),*/
            // freeText6: this.form.get('freeTextSix').value ? this.form.get('freeTextSix').value : '',
            // freeText7: this.form.get('freeTextSeven').value ? this.form.get('freeTextSeven').value : '',
            // freeText8: this.form.get('freeTextEight').value ? this.form.get('freeTextEight').value : '',
            // freeText9: this.form.get('freeTextNine').value ? this.form.get('freeTextNine').value : '',
            // termLoanFreeText: !ObjectUtil.isEmpty(this.termLoanFreeText) ? this.termLoanFreeText : '',
            /*freeText10: !ObjectUtil.isEmpty(tempTermLoanFreeVal) ? tempTermLoanFreeVal.freeText10 : '',
            freeText11: !ObjectUtil.isEmpty(tempTermLoanFreeVal) ? tempTermLoanFreeVal.freeText11 : '',
            freeText12: !ObjectUtil.isEmpty(tempTermLoanFreeVal) ? tempTermLoanFreeVal.freeText12 : '',
            SNLimitVehicleLoan: !ObjectUtil.isEmpty(tempTermLoanFreeVal) ? tempTermLoanFreeVal.SNLimitVehicleLoan : '',
            newEMISubsequentVehicleLoan1: !ObjectUtil.isEmpty(tempTermLoanFreeVal) ? tempTermLoanFreeVal.newEMISubsequentVehicleLoan1 : '',*/
            freeText13: !ObjectUtil.isEmpty(tempMortgageEquity) ? tempMortgageEquity.freeText13 : '',
            SNOfParentLimitMortgageTerm: !ObjectUtil.isEmpty(tempMortgageEquity) ? tempMortgageEquity.SNOfParentLimitMortgageTerm : '',
            newEMIAutoPopulateMortgageTerm1: !ObjectUtil.isEmpty(tempMortgageEquity) ? tempMortgageEquity.newEMIAutoPopulateMortgageTerm1 : '',
            freeText16: this.form.get('freeTextSixteen').value ? this.form.get('freeTextSixteen').value : '',
            snOfFacility: this.form.get('SNOfFacility').value ? this.form.get('SNOfFacility').value : '',
            // remainDaysLoan: this.form.get('remainDaysLoanTrust').value ? this.form.get('remainDaysLoanTrust').value : '',
            // SNIrrevocable: this.form.get('SNOfParentLimitIrrevocable').value ? this.form.get('SNOfParentLimitIrrevocable').value : '',
            // SNTimeLetter: this.form.get('SNOfParentLimitTimeLetter').value ? this.form.get('SNOfParentLimitTimeLetter').value : '',
            // tslint:disable-next-line:max-line-length
            // SNBillsDiscounting: this.form.get('SNOfParentLimitBillsDiscounting').value ? this.form.get('SNOfParentLimitBillsDiscounting').value : '',
            // SNLoanTrust: this.form.get('SNOfParentLimitLoanTrust').value ? this.form.get('SNOfParentLimitLoanTrust').value : '',
            // SNShortTermLoan: this.form.get('SNOfParentLimitShortTermLoan').value ? this.form.get('SNOfParentLimitShortTermLoan').value : '',
            // SNDemandLoan: this.form.get('SNOfParentLimitDemandLoan').value ? this.form.get('SNOfParentLimitDemandLoan').value : '',
            // SNPreExport: this.form.get('SNOfParentLimitPreExport').value ? this.form.get('SNOfParentLimitPreExport').value : '',
            // tslint:disable-next-line:max-line-length
            // SNDocumentaryBill: this.form.get('SNOfParentLimitDocumentaryBill').value ? this.form.get('SNOfParentLimitDocumentaryBill').value : '',
            documentaryBillPurchaseFreeText: this.documentaryBillFreeText(),
            billsPurchaseFreeText: this.billsPurchaseFreeText(),
            importBillsDiscountingFreeText: this.importBillsDiscountingFreeText(),
            irrevocableLetterOfCreditFreeText: this.irrevocableLetterOfCreditFree(),
            importLoanTrustReceiptFreeText: this.importLoanTrustReceiptFree(),
            shortTermLoanFreeText: this.shortTermLoanFree(),
            customerAcceptanceFreeText: this.customerAcceptanceFree(),
            demandLoanFreeText: this.demandLoanFree(),
            bridgeGapFreeText: this.bridgeGapFree(),
            preExportLoanFreeText: this.preExportFree(),
            // SNBridgeGap: this.form.get('SNOfParentLimitBridgeGap').value ? this.form.get('SNOfParentLimitBridgeGap').value : '',
            SNBankGuarantee: this.form.get('SNOfParentLimitBankGuarantee').value ? this.form.get('SNOfParentLimitBankGuarantee').value : '',
            // SNBillsPurchase: this.form.get('SNOfParentLimitBillsPurchase').value ? this.form.get('SNOfParentLimitBillsPurchase').value : '',
            // freeText15: this.form.get('freeTextFifteen').value ? this.form.get('freeTextFifteen').value : '',
        };
        return this.freeTextVal;
    }

    preExportFree() {
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.preExportForm) &&
            !ObjectUtil.isEmpty(this.tempData.preExportForm.termLoanDetails)) {
            for (let val = 0; val < this.tempData.preExportForm.termLoanDetails.length; val++) {
                const tempFreeText = {
                    SNOfParentLimitPreExport: this.form.get(['preExportLoan', val, 'SNOfParentLimitPreExport']).value ?
                        this.form.get(['preExportLoan', val, 'SNOfParentLimitPreExport']).value : '',
                    sulkaPreExport: this.form.get(['preExportLoan', val, 'sulkaPreExport']).value ?
                        this.form.get(['preExportLoan', val, 'sulkaPreExport']).value : '',
                    interestRatePreExport: this.form.get(['preExportLoan', val, 'interestRatePreExport']).value ?
                        this.form.get(['preExportLoan', val, 'interestRatePreExport']).value : '',
                    freeTextFour: this.form.get(['preExportLoan', val, 'freeTextFour']).value ?
                        this.form.get(['preExportLoan', val, 'freeTextFour']).value : '',
                    freeTextFive: this.form.get(['preExportLoan', val, 'freeTextFive']).value ?
                    this.form.get(['preExportLoan', val, 'freeTextFive']).value : '',
                };
                this.preExportLoanFreeText.push(tempFreeText);
            }
            return this.preExportLoanFreeText;
        }
    }
    bridgeGapFree() {
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.bridgeGapLoan) &&
            !ObjectUtil.isEmpty(this.tempData.bridgeGapLoan.bridgeGapDetails)) {
            for (let val = 0; val < this.tempData.bridgeGapLoan.bridgeGapDetails.length; val++) {
                const tempFreeText = {
                    SNOfParentLimitBridgeGap: this.form.get(['bridgeGapLoan', val, 'SNOfParentLimitBridgeGap']).value ?
                        this.form.get(['bridgeGapLoan', val, 'SNOfParentLimitBridgeGap']).value : '',
                    freeTextSix: this.form.get(['bridgeGapLoan', val, 'freeTextSix']).value ?
                        this.form.get(['bridgeGapLoan', val, 'freeTextSix']).value : '',
                    freeTextSeven: this.form.get(['bridgeGapLoan', val, 'freeTextSeven']).value ?
                        this.form.get(['bridgeGapLoan', val, 'freeTextSeven']).value : '',
                    freeTextEight: this.form.get(['bridgeGapLoan', val, 'freeTextEight']).value ?
                        this.form.get(['bridgeGapLoan', val, 'freeTextEight']).value : '',
                    freeTextNine: this.form.get(['bridgeGapLoan', val, 'freeTextNine']).value ?
                        this.form.get(['bridgeGapLoan', val, 'freeTextNine']).value : '',
                };
                this.bridgeGapLoanFreeText.push(tempFreeText);
            }
            return this.bridgeGapLoanFreeText;
        }
    }
    demandLoanFree() {
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.demandLoanForm) &&
            !ObjectUtil.isEmpty(this.tempData.demandLoanForm.demandLoanFormArray)) {
            for (let val = 0; val < this.tempData.demandLoanForm.demandLoanFormArray.length; val++) {
                const tempFreeText = {
                    SNOfParentLimitDemandLoan: this.form.get(['demandLoan', val, 'SNOfParentLimitDemandLoan']).value ?
                        this.form.get(['demandLoan', val, 'SNOfParentLimitDemandLoan']).value : '',
                };
                this.demandLoanFreeText.push(tempFreeText);
            }
            return this.demandLoanFreeText;
        }
    }
    customerAcceptanceFree() {
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.timeLetterCreditForm) &&
            !ObjectUtil.isEmpty(this.tempData.timeLetterCreditForm.timeLetterCreditFormArray)) {
            for (let val = 0; val < this.tempData.timeLetterCreditForm.timeLetterCreditFormArray.length; val++) {
                const tempFreeText = {
                    SNOfParentLimitTimeLetter: this.form.get(['customerAcceptanceLetterOfCredit', val, 'SNOfParentLimitTimeLetter']).value ?
                        this.form.get(['customerAcceptanceLetterOfCredit', val, 'SNOfParentLimitTimeLetter']).value : '',
                    loanExpiryDateTimeLetter2: this.form.get(['customerAcceptanceLetterOfCredit', val, 'loanExpiryDateTimeLetter2']).value ?
                        this.form.get(['customerAcceptanceLetterOfCredit', val, 'loanExpiryDateTimeLetter2']).value : '',
                };
                this.customerAccentanceLetterOfCreditFreeText.push(tempFreeText);
            }
            return this.customerAccentanceLetterOfCreditFreeText;
        }
    }
    shortTermLoanFree() {
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.revolvingShortTermLoan) &&
            !ObjectUtil.isEmpty(this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray)) {
            for (let val = 0; val < this.tempData.revolvingShortTermLoan.revolvingShortTermLoanFormArray.length; val++) {
                const tempFreeText = {
                    freeTextThree: this.form.get(['revolvingShortTermLoan', val, 'freeTextThree']).value ?
                        this.form.get(['revolvingShortTermLoan', val, 'freeTextThree']).value : '',
                    // remainDaysShortTermLoan: this.form.get(['revolvingShortTermLoan', val, 'remainDaysShortTermLoan']).value ?
                    //     this.form.get(['revolvingShortTermLoan', val, 'remainDaysShortTermLoan']).value : '',
                    SNOfParentLimitShortTermLoan: this.form.get(['revolvingShortTermLoan', val, 'SNOfParentLimitShortTermLoan']).value ?
                        this.form.get(['revolvingShortTermLoan', val, 'SNOfParentLimitShortTermLoan']).value : '',
                };
                this.revolvingShortTermFreeText.push(tempFreeText);
            }
            return this.revolvingShortTermFreeText;
        }
    }
    importLoanTrustReceiptFree() {
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.importLoanTrust) &&
            !ObjectUtil.isEmpty(this.tempData.importLoanTrust.importLoanTrustFormArray)) {
            for (let val = 0; val < this.tempData.importLoanTrust.importLoanTrustFormArray.length; val++) {
                const tempFreeText = {
                    freeTextTwo: this.form.get(['importLoanTrustReceiptLoan', val, 'freeTextTwo']).value ?
                        this.form.get(['importLoanTrustReceiptLoan', val, 'freeTextTwo']).value : '',
                    // remainDaysLoanTrust: this.form.get(['importLoanTrustReceiptLoan', val, 'remainDaysLoanTrust']).value ?
                    //     this.form.get(['importLoanTrustReceiptLoan', val, 'remainDaysLoanTrust']).value : '',
                    SNOfParentLimitLoanTrust: this.form.get(['importLoanTrustReceiptLoan', val, 'SNOfParentLimitLoanTrust']).value ?
                        this.form.get(['importLoanTrustReceiptLoan', val, 'SNOfParentLimitLoanTrust']).value : '',
                };
                this.importLoanTrustReceiptFreeText.push(tempFreeText);
            }
            return this.importLoanTrustReceiptFreeText;
        }
    }
    irrevocableLetterOfCreditFree() {
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.letterOfCreditForm) &&
            !ObjectUtil.isEmpty(this.tempData.letterOfCreditForm.letterOfCreditFormArray)) {
            for (let val = 0; val < this.tempData.letterOfCreditForm.letterOfCreditFormArray.length; val++) {
                const tempFreeText = {
                    loanExpiryDateIrrevocable2: this.form.get(['irrevocableLetterOfCredit', val, 'loanExpiryDateIrrevocable2']).value ?
                        this.form.get(['irrevocableLetterOfCredit', val, 'loanExpiryDateIrrevocable2']).value : '',
                    SNOfParentLimitIrrevocable: this.form.get(['irrevocableLetterOfCredit', val, 'SNOfParentLimitIrrevocable']).value ?
                        this.form.get(['irrevocableLetterOfCredit', val, 'SNOfParentLimitIrrevocable']).value : '',
                };
                this.irrevocableLetterOfCreditFreeText.push(tempFreeText);
            }
            return this.irrevocableLetterOfCreditFreeText;
        }
    }
    importBillsDiscountingFreeText() {
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.importBillsDiscountForm) &&
            !ObjectUtil.isEmpty(this.tempData.importBillsDiscountForm.importBillsDiscountFormArray)) {
            for (let val = 0; val < this.tempData.importBillsDiscountForm.importBillsDiscountFormArray.length; val++) {
                const tempFreeText = {
                    SNOfParentLimitBillsDiscounting: this.form.get(['importBillsDiscounting', val, 'SNOfParentLimitBillsDiscounting']).value ?
                        this.form.get(['importBillsDiscounting', val, 'SNOfParentLimitBillsDiscounting']).value : '',
                    freeTextOne: this.form.get(['importBillsDiscounting', val, 'freeTextOne']).value ?
                        this.form.get(['importBillsDiscounting', val, 'freeTextOne']).value : '',
                };
                this.importBillsFreeText.push(tempFreeText);
            }
            return this.importBillsFreeText;
        }
    }
    billsPurchaseFreeText() {
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.billPurchaseForm) &&
            !ObjectUtil.isEmpty(this.tempData.billPurchaseForm.billPurchaseFormArray)) {
            for (let val = 0; val < this.tempData.billPurchaseForm.billPurchaseFormArray.length; val++) {
                const tempFreeText = {
                    SNOfParentLimitBillsPurchase: this.form.get(['billsPurchase', val, 'SNOfParentLimitBillsPurchase']).value ?
                        this.form.get(['billsPurchase', val, 'SNOfParentLimitBillsPurchase']).value : '',
                    freeTextFifteen: this.form.get(['billsPurchase', val, 'freeTextFifteen']).value ?
                        this.form.get(['billsPurchase', val, 'freeTextFifteen']).value : '',
                };
                this.billPurchaseFreeText.push(tempFreeText);
            }
            return this.billPurchaseFreeText;
        }
    }
    documentaryBillFreeText() {
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.documentaryBillPurchase) &&
            !ObjectUtil.isEmpty(this.tempData.documentaryBillPurchase.documentaryBillPurchaseFormArray)) {
            for (let val = 0; val < this.tempData.documentaryBillPurchase.documentaryBillPurchaseFormArray.length; val++) {
                const tempFreeText = {
                    SNOfParentLimitDocumentaryBill: this.form.get(['documentaryBillPurchaseNegotiation', val, 'SNOfParentLimitDocumentaryBill']).value ?
                        this.form.get(['documentaryBillPurchaseNegotiation', val, 'SNOfParentLimitDocumentaryBill']).value : '',
                    InterestRateDocumentaryBill: this.form.get(['documentaryBillPurchaseNegotiation', val, 'InterestRateDocumentaryBill']).value ?
                        this.form.get(['documentaryBillPurchaseNegotiation', val, 'InterestRateDocumentaryBill']).value : '',
                    loanPaymentDocumentaryBill: this.form.get(['documentaryBillPurchaseNegotiation', val, 'loanPaymentDocumentaryBill']).value ?
                        this.form.get(['documentaryBillPurchaseNegotiation', val, 'loanPaymentDocumentaryBill']).value : '',
                };
                this.documentaryFreeText.push(tempFreeText);
            }
            return this.documentaryFreeText;
        }
    }
    setFreeText() {
        this.setDocumentaryBillFreetext();
        this.setBillsPurchaseFreeText();
        this.setImportBillsFreeText();
        this.setIrrevocableLetterOfCreditFreeText();
        this.setImportLoanTrustReceiptLoanFreeText();
        this.setRevolvingShortTermLoanFreeText();
        this.setCustomerAcceptanceLetterOfCreditFreeText();
        this.setDemandLoanFreeText();
        this.setBridgeGapFreeText();
        this.setPreExportLoanFreeText();
        this.form.patchValue({
            // freeTextOne: this.tempInformation ? this.tempInformation.section2.freeText1 : '',
            // freeTextTwo: this.tempInformation ? this.tempInformation.section2.freeText2 : '',
            // freeTextThree: this.tempInformation ? this.tempInformation.section2.freeText3 : '',
            // freeTextFour: this.tempInformation ? this.tempInformation.section2.freeText4 : '',
            // freeTextFive: this.tempInformation ? this.tempInformation.section2.freeText5 : '',
            // freeTextSix: this.tempInformation ? this.tempInformation.section2.freeText6 : '',
            // freeTextSeven: this.tempInformation ? this.tempInformation.section2.freeText7 : '',
            // freeTextEight: this.tempInformation ? this.tempInformation.section2.freeText8 : '',
            // freeTextNine: this.tempInformation ? this.tempInformation.section2.freeText9 : '',
            // freeTextFifteen: this.tempInformation ? this.tempInformation.section2.freeText15 : '',
            freeTextSixteen: this.tempInformation ? this.tempInformation.section2.freeText16 : '',
            // loanExpiryDateIrrevocable2: this.tempInformation ? this.tempInformation.section2.loanExpiryIrrevocable : '',
            // loanExpiryDateTimeLetter2: this.tempInformation ? this.tempInformation.section2.loanExpiryTimeLetter : '',
            // remainDaysShortTermLoan: this.tempInformation ? this.tempInformation.section2.remainingDaysShortTerms : '',
            // interestRatePreExport: this.tempInformation ? this.tempInformation.section2.interestRatePre : '',
            // sulkaPreExport: this.tempInformation ? this.tempInformation.section2.SulkaPreExport : '',
           /* InterestRateDocumentaryBill: this.tempInformation ? this.tempInformation.section2.interestRateDocumentary : '',
            loanPaymentDocumentaryBill: this.tempInformation ? this.tempInformation.section2.loanPaymentDocumentary : '',*/
            SNOfFacility: this.tempInformation ? this.tempInformation.section2.snOfFacility : '',
            // remainDaysLoanTrust: this.tempInformation ? this.tempInformation.section2.remainDaysLoan : '',
            // SNOfParentLimitIrrevocable: this.tempInformation ? this.tempInformation.section2.SNIrrevocable : '',
            // SNOfParentLimitTimeLetter: this.tempInformation ? this.tempInformation.section2.SNTimeLetter : '',
            // SNOfParentLimitBillsDiscounting: this.tempInformation ? this.tempInformation.section2.SNBillsDiscounting : '',
            // SNOfParentLimitLoanTrust: this.tempInformation ? this.tempInformation.section2.SNLoanTrust : '',
            // SNOfParentLimitShortTermLoan: this.tempInformation ? this.tempInformation.section2.SNShortTermLoan : '',
            // SNOfParentLimitDemandLoan: this.tempInformation ? this.tempInformation.section2.SNDemandLoan : '',
            // SNOfParentLimitPreExport: this.tempInformation ? this.tempInformation.section2.SNPreExport : '',
            // SNOfParentLimitDocumentaryBill: this.tempInformation ? this.tempInformation.section2.SNDocumentaryBill : '',
            // SNOfParentLimitBridgeGap: this.tempInformation ? this.tempInformation.section2.SNBridgeGap : '',
            SNOfParentLimitBankGuarantee: this.tempInformation ? this.tempInformation.section2.SNBankGuarantee : '',
            // SNOfParentLimitBillsPurchase: this.tempInformation ? this.tempInformation.section2.SNBillsPurchase : '',
        });
    }

    setPreExportLoanFreeText() {
        if (!ObjectUtil.isEmpty(this.tempInformation) &&
            !ObjectUtil.isEmpty(this.tempInformation.section2) &&
            !ObjectUtil.isEmpty(this.tempInformation.section2.preExportLoanFreeText)) {
            for (let val = 0; val < this.tempInformation.section2.preExportLoanFreeText.length; val++) {
                this.form.get(['preExportLoan', val, 'SNOfParentLimitPreExport']).patchValue(
                    this.tempInformation.section2.preExportLoanFreeText[val] ?
                        this.tempInformation.section2.preExportLoanFreeText[val].SNOfParentLimitPreExport : '');
                this.form.get(['preExportLoan', val, 'sulkaPreExport']).patchValue(
                    this.tempInformation.section2.preExportLoanFreeText[val] ?
                        this.tempInformation.section2.preExportLoanFreeText[val].sulkaPreExport : '');
                this.form.get(['preExportLoan', val, 'interestRatePreExport']).patchValue(
                    this.tempInformation.section2.preExportLoanFreeText[val] ?
                        this.tempInformation.section2.preExportLoanFreeText[val].interestRatePreExport : '');
                this.form.get(['preExportLoan', val, 'freeTextFour']).patchValue(
                    this.tempInformation.section2.preExportLoanFreeText[val] ?
                        this.tempInformation.section2.preExportLoanFreeText[val].freeTextFour : '');
                this.form.get(['preExportLoan', val, 'freeTextFive']).patchValue(
                    this.tempInformation.section2.preExportLoanFreeText[val] ?
                        this.tempInformation.section2.preExportLoanFreeText[val].freeTextFive : '');
            }
        }
    }
    setBridgeGapFreeText() {
        if (!ObjectUtil.isEmpty(this.tempInformation) &&
            !ObjectUtil.isEmpty(this.tempInformation.section2) &&
            !ObjectUtil.isEmpty(this.tempInformation.section2.bridgeGapFreeText)) {
            for (let val = 0; val < this.tempInformation.section2.bridgeGapFreeText.length; val++) {
                this.form.get(['bridgeGapLoan', val, 'SNOfParentLimitBridgeGap']).patchValue(
                    this.tempInformation.section2.bridgeGapFreeText[val] ?
                        this.tempInformation.section2.bridgeGapFreeText[val].SNOfParentLimitBridgeGap : '');
                this.form.get(['bridgeGapLoan', val, 'freeTextSix']).patchValue(
                    this.tempInformation.section2.bridgeGapFreeText[val] ?
                        this.tempInformation.section2.bridgeGapFreeText[val].freeTextSix : '');
                this.form.get(['bridgeGapLoan', val, 'freeTextSeven']).patchValue(
                    this.tempInformation.section2.bridgeGapFreeText[val] ?
                        this.tempInformation.section2.bridgeGapFreeText[val].freeTextSeven : '');
                this.form.get(['bridgeGapLoan', val, 'freeTextEight']).patchValue(
                    this.tempInformation.section2.bridgeGapFreeText[val] ?
                        this.tempInformation.section2.bridgeGapFreeText[val].freeTextEight : '');
                this.form.get(['bridgeGapLoan', val, 'freeTextNine']).patchValue(
                    this.tempInformation.section2.bridgeGapFreeText[val] ?
                        this.tempInformation.section2.bridgeGapFreeText[val].freeTextNine : '');
            }
        }
    }
    setDemandLoanFreeText() {
        if (!ObjectUtil.isEmpty(this.tempInformation) &&
            !ObjectUtil.isEmpty(this.tempInformation.section2) &&
            !ObjectUtil.isEmpty(this.tempInformation.section2.demandLoanFreeText)) {
            for (let val = 0; val < this.tempInformation.section2.demandLoanFreeText.length; val++) {
                this.form.get(['demandLoan', val, 'SNOfParentLimitDemandLoan']).patchValue(
                    this.tempInformation.section2.demandLoanFreeText[val] ?
                        this.tempInformation.section2.demandLoanFreeText[val].SNOfParentLimitDemandLoan : '');
            }
        }
    }
    setCustomerAcceptanceLetterOfCreditFreeText() {
        if (!ObjectUtil.isEmpty(this.tempInformation) &&
            !ObjectUtil.isEmpty(this.tempInformation.section2) &&
            !ObjectUtil.isEmpty(this.tempInformation.section2.customerAcceptanceFreeText)) {
            for (let val = 0; val < this.tempInformation.section2.customerAcceptanceFreeText.length; val++) {
                this.form.get(['customerAcceptanceLetterOfCredit', val, 'loanExpiryDateTimeLetter2']).patchValue(
                    this.tempInformation.section2.customerAcceptanceFreeText[val] ?
                        this.tempInformation.section2.customerAcceptanceFreeText[val].loanExpiryDateTimeLetter2 : '');
                this.form.get(['customerAcceptanceLetterOfCredit', val, 'SNOfParentLimitTimeLetter']).patchValue(
                    this.tempInformation.section2.customerAcceptanceFreeText[val] ?
                        this.tempInformation.section2.customerAcceptanceFreeText[val].SNOfParentLimitTimeLetter : '');
            }
        }
    }
    setRevolvingShortTermLoanFreeText() {
        if (!ObjectUtil.isEmpty(this.tempInformation) &&
            !ObjectUtil.isEmpty(this.tempInformation.section2) &&
            !ObjectUtil.isEmpty(this.tempInformation.section2.shortTermLoanFreeText)) {
            for (let val = 0; val < this.tempInformation.section2.shortTermLoanFreeText.length; val++) {
                this.form.get(['revolvingShortTermLoan', val, 'freeTextThree']).patchValue(
                    this.tempInformation.section2.shortTermLoanFreeText[val] ?
                        this.tempInformation.section2.shortTermLoanFreeText[val].freeTextThree : '');
                // this.form.get(['revolvingShortTermLoan', val, 'remainDaysShortTermLoan']).patchValue(
                //     this.tempInformation.section2.shortTermLoanFreeText[val] ?
                //         this.tempInformation.section2.shortTermLoanFreeText[val].remainDaysShortTermLoan : '');
                this.form.get(['revolvingShortTermLoan', val, 'SNOfParentLimitShortTermLoan']).patchValue(
                    this.tempInformation.section2.shortTermLoanFreeText[val] ?
                        this.tempInformation.section2.shortTermLoanFreeText[val].SNOfParentLimitShortTermLoan : '');
            }
        }
    }
    setImportLoanTrustReceiptLoanFreeText() {
        if (!ObjectUtil.isEmpty(this.tempInformation) &&
            !ObjectUtil.isEmpty(this.tempInformation.section2) &&
            !ObjectUtil.isEmpty(this.tempInformation.section2.importLoanTrustReceiptFreeText)) {
            for (let val = 0; val < this.tempInformation.section2.importLoanTrustReceiptFreeText.length; val++) {
                this.form.get(['importLoanTrustReceiptLoan', val, 'freeTextTwo']).patchValue(
                    this.tempInformation.section2.importLoanTrustReceiptFreeText[val] ?
                        this.tempInformation.section2.importLoanTrustReceiptFreeText[val].freeTextTwo : '');
                // this.form.get(['importLoanTrustReceiptLoan', val, 'remainDaysLoanTrust']).patchValue(
                //     this.tempInformation.section2.importLoanTrustReceiptFreeText[val] ?
                //         this.tempInformation.section2.importLoanTrustReceiptFreeText[val].remainDaysLoanTrust : '');
                this.form.get(['importLoanTrustReceiptLoan', val, 'SNOfParentLimitLoanTrust']).patchValue(
                    this.tempInformation.section2.importLoanTrustReceiptFreeText[val] ?
                        this.tempInformation.section2.importLoanTrustReceiptFreeText[val].SNOfParentLimitLoanTrust : '');
            }
        }
    }
    setIrrevocableLetterOfCreditFreeText() {
        if (!ObjectUtil.isEmpty(this.tempInformation) &&
            !ObjectUtil.isEmpty(this.tempInformation.section2) &&
            !ObjectUtil.isEmpty(this.tempInformation.section2.irrevocableLetterOfCreditFreeText)) {
            for (let val = 0; val < this.tempInformation.section2.irrevocableLetterOfCreditFreeText.length; val++) {
                this.form.get(['irrevocableLetterOfCredit', val, 'loanExpiryDateIrrevocable2']).patchValue(
                    this.tempInformation.section2.irrevocableLetterOfCreditFreeText[val] ?
                        this.tempInformation.section2.irrevocableLetterOfCreditFreeText[val].loanExpiryDateIrrevocable2 : '');
                this.form.get(['irrevocableLetterOfCredit', val, 'SNOfParentLimitIrrevocable']).patchValue(
                    this.tempInformation.section2.irrevocableLetterOfCreditFreeText[val] ?
                        this.tempInformation.section2.irrevocableLetterOfCreditFreeText[val].SNOfParentLimitIrrevocable : '');
            }
        }
    }
    setImportBillsFreeText() {
        if (!ObjectUtil.isEmpty(this.tempInformation) &&
            !ObjectUtil.isEmpty(this.tempInformation.section2) &&
            !ObjectUtil.isEmpty(this.tempInformation.section2.importBillsDiscountingFreeText)) {
            for (let val = 0; val < this.tempInformation.section2.importBillsDiscountingFreeText.length; val++) {
                this.form.get(['importBillsDiscounting', val, 'SNOfParentLimitBillsDiscounting']).patchValue(
                    this.tempInformation.section2.importBillsDiscountingFreeText[val] ?
                        this.tempInformation.section2.importBillsDiscountingFreeText[val].SNOfParentLimitBillsDiscounting : '');
                this.form.get(['importBillsDiscounting', val, 'freeTextOne']).patchValue(
                    this.tempInformation.section2.importBillsDiscountingFreeText[val] ?
                        this.tempInformation.section2.importBillsDiscountingFreeText[val].freeTextOne : '');
            }
        }
    }
    setBillsPurchaseFreeText() {
        if (!ObjectUtil.isEmpty(this.tempInformation) &&
            !ObjectUtil.isEmpty(this.tempInformation.section2) &&
            !ObjectUtil.isEmpty(this.tempInformation.section2.billsPurchaseFreeText)) {
            for (let val = 0; val < this.tempInformation.section2.billsPurchaseFreeText.length; val++) {
                this.form.get(['billsPurchase', val, 'SNOfParentLimitBillsPurchase']).patchValue(
                    this.tempInformation.section2.billsPurchaseFreeText[val] ?
                        this.tempInformation.section2.billsPurchaseFreeText[val].SNOfParentLimitBillsPurchase : '');
                this.form.get(['billsPurchase', val, 'freeTextFifteen']).patchValue(
                    this.tempInformation.section2.billsPurchaseFreeText[val] ?
                        this.tempInformation.section2.billsPurchaseFreeText[val].freeTextFifteen : '');
            }
        }
    }
    setDocumentaryBillFreetext() {
        if (!ObjectUtil.isEmpty(this.tempInformation) &&
            !ObjectUtil.isEmpty(this.tempInformation.section2) &&
            !ObjectUtil.isEmpty(this.tempInformation.section2.documentaryBillPurchaseFreeText)) {
            for (let val = 0; val < this.tempInformation.section2.documentaryBillPurchaseFreeText.length; val++) {
                this.form.get(['documentaryBillPurchaseNegotiation', val, 'SNOfParentLimitDocumentaryBill']).patchValue(
                    this.tempInformation.section2.documentaryBillPurchaseFreeText[val] ?
                        this.tempInformation.section2.documentaryBillPurchaseFreeText[val].SNOfParentLimitDocumentaryBill : '');
                this.form.get(['documentaryBillPurchaseNegotiation', val, 'InterestRateDocumentaryBill']).patchValue(
                    this.tempInformation.section2.documentaryBillPurchaseFreeText[val] ?
                        this.tempInformation.section2.documentaryBillPurchaseFreeText[val].InterestRateDocumentaryBill : '');
                this.form.get(['documentaryBillPurchaseNegotiation', val, 'loanPaymentDocumentaryBill']).patchValue(
                    this.tempInformation.section2.documentaryBillPurchaseFreeText[val] ?
                        this.tempInformation.section2.documentaryBillPurchaseFreeText[val].loanPaymentDocumentaryBill : '');
            }
        }
    }

    filterLoanData() {
        const tempArray = this.loanData.filter(data => data.loanName !== this.loanNameConstant.AUTO_LOAN &&
            data.loanName !== this.loanNameConstant.TERM_LOAN_TO_FOR_PURCHASE_OF_VEHICLE);
        this.finalLoanDetails = tempArray;
        this.overdraftAgainstBond = this.loanData.filter(data => data.loanName === this.loanNameConstant.OVERDRAFT_FACILITY_AGAINST_BOND);
        this.documentaryBillPurchase = this.loanData.filter(data => data.loanName === this.loanNameConstant.DOCUMENTARY_BILL_PURCHASE_NEGOTIATION);
        this.billsPurchase = this.loanData.filter(data => data.loanName === this.loanNameConstant.BILLS_PURCHASE);
        this.equityMortgageOverdraft = this.loanData.filter(data => data.loanName === this.loanNameConstant.EQUITY_MORTGAGED_OVERDRAFT);
        this.mortgageOverdraft = this.loanData.filter(data => data.loanName === this.loanNameConstant.MORTGAGE_OVERDRAFT);
        this.importBillsDiscounting = this.loanData.filter(data => data.loanName === this.loanNameConstant.IMPORT_BILLS_DISCOUNTING);
        this.irrevocableLetter = this.loanData.filter(data => data.loanName === this.loanNameConstant.IRREVOCABLE_LETTER_OF_CREDIT_FACILITY);
        this.autoLoanDetails = this.loanData.filter(data => data.loanName === this.loanNameConstant.AUTO_LOAN);
        this.termLoanDetails = this.loanData.filter(data => data.loanName === this.loanNameConstant.TERM_LOAN_TO_FOR_PURCHASE_OF_VEHICLE);
        this.importLoanTrustReceipt = this.loanData.filter(data => data.loanName === this.loanNameConstant.IMPORT_LOAN_TRUST_RECEIPT_LOAN);
        this.revolvingShortTerm = this.loanData.filter(data => data.loanName === this.loanNameConstant.SHORT_TERM_LOAN);
        this.customerAccentanceLetterOfCredit = this.loanData.filter(data => data.loanName === this.loanNameConstant.CUSTOMER_ACCEPTANCE_FOR_TIME_LETTER_OF_CREDIT);
        this.demandLoan = this.loanData.filter(data => data.loanName === this.loanNameConstant.DEMAND_LOAN_FOR_WORKING_CAPITAL);
        this.bridgeGap = this.loanData.filter(data => data.loanName === this.loanNameConstant.BRIDGE_GAP_LOAN);
        this.overdraftLoanForWorkingCapitalLoan = this.loanData.filter(data => data.loanName === this.loanNameConstant.OVERDRAFT_LOAN_FOR_WORKING_CAPITAL_REQUIREMENT);
        this.preExportLoan = this.loanData.filter(data => data.loanName === this.loanNameConstant.PRE_EXPORT_LOAN);
    }
}
