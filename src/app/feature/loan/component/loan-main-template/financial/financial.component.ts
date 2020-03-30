import {Component, Input, OnInit, QueryList, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BorrowerRiskRatingComponent} from './borrower-risk-rating/borrower-risk-rating.component';
import {IncomeStatementComponent} from './income-statement/income-statement.component';
import {BalanceSheetComponent} from './balance-sheet/balance-sheet.component';
import {CashFlowStatementComponent} from './cash-flow-statement/cash-flow-statement.component';
import {KeyIndicatorsComponent} from './key-indicators/key-indicators.component';
import * as currentFormData from './financial.json';
import {FinancialService} from './financial.service';
import {Financial} from '../../../model/financial';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FiscalYearModalComponent} from './fiscal-year-modal/fiscal-year-modal.component';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-financial',
    templateUrl: './financial.component.html',
    styleUrls: ['./financial.component.scss']
})
export class FinancialComponent implements OnInit {
    @ViewChild('brr', {static: false}) brr: BorrowerRiskRatingComponent;
    @ViewChild('incomeStatement', {static: false}) incomeStatement: IncomeStatementComponent;
    @ViewChild('balanceSheet', {static: false}) balanceSheet: BalanceSheetComponent;
    @ViewChild('cashFlowStatement', {static: false}) cashFlowStatement: CashFlowStatementComponent;
    @ViewChild('keyIndicators', {static: false}) keyIndicators: KeyIndicatorsComponent;
    @Input() formData: Financial;

    isBusinessLoan = false;

    fiscalYear = [];
    auditorList = [];
    activeTab: string;
    financialForm: FormGroup;
    financialData: Financial = new Financial();
    currentFormData: Object;

    // Financial heading arrays---
    incomeStatementArray = [
        'totalSalesRevenue',
        'costOfGoodsSold',
        'grossProfit',
        'operatingExpenses',
        'operatingProfit',
        'interestExpenses',
        'nonOperatingIncomeOrExpenses',
        'profitBeforeTaxAndStaffBonus',
        'staffBonus',
        'profitBeforeTaxes',
        'taxes',
        'profitAfterTax',
        'dividendOrDrawing',
        'otherAdjustment',
        'accumulatedProfitBOrD',
        'netProfitTransferredToBalanceSheet'
    ];
    incomeStatementCategoryArray = [
        'totalSalesSubCategory',
        'costOfGoodsSoldCategory',
        'operatingExpensesCategory',
        'interestExpensesCategory',
        'nonOperatingIncomeOrExpensesCategory',
        'taxesCategory'
    ];
    balanceSheetArray = [
        'currentAssets',
        'inventories',
        'fixedAssets',
        'otherAssets',
        'totalAssets',
        'currentLiabilities',
        'longTermLoan',
        'otherLongTermLiabilities',
        'otherProvisions',
        'netWorth',
        'totalLiabilitiesAndEquity',
        'differenceBS'
    ];
    balanceSheetCategoryArray = [
        'currentAssetsCategory',
        'inventoriesCategory',
        'fixedAssetsCategory',
        'otherAssetsCategory',
        'currentLiabilitiesCategory',
        'longTermLoanCategory',
        'otherLongTermLiabilitiesCategory',
        'netWorthCategory',
    ];
    cashFlowStatementArray = [
        'cashFromOperatingActivities',
        'netProfitForThePeriod',
        'depreciation',
        'otherAmortizationAndNonCashExpenses',
        'increaseDecreaseInInventory',
        'increaseDecreaseInAccountsReceivable',
        'increaseDecreaseInShortTermInvestment',
        'increaseDecreaseInAdvanceAndDeposit',
        'increaseDecreaseInOtherCurrentAssets',
        'increaseDecreaseInCreditors',
        'increaseDecreaseInOtherCurrentLiabilities',
        'adjustmentForNonOperatingIncome',
        'interestExpensesCFSa',
        'cashFromInvestingActivities',
        'changedInFixedAsset',
        'nonOperatingIncomeExpenses',
        'changeInOtherAssets',
        'changeInOtherLongTermLiabilities',
        'changeInOtherProvisions',
        'cashFromFinancingActivities',
        'paidUpCapitalEquity',
        'shortTermLoan',
        'longTermLoanReceived',
        'dividendDrawing',
        'interestExpensesCFSb',
        'otherAdjustments',
        'netCashFlow',
        'addOpeningBalance',
        'closingCash',
        'closingBalance',
        'differenceCFS'
    ];
    keyIndicatorsArray = [
        'growth',
        'sales',
        'grossProfitKI',
        'operatingProfitKI',
        'pAT',
        'profitability',
        'grossProfitMargin',
        'netProfitMargin',
        'eBITtoSales',
        'returnOnEquity',
        'solvency',
        'quickRatio',
        'currentRatio',
        'debtServiceCoverageRatio',
        'interestCoverageRatio',
        'debtEquityRatioOverall',
        'debtEquityRatioLongTerm',
        'debtEquityRatioWorkingCapital',
        'debtEquityRatioGeneral',
        'operatingCycle',
        'inventoryTurnoverRatio',
        'stockInHandDays',
        'debtorTurnOverRatio',
        'averageCollectionPeriod',
        'averagePaymentPeriod',
        'netOperatingCycle',
        'netWCBeforeBank'
    ];

