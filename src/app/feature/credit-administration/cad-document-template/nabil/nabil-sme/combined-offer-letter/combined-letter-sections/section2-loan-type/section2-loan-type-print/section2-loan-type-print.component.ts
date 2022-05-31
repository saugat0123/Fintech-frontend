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
    FDNameStl;
    FDNameDl;
    DepName;
    BondName;
    BondNameDl;
    BondNameStl;
    finalBondName = [];
    finalBondNameDl = [];
    finalBondNameStl = [];
    FDNames: Array<String> = [];
    FDNamesStl: Array<String> = [];
    FDNamesDl: Array<String> = [];
    finalDepNameOverdraftLien = [];
    finalDepNameStlLien = [];
    finalDepNameDlLien = [];
    DepNameOverdraftLien;
    DepNameStlLien;
    DepNameDlLien;
    // Dep Names Array
    DepNamesOverdraftLien: Array<String> = [];
    DepNamesStlLien: Array<String> = [];
    DepNamesDlLien: Array<String> = [];
    // All Dep Names
    allDepNamesOverdraftLien;
    allDepNamesStlLien;
    allDepNamesDlLien;
    // Final FD Array
    finalFdName = [];
    finalFdNameStl = [];
    finalFdNameDl = [];
    // All FD Names
    allFdNames;
    allFdNamesStl;
    allFdNamesDl;
    allFDNames;
    DepNames: Array<String> = [];
    allDepNames;
    BondNames: Array<String> = [];
    BondNamesDl: Array<String> = [];
    BondNamesStl: Array<String> = [];
    allBondNames;
    allBondNamesDl;
    allBondNamesStl;
    loanNameConstant = LoanNameConstant;
    tempData;
    freeInformation;
    loanExpiryDateIrrevocable;
    loanData = [];
    isIrrevocableLetter = false;
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
    interestRateTypeFacilityAgainstBond;
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
    preExportLoan = [];
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
    stlAgainstBond = [];
    dlAgainstBond = [];

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
                if (v.loanName === LoanNameConstant.TERM_LOAN_TO_FOR_PURCHASE_OF_VEHICLE) {
                    this.isTermLoanToOrFor = true;
                }
                if (v.loanName === LoanNameConstant.AUTO_LOAN) {
                    this.isAutoLoanMaster = true;
                }
            });
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
