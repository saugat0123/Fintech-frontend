import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngNepDatePipe} from 'nepali-patro';
import {DatePipe} from '@angular/common';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {LoanNameConstant} from '../../../../../../../cad-view/template-data/nabil-sme-template-data/sme-costant/loan-name-constant';

@Component({
    selector: 'app-section2-loan-type-print',
    templateUrl: './section2-loan-type-print.component.html',
    styleUrls: ['./section2-loan-type-print.component.scss']
})
export class Section2LoanTypePrintComponent implements OnInit {
    @Input() letterData;
    @Input() customerApprovedDoc;
    @Input() freeText;
    @Input() index;
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
    tempData;
    freeInformation;
    loanExpiryDateIrrevocable;
    loanData = [];
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
    documentaryBillPurchase = [];
    billsPurchase = [];
    autoLoanData;
    termLoanData;
    equityMortgageOverdraft = [];
    mortgageOverdraft = [];
    importBillsDiscounting = [];
    irrevocableLetter = [];
    importLoanTrustReceipt = [];
    revolvingShortTerm = [];
    customerAccentanceLetterOfCredit = [];
    demandLoan = [];
    bridgeGap = [];
    overdraftLoanForWorkingCapitalLoan = [];

    constructor(private engToNepWord: NepaliCurrencyWordPipe,
                private engToNepaliDate: EngNepDatePipe,
                private datePipe: DatePipe,
                private currencyFormatPipe: CurrencyFormatterPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe
    ) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
            this.tempData = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].initialInformation);
            if (!ObjectUtil.isEmpty(this.customerApprovedDoc.offerDocumentList[0].supportedInformation)) {
                this.freeInformation = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].supportedInformation);
            }
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
        }
        this.issubsidyOrAgricultureLoan = this.tempData.smeGlobalForm.subsidyOrAgricultureLoan;
    }

    getLoanName() {
        this.customerApprovedDoc.assignedLoan.forEach(val => {
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
        this.filterLoanData();
    }

    private checkLoanName(): void {
        if (this.finalLoanDetails.length > 0) {
            this.finalLoanDetails.forEach(v => {
                // tslint:disable-next-line:max-line-length
                if (v.loanName === LoanNameConstant.CUSTOMER_ACCEPTANCE_FOR_TIME_LETTER_OF_CREDIT && !ObjectUtil.isEmpty(this.tempData.timeLetterCreditForm)) {
                    this.isCustomerAcceptance = true;
                    this.loanOptionTimeLetter = this.tempData.timeLetterCreditForm.loanOption;
                    this.complementaryOtherTimeLetterName = this.tempData.timeLetterCreditForm.complimentaryLoanSelected;
                    if (this.tempData.timeLetterCreditForm.complementryOther === true) {
                        this.complementaryOtherTimeLetter = true;
                    }
                }
                // tslint:disable-next-line:max-line-length
                if (v.loanName === LoanNameConstant.IRREVOCABLE_LETTER_OF_CREDIT_FACILITY && !ObjectUtil.isEmpty(this.tempData.letterOfCreditForm)) {
                    this.isIrrevocableLetter = true;
                    this.loanOptionIrrevocable = this.tempData.letterOfCreditForm.loanOption;
                    this.commissionTypeIrrevocable = this.tempData.letterOfCreditForm.commissionType;
                    this.complementaryOtherIrrevocableTeName = this.tempData.letterOfCreditForm.complimentaryLoanSelected;
                    if (this.tempData.letterOfCreditForm.complementryOther === true) {
                        this.complementaryOtherIrrevocable = true;
                    }
                }
                // tslint:disable-next-line:max-line-length
                if (v.loanName === LoanNameConstant.IMPORT_BILLS_DISCOUNTING && !ObjectUtil.isEmpty(this.tempData.importBillsDiscountForm)) {
                    this.isBillDiscounting = true;
                    this.loanOptionBillDiscounting = this.tempData.importBillsDiscountForm.loanOption;
                    this.complementaryOtherBillDiscountingName = this.tempData.importBillsDiscountForm.complimentaryLoanSelected;
                    if (this.tempData.importBillsDiscountForm.complementryOther === true) {
                        this.complementaryOtherBillDiscounting = true;
                    }
                }
                if (v.loanName === LoanNameConstant.IMPORT_LOAN_TRUST_RECEIPT_LOAN && !ObjectUtil.isEmpty(this.tempData.importLoanTrust)) {
                    this.isLoanTrustReceiptLoan = true;
                    this.loanOptionImportLoanTrust = this.tempData.importLoanTrust.loanOption;
                    this.complementaryOtherImportLoanTrustName = this.tempData.importLoanTrust.complimentaryLoanSelected;
                    this.interestSubsidyAgImportLoanTrust = this.tempData.importLoanTrust.subsidyOrAgricultureLoan;
                    if (this.tempData.importLoanTrust.complementryOther === true) {
                        this.complementaryOtherImportLoanTrust = true;
                    }
                }
                if (v.loanName === LoanNameConstant.SHORT_TERM_LOAN && !ObjectUtil.isEmpty(this.tempData.revolvingShortTermLoan)) {
                    this.isRevolvingShortTermLoan = true;
                    this.loanOptionShortTermLoan = this.tempData.revolvingShortTermLoan.loanOption;
                    this.complementaryOtherShortTermLoanName = this.tempData.revolvingShortTermLoan.complimentaryLoanSelected;
                    this.loanRevolvingBasisShortTermLoan = this.tempData.revolvingShortTermLoan.loanRevolvingBasis;
                    this.interestSubsidyAgShortTermLoan = this.tempData.revolvingShortTermLoan.subsidyOrAgricultureLoan;
                    if (this.tempData.revolvingShortTermLoan.complementaryOther === true) {
                        this.complementaryOtherShortTermLoan = true;
                    }
                    /*if (this.tempData.revolvingShortTermLoan.arFinancing === true) {
                        this.arFinancing = true;
                    }*/
                }
                if (v.loanName === LoanNameConstant.DEMAND_LOAN_FOR_WORKING_CAPITAL && !ObjectUtil.isEmpty(this.tempData.demandLoanForm)) {
                    this.isDemandLoanWorkingCapital = true;
                    this.interestSubsidyAgDemandLoan = this.tempData.demandLoanForm.subsidyOrAgricultureLoan;
                    this.complementaryOtherDemandLoanName = this.tempData.demandLoanForm.complimentaryLoanSelected;
                    if (this.tempData.demandLoanForm.complementryOther === true) {
                        this.complementaryOtherDemandLoan = true;
                    }
                    if (this.tempData.demandLoanForm.arFinancing === true) {
                        this.arFinancingDemandLoan = true;
                    }
                }
                if (v.loanName === LoanNameConstant.PRE_EXPORT_LOAN && !ObjectUtil.isEmpty(this.tempData.preExportForm)) {
                    this.isPreExportLoan = true;
                    this.complementaryOtherPreExportLoanName = this.tempData.preExportForm.complimentaryLoanSelected;
                    if (this.tempData.preExportForm.complementryOther === true) {
                        this.complementaryOtherPreExportLoan = true;
                    }
                }
                if (v.loanName === LoanNameConstant.DOCUMENTARY_BILL_PURCHASE_NEGOTIATION &&
                    !ObjectUtil.isEmpty(this.tempData.documentaryBillPurchase)) {
                    this.isDocumentaryBillPurchase = true;
                    this.complementaryOtherDocumentaryBillName = this.tempData.documentaryBillPurchase.complimentaryLoanSelected;
                    if (this.tempData.documentaryBillPurchase.complementryOther === true) {
                        this.complementaryOtherDocumentaryBill = true;
                    }
                }
                if (v.loanName === LoanNameConstant.OVERDRAFT_LOAN_FOR_WORKING_CAPITAL_REQUIREMENT &&
                    !ObjectUtil.isEmpty(this.tempData.overdraftLoanForm)) {
                    this.isOverdraftLoanWorkingCapital = true;
                    this.interestSubsidyAgOverdraftLoanWorking = this.tempData.overdraftLoanForm.subsidyOrAgricultureLoan;
                    if (this.tempData.overdraftLoanForm.arFinancing === true) {
                        this.arFinancingOverdraftLoanWorking = true;
                    }
                }
                if (v.loanName === LoanNameConstant.MORTGAGE_OVERDRAFT || v.loanName === LoanNameConstant.EQUITY_MORTGAGED_OVERDRAFT &&
                    !ObjectUtil.isEmpty(this.tempData.equityMortgaged)) {
                    this.isEquityMortgageOverdraft = true;
                    this.loanSubTypeEquityMortgage = this.tempData.equityMortgaged.loanSubType;
                    this.drawingBasisEquityMortgage = this.tempData.equityMortgaged.drawingBasis;
                    this.mortgageTypeEquityMortgage = this.tempData.equityMortgaged.mortgageType;
                    this.interestSubsidyAgEquityMortgage = this.tempData.equityMortgaged.subsidyOrAgricultureLoan;
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
                }
                // tslint:disable-next-line:max-line-length
                if (v.loanName === LoanNameConstant.OVERDRAFT_FACILITY_AGAINST_BOND || v.loanName === LoanNameConstant.STL_FACILITY_AGAINST_BOND ||
                    v.loanName === LoanNameConstant.DL_FACILITY_AGAINST_BOND && !ObjectUtil.isEmpty(this.tempData.overDraftFacilityForm)) {
                    this.isOverdraftFacilityAgainstBond = true;
                    this.letterOfSetOffFacilityAgainstBond = this.tempData.overDraftFacilityForm.letterOfSetOffUsed;
                    this.interestSubsidyAgFacilityAgainstBond = this.tempData.overDraftFacilityForm.subsidyOrAgricultureLoan;
                    this.interestRateTypeFacilityAgainstBond = this.tempData.overDraftFacilityForm.interestRateType;
                }
                if (v.loanName === LoanNameConstant.BRIDGE_GAP_LOAN && !ObjectUtil.isEmpty(this.tempData.bridgeGapLoan)) {
                    this.isBridgeGapLoan = true;
                    this.complementaryOtherBridgeGapLoanName = this.tempData.bridgeGapLoan.complimentaryLoanSelected;
                    if (this.tempData.bridgeGapLoan.interestSubsidy === true) {
                        this.interestSubsidyAgBridgeGapLoan = true;
                    }
                    if (this.tempData.bridgeGapLoan.complementryOther === true) {
                        this.complementaryOtherBridgeGapLoan = true;
                    }
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
                    this.complementaryOtherBankGuaranteeName = this.tempData.bankGuarantee.complimentaryLoanSelected;
                    if (this.tempData.bankGuarantee.complementryOther === true) {
                        this.complementaryOtherBankGuarantee = true;
                    }
                }
                if (v.loanName === LoanNameConstant.BILLS_PURCHASE && !ObjectUtil.isEmpty(this.tempData.billPurchaseForm)) {
                    this.isBillPurchase = true;
                    this.complementaryOtherBillPurchaseName = this.tempData.billPurchaseForm.complimentaryLoanSelected;
                    if (this.tempData.billPurchaseForm.complementryOther === true) {
                        this.complementaryOtherBillPurchase = true;
                    }
                }
            });
        }
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
    }
}