    constructor(private formBuilder: FormBuilder,
                private financialService: FinancialService,
                private modalService: NgbModal,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe( queryParams => {
            if (queryParams.loanCategory === 'BUSINESS_TYPE') {
                this.isBusinessLoan = true;
            }
        });
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.formData)) {
            this.currentFormData = JSON.parse(this.formData.data);
            this.fiscalYear = this.currentFormData['fiscalYear'];
            this.auditorList = this.currentFormData['auditorList'];
            const initialFormData = this.currentFormData['initialForm'];

            this.setIncomeOfBorrower(initialFormData.incomeOfBorrower);
            this.setExpensesOfBorrower(initialFormData.expensesOfBorrower);
            this.financialForm.get('totalIncome').setValue(initialFormData.totalIncome);
            this.financialForm.get('totalExpense').setValue(initialFormData.totalExpense);
            this.financialForm.get('netSaving').setValue(initialFormData.netSaving);
        } else {
            if (this.isBusinessLoan) {
                const currentFormDataJson = JSON.stringify(currentFormData['default']);
                this.currentFormData = JSON.parse(currentFormDataJson);
            } else {
                this.currentFormData = {
                    fiscalYear: [],
                    initialForm: {}
                };
            }

            // functions for adding fields in initial Financial Form
            this.addIncomeOfBorrower();
            this.addExpensesOfBorrower();
        }
    }

    buildForm() {
        this.financialForm = this.formBuilder.group({
            incomeOfBorrower: this.formBuilder.array([]),
            expensesOfBorrower: this.formBuilder.array([]),
            totalIncome: [0],
            totalExpense: [0],
            netSaving: [0]
        });
    }

    // Setting existing data--
    // Set Initial Financial form--
    setIncomeOfBorrower(currentData) {
        const controls = this.financialForm.get('incomeOfBorrower') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    incomeSource: [singleData.incomeSource, Validators.required],
                    organization: [singleData.organization, Validators.required],
                    amount: [singleData.amount, Validators.required],
                    remarks: [singleData.remarks, Validators.required]
                })
            );
        });
    }

    setExpensesOfBorrower(currentData) {
        const controls = this.financialForm.get('expensesOfBorrower') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    particulars: [singleData.particulars, Validators.required],
                    amount: [singleData.amount, Validators.required],
                    remarks: [singleData.remarks, Validators.required]
                })
            );
        });
    }

    //
    //
    // Fiscal Year --
    addFiscalYear(yearValue, auditorDetails) {
        // push fiscal year
        this.fiscalYear.push(yearValue);

        // push Auditor Details if there's one
        if (!ObjectUtil.isEmpty(auditorDetails)) {
            this.auditorList.push(auditorDetails);
        }

        switch (this.activeTab) {
            case 'Income Statement':
                this.incomeStatement.ngOnDestroy();
                break;
            case 'Balance Sheet':
                this.balanceSheet.ngOnDestroy();
        }

        // Adding fiscal year for Json---
        this.addingFiscalYearForIncomeStatementJson(yearValue);
        this.addingFiscalYearForBalanceSheetJson(yearValue);
        this.addingFiscalYearForCashFlowStatement(yearValue);
        this.addingFiscalYearForKeyIndicators(yearValue);
        // Refreshing components with new Json data---
        this.refreshComponent();
    }

    removeFiscalYear(removeParamsObject) {
        // splice fiscal year
        this.fiscalYear.splice(removeParamsObject.index, 1);

        // splice Auditor Detail from list
        this.auditorList = this.auditorList.filter(value => !(removeParamsObject.fiscalYear as string).match(value.audited));

        switch (this.activeTab) {
            case 'Income Statement':
                // Push Income Statement---
                this.incomeStatement.ngOnDestroy();
                break;
            case 'Balance Sheet':
                // Push Balance Sheet---
                this.balanceSheet.ngOnDestroy();
                break;
        }
        // Removing fiscal year for Json---
        this.removingFiscalYearForIncomeStatementJson(removeParamsObject.index);
        this.removingFiscalYearForBalanceSheetJson(removeParamsObject.index);
        this.removingFiscalYearForCashFlowStatement(removeParamsObject.index);
        this.removingFiscalYearForKeyIndicators(removeParamsObject.index);
        // Refreshing components with new Json data---
        this.refreshComponent();
    }

    openFiscalYearModal() {
        const fiscalYearModalRef = this.modalService.open(FiscalYearModalComponent, {backdrop: 'static', size: 'lg'});
        fiscalYearModalRef.result.then( closeParams => {
            this.addFiscalYear(closeParams.fiscalYearValue, closeParams.auditorDetails);
        }, dismiss => {
            console.log(dismiss);
        });
    }

    refreshComponent() {
        switch (this.activeTab) {
            case 'Income Statement':
                this.incomeStatement.ngOnInit();
                break;
            case 'Balance Sheet':
                this.balanceSheet.ngOnInit();
                break;
            case 'Cash Flow Statement':
                this.cashFlowStatement.ngOnInit();
                break;
            case 'Key Indicators':
                this.keyIndicators.ngOnInit();
        }
    }

    // Adding Fiscal year for Json---
    // Income Statement Json Fiscal year addition---
    addingFiscalYearForIncomeStatementJson(yearValue) {
        const incomeStatementData = this.currentFormData['incomeStatementData'];
        // Income Statement Main Heading Json values--
        this.incomeStatementArray.forEach(headingValue => {
            this.financialService.addFiscalYearForJson(incomeStatementData[headingValue], yearValue);
        });
        // Income Statement Heading Category Json values--
        this.incomeStatementCategoryArray.forEach(headingValue => {
            this.financialService.addFiscalYearForJsonCategory(incomeStatementData[headingValue], yearValue);
        });
    }

    addingFiscalYearForBalanceSheetJson(yearValue) {
        const balanceSheetData = this.currentFormData['balanceSheetData'];
        this.balanceSheetArray.forEach(headingValue => {
            this.financialService.addFiscalYearForJson(balanceSheetData[headingValue], yearValue);
        });
        this.balanceSheetCategoryArray.forEach(headingValue => {
            this.financialService.addFiscalYearForJsonCategory(balanceSheetData[headingValue], yearValue);

        });
    }

    addingFiscalYearForCashFlowStatement(yearValue) {
        const cashFlowStatementData = this.currentFormData['cashFlowStatementData'];
        this.cashFlowStatementArray.forEach(headingValue => {
            this.financialService.addFiscalYearForJson(cashFlowStatementData[headingValue], yearValue);
        });
    }

    addingFiscalYearForKeyIndicators(yearValue) {
        const keyIndicatorsData = this.currentFormData['keyIndicatorsData'];
        this.keyIndicatorsArray.forEach(headingValue => {
            this.financialService.addFiscalYearForJson(keyIndicatorsData[headingValue], yearValue);
        });
    }

    //
    // Removing Fiscal Year for json---
    removingFiscalYearForIncomeStatementJson(index) {
        const incomeStatementData = this.currentFormData['incomeStatementData'];
        // Income Statement Main Heading Json values--
        this.incomeStatementArray.forEach(headingValue => {
            this.financialService.removeFiscalYearForJson(incomeStatementData[headingValue], index);
        });
        // Income Statement Heading Category Json values--
        this.incomeStatementCategoryArray.forEach(headingValue => {
            this.financialService.removeFiscalYearForJsonCategory(incomeStatementData[headingValue], index);
        });
    }

    removingFiscalYearForBalanceSheetJson(index) {
        const balanceSheetData = this.currentFormData['balanceSheetData'];
        this.balanceSheetArray.forEach(headingValue => {
            this.financialService.removeFiscalYearForJson(balanceSheetData[headingValue], index);
        });
        this.balanceSheetCategoryArray.forEach(headingValue => {
            this.financialService.removeFiscalYearForJsonCategory(balanceSheetData[headingValue], index);

        });
    }

    removingFiscalYearForCashFlowStatement(index) {
        const cashFlowStatementData = this.currentFormData['cashFlowStatementData'];
        this.cashFlowStatementArray.forEach(headingValue => {
            this.financialService.removeFiscalYearForJson(cashFlowStatementData[headingValue], index);
        });
    }

    removingFiscalYearForKeyIndicators(index) {
        const keyIndicatorsData = this.currentFormData['keyIndicatorsData'];
        this.keyIndicatorsArray.forEach(headingValue => {
            this.financialService.removeFiscalYearForJson(keyIndicatorsData[headingValue], index);
        });
    }

    //
    //
    // Header Part--
    addIncomeOfBorrower() {
        const control = this.financialForm.controls.incomeOfBorrower as FormArray;
        control.push(
            this.formBuilder.group({
                incomeSource: [undefined, Validators.required],
                organization: [undefined, Validators.required],
                amount: [undefined, Validators.required],
                remarks: [undefined, Validators.required]
            })
        );
    }

    addExpensesOfBorrower() {
        const control = this.financialForm.controls.expensesOfBorrower as FormArray;
        control.push(
            this.formBuilder.group({
                particulars: [undefined, Validators.required],
                amount: [undefined, Validators.required],
                remarks: [undefined, Validators.required]
            })
        );
    }

    removeIncomeIndex(incomeIndex) {
        (this.financialForm.get('incomeOfBorrower') as FormArray).removeAt(incomeIndex);
        this.totalAdditionInitialForm('incomeOfBorrower', 'totalIncome');
    }

    removeExpensesIndex(incomeIndex) {
        (this.financialForm.get('expensesOfBorrower') as FormArray).removeAt(incomeIndex);
        this.totalAdditionInitialForm('expensesOfBorrower', 'totalExpense');
    }

    totalAdditionInitialForm(formArrayName, resultControllerName) {
        let total = 0;
        (this.financialForm.get(formArrayName) as FormArray).controls.forEach( group => {
            total = Number(group.get('amount').value) + Number(total);
        });
        this.financialForm.get(resultControllerName).setValue(total);
        this.financialForm.get('netSaving').setValue(Number(this.financialForm.get('totalIncome').value)
            - Number(this.financialForm.get('totalExpense').value));
    }

    changeActiveTab(tabs: QueryList<any>) {
        tabs.forEach(tabContent => {
            if (tabContent.active) {
                this.activeTab = tabContent['tabTitle'];
            }
        });
    }

    onSubmit() {
        switch (this.activeTab) {
            case 'Income Statement':
                this.incomeStatement.ngOnDestroy();
                break;
            case 'Balance Sheet':
                this.balanceSheet.ngOnDestroy();
                break;
            case 'Cash Flow Statement':
                this.cashFlowStatement.ngOnDestroy();
                break;
            case 'Key Indicators':
                this.keyIndicators.ngOnDestroy();
        }
        if (!ObjectUtil.isEmpty(this.formData)) {
            this.financialData = this.formData;
        }
        this.currentFormData['fiscalYear'] = this.fiscalYear;
        this.currentFormData['initialForm'] = this.financialForm.value;
        if (this.isBusinessLoan) {
            this.currentFormData['brr'] = this.brr.borrowerRiskRating.value;
            this.currentFormData['auditorList'] = this.auditorList;
        }
        this.financialData.data = JSON.stringify(this.currentFormData);
    }
}
