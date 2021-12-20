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
    tempData;
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
    // Irrevocable letter of credit facility
    loanOptionIrrevocable;
    commissionTypeIrrevocable;
    complementaryOtherIrrevocable = false;
    loanAmountIrrevocable;
    loanAmountInWordIrrevocable;
    // Customer Acceptance for Time Letter of Credit
    loanOptionTimeLetter;
    complementaryOtherTimeLetter = false;
    loanAmountTimeLetter;
    loanAmountInWordTimeLetter;
    // Import Bills Discounting
    loanOptionBillDiscounting;
    complementaryOtherBillDiscounting = false;
    loanAmountBillDiscounting;
    loanAmountInWordBillDiscounting;
    // Import Loan/ Trust Receipt Loan
    loanOptionImportLoanTrust;
    complementaryOtherImportLoanTrust = false;
    interestSubsidyAgImportLoanTrust;
    loanAmountImportLoanTrust;
    loanAmountInWordImportLoanTrust;
    // Revolving/One off basis Short Term Loan
    loanRevolvingBasisShortTermLoan;
    loanOptionShortTermLoan;
    complementaryOtherShortTermLoan = false;
    arFinancingShortTermLoan = false;
    interestSubsidyAgShortTermLoan;
    loanAmountShortTermLoan;
    loanAmountInWordShortTermLoan;
    // Demand Loan for working capital
    complementaryOtherDemandLoan = false;
    arFinancingDemandLoan = false;
    interestSubsidyAgDemandLoan;
    loanAmountDemandLoan;
    loanAmountInWordDemandLoan;
    // Pre- Export Loan
    complementaryOtherPreExportLoan = false;
    loanAmountPreExportLoan;
    loanAmountInWordPreExportLoan;
    // Documentary Bill Purchase/Negotiation
    complementaryOtherDocumentaryBill = false;
    loanAmountDocumentaryBill;
    loanAmountInWordDocumentaryBill;
    // Overdraft Loan for Working Capital requirement
    arFinancingOverdraftLoanWorking = false;
    interestSubsidyAgOverdraftLoanWorking;
    loanAmountOverdraftLoanWorking;
    loanAmountInWordOverdraftLoanWorking;
    // Mortgage Overdraft/ Other Overdraft/ Equity Mortgaged Overdraft
    loanSubTypeEquityMortgage;
    drawingBasisEquityMortgage;
    mortgageTypeEquityMortgage;
    interestSubsidyAgEquityMortgage;
    loanAmountEquityMortgage;
    loanAmountInWordEquityMortgage;
    // Overdraft Facility against Fixed Deposit/ Lien on Deposit Account
    subLoanOptionOverdraftFixedForm;
    holdingBankOverdraftFixedForm;
    letterOfSetOffOverdraftFixedForm;
    interestRateTypeOverdraftFixedForm;
    interestSubsidyAgOverdraftFixedForm;
    checkAdditionalPremiumRateOverdraftFixedForm = false;
    accountTypeOverdraftFixedForm;
    loanAmountOverdraftFixedForm;
    loanAmountInWordOverdraftFixedForm;
    // Overdraft Facility against Bond
    letterOfSetOffFacilityAgainstBond;
    interestSubsidyAgFacilityAgainstBond;
    interestRateTypeFacilityAgainstBond;
    loanAmountFacilityAgainstBond;
    loanAmountInWordFacilityAgainstBond;
    // Bridge Gap Loan
    complementaryOtherBridgeGapLoan = false;
    interestSubsidyAgBridgeGapLoan = false;
    loanAmountBridgeGapLoan; loanAmountInWordBridgeGapLoan;
    // Bank Guarantee
    complementaryOtherBankGuarantee = false;
    securityTypeBankGuarantee;
    guaranteeTypeBankGuarantee;
    commissionTypeBankGuarantee;
    loanAmountBankGuarantee; loanAmountInWordBankGuarantee;
    // Bills Purchase
    complementaryOtherBillPurchase = false; loanAmountBillPurchase; loanAmountInWordBillPurchase;

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
            this.hypothecationGlobal = this.tempData.smeGlobalForm.hypothecation;
            this.getLoanName();
            this.checkLoanName();
        }
    }

    getLoanName() {
        this.customerApprovedDoc.assignedLoan.forEach(val => {
            const loanName = val.loan.name;
            const loanAmount = val.proposal.proposedLimit;
            const tempLoan = {
                loanName: loanName,
                loanAmount: loanAmount,
            };
            this.loanData.push(tempLoan);
        });
    }

    private checkLoanName(): void {
        if (this.loanData.length > 0) {
            this.loanData.forEach(v => {
                // tslint:disable-next-line:max-line-length
                if (v.loanName === LoanNameConstant.CUSTOMER_ACCEPTANCE_FOR_TIME_LETTER_OF_CREDIT && !ObjectUtil.isEmpty(this.tempData.timeLetterCreditForm)) {
                    this.isCustomerAcceptance = true;
                    this.loanOptionTimeLetter = this.tempData.timeLetterCreditForm.loanOption;
                    const totalLoanAmount = v.loanAmount;
                    this.loanAmountTimeLetter = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount));
                    this.loanAmountInWordTimeLetter = this.engToNepWord.transform(totalLoanAmount);
                    if (this.tempData.timeLetterCreditForm.complementryOther === true) {
                        this.complementaryOtherTimeLetter = true;
                    }
                }
                // tslint:disable-next-line:max-line-length
                if (v.loanName === LoanNameConstant.IRREVOCABLE_LETTER_OF_CREDIT_FACILITY && !ObjectUtil.isEmpty(this.tempData.letterOfCreditForm)) {
                    this.isIrrevocableLetter = true;
                    this.loanOptionIrrevocable = this.tempData.letterOfCreditForm.loanOption;
                    this.commissionTypeIrrevocable = this.tempData.letterOfCreditForm.commissionType;
                    const totalLoanAmount = v.loanAmount;
                    this.loanAmountIrrevocable = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount));
                    this.loanAmountInWordIrrevocable = this.engToNepWord.transform(totalLoanAmount);
                    if (this.tempData.letterOfCreditForm.complementryOther === true) {
                        this.complementaryOtherIrrevocable = true;
                    }
                }
                // tslint:disable-next-line:max-line-length
                if (v.loanName === LoanNameConstant.IMPORT_BILLS_DISCOUNTING && !ObjectUtil.isEmpty(this.tempData.importBillsDiscountForm)) {
                    this.isBillDiscounting = true;
                    this.loanOptionBillDiscounting = this.tempData.importBillsDiscountForm.loanOption;
                    const totalLoanAmount = v.loanAmount;
                    this.loanAmountBillDiscounting = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount));
                    this.loanAmountInWordBillDiscounting = this.engToNepWord.transform(totalLoanAmount);
                    if (this.tempData.importBillsDiscountForm.complementryOther === true) {
                        this.complementaryOtherBillDiscounting = true;
                    }
                }
                if (v.loanName === LoanNameConstant.IMPORT_LOAN_TRUST_RECEIPT_LOAN && !ObjectUtil.isEmpty(this.tempData.importLoanTrust)) {
                    this.isLoanTrustReceiptLoan = true;
                    this.loanOptionImportLoanTrust = this.tempData.importLoanTrust.loanOption;
                    this.interestSubsidyAgImportLoanTrust = this.tempData.importLoanTrust.subsidyOrAgricultureLoan;
                    const totalLoanAmount = v.loanAmount;
                    this.loanAmountImportLoanTrust = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount));
                    this.loanAmountInWordImportLoanTrust = this.engToNepWord.transform(totalLoanAmount);
                    if (this.tempData.importLoanTrust.complementryOther === true) {
                        this.complementaryOtherImportLoanTrust = true;
                    }
                }
                if (v.loanName === LoanNameConstant.SHORT_TERM_LOAN && !ObjectUtil.isEmpty(this.tempData.revolvingShortTermLoan)) {
                    this.isRevolvingShortTermLoan = true;
                    this.loanOptionShortTermLoan = this.tempData.revolvingShortTermLoan.loanOption;
                    this.loanRevolvingBasisShortTermLoan = this.tempData.revolvingShortTermLoan.loanRevolvingBasis;
                    this.interestSubsidyAgShortTermLoan = this.tempData.revolvingShortTermLoan.subsidyOrAgricultureLoan;
                    const totalLoanAmount = v.loanAmount;
                    this.loanAmountShortTermLoan = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount));
                    this.loanAmountInWordShortTermLoan = this.engToNepWord.transform(totalLoanAmount);
                    if (this.tempData.revolvingShortTermLoan.complementaryOther === true) {
                        this.complementaryOtherShortTermLoan = true;
                    }
                    if (this.tempData.revolvingShortTermLoan.arFinancing === true) {
                        this.arFinancingShortTermLoan = true;
                    }
                }
                if (v.loanName === LoanNameConstant.DEMAND_LOAN_FOR_WORKING_CAPITAL && !ObjectUtil.isEmpty(this.tempData.demandLoanForm)) {
                    this.isDemandLoanWorkingCapital = true;
                    this.interestSubsidyAgDemandLoan = this.tempData.demandLoanForm.subsidyOrAgricultureLoan;
                    const totalLoanAmount = v.loanAmount;
                    this.loanAmountDemandLoan = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount));
                    this.loanAmountInWordDemandLoan = this.engToNepWord.transform(totalLoanAmount);
                    if (this.tempData.demandLoanForm.complementryOther === true) {
                        this.complementaryOtherDemandLoan = true;
                    }
                    if (this.tempData.demandLoanForm.arFinancing === true) {
                        this.arFinancingDemandLoan = true;
                    }
                }
                if (v.loanName === LoanNameConstant.PRE_EXPORT_LOAN && !ObjectUtil.isEmpty(this.tempData.preExportForm)) {
                    this.isPreExportLoan = true;
                    const totalLoanAmount = v.loanAmount;
                    this.loanAmountPreExportLoan = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount));
                    this.loanAmountInWordPreExportLoan = this.engToNepWord.transform(totalLoanAmount);
                    if (this.tempData.preExportForm.complementryOther === true) {
                        this.complementaryOtherPreExportLoan = true;
                    }
                }
                if (v.loanName === LoanNameConstant.DOCUMENTARY_BILL_PURCHASE_NEGOTIATION &&
                    !ObjectUtil.isEmpty(this.tempData.documentaryBillPurchase)) {
                    this.isDocumentaryBillPurchase = true;
                    const totalLoanAmount = v.loanAmount;
                    this.loanAmountDocumentaryBill = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount));
                    this.loanAmountInWordDocumentaryBill = this.engToNepWord.transform(totalLoanAmount);
                    if (this.tempData.documentaryBillPurchase.complementryOther === true) {
                        this.complementaryOtherDocumentaryBill = true;
                    }
                }
                if (v.loanName === LoanNameConstant.OVERDRAFT_LOAN_FOR_WORKING_CAPITAL_REQUIREMENT &&
                    !ObjectUtil.isEmpty(this.tempData.overdraftLoanForm)) {
                    this.isOverdraftLoanWorkingCapital = true;
                    this.interestSubsidyAgOverdraftLoanWorking = this.tempData.overdraftLoanForm.subsidyOrAgricultureLoan;
                    const totalLoanAmount = v.loanAmount;
                    // tslint:disable-next-line:max-line-length
                    this.loanAmountOverdraftLoanWorking = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount));
                    this.loanAmountInWordOverdraftLoanWorking = this.engToNepWord.transform(totalLoanAmount);
                    if (this.tempData.overdraftLoanForm.arFinancing === true) {
                        this.arFinancingOverdraftLoanWorking = true;
                    }
                }
                if (v.loanName === LoanNameConstant.MORTGAGE_OVERDRAFT || v === LoanNameConstant.EQUITY_MORTGAGED_OVERDRAFT &&
                    !ObjectUtil.isEmpty(this.tempData.equityMortgaged)) {
                    this.isEquityMortgageOverdraft = true;
                    this.loanSubTypeEquityMortgage = this.tempData.equityMortgaged.loanSubType;
                    this.drawingBasisEquityMortgage = this.tempData.equityMortgaged.drawingBasis;
                    this.mortgageTypeEquityMortgage = this.tempData.equityMortgaged.mortgageType;
                    this.interestSubsidyAgEquityMortgage = this.tempData.equityMortgaged.subsidyOrAgricultureLoan;
                    const totalLoanAmount = v.loanAmount;
                    this.loanAmountEquityMortgage = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount));
                    this.loanAmountInWordEquityMortgage = this.engToNepWord.transform(totalLoanAmount);
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
                    const totalLoanAmount = v.loanAmount;
                    // tslint:disable-next-line:max-line-length
                    this.loanAmountOverdraftFixedForm = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount));
                    this.loanAmountInWordOverdraftFixedForm = this.engToNepWord.transform(totalLoanAmount);
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
                    const totalLoanAmount = v.loanAmount;
                    // tslint:disable-next-line:max-line-length
                    this.loanAmountFacilityAgainstBond = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount));
                    this.loanAmountInWordFacilityAgainstBond = this.engToNepWord.transform(totalLoanAmount);
                }
                if (v.loanName === LoanNameConstant.BRIDGE_GAP_LOAN && !ObjectUtil.isEmpty(this.tempData.bridgeGapLoan)) {
                    this.isBridgeGapLoan = true;
                    const totalLoanAmount = v.loanAmount;
                    this.loanAmountBridgeGapLoan = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount));
                    this.loanAmountInWordBridgeGapLoan = this.engToNepWord.transform(totalLoanAmount);
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
                    const totalLoanAmount = v.loanAmount;
                    this.loanAmountBankGuarantee = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount));
                    this.loanAmountInWordBankGuarantee = this.engToNepWord.transform(totalLoanAmount);
                    if (this.tempData.bankGuarantee.complementryOther === true) {
                        this.complementaryOtherBankGuarantee = true;
                    }
                }
                if (v.loanName === LoanNameConstant.BILLS_PURCHASE && !ObjectUtil.isEmpty(this.tempData.billPurchaseForm)) {
                    this.isBillPurchase = true;
                    const totalLoanAmount = v.loanAmount;
                    this.loanAmountBillPurchase = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount));
                    this.loanAmountInWordBillPurchase = this.engToNepWord.transform(totalLoanAmount);
                    if (this.tempData.billPurchaseForm.complementryOther === true) {
                        this.complementaryOtherBillPurchase = true;
                    }
                }
            });
        }
    }

}
