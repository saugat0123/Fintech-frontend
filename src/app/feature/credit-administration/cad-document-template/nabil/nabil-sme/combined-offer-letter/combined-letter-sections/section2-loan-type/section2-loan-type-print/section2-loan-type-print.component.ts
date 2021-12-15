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
    loanAmount;
    loanAmountInWord;
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
    loanOptionIrrevocable; commissionTypeIrrevocable; complementaryOtherIrrevocable = false;
    // Customer Acceptance for Time Letter of Credit
    loanOptionTimeLetter; complementaryOtherTimeLetter = false;
    // Import Bills Discounting
    loanOptionBillDiscounting; complementaryOtherBillDiscounting = false;
    // Import Loan/ Trust Receipt Loan
    loanOptionImportLoanTrust; complementaryOtherImportLoanTrust = false; interestSubsidyAgImportLoanTrust;
    // Revolving/One off basis Short Term Loan
    loanRevolvingBasisShortTermLoan; loanOptionShortTermLoan; complementaryOtherShortTermLoan = false; arFinancingShortTermLoan = false;
    interestSubsidyAgShortTermLoan;
    // Demand Loan for working capital
    complementaryOtherDemandLoan = false; arFinancingDemandLoan = false; interestSubsidyAgDemandLoan;
    // Pre- Export Loan
    complementaryOtherPreExportLoan = false;
    // Documentary Bill Purchase/Negotiation
    complementaryOtherDocumentaryBill = false;
    // Overdraft Loan for Working Capital requirement
    arFinancingOverdraftLoanWorking = false; interestSubsidyAgOverdraftLoanWorking;
    // Mortgage Overdraft/ Other Overdraft/ Equity Mortgaged Overdraft
    loanSubTypeEquityMortgage; drawingBasisEquityMortgage; mortgageTypeEquityMortgage; interestSubsidyAgEquityMortgage;
    // Overdraft Facility against Fixed Deposit/ Lien on Deposit Account
    subLoanOptionOverdraftFixedForm; holdingBankOverdraftFixedForm; letterOfSetOffOverdraftFixedForm; interestRateTypeOverdraftFixedForm;
    interestSubsidyAgOverdraftFixedForm; checkAdditionalPremiumRateOverdraftFixedForm = false; accountTypeOverdraftFixedForm;
    // Overdraft Facility against Bond
    letterOfSetOffFacilityAgainstBond; interestSubsidyAgFacilityAgainstBond; interestRateTypeFacilityAgainstBond;
    // Bridge Gap Loan
    complementaryOtherBridgeGapLoan = false; interestSubsidyAgBridgeGapLoan;
    // Bank Guarantee
    complementaryOtherBankGuarantee = false; securityTypeBankGuarantee; guaranteeTypeBankGuarantee; commissionTypeBankGuarantee;
    // Bills Purchase
    complementaryOtherBillPurchase = false;

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
            const totalLoanAmount = this.customerApprovedDoc.assignedLoan[0].proposal.proposedLimit;
            this.loanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount));
            this.loanAmountInWord = this.engToNepWord.transform(totalLoanAmount);
            this.getLoanName();
            this.checkLoanName();
        }
    }

    getLoanName() {
        this.customerApprovedDoc.assignedLoan.forEach(val => {
            const loanName = val.loan.name;
            this.loanData.push(loanName);
        });
    }

    private checkLoanName(): void {
        if (this.loanData.length > 0) {
            this.loanData.forEach(v => {
                // tslint:disable-next-line:max-line-length
                if (v === LoanNameConstant.CUSTOMER_ACCEPTANCE_FOR_TIME_LETTER_OF_CREDIT && !ObjectUtil.isEmpty(this.tempData.timeLetterCreditForm)) {
                    this.isCustomerAcceptance = true;
                    this.loanOptionTimeLetter = this.tempData.timeLetterCreditForm.loanOption;
                    if (this.tempData.timeLetterCreditForm.complementryOther === true) {
                        this.complementaryOtherTimeLetter = true;
                    }
                }
                if (v === LoanNameConstant.IRREVOCABLE_LETTER_OF_CREDIT_FACILITY && !ObjectUtil.isEmpty(this.tempData.letterOfCreditForm)) {
                    this.isIrrevocableLetter = true;
                    this.loanOptionIrrevocable = this.tempData.letterOfCreditForm.loanOption;
                    this.commissionTypeIrrevocable = this.tempData.letterOfCreditForm.commissionType;
                    if (this.tempData.letterOfCreditForm.complementryOther === true) {
                        this.complementaryOtherIrrevocable = true;
                    }
                }
                if (v === LoanNameConstant.IMPORT_BILLS_DISCOUNTING && !ObjectUtil.isEmpty(this.tempData.importBillsDiscountForm)) {
                    this.isBillDiscounting = true;
                    this.loanOptionBillDiscounting = this.tempData.importBillsDiscountForm.loanOption;
                    if (this.tempData.importBillsDiscountForm.complementryOther === true) {
                        this.complementaryOtherBillDiscounting = true;
                    }
                }
                if (v === LoanNameConstant.IMPORT_LOAN_TRUST_RECEIPT_LOAN && !ObjectUtil.isEmpty(this.tempData.importLoanTrust)) {
                    this.isLoanTrustReceiptLoan = true;
                    this.loanOptionImportLoanTrust = this.tempData.importLoanTrust.loanOption;
                    this.interestSubsidyAgImportLoanTrust = this.tempData.importLoanTrust.subsidyOrAgricultureLoan;
                    if (this.tempData.importLoanTrust.complementryOther === true) {
                        this.complementaryOtherImportLoanTrust = true;
                    }
                }
                if (v === LoanNameConstant.SHORT_TERM_LOAN && !ObjectUtil.isEmpty(this.tempData.revolvingShortTermLoan)) {
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
                }
                if (v === LoanNameConstant.DEMAND_LOAN_FOR_WORKING_CAPITAL && !ObjectUtil.isEmpty(this.tempData.demandLoanForm)) {
                    this.isDemandLoanWorkingCapital = true;
                    this.interestSubsidyAgDemandLoan = this.tempData.demandLoanForm.subsidyOrAgricultureLoan;
                    if (this.tempData.demandLoanForm.complementryOther === true) {
                        this.complementaryOtherDemandLoan = true;
                    }
                    if (this.tempData.demandLoanForm.arFinancing === true) {
                        this.arFinancingDemandLoan = true;
                    }
                }
                if (v === LoanNameConstant.PRE_EXPORT_LOAN && !ObjectUtil.isEmpty(this.tempData.preExportForm)) {
                    this.isPreExportLoan = true;
                    if (this.tempData.preExportForm.complementryOther === true) {
                        this.complementaryOtherPreExportLoan = true;
                    }
                }
                if (v === LoanNameConstant.DOCUMENTARY_BILL_PURCHASE_NEGOTIATION &&
                    !ObjectUtil.isEmpty(this.tempData.documentaryBillPurchase)) {
                    this.isDocumentaryBillPurchase = true;
                    if (this.tempData.documentaryBillPurchase.complementryOther === true) {
                        this.complementaryOtherDocumentaryBill = true;
                    }
                }
                if (v === LoanNameConstant.OVERDRAFT_LOAN_FOR_WORKING_CAPITAL_REQUIREMENT &&
                    !ObjectUtil.isEmpty(this.tempData.overdraftLoanForm)) {
                    this.isOverdraftLoanWorkingCapital = true;
                    this.interestSubsidyAgOverdraftLoanWorking = this.tempData.overdraftLoanForm.subsidyOrAgricultureLoan;
                    if (this.tempData.overdraftLoanForm.arFinancing === true) {
                        this.arFinancingOverdraftLoanWorking = true;
                    }
                }
                if (v === LoanNameConstant.MORTGAGE_OVERDRAFT || v === LoanNameConstant.EQUITY_MORTGAGED_OVERDRAFT &&
                    !ObjectUtil.isEmpty(this.tempData.equityMortgaged)) {
                    this.isEquityMortgageOverdraft = true;
                    this.loanSubTypeEquityMortgage = this.tempData.equityMortgaged.loanSubType;
                    this.drawingBasisEquityMortgage = this.tempData.equityMortgaged.drawingBasis;
                    this.mortgageTypeEquityMortgage = this.tempData.equityMortgaged.mortgageType;
                    this.interestSubsidyAgEquityMortgage = this.tempData.equityMortgaged.subsidyOrAgricultureLoan;
                }
                // tslint:disable-next-line:max-line-length
                if (v === LoanNameConstant.OVERDRAFT_FACILITY_FIXED_DEPOSIT || v === LoanNameConstant.OVERDRAFT_FACILITY_LIEN_ON_DEPOSIT_ACCOUNT ||
                    v === LoanNameConstant.STL_AGAINST_FIXED_DEPOSIT || v === LoanNameConstant.STL_LIEN_ON_DEPOSIT_ACCOUNT ||
                    v === LoanNameConstant.DL_AGAINST_FIXED_DEPOSIT || v === LoanNameConstant.DL_LIEN_ON_DEPOSIT_ACCOUNT &&
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
                if (v === LoanNameConstant.OVERDRAFT_FACILITY_AGAINST_BOND || v === LoanNameConstant.STL_FACILITY_AGAINST_BOND ||
                    v === LoanNameConstant.DL_FACILITY_AGAINST_BOND && !ObjectUtil.isEmpty(this.tempData.overDraftFacilityForm)) {
                    this.isOverdraftFacilityAgainstBond = true;
                    this.letterOfSetOffFacilityAgainstBond = this.tempData.overDraftFacilityForm.letterOfSetOffUsed;
                    this.interestSubsidyAgFacilityAgainstBond = this.tempData.overDraftFacilityForm.subsidyOrAgricultureLoan;
                    this.interestRateTypeFacilityAgainstBond = this.tempData.overDraftFacilityForm.interestRateType;
                }
                if (v === LoanNameConstant.BRIDGE_GAP_LOAN && !ObjectUtil.isEmpty(this.tempData.bridgeGapLoan)) {
                    this.isBridgeGapLoan = true;
                    this.interestSubsidyAgBridgeGapLoan = this.tempData.bridgeGapLoan.subsidyOrAgricultureLoan;
                    if (this.tempData.bridgeGapLoan.complementryOther === true) {
                        this.complementaryOtherBridgeGapLoan = true;
                    }
                }
                if (v === LoanNameConstant.TERM_LOAN_TO_FOR_PURCHASE_OF_VEHICLE) {
                    this.isTermLoanToOrFor = true;
                }
                if (v === LoanNameConstant.MORTGAGE_TERM_LOAN_EQUITY_MORTGAGE_TERM_LOAN) {
                    this.isEquityMortgageTermLoan = true;
                }
                if (v === LoanNameConstant.AUTO_LOAN) {
                    this.isAutoLoanMaster = true;
                }
                if (v === LoanNameConstant.BANK_GUARANTEE && !ObjectUtil.isEmpty(this.tempData.bankGuarantee)) {
                    this.isBankGuarantee = true;
                    this.securityTypeBankGuarantee = this.tempData.bankGuarantee.securityType;
                    this.guaranteeTypeBankGuarantee = this.tempData.bankGuarantee.guaranteeType;
                    this.commissionTypeBankGuarantee = this.tempData.bankGuarantee.commissionType;
                    if (this.tempData.bankGuarantee.complementryOther === true) {
                        this.complementaryOtherBankGuarantee = true;
                    }
                }
                if (v === LoanNameConstant.BILLS_PURCHASE && !ObjectUtil.isEmpty(this.tempData.billPurchaseForm)) {
                    this.isBillPurchase = true;
                    if (this.tempData.billPurchaseForm.complementryOther === true) {
                        this.complementaryOtherBillPurchase = true;
                    }
                }
            });
        }
    }

}
