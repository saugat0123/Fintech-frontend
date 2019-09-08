import {Component, Input, OnInit, QueryList, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BorrowerRiskRatingComponent} from './borrower-risk-rating/borrower-risk-rating.component';
import {IncomeStatementComponent} from './income-statement/income-statement.component';
import {BalanceSheetComponent} from './balance-sheet/balance-sheet.component';
import {CashFlowStatementComponent} from './cash-flow-statement/cash-flow-statement.component';
import {KeyIndicatorsComponent} from './key-indicators/key-indicators.component';
import * as currentFormData from './financial.json';
import {FinancialService} from './financial.service';

@Component({
    selector: 'app-financial',
    templateUrl: './financial.component.html',
    styleUrls: ['./financial.component.scss']
})
export class FinancialComponent implements OnInit {
    @ViewChild('brr') brr: BorrowerRiskRatingComponent;
    @ViewChild('incomeStatement') incomeStatement: IncomeStatementComponent;
    @ViewChild('balanceSheet') balanceSheet: BalanceSheetComponent;
    @ViewChild('cashFlowStatement') cashFlowStatement: CashFlowStatementComponent;
    @ViewChild('keyIndicators') keyIndicators: KeyIndicatorsComponent;
    @Input() formData: Object;

    addYear = false;
    fiscalYear = [];
    activeTab: string;
    financialForm: FormGroup;
    financialData: Object;
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
                private financialService: FinancialService) {
    }

    ngOnInit() {
        this.buildForm();
        if (this.formData !== undefined) {
            const formDataString = JSON.stringify(this.formData);
            this.currentFormData = JSON.parse(formDataString);
            this.fiscalYear = this.currentFormData['data'].fiscalYear;
            const initialFormData = this.currentFormData['data'].initialForm;

            this.setIncomeOfBorrower(initialFormData.incomeOfBorrower);
            this.setExpensesOfBorrower(initialFormData.expensesOfBorrower);
        } else {
            const currentFormDataJson = JSON.stringify(currentFormData['default']);
            this.currentFormData = JSON.parse(currentFormDataJson);

            // functions for adding fields in initial Financial Form
            this.addIncomeOfBorrower();
            this.addExpensesOfBorrower();
        }
    }

    buildForm() {
        this.financialForm = this.formBuilder.group({
            incomeOfBorrower: this.formBuilder.array([]),
            expensesOfBorrower: this.formBuilder.array([]),
            selectDenomination: [undefined, Validators.required]
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
    addFiscalYear(yearValue) {
        this.addYear = true;
        if (yearValue === '' || yearValue === undefined) {
            return;
        }
        // push fiscal year
        this.fiscalYear.push(yearValue);

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
        this.addYear = false;
    }

    removeFiscalYear(index) {
        // splice fiscal year
        this.fiscalYear.splice(index, 1);

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
        this.removingFiscalYearForIncomeStatementJson(index);
        this.removingFiscalYearForBalanceSheetJson(index);
        this.removingFiscalYearForCashFlowStatement(index);
        this.removingFiscalYearForKeyIndicators(index);
        // Refreshing components with new Json data---
        this.refreshComponent();
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
        const incomeStatementData = this.currentFormData['data'].incomeStatementData;
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
        const balanceSheetData = this.currentFormData['data'].balanceSheetData;
        this.balanceSheetArray.forEach(headingValue => {
            this.financialService.addFiscalYearForJson(balanceSheetData[headingValue], yearValue);
        });
        this.balanceSheetCategoryArray.forEach(headingValue => {
            this.financialService.addFiscalYearForJsonCategory(balanceSheetData[headingValue], yearValue);

        });
    }

    addingFiscalYearForCashFlowStatement(yearValue) {
        const cashFlowStatementData = this.currentFormData['data'].cashFlowStatementData;
        this.cashFlowStatementArray.forEach(headingValue => {
            this.financialService.addFiscalYearForJson(cashFlowStatementData[headingValue], yearValue);
        });
    }

    addingFiscalYearForKeyIndicators(yearValue) {
        const keyIndicatorsData = this.currentFormData['data'].keyIndicatorsData;
        this.keyIndicatorsArray.forEach(headingValue => {
            this.financialService.addFiscalYearForJson(keyIndicatorsData[headingValue], yearValue);
        });
    }

    //
    // Removing Fiscal Year for json---
    removingFiscalYearForIncomeStatementJson(index) {
        const incomeStatementData = this.currentFormData['data'].incomeStatementData;
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
        const balanceSheetData = this.currentFormData['data'].balanceSheetData;
        this.balanceSheetArray.forEach(headingValue => {
            this.financialService.removeFiscalYearForJson(balanceSheetData[headingValue], index);
        });
        this.balanceSheetCategoryArray.forEach(headingValue => {
            this.financialService.removeFiscalYearForJsonCategory(balanceSheetData[headingValue], index);

        });
    }

    removingFiscalYearForCashFlowStatement(index) {
        const cashFlowStatementData = this.currentFormData['data'].cashFlowStatementData;
        this.cashFlowStatementArray.forEach(headingValue => {
            this.financialService.removeFiscalYearForJson(cashFlowStatementData[headingValue], index);
        });
    }

    removingFiscalYearForKeyIndicators(index) {
        const keyIndicatorsData = this.currentFormData['data'].keyIndicatorsData;
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
    }

    removeExpensesIndex(incomeIndex) {
        (this.financialForm.get('expensesOfBorrower') as FormArray).removeAt(incomeIndex);
    }


    changeActiveTab(tabs: QueryList<any>) {
        tabs.forEach(tabContent => {
            if (tabContent.active) {
                this.activeTab = tabContent['tabTitle'];
            }
        });
        console.log(this.activeTab);
    }

    onSubmit() {
        switch (this.activeTab) {
            case 'Income Statement':
                this.incomeStatement.ngOnDestroy();
                break;
            case 'Balance Sheet':
                this.balanceSheet.ngOnDestroy();
        }
        this.currentFormData['data'].fiscalYear = this.fiscalYear;
        this.currentFormData['data'].brr = this.brr.borrowerRiskRating.value;
        this.currentFormData['data'].initialForm = this.financialForm.value;
        this.financialData = this.currentFormData;
    }
}
