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
import {MortgageTermLoanComponent} from './mortgage-term-loan/mortgage-term-loan.component';

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
    tempData: any;
    tempInformation;
    loanData = [];
    freeTextVal: any = {};
    termLoanFreeText = [];
    @ViewChild('termLoanToOrForComponent', {static: false}) termLoanToOrForComponent: TermLoanToOrForComponent;
    @ViewChild('mortgageEquityTermLoanComponent', {static: false}) mortgageEquityTermLoanComponent: MortgageEquityTermLoanComponent;
    @ViewChild('autoLoanComponent', {static: false}) autoLoanComponent: AutoLoanComponent;
    @ViewChild('mortgageTermLoanComponent', {static: false}) mortgageTermLoanComponent: MortgageTermLoanComponent;
    FDName;
    FDNameStl;
    FDNameDl;
    // Dep Name
    DepName;
    DepNameOverdraftLien;
    DepNameStlLien;
    DepNameDlLien;
    // Bond Name
    BondName;
    BondNameStl;
    BondNameDl;
    // final Bond Name Array
    finalBondName = [];
    finalBondNameStl = [];
    finalBondNameDl = [];
    // final Dep Name Lien
    finalDepNameOverdraftLien = [];
    finalDepNameStlLien = [];
    finalDepNameDlLien = [];
    // Final FD Array
    finalFdName = [];
    finalFdNameStl = [];
    finalFdNameDl = [];
    // FD Names Array
    FDNames: Array<String> = [];
    FDNamesStl: Array<String> = [];
    FDNamesDl: Array<String> = [];
    allFDNames;
    // Dep Names Array
    DepNamesOverdraftLien: Array<String> = [];
    DepNamesStlLien: Array<String> = [];
    DepNamesDlLien: Array<String> = [];
    // All Dep Names
    allDepNamesOverdraftLien;
    allDepNamesStlLien;
    allDepNamesDlLien;
    // All FD Names
    allFdNames;
    allFdNamesStl;
    allFdNamesDl;
    // BondNames Array
    BondNames: Array<String> = [];
    BondNamesStl: Array<String> = [];
    BondNamesDl: Array<String> = [];
    // all Bond Names
    allBondNames;
    allBondNamesStl;
    allBondNamesDl;
    loanNameConstant = LoanNameConstant;
    isIrrevocableLetter = false;
    isOverDraftFacilityFixedDeposit = false;
    isTermLoanToOrFor = false;
    isAutoLoanMaster = false;
    isBankGuarantee = false;
    // SME Global Form
    hypothecationGlobal;
    issubsidyOrAgricultureLoan;
    // Irrevocable letter of credit facility
    loanOptionIrrevocable;
    loanOptionTimeLetter;
    loanOptionImportLoanTrust;
    interestSubsidyAgImportLoanTrust;
    arFinancing = false;
    // Overdraft Facility against Fixed Deposit/ Lien on Deposit Account
    subLoanOptionOverdraftFixedForm;
    holdingBankOverdraftFixedForm;
    letterOfSetOffOverdraftFixedForm;
    interestRateTypeOverdraftFixedForm;
    interestSubsidyAgOverdraftFixedForm;
    checkAdditionalPremiumRateOverdraftFixedForm = false;
    accountTypeOverdraftFixedForm;
    interestRateTypeFacilityAgainstBond;
    // Bank Guarantee
    complementaryOtherBankGuarantee = false;
    complementaryOtherBankGuaranteeName;
    securityTypeBankGuarantee;
    guaranteeTypeBankGuarantee;
    commissionTypeBankGuarantee;
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
    equityMortgageTermLoan = [];
    equityMortgageData;
    mortgageTermLoan = [];
    mortgageTermLoanData;
    overdraftFacilityFixedDeposit = [];
    overdraftFacilityLienDeposit = [];
    stlFixedDeposit = [];
    stlLienDeposit = [];
    dlFixedDeposit = [];
    dlLienDeposit = [];
    bankGuaranteeLoan = [];
    bankGuaranteeFree: Array <any> = new Array<any>();
    stlAgainstBond = [];
    dlAgainstBond = [];
    loanOption: any;

    constructor(private formBuilder: FormBuilder,
                private engToNepWord: NepaliCurrencyWordPipe,
                private currencyFormatPipe: CurrencyFormatterPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
    ) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
            this.initialData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
            this.loanOption = this.initialData.smeGlobalForm.loanOption;
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
                this.equityMortgageData = !ObjectUtil.isEmpty(this.tempData.mortgageEquityTermForm) ?
                    this.tempData.mortgageEquityTermForm.mortgageEquityTermFormArray : [];
                this.mortgageTermLoanData = !ObjectUtil.isEmpty(this.tempData.mortgageEquityTermForm) ?
                    this.tempData.mortgageEquityTermForm.mortgageTermFormArray : [];
            }
            this.getFDName();
            this.getDepName();
            this.getBondName();
            this.getLoanName();
            this.checkLoanName();
            this.setFreeText();
        }
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
            overdraftFacilityFixedDeposit: this.formBuilder.array([]),
            overdraftfacilityLienDeposit: this.formBuilder.array([]),
            stlFixedDeposit: this.formBuilder.array([]),
            stlLienDeposit: this.formBuilder.array([]),
            dlFixedDeposit: this.formBuilder.array([]),
            dlLienDeposit: this.formBuilder.array([]),

            // Overdraft Facility against Bond
            overdraftFacilityAgainstBond: this.formBuilder.array([]),
            dlAgainstBond : this.formBuilder.array([]),
            stlAgainstBond: this.formBuilder.array([]),

            // Bridge Gap Loan
            bridgeGapLoan: this.formBuilder.array([]),

            // Bank Guarantee
            bankGuarantee: this.formBuilder.array([]),

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
        this.setOverdraftFixedDeposti();
        this.setOverdraftLienDeposit();
        this.setStlFixedDeposit();
        this.setStlLienDeposit();
        this.setDlFixedDeposit();
        this.setDlLienDeposit();
        this.setBankGuarantee();
        this.setStlAgainstBond();
        this.setDlAgainstBond();
    }
    setOverdraftFacilityAgainstBond() {
        if (!ObjectUtil.isEmpty(this.initialData) &&
            !ObjectUtil.isEmpty(this.initialData.overDraftFacilityForm) &&
            !ObjectUtil.isEmpty(this.initialData.overDraftFacilityForm.overdraftFacilityDetails)) {
            for (let a = 0; a < this.initialData.overDraftFacilityForm.overdraftFacilityDetails.length; a++) {
                (this.form.get('overdraftFacilityAgainstBond') as FormArray).push(this.setOverdraftBondForm());
            }
        }
    }
    setStlAgainstBond() {
        if (!ObjectUtil.isEmpty(this.initialData) &&
            !ObjectUtil.isEmpty(this.initialData.overDraftFacilityForm) &&
            !ObjectUtil.isEmpty(this.initialData.overDraftFacilityForm.stlAgainstBondFormArray)) {
            for (let a = 0; a < this.initialData.overDraftFacilityForm.stlAgainstBondFormArray.length; a++) {
                (this.form.get('stlAgainstBond') as FormArray).push(this.setOverdraftBondForm());
            }
        }
    }
    setDlAgainstBond() {
        if (!ObjectUtil.isEmpty(this.initialData) &&
            !ObjectUtil.isEmpty(this.initialData.overDraftFacilityForm) &&
            !ObjectUtil.isEmpty(this.initialData.overDraftFacilityForm.dlAgainstBondFormArray)) {
            for (let a = 0; a < this.initialData.overDraftFacilityForm.dlAgainstBondFormArray.length; a++) {
                (this.form.get('dlAgainstBond') as FormArray).push(this.setOverdraftBondForm());
            }
        }
    }
    setBankGuarantee() {
        if (!ObjectUtil.isEmpty(this.initialData) &&
            !ObjectUtil.isEmpty(this.initialData.bankGuarantee) &&
            !ObjectUtil.isEmpty(this.initialData.bankGuarantee.bankGuaranteeArray)) {
            for (let a = 0; a < this.initialData.bankGuarantee.bankGuaranteeArray.length; a++) {
                (this.form.get('bankGuarantee') as FormArray).push(this.setBankGuaranteeForm());
            }
        }
    }
    setOverdraftFixedDeposti() {
        if (!ObjectUtil.isEmpty(this.initialData) &&
            !ObjectUtil.isEmpty(this.initialData.overdraftFixedForm) &&
            !ObjectUtil.isEmpty(this.initialData.overdraftFixedForm.odFdFormArray)) {
            for (let a = 0; a < this.initialData.overdraftFixedForm.odFdFormArray.length; a++) {
                (this.form.get('overdraftFacilityFixedDeposit') as FormArray).push(this.setDepositForm());
            }
        }
    }
    setOverdraftLienDeposit() {
        if (!ObjectUtil.isEmpty(this.initialData) &&
            !ObjectUtil.isEmpty(this.initialData.overdraftFixedForm) &&
            !ObjectUtil.isEmpty(this.initialData.overdraftFixedForm.overdraftLienOnDepositFormArray)) {
            for (let a = 0; a < this.initialData.overdraftFixedForm.overdraftLienOnDepositFormArray.length; a++) {
                (this.form.get('overdraftfacilityLienDeposit') as FormArray).push(this.setDepositForm());
            }
        }
    }
    setStlFixedDeposit() {
        if (!ObjectUtil.isEmpty(this.initialData) &&
            !ObjectUtil.isEmpty(this.initialData.overdraftFixedForm) &&
            !ObjectUtil.isEmpty(this.initialData.overdraftFixedForm.stlAgainstFixedDepositFormArray)) {
            for (let a = 0; a < this.initialData.overdraftFixedForm.stlAgainstFixedDepositFormArray.length; a++) {
                (this.form.get('stlFixedDeposit') as FormArray).push(this.setDepositForm());
            }
        }
    }
    setStlLienDeposit() {
        if (!ObjectUtil.isEmpty(this.initialData) &&
            !ObjectUtil.isEmpty(this.initialData.overdraftFixedForm) &&
            !ObjectUtil.isEmpty(this.initialData.overdraftFixedForm.stlLienOnDepositFormArray)) {
            for (let a = 0; a < this.initialData.overdraftFixedForm.stlLienOnDepositFormArray.length; a++) {
                (this.form.get('stlLienDeposit') as FormArray).push(this.setDepositForm());
            }
        }
    }
    setDlFixedDeposit() {
        if (!ObjectUtil.isEmpty(this.initialData) &&
            !ObjectUtil.isEmpty(this.initialData.overdraftFixedForm) &&
            !ObjectUtil.isEmpty(this.initialData.overdraftFixedForm.dlAgainstFixedDepositFormArray)) {
            for (let a = 0; a < this.initialData.overdraftFixedForm.dlAgainstFixedDepositFormArray.length; a++) {
                (this.form.get('dlFixedDeposit') as FormArray).push(this.setDepositForm());
            }
        }
    }
    setDlLienDeposit() {
        if (!ObjectUtil.isEmpty(this.initialData) &&
            !ObjectUtil.isEmpty(this.initialData.overdraftFixedForm) &&
            !ObjectUtil.isEmpty(this.initialData.overdraftFixedForm.dlAgainstLienOnDepositFormArray)) {
            for (let a = 0; a < this.initialData.overdraftFixedForm.dlAgainstLienOnDepositFormArray.length; a++) {
                (this.form.get('dlLienDeposit') as FormArray).push(this.setDepositForm());
            }
        }
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
    setBankGuaranteeForm() {
        return this.formBuilder.group({
            SNOfParentLimitBankGuarantee: [undefined],
            nameOfBankBankGuarantee: [undefined],
            marginInPercentageBankGuarantee: [undefined],
            commissionAPGBankGuarantee: [undefined],
            commissionBidBondBankGuarantee: [undefined],
            serviceChargeBankGuarantee: [undefined],
            minimumServiceChargeBankGuarantee: [undefined],
            commissionAPG1BankGuarantee: [undefined],
            commissionBidBond1BankGuarantee: [undefined],
            loanExpiryDateBankGuarantee1: [undefined]
        });
    }
    setDepositForm() {
        return this.formBuilder.group({
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
        });
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
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.overdraftFixedForm)) {
            if (!ObjectUtil.isEmpty(this.tempData.overdraftFixedForm.odFdFormArray)) {
                this.getFixedDepositors(this.tempData.overdraftFixedForm.odFdFormArray,
                    this.FDName, this.FDNames, this.allFdNames, this.finalFdName);
            }
            if (!ObjectUtil.isEmpty(this.tempData.overdraftFixedForm.stlAgainstFixedDepositFormArray)) {
                this.getFixedDepositors(this.tempData.overdraftFixedForm.stlAgainstFixedDepositFormArray,
                    this.FDNameStl, this.FDNamesStl, this.allFdNamesStl, this.finalFdNameStl);
            }
            if (!ObjectUtil.isEmpty(this.tempData.overdraftFixedForm.dlAgainstFixedDepositFormArray)) {
                this.getFixedDepositors(this.tempData.overdraftFixedForm.dlAgainstFixedDepositFormArray,
                    this.FDNameDl, this.FDNamesDl, this.allFdNamesDl, this.finalFdNameDl);
            }
        }
    }

    getFixedDepositors(mainArray, name, names, allNames, finalName) {
        for (let val = 0; val < mainArray.length; val++) {
            if (mainArray[val]['fdHolderDetails'].length > 0) {
                if (mainArray[val]['fdHolderDetails'].length === 1) {
                    const temp = mainArray[val]['fdHolderDetails'][0].nameOfFDHolderCT;
                    name = temp;
                } else if (mainArray[val]['fdHolderDetails'].length === 2) {
                    for (let i = 0; i < mainArray[val]['fdHolderDetails'].length; i++) {
                        const temp = mainArray[val]['fdHolderDetails'][i].nameOfFDHolderCT;
                        names.push(temp);
                    }
                    allNames = names.join(' र ');
                    name = allNames;
                } else {
                    for (let i = 0; i < mainArray[val]['fdHolderDetails'].length - 1; i++) {
                        const temp = mainArray[val]['fdHolderDetails'][i].nameOfFDHolderCT;
                        names.push(temp);
                    }
                    allNames = names.join(' , ');
                    // tslint:disable-next-line:max-line-length
                    const temp1 = mainArray[val]['fdHolderDetails'][mainArray[val]['fdHolderDetails'].length - 1].nameOfFDHolderCT;
                    name = allNames + ' र ' + temp1;
                }
                finalName.push(name);
                name = '';
                allNames = '';
                names = [];
            }
        }
    }

    getDepName() {
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.overdraftFixedForm)) {
            if (!ObjectUtil.isEmpty(this.tempData.overdraftFixedForm.overdraftLienOnDepositFormArray)) {
                this.getDepositor(this.tempData.overdraftFixedForm.overdraftLienOnDepositFormArray,
                    this.DepNameOverdraftLien, this.DepNamesOverdraftLien, this.allDepNamesOverdraftLien, this.finalDepNameOverdraftLien);
            }
            if (!ObjectUtil.isEmpty(this.tempData.overdraftFixedForm.stlLienOnDepositFormArray)) {
                this.getDepositor(this.tempData.overdraftFixedForm.stlLienOnDepositFormArray,
                    this.DepNameStlLien, this.DepNamesStlLien, this.allDepNamesStlLien, this.finalDepNameStlLien);
            }
            if (!ObjectUtil.isEmpty(this.tempData.overdraftFixedForm.dlAgainstLienOnDepositFormArray)) {
                this.getDepositor(this.tempData.overdraftFixedForm.dlAgainstLienOnDepositFormArray,
                    this.DepNameDlLien, this.DepNamesDlLien, this.allDepNamesDlLien, this.finalDepNameDlLien);
            }
        }
    }

    getDepositor(mainArray, name, names, allNames, finalName) {
        if (mainArray.length > 0) {
            for (let val = 0; val < mainArray.length; val++) {
                if (mainArray[val]['depositorDetails'].length > 0) {
                    if (mainArray[val]['depositorDetails'].length === 1) {
                        const temp = mainArray[val]['depositorDetails'][0].nameOfDepositorsCT;
                        name = temp;
                    } else if (mainArray[val]['depositorDetails'].length === 2) {
                        for (let i = 0; i < mainArray[val]['depositorDetails'].length; i++) {
                            const temp = mainArray[val]['depositorDetails'][i].nameOfDepositorsCT;
                            names.push(temp);
                        }
                        allNames = names.join(' र ');
                        name = allNames;
                    } else {
                        for (let i = 0; i < mainArray[val]['depositorDetails'].length - 1; i++) {
                            const temp = mainArray[val]['depositorDetails'][i].nameOfDepositorsCT;
                            names.push(temp);
                        }
                        allNames = names.join(' , ');
                        // tslint:disable-next-line:max-line-length
                        const temp1 = mainArray[val]['depositorDetails'][mainArray[val]['depositorDetails'].length - 1].nameOfDepositorsCT;
                        name = allNames + ' र ' + temp1;
                    }
                }
                finalName.push(name);
                name = '';
                allNames = '';
                names = [];
            }
        }
    }

    getBondName() {
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.overDraftFacilityForm)) {
            if (!ObjectUtil.isEmpty(this.tempData.overDraftFacilityForm.overdraftFacilityDetails)) {
                this.getBondDetails(this.tempData.overDraftFacilityForm.overdraftFacilityDetails,
                    this.BondName, this.BondNames, this.allBondNames, this.finalBondName);
            }
            if (!ObjectUtil.isEmpty(this.tempData.overDraftFacilityForm.dlAgainstBondFormArray)) {
                this.getBondDetails(this.tempData.overDraftFacilityForm.dlAgainstBondFormArray,
                    this.BondNameDl, this.BondNamesDl, this.allBondNamesDl, this.finalBondNameDl);
            }
            if (!ObjectUtil.isEmpty(this.tempData.overDraftFacilityForm.stlAgainstBondFormArray)) {
                this.getBondDetails(this.tempData.overDraftFacilityForm.stlAgainstBondFormArray,
                    this.BondNameStl, this.BondNamesStl, this.allBondNamesStl, this.finalBondNameStl);
            }
        }
    }

    getBondDetails(mainArray, name, names, allNames, finalName) {
        for (let val = 0; val < mainArray.length; val++) {
            if (mainArray[val]['bondDetails'].length > 0) {
                if (mainArray[val]['bondDetails'].length === 1) {
                    const temp = mainArray[val]['bondDetails'][0].bondOwnerNameCT;
                    name = temp;
                } else if (mainArray[val]['bondDetails'].length === 2) {
                    for (let i = 0; i < mainArray[val]['bondDetails'].length; i++) {
                        const temp = mainArray[val]['bondDetails'][i].bondOwnerNameCT;
                        names.push(temp);
                    }
                    allNames = names.join(' र ');
                    name = allNames;
                } else {
                    for (let i = 0; i < mainArray[val]['bondDetails'].length - 1; i++) {
                        const temp = mainArray[val]['bondDetails'][i].bondOwnerNameCT;
                        names.push(temp);
                    }
                    allNames = names.join(' , ');
                    // tslint:disable-next-line:max-line-length
                    const temp1 = mainArray[val]['bondDetails'][mainArray[val]['bondDetails'].length - 1].bondOwnerNameCT;
                    name = allNames + ' र ' + temp1;
                }
                finalName.push(name);
                name = '';
                allNames = '';
                names = [];
            }
        }
    }
    private checkLoanName(): void {
        if (this.finalLoanDetails.length > 0) {
            this.finalLoanDetails.forEach(v => {
                if (v.loanName === LoanNameConstant.TERM_LOAN_TO_FOR_PURCHASE_OF_VEHICLE) {
                    this.isTermLoanToOrFor = true;
                }
                if (v.loanName === LoanNameConstant.AUTO_LOAN) {
                    this.isAutoLoanMaster = true;
                }
            });
        }
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
        this.bankGuaranteeFormPatchValue();
        if (this.overdraftFacilityFixedDeposit.length > 0) {
            this.overdraftFixedFormPatchValue('overdraftFacilityFixedDeposit',
                this.tempData.overdraftFixedForm.odFdFormArray, this.finalFdName, 'fixedDeposit');
        }
        if (this.overdraftFacilityLienDeposit.length > 0) {
            this.overdraftFixedFormPatchValue('overdraftfacilityLienDeposit',
                this.tempData.overdraftFixedForm.overdraftLienOnDepositFormArray, this.finalDepNameOverdraftLien, 'lienDeposit');
        }
        if (this.stlFixedDeposit.length > 0) {
            this.overdraftFixedFormPatchValue('stlFixedDeposit',
                this.tempData.overdraftFixedForm.stlAgainstFixedDepositFormArray, this.finalFdNameStl, 'fixedDeposit');
        }
        if (this.stlLienDeposit.length > 0) {
            this.overdraftFixedFormPatchValue('stlLienDeposit',
                this.tempData.overdraftFixedForm.stlLienOnDepositFormArray, this.finalDepNameStlLien, 'lienDeposit');
        }
        if (this.dlFixedDeposit.length > 0) {
            this.overdraftFixedFormPatchValue('dlFixedDeposit',
                this.tempData.overdraftFixedForm.dlAgainstFixedDepositFormArray, this.finalFdNameDl, 'fixedDeposit');
        }
        if (this.dlLienDeposit.length > 0) {
            this.overdraftFixedFormPatchValue('dlLienDeposit',
                this.tempData.overdraftFixedForm.dlAgainstLienOnDepositFormArray, this.finalDepNameDlLien, 'lienDeposit');
        }
        if (this.overdraftAgainstBond.length > 0) {
            this.overDraftFacilityFormPatchValue('overdraftFacilityAgainstBond',
                this.tempData.overDraftFacilityForm.overdraftFacilityDetails, this.finalBondName);
        }
        if (this.dlAgainstBond.length > 0) {
            this.overDraftFacilityFormPatchValue('dlAgainstBond',
                this.tempData.overDraftFacilityForm.dlAgainstBondFormArray, this.finalBondNameDl);
        }
        if (this.stlAgainstBond.length > 0) {
            this.overDraftFacilityFormPatchValue('stlAgainstBond',
                this.tempData.overDraftFacilityForm.stlAgainstBondFormArray, this.finalBondNameStl);
        }
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

    overdraftFixedFormPatchValue(patchingArray, mainArray, depositorOrFdName, depositType) {
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.overdraftFixedForm) &&
            !ObjectUtil.isEmpty(mainArray)) {
            for (let val = 0; val < mainArray.length; val++) {
                this.form.get([patchingArray, val, 'nameOfFacilityOverdraftFacility']).patchValue(
                    mainArray[val] ?
                        mainArray[val].nameOfFacilityCT : ''
                );
                this.form.get([patchingArray, val, 'nameOfFacilityOverdraftFacilityInEng']).patchValue(
                    mainArray[val] ?
                        mainArray[val].nameOfFacility : ''
                );
                if (depositType === 'fixedDeposit' && !ObjectUtil.isEmpty(depositorOrFdName)) {
                    this.form.get([patchingArray, val, 'nameOfFDHolderOverdraftFacility']).patchValue(
                        depositorOrFdName ?
                            depositorOrFdName[val] : ''
                    );
                }
                this.form.get([patchingArray, val, 'FDAmountOverdraftFacility']).patchValue(
                    mainArray[val] ?
                        mainArray[val].FdAmountInFigureCT : ''
                );
                this.form.get([patchingArray, val, 'nameOfBankOverdraftFacility']).patchValue(
                    mainArray[val] ?
                        mainArray[val].nameOfHoldingBankCT : ''
                );
                if (depositType === 'lienDeposit' && !ObjectUtil.isEmpty(depositorOrFdName)) {
                    this.form.get([patchingArray, val, 'nameOfDepositorOverdraftFacility']).patchValue(
                        depositorOrFdName ?
                            depositorOrFdName[val] : ''
                    );
                }
                this.form.get([patchingArray, val, 'accountNoOverdraftFacility']).patchValue(
                    mainArray[val] ?
                        mainArray[val].accountNumberCT : ''
                );
                this.form.get([patchingArray, val, 'amountOverdraftFacility']).patchValue(
                    mainArray[val] ?
                        mainArray[val].amountInFigureCT : ''
                );
                this.form.get([patchingArray, val, 'drawingPowerOverdraftFacility']).patchValue(
                    mainArray[val] ?
                        mainArray[val].drawingPowerCT : ''
                );
                this.form.get([patchingArray, val, 'additionalPremiumOverdraftFacility']).patchValue(
                    mainArray[val] ?
                        mainArray[val].additionalPremiumRateCT : ''
                );
                this.form.get([patchingArray, val, 'couponInterestRateOverdraftFacility']).patchValue(
                    mainArray[val] ?
                        mainArray[val].totalInterestRateCT : ''
                );
                this.form.get([patchingArray, val, 'baseRateOverdraftFacility']).patchValue(
                    mainArray[val] ?
                        mainArray[val].baseRateCT : ''
                );
                this.form.get([patchingArray, val, 'premiumRateOverdraftFacility']).patchValue(
                    mainArray[val] ?
                        mainArray[val].premiumRateCT : ''
                );
                this.form.get([patchingArray, val, 'interestRateOverdraftFacility']).patchValue(
                    mainArray[val] ?
                        mainArray[val].interestRateCT : ''
                );
                this.form.get([patchingArray, val, 'loanExpiryDateOverdraftFacility']).patchValue(
                    mainArray[val] ?
                        mainArray[val].dateOfExpiryCT : ''
                );
            }
        }
    }

    overDraftFacilityFormPatchValue(patchingArray, mainArray, depositorOrFdName) {
        if (!ObjectUtil.isEmpty(this.tempData) &&
        !ObjectUtil.isEmpty(this.tempData.overDraftFacilityForm) &&
        !ObjectUtil.isEmpty(mainArray)) {
            for (let index = 0; index < mainArray.length; index++) {
                this.form.get([patchingArray, index, 'nameOfFacilityAgainstBond']).patchValue(
                    mainArray[index] ?
                        mainArray[index].nameOfFacilityCT : '');

                this.form.get([patchingArray, index, 'nameOfFacilityAgainstBondInEng']).patchValue(
                    mainArray[index] ?
                        mainArray[index].nameOfFacility : '');

                if (!ObjectUtil.isEmpty(depositorOrFdName)) {
                    this.form.get([patchingArray, index, 'ownerNameAgainstBond']).patchValue(
                        depositorOrFdName ? depositorOrFdName[index] : '');
                }

                this.form.get([patchingArray, index, 'bondAmountAgainstBond']).patchValue(
                    mainArray[index] ?
                        mainArray[index].bondAmountCT : '');

                this.form.get([patchingArray, index, 'bondTypeAgainstBond']).patchValue(
                    mainArray[index] ?
                        mainArray[index].bondTypeCT : '');

                this.form.get([patchingArray, index, 'totalInterestRateAgainstBond']).patchValue(
                    mainArray[index] ?
                        mainArray[index].interestRateCT : '');

                this.form.get([patchingArray, index, 'baseRateAgainstBond']).patchValue(
                    mainArray[index] ?
                        mainArray[index].baseRateCT : '');

                this.form.get([patchingArray, index, 'premiumRateAgainstBond']).patchValue(
                    mainArray[index] ?
                        mainArray[index].premiumRateCT : '');

                this.form.get([patchingArray, index, 'interestRateAgainstBond']).patchValue(
                    mainArray[index] ?
                        mainArray[index].interestRateCT : '');

                this.form.get([patchingArray, index, 'loanExpiryDateAgainstBond']).patchValue(
                    mainArray[index] ?
                        mainArray[index].dateOfExpiryCT : '');
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
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.bankGuarantee) &&
            !ObjectUtil.isEmpty(this.tempData.bankGuarantee.bankGuaranteeArray)) {
            for (let index = 0; index < this.tempData.bankGuarantee.bankGuaranteeArray.length; index++) {
                this.form.get(['bankGuarantee', index, 'nameOfBankBankGuarantee']).patchValue(
                    this.tempData.bankGuarantee.bankGuaranteeArray[index] ?
                        this.tempData.bankGuarantee.bankGuaranteeArray[index].nameOfHoldingBankCT : '');

                this.form.get(['bankGuarantee', index, 'marginInPercentageBankGuarantee']).patchValue(
                    this.tempData.bankGuarantee.bankGuaranteeArray[index] ?
                        this.tempData.bankGuarantee.bankGuaranteeArray[index].marginInPercentageCT : '');

                this.form.get(['bankGuarantee', index, 'commissionAPGBankGuarantee']).patchValue(
                    this.tempData.bankGuarantee.bankGuaranteeArray[index] ?
                        this.tempData.bankGuarantee.bankGuaranteeArray[index].commissionInPercentageAPGCT : '');

                this.form.get(['bankGuarantee', index, 'commissionBidBondBankGuarantee']).patchValue(
                    this.tempData.bankGuarantee.bankGuaranteeArray[index] ?
                        this.tempData.bankGuarantee.bankGuaranteeArray[index].commissionInPercentageBidBondCT : '');

                this.form.get(['bankGuarantee', index, 'serviceChargeBankGuarantee']).patchValue(
                    this.tempData.bankGuarantee.bankGuaranteeArray[index] ?
                        this.tempData.bankGuarantee.bankGuaranteeArray[index].serviceChargeInPercentCT : '');

                this.form.get(['bankGuarantee', index, 'minimumServiceChargeBankGuarantee']).patchValue(
                    this.tempData.bankGuarantee.bankGuaranteeArray[index] ?
                        this.tempData.bankGuarantee.bankGuaranteeArray[index].minServiceChargeInFigure1CT : '');

                this.form.get(['bankGuarantee', index, 'commissionAPG1BankGuarantee']).patchValue(
                    this.tempData.bankGuarantee.bankGuaranteeArray[index] ?
                        this.tempData.bankGuarantee.bankGuaranteeArray[index].commissionInPercentage2APGCT : '');

                this.form.get(['bankGuarantee', index, 'commissionBidBond1BankGuarantee']).patchValue(
                    this.tempData.bankGuarantee.bankGuaranteeArray[index] ?
                        this.tempData.bankGuarantee.bankGuaranteeArray[index].commissionInPercentage2BidBondCT : '');

                this.form.get(['bankGuarantee', index, 'loanExpiryDateBankGuarantee1']).patchValue(
                    this.tempData.bankGuarantee.bankGuaranteeArray[index] ?
                        this.tempData.bankGuarantee.bankGuaranteeArray[index].dateOfExpiryCT : '');
            }
        }
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
        if (this.equityMortgageTermLoan.length > 0) {
            tempMortgageEquity = this.mortgageEquityTermLoanComponent.setFreeTextMortgage();
        }
        let tempMortgageTermLoan;
        if (this.mortgageTermLoanData.length > 0) {
            tempMortgageTermLoan = this.mortgageTermLoanComponent.setFreeTextMortgage();
        }
        this.freeTextVal = {
            autoLoanFreeText: !ObjectUtil.isEmpty(tempAutoLoanFreeVal) ? tempAutoLoanFreeVal : '',
            termLoanFreeText: !ObjectUtil.isEmpty(tempTermLoanFreeVal) ? tempTermLoanFreeVal : '',
            equityTermLoanFreeText: !ObjectUtil.isEmpty(tempMortgageEquity) ? tempMortgageEquity : '',
            mortgageTermLoanFreeText: !ObjectUtil.isEmpty(tempMortgageTermLoan) ? tempMortgageTermLoan : '',
            freeText16: this.form.get('freeTextSixteen').value ? this.form.get('freeTextSixteen').value : '',
            snOfFacility: this.form.get('SNOfFacility').value ? this.form.get('SNOfFacility').value : '',
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
            bankGuaranteeFreeText: this.bankGuaranteeFreeText(),
        };
        return this.freeTextVal;
    }

    bankGuaranteeFreeText() {
        if (!ObjectUtil.isEmpty(this.tempData) &&
            !ObjectUtil.isEmpty(this.tempData.bankGuarantee) &&
            !ObjectUtil.isEmpty(this.tempData.bankGuarantee.bankGuaranteeArray)) {
            for (let val = 0; val < this.tempData.bankGuarantee.bankGuaranteeArray.length; val++) {
                const tempFreeText = {
                    SNOfParentLimitBankGuarantee: this.form.get(['bankGuarantee', val, 'SNOfParentLimitBankGuarantee']).value ?
                        this.form.get(['bankGuarantee', val, 'SNOfParentLimitBankGuarantee']).value : '',
                };
                this.bankGuaranteeFree.push(tempFreeText);
            }
            return this.bankGuaranteeFree;
        }
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
        this.setBankGuaranteeFreeText();
        this.form.patchValue({
            freeTextSixteen: this.tempInformation ? this.tempInformation.section2.freeText16 : '',
            SNOfFacility: this.tempInformation ? this.tempInformation.section2.snOfFacility : '',
            SNOfParentLimitBankGuarantee: this.tempInformation ? this.tempInformation.section2.SNBankGuarantee : '',
        });
    }

    setBankGuaranteeFreeText() {
        if (!ObjectUtil.isEmpty(this.tempInformation) &&
            !ObjectUtil.isEmpty(this.tempInformation.section2) &&
            !ObjectUtil.isEmpty(this.tempInformation.section2.bankGuaranteeFreeText)) {
            for (let val = 0; val < this.tempInformation.section2.bankGuaranteeFreeText.length; val++) {
                this.form.get(['bankGuarantee', val, 'SNOfParentLimitBankGuarantee']).patchValue(
                    this.tempInformation.section2.bankGuaranteeFreeText[val] ?
                        this.tempInformation.section2.bankGuaranteeFreeText[val].SNOfParentLimitBankGuarantee : '');
            }
        }
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
        this.equityMortgageTermLoan = this.loanData.filter(data => data.loanName === this.loanNameConstant.EQUITY_MORTGAGE_TERM_LOAN);
        this.mortgageTermLoan = this.loanData.filter(data => data.loanName === this.loanNameConstant.MORTGAGE_TERM_LOAN);
        this.overdraftFacilityFixedDeposit = this.loanData.filter(data => data.loanName === this.loanNameConstant.OVERDRAFT_FACILITY_FIXED_DEPOSIT);
        this.overdraftFacilityLienDeposit = this.loanData.filter(data => data.loanName === this.loanNameConstant.OVERDRAFT_FACILITY_LIEN_ON_DEPOSIT_ACCOUNT);
        this.stlFixedDeposit = this.loanData.filter(data => data.loanName === this.loanNameConstant.STL_AGAINST_FIXED_DEPOSIT);
        this.stlLienDeposit = this.loanData.filter(data => data.loanName === this.loanNameConstant.STL_LIEN_ON_DEPOSIT_ACCOUNT);
        this.dlFixedDeposit = this.loanData.filter(data => data.loanName === this.loanNameConstant.DL_AGAINST_FIXED_DEPOSIT);
        this.dlLienDeposit = this.loanData.filter(data => data.loanName === this.loanNameConstant.DL_LIEN_ON_DEPOSIT_ACCOUNT);
        this.bankGuaranteeLoan = this.loanData.filter(data => data.loanName === this.loanNameConstant.BANK_GUARANTEE);
        this.stlAgainstBond = this.loanData.filter(data => data.loanName === this.loanNameConstant.STL_FACILITY_AGAINST_BOND);
        this.dlAgainstBond = this.loanData.filter(data => data.loanName === this.loanNameConstant.DL_FACILITY_AGAINST_BOND);
    }
}
