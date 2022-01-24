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
    arFinancingShortTermLoan = false;
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
            documentaryBillPurchaseNegotiation: this.formBuilder.array([]),

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
            overdraftFacilityAgainstBond: this.formBuilder.array([]),

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
            billsPurchase: this.formBuilder.array([]),

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
            freeTextSixteen: [undefined],
        });
        this.setOverdraftFacilityAgainstBond();
        this.setDocumentaryBillPurchaseNegotiation();
        this.setBillsPurchase();
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
        console.log('bills purchase form:', this.form);
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
                if (v.loanName === LoanNameConstant.CUSTOMER_ACCEPTANCE_FOR_TIME_LETTER_OF_CREDIT && !ObjectUtil.isEmpty(this.tempData.timeLetterCreditForm)) {
                    this.isCustomerAcceptance = true;
                    this.loanOptionTimeLetter = this.tempData.timeLetterCreditForm.loanOption;
                    this.complementaryOtherTimeLetterName = this.tempData.timeLetterCreditForm.complimentaryLoanSelected;
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
                    this.complementaryOtherIrrevocableTeName = this.tempData.letterOfCreditForm.complimentaryLoanSelected;
                    if (this.tempData.letterOfCreditForm.complementryOther === true) {
                        this.complementaryOtherIrrevocable = true;
                    }
                    this.irrevocableLetterOfCredit();
                }
                // tslint:disable-next-line:max-line-length
                if (v.loanName === LoanNameConstant.IMPORT_BILLS_DISCOUNTING && !ObjectUtil.isEmpty(this.tempData.importBillsDiscountForm)) {
                    this.isBillDiscounting = true;
                    this.loanOptionBillDiscounting = this.tempData.importBillsDiscountForm.loanOption;
                    this.complementaryOtherBillDiscountingName = this.tempData.importBillsDiscountForm.complimentaryLoanSelected;
                    if (this.tempData.importBillsDiscountForm.complementryOther === true) {
                        this.complementaryOtherBillDiscounting = true;
                    }
                    this.importBillsDiscountFormPatchValue();
                }
                if (v.loanName === LoanNameConstant.IMPORT_LOAN_TRUST_RECEIPT_LOAN && !ObjectUtil.isEmpty(this.tempData.importLoanTrust)) {
                    this.isLoanTrustReceiptLoan = true;
                    this.loanOptionImportLoanTrust = this.tempData.importLoanTrust.loanOption;
                    this.complementaryOtherImportLoanTrustName = this.tempData.importLoanTrust.complimentaryLoanSelected;
                    this.interestSubsidyAgImportLoanTrust = this.tempData.importLoanTrust.subsidyOrAgricultureLoan;
                    if (this.tempData.importLoanTrust.complementryOther === true) {
                        this.complementaryOtherImportLoanTrust = true;
                    }
                    this.importTrustFormPatchValue();
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
                    if (this.tempData.revolvingShortTermLoan.arFinancing === true) {
                        this.arFinancingShortTermLoan = true;
                    }
                    this.revolvingShortTermFormPatchValue();
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
                    this.demandLoanFormPatchValue();
                }
                if (v.loanName === LoanNameConstant.PRE_EXPORT_LOAN && !ObjectUtil.isEmpty(this.tempData.preExportForm)) {
                    this.isPreExportLoan = true;
                    this.complementaryOtherPreExportLoanName = this.tempData.preExportForm.complimentaryLoanSelected;
                    if (this.tempData.preExportForm.complementryOther === true) {
                        this.complementaryOtherPreExportLoan = true;
                    }
                    this.preExportFormPatchValue();
                }
               /* if (v.loanName === LoanNameConstant.DOCUMENTARY_BILL_PURCHASE_NEGOTIATION &&
                    !ObjectUtil.isEmpty(this.tempData.documentaryBillPurchase)) {
                    this.isDocumentaryBillPurchase = true;
                    this.complementaryOtherDocumentaryBillName = this.tempData.documentaryBillPurchase.complimentaryLoanSelected;
                    if (this.tempData.documentaryBillPurchase.complementryOther === true) {
                        this.complementaryOtherDocumentaryBill = true;
                    }
                    this.documentaryBillPurchaseFormPatchValue();
                }*/
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
                if (v.loanName === LoanNameConstant.BRIDGE_GAP_LOAN && !ObjectUtil.isEmpty(this.tempData.bridgeGapLoan)) {
                    this.isBridgeGapLoan = true;
                    this.complementaryOtherBridgeGapLoanName = this.tempData.bridgeGapLoan.complimentaryLoanSelected;
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
            /*interestRateDocumentary: this.documentaryFreeText2(),
            // tslint:disable-next-line:max-line-length
            loanPaymentDocumentary: this.documentaryFreeText3(),*/
            freeText6: this.form.get('freeTextSix').value ? this.form.get('freeTextSix').value : '',
            freeText7: this.form.get('freeTextSeven').value ? this.form.get('freeTextSeven').value : '',
            freeText8: this.form.get('freeTextEight').value ? this.form.get('freeTextEight').value : '',
            freeText9: this.form.get('freeTextNine').value ? this.form.get('freeTextNine').value : '',
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
            remainDaysLoan: this.form.get('remainDaysLoanTrust').value ? this.form.get('remainDaysLoanTrust').value : '',
            SNIrrevocable: this.form.get('SNOfParentLimitIrrevocable').value ? this.form.get('SNOfParentLimitIrrevocable').value : '',
            SNTimeLetter: this.form.get('SNOfParentLimitTimeLetter').value ? this.form.get('SNOfParentLimitTimeLetter').value : '',
            // tslint:disable-next-line:max-line-length
            SNBillsDiscounting: this.form.get('SNOfParentLimitBillsDiscounting').value ? this.form.get('SNOfParentLimitBillsDiscounting').value : '',
            SNLoanTrust: this.form.get('SNOfParentLimitLoanTrust').value ? this.form.get('SNOfParentLimitLoanTrust').value : '',
            SNShortTermLoan: this.form.get('SNOfParentLimitShortTermLoan').value ? this.form.get('SNOfParentLimitShortTermLoan').value : '',
            SNDemandLoan: this.form.get('SNOfParentLimitDemandLoan').value ? this.form.get('SNOfParentLimitDemandLoan').value : '',
            SNPreExport: this.form.get('SNOfParentLimitPreExport').value ? this.form.get('SNOfParentLimitPreExport').value : '',
            // tslint:disable-next-line:max-line-length
            // SNDocumentaryBill: this.form.get('SNOfParentLimitDocumentaryBill').value ? this.form.get('SNOfParentLimitDocumentaryBill').value : '',
            documentaryBillPurchaseFreeText: this.documentaryBillFreeText(),
            billsPurchaseFreeText: this.billsPurchaseFreeText(),
            SNBridgeGap: this.form.get('SNOfParentLimitBridgeGap').value ? this.form.get('SNOfParentLimitBridgeGap').value : '',
            SNBankGuarantee: this.form.get('SNOfParentLimitBankGuarantee').value ? this.form.get('SNOfParentLimitBankGuarantee').value : '',
            // SNBillsPurchase: this.form.get('SNOfParentLimitBillsPurchase').value ? this.form.get('SNOfParentLimitBillsPurchase').value : '',
            // freeText15: this.form.get('freeTextFifteen').value ? this.form.get('freeTextFifteen').value : '',
        };
        return this.freeTextVal;
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
        this.form.patchValue({
            freeTextOne: this.tempInformation ? this.tempInformation.section2.freeText1 : '',
            freeTextTwo: this.tempInformation ? this.tempInformation.section2.freeText2 : '',
            freeTextThree: this.tempInformation ? this.tempInformation.section2.freeText3 : '',
            freeTextFour: this.tempInformation ? this.tempInformation.section2.freeText4 : '',
            freeTextFive: this.tempInformation ? this.tempInformation.section2.freeText5 : '',
            freeTextSix: this.tempInformation ? this.tempInformation.section2.freeText6 : '',
            freeTextSeven: this.tempInformation ? this.tempInformation.section2.freeText7 : '',
            freeTextEight: this.tempInformation ? this.tempInformation.section2.freeText8 : '',
            freeTextNine: this.tempInformation ? this.tempInformation.section2.freeText9 : '',
            // freeTextFifteen: this.tempInformation ? this.tempInformation.section2.freeText15 : '',
            freeTextSixteen: this.tempInformation ? this.tempInformation.section2.freeText16 : '',
            loanExpiryDateIrrevocable2: this.tempInformation ? this.tempInformation.section2.loanExpiryIrrevocable : '',
            loanExpiryDateTimeLetter2: this.tempInformation ? this.tempInformation.section2.loanExpiryTimeLetter : '',
            remainDaysShortTermLoan: this.tempInformation ? this.tempInformation.section2.remainingDaysShortTerms : '',
            interestRatePreExport: this.tempInformation ? this.tempInformation.section2.interestRatePre : '',
            sulkaPreExport: this.tempInformation ? this.tempInformation.section2.SulkaPreExport : '',
           /* InterestRateDocumentaryBill: this.tempInformation ? this.tempInformation.section2.interestRateDocumentary : '',
            loanPaymentDocumentaryBill: this.tempInformation ? this.tempInformation.section2.loanPaymentDocumentary : '',*/
            SNOfFacility: this.tempInformation ? this.tempInformation.section2.snOfFacility : '',
            remainDaysLoanTrust: this.tempInformation ? this.tempInformation.section2.remainDaysLoan : '',
            SNOfParentLimitIrrevocable: this.tempInformation ? this.tempInformation.section2.SNIrrevocable : '',
            SNOfParentLimitTimeLetter: this.tempInformation ? this.tempInformation.section2.SNTimeLetter : '',
            SNOfParentLimitBillsDiscounting: this.tempInformation ? this.tempInformation.section2.SNBillsDiscounting : '',
            SNOfParentLimitLoanTrust: this.tempInformation ? this.tempInformation.section2.SNLoanTrust : '',
            SNOfParentLimitShortTermLoan: this.tempInformation ? this.tempInformation.section2.SNShortTermLoan : '',
            SNOfParentLimitDemandLoan: this.tempInformation ? this.tempInformation.section2.SNDemandLoan : '',
            SNOfParentLimitPreExport: this.tempInformation ? this.tempInformation.section2.SNPreExport : '',
            // SNOfParentLimitDocumentaryBill: this.tempInformation ? this.tempInformation.section2.SNDocumentaryBill : '',
            SNOfParentLimitBridgeGap: this.tempInformation ? this.tempInformation.section2.SNBridgeGap : '',
            SNOfParentLimitBankGuarantee: this.tempInformation ? this.tempInformation.section2.SNBankGuarantee : '',
            // SNOfParentLimitBillsPurchase: this.tempInformation ? this.tempInformation.section2.SNBillsPurchase : '',
        });
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
        this.autoLoanDetails = this.loanData.filter(data => data.loanName === this.loanNameConstant.AUTO_LOAN);
        this.termLoanDetails = this.loanData.filter(data => data.loanName === this.loanNameConstant.TERM_LOAN_TO_FOR_PURCHASE_OF_VEHICLE);
    }
}
