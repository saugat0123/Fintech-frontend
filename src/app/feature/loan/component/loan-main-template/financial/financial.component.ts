import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BorrowerRiskRatingComponent} from './borrower-risk-rating/borrower-risk-rating.component';

@Component({
    selector: 'app-financial',
    templateUrl: './financial.component.html',
    styleUrls: ['./financial.component.scss']
})
export class FinancialComponent implements OnInit {
    @ViewChild('brr') brr: BorrowerRiskRatingComponent;
    @Input() formData: Object;

    addYear = false;
    fiscalYear = [];
    financialForm: FormGroup;
    additionalFinancialForm: FormGroup;
    financialData: Object;

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.buildForm();
        console.log(this.formData);
        const formDataString = JSON.stringify(this.formData);
        const formDataParsed = JSON.parse(formDataString);
        const formData = formDataParsed.data.financialForm;

        this.setTotalSalesRevenue(formData.totalSalesRevenue);
        this.setTotalSalesSubCategory(formData.totalSalesSubCategory);
        this.setCostOfGoodsSold(formData.costOfGoodsSold);
        this.setCostOfGoodsSoldCategory(formData.costOfGoodsSoldCategory);
        this.setGrossProfit(formData.grossProfit);
        this.setOperatingExpenses(formData.operatingExpenses);
        this.setOperatingExpensesCategory(formData.operatingExpensesCategory);
        this.setOperatingProfit(formData.operatingProfit);
        this.setInterestExpenses(formData.interestExpenses);
        this.setInterestExpensesCategory(formData.interestExpensesCategory);
        this.setNonOperatingIncomeOrExpenses(formData.nonOperatingIncomeOrExpenses);
        this.setNonOperatingIncomeOrExpensesCategory(formData.nonOperatingIncomeOrExpensesCategory);
        this.setProfitBeforeTaxAndStaffBonus(formData.profitBeforeTaxAndStaffBonus);
        this.setStaffBonus(formData.staffBonus);
        this.setProfitBeforeTaxes(formData.profitBeforeTaxes);
        this.setTaxes(formData.taxes);
        this.setTaxesCategory(formData.taxesCategory);
        this.setProfitAfterTax(formData.profitAfterTax);
        this.setDividendOrDrawing(formData.dividendOrDrawing);
        this.setOtherAdjustment(formData.otherAdjustment);
        this.setAccumulatedProfitBOrD(formData.accumulatedProfitBOrD);
        this.setNetProfitTransferredToBalanceSheet(formData.netProfitTransferredToBalanceSheet);
        /*this.setTaxes(formData.taxes);
        this.setTaxes(formData.taxes);*/
    }

    buildForm() {
        this.financialForm = this.formBuilder.group({
            incomeOfBorrower: this.formBuilder.array([]),
            expensesOfBorrower: this.formBuilder.array([]),
            selectDenomination: [undefined, Validators.required]
        });

        this.additionalFinancialForm = this.formBuilder.group({
            totalSalesRevenue: this.formBuilder.array([]),
            totalSalesSubCategory: this.formBuilder.array([
                this.formBuilder.group({
                    name: ['Direct Sales'],
                    amount: this.formBuilder.array([])
                })
            ]),
            costOfGoodsSold: this.formBuilder.array([]),
            costOfGoodsSoldCategory: this.formBuilder.array([
                this.formBuilder.group({
                    name: ['Raw Material Consumed'],
                    amount: this.formBuilder.array([])
                }),
                this.formBuilder.group({
                    name: ['Labor'],
                    amount: this.formBuilder.array([])
                }),
                this.formBuilder.group({
                    name: ['Other Direct Costs'],
                    amount: this.formBuilder.array([])
                })
            ]),
            grossProfit: this.formBuilder.array([]),
            operatingExpenses: this.formBuilder.array([]),
            operatingExpensesCategory: this.formBuilder.array([
                this.formBuilder.group({
                    name: ['Depreciation'],
                    amount: this.formBuilder.array([])
                }),
                this.formBuilder.group({
                    name: ['Amortization/Other Non-Cash Expenses'],
                    amount: this.formBuilder.array([])
                }),
                this.formBuilder.group({
                    name: ['Office Expenses'],
                    amount: this.formBuilder.array([])
                }),
                this.formBuilder.group({
                    name: ['Selling Overhead'],
                    amount: this.formBuilder.array([])
                })
            ]),
            operatingProfit: this.formBuilder.array([]),
            interestExpenses: this.formBuilder.array([]),
            interestExpensesCategory: this.formBuilder.array([
                this.formBuilder.group({
                    name: ['Interest on Term Loan'],
                    amount: this.formBuilder.array([])
                }),
                this.formBuilder.group({
                    name: ['Interest on Working Capital Loan'],
                    amount: this.formBuilder.array([])
                }),
            ]),
            nonOperatingIncomeOrExpenses: this.formBuilder.array([]),
            nonOperatingIncomeOrExpensesCategory: this.formBuilder.array([
                this.formBuilder.group({
                    name: ['Profit/(Loss) on Sale of Fixed Assets'],
                    amount: this.formBuilder.array([])
                })
            ]),
            profitBeforeTaxAndStaffBonus: this.formBuilder.array([]),
            staffBonus: this.formBuilder.array([]),
            profitBeforeTaxes: this.formBuilder.array([]),
            taxes: this.formBuilder.array([]),
            taxesCategory: this.formBuilder.array([
                this.formBuilder.group({
                    name: ['Tax'],
                    amount: this.formBuilder.array([])
                }),
                this.formBuilder.group({
                    name: ['Tax adjustment of prior year'],
                    amount: this.formBuilder.array([])
                })
            ]),
            profitAfterTax: this.formBuilder.array([]),
            dividendOrDrawing: this.formBuilder.array([]),
            otherAdjustment: this.formBuilder.array([]),
            accumulatedProfitBOrD: this.formBuilder.array([]),
            netProfitTransferredToBalanceSheet: this.formBuilder.array([]),

            currentAssets: this.formBuilder.array([]),
            currentAssetsCategory: this.formBuilder.array([
                this.formBuilder.group({
                    name: ['Cash/Bank Balance'],
                    amount: this.formBuilder.array([])
                }),
                this.formBuilder.group({
                    name: ['Short term investment'],
                    amount: this.formBuilder.array([])
                }),
                this.formBuilder.group({
                    name: ['Account Receivable'],
                    amount: this.formBuilder.array([])
                }),
                this.formBuilder.group({
                    name: ['Advances and Deposits'],
                    amount: this.formBuilder.array([])
                })
            ]),
            inventories: this.formBuilder.array([]),
            inventoriesCategory: this.formBuilder.array([
                this.formBuilder.group({
                    name: ['Finished Goods'],
                    amount: this.formBuilder.array([])
                }),
                this.formBuilder.group({
                    name: ['WIP/Raw Materials'],
                    amount: this.formBuilder.array([])
                })
            ]),
            fixedAssets: this.formBuilder.array([]),
            fixedAssetsCategory: this.formBuilder.array([
                this.formBuilder.group({
                    name: ['Net Fixed Assets'],
                    amount: this.formBuilder.array([])
                })
            ]),
            otherAssets: this.formBuilder.array([]),
            otherAssetsCategory: this.formBuilder.array([
                this.formBuilder.group({
                    name: ['Long term investment'],
                    amount: this.formBuilder.array([])
                }),
                this.formBuilder.group({
                    name: ['Preliminary expenses'],
                    amount: this.formBuilder.array([])
                })
            ]),
            totalAssets: this.formBuilder.array([]),
            currentLiabilities: this.formBuilder.array([]),
            currentLiabilitiesCategory: this.formBuilder.array([
                this.formBuilder.group({
                    name: ['Short Term Loan'],
                    amount: this.formBuilder.array([])
                }),
                this.formBuilder.group({
                    name: ['Creditors'],
                    amount: this.formBuilder.array([])
                })
            ]),
            longTermLoan: this.formBuilder.array([]),
            longTermLoanCategory: this.formBuilder.array([
                this.formBuilder.group({
                    name: ['Term Loan'],
                    amount: this.formBuilder.array([])
                }),
                this.formBuilder.group({
                    name: ['Debentures'],
                    amount: this.formBuilder.array([])
                }),
                this.formBuilder.group({
                    name: ['Loan From Promoters/Proprietor'],
                    amount: this.formBuilder.array([])
                })
            ]),
            otherLongTermLiabilities: this.formBuilder.array([]),
            otherLongTermLiabilitiesCategory: this.formBuilder.array([]),
            otherProvisions: this.formBuilder.array([]),
            netWorth: this.formBuilder.array([]),
            netWorthCategory: this.formBuilder.array([
                this.formBuilder.group({
                    name: ['Paid up Capital/Equity'],
                    amount: this.formBuilder.array([])
                }),
                this.formBuilder.group({
                    name: ['Retained Earning'],
                    amount: this.formBuilder.array([])
                })
            ]),
            totalLiabilitiesAndEquity: this.formBuilder.array([]),
            differenceBS: this.formBuilder.array([]),

            cashFromOperatingActivities: this.formBuilder.array([]),
            netProfitForThePeriod: this.formBuilder.array([]),
            depreciation: this.formBuilder.array([]),
            otherAmortizationAndNonCashExpenses: this.formBuilder.array([]),
            increaseDecreaseInInventory: this.formBuilder.array([]),
            increaseDecreaseInAccountsReceivable: this.formBuilder.array([]),
            increaseDecreaseInShortTermInvestment: this.formBuilder.array([]),
            increaseDecreaseInAdvanceAndDeposit: this.formBuilder.array([]),
            increaseDecreaseInOtherCurrentAssets: this.formBuilder.array([]),
            increaseDecreaseInCreditors: this.formBuilder.array([]),
            increaseDecreaseInOtherCurrentLiabilities: this.formBuilder.array([]),
            adjustmentForNonOperatingIncome: this.formBuilder.array([]),
            interestExpensesCFSa: this.formBuilder.array([]),
            cashFromInvestingActivities: this.formBuilder.array([]),
            changedInFixedAsset: this.formBuilder.array([]),
            nonOperatingIncomeExpenses: this.formBuilder.array([]),
            changeInOtherAssets: this.formBuilder.array([]),
            changeInOtherLongTermLiabilities: this.formBuilder.array([]),
            cashFromFinancingActivities: this.formBuilder.array([]),
            paidUpCapitalEquity: this.formBuilder.array([]),
            shortTermLoan: this.formBuilder.array([]),
            longTermLoanReceived: this.formBuilder.array([]),
            dividendDrawing: this.formBuilder.array([]),
            interestExpensesCFSb: this.formBuilder.array([]),
            otherAdjustments: this.formBuilder.array([]),
            netCashFlow: this.formBuilder.array([]),
            addOpeningBalance: this.formBuilder.array([]),
            closingCash: this.formBuilder.array([]),
            closingBalance: this.formBuilder.array([]),
            differenceCFS: this.formBuilder.array([]),

            growth: this.formBuilder.array([]),
            sales: this.formBuilder.array([]),
            grossProfitKI: this.formBuilder.array([]),
            operatingProfitKI: this.formBuilder.array([]),
            pAT: this.formBuilder.array([]),
            profitability: this.formBuilder.array([]),
            grossProfitMargin: this.formBuilder.array([]),
            netProfitMargin: this.formBuilder.array([]),
            eBITtoSales: this.formBuilder.array([]),
            returnOnEquity: this.formBuilder.array([]),
            solvency: this.formBuilder.array([]),
            quickRatio: this.formBuilder.array([]),
            currentRatio: this.formBuilder.array([]),
            debtServiceCoverageRatio: this.formBuilder.array([]),
            interestCoverageRatio: this.formBuilder.array([]),
            debtEquityRatioOverall: this.formBuilder.array([]),
            debtEquityRatioLongTerm: this.formBuilder.array([]),
            debtEquityRatioWorkingCapital: this.formBuilder.array([]),
            debtEquityRatioGeneral: this.formBuilder.array([]),
            operatingCycle: this.formBuilder.array([]),
            inventoryTurnoverRatio: this.formBuilder.array([]),
            stockInHandDays: this.formBuilder.array([]),
            debtorTurnOverRatio: this.formBuilder.array([]),
            averageCollectionPeriod: this.formBuilder.array([]),
            averagePaymentPeriod: this.formBuilder.array([]),
            netOperatingCycle: this.formBuilder.array([]),
            netWCBeforeBank: this.formBuilder.array([]),
        });
        // functions for adding fields
        this.addIncomeOfBorrower();
        this.addExpensesOfBorrower();
    }

    // Setting existing data--
    setTotalSalesRevenue(currentData) {
        this.fiscalYear = [];
        const controls = this.additionalFinancialForm.get('totalSalesRevenue') as FormArray;
        currentData.forEach(singleData => {
            this.fiscalYear.push(singleData.year);
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    setTotalSalesSubCategory(currentData) {
        const control = this.additionalFinancialForm.get('totalSalesSubCategory') as FormArray;
        control.controls.length = 0;
        currentData.forEach(singleData => {
            control.push(
                this.formBuilder.group({
                    name: [singleData.name],
                    amount: this.setSubCategoryAmount(singleData)
                })
            );
        });
    }

    setSubCategoryAmount(singleData) {
        const amountControl = this.formBuilder.array([]);
        console.log(singleData.amount);
        singleData.amount.forEach(singleAmount => {
            amountControl.push(
                this.formBuilder.group({
                    value: [singleAmount.value],
                    year: [singleAmount.year]
                })
            );
        });
        return amountControl;
    }

    // costOfGoodsSold
    setCostOfGoodsSold(currentData) {
        const controls = this.additionalFinancialForm.get('costOfGoodsSold') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    setCostOfGoodsSoldCategory(currentData) {
        const control = this.additionalFinancialForm.get('costOfGoodsSoldCategory') as FormArray;
        control.controls.length = 0;
        currentData.forEach(singleData => {
            control.push(
                this.formBuilder.group({
                    name: [singleData.name],
                    amount: this.setCostOfGoodsSoldCategoryAmount(singleData)
                })
            );
        });
    }

    setCostOfGoodsSoldCategoryAmount(singleData) {
        const amountControl = this.formBuilder.array([]);
        console.log(singleData.amount);
        singleData.amount.forEach(singleAmount => {
            amountControl.push(
                this.formBuilder.group({
                    value: [singleAmount.value],
                    year: [singleAmount.year]
                })
            );
        });
        return amountControl;
    }

    // grossProfit
    setGrossProfit(currentData) {
        const controls = this.additionalFinancialForm.get('grossProfit') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // operatingExpenses
    setOperatingExpenses(currentData) {
        const controls = this.additionalFinancialForm.get('operatingExpenses') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    setOperatingExpensesCategory(currentData) {
        const control = this.additionalFinancialForm.get('operatingExpensesCategory') as FormArray;
        control.controls.length = 0;
        currentData.forEach(singleData => {
            control.push(
                this.formBuilder.group({
                    name: [singleData.name],
                    amount: this.setOperatingExpensesCategoryAmount(singleData)
                })
            );
        });
    }

    setOperatingExpensesCategoryAmount(singleData) {
        const amountControl = this.formBuilder.array([]);
        console.log(singleData.amount);
        singleData.amount.forEach(singleAmount => {
            amountControl.push(
                this.formBuilder.group({
                    value: [singleAmount.value],
                    year: [singleAmount.year]
                })
            );
        });
        return amountControl;
    }

    // operatingProfit
    setOperatingProfit(currentData) {
        const controls = this.additionalFinancialForm.get('operatingProfit') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // interestExpenses
    setInterestExpenses(currentData) {
        const controls = this.additionalFinancialForm.get('interestExpenses') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    setInterestExpensesCategory(currentData) {
        const control = this.additionalFinancialForm.get('interestExpensesCategory') as FormArray;
        control.controls.length = 0;
        currentData.forEach(singleData => {
            control.push(
                this.formBuilder.group({
                    name: [singleData.name],
                    amount: this.setInterestExpensesCategoryAmount(singleData)
                })
            );
        });
    }

    setInterestExpensesCategoryAmount(singleData) {
        const amountControl = this.formBuilder.array([]);
        console.log(singleData.amount);
        singleData.amount.forEach(singleAmount => {
            amountControl.push(
                this.formBuilder.group({
                    value: [singleAmount.value],
                    year: [singleAmount.year]
                })
            );
        });
        return amountControl;
    }

    // nonOperatingIncomeOrExpenses
    setNonOperatingIncomeOrExpenses(currentData) {
        const controls = this.additionalFinancialForm.get('nonOperatingIncomeOrExpenses') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    setNonOperatingIncomeOrExpensesCategory(currentData) {
        const control = this.additionalFinancialForm.get('nonOperatingIncomeOrExpensesCategory') as FormArray;
        control.controls.length = 0;
        currentData.forEach(singleData => {
            control.push(
                this.formBuilder.group({
                    name: [singleData.name],
                    amount: this.setNonOperatingIncomeOrExpensesCategoryAmount(singleData)
                })
            );
        });
    }

    setNonOperatingIncomeOrExpensesCategoryAmount(singleData) {
        const amountControl = this.formBuilder.array([]);
        console.log(singleData.amount);
        singleData.amount.forEach(singleAmount => {
            amountControl.push(
                this.formBuilder.group({
                    value: [singleAmount.value],
                    year: [singleAmount.year]
                })
            );
        });
        return amountControl;
    }

    // profitBeforeTaxAndStaffBonus
    setProfitBeforeTaxAndStaffBonus(currentData) {
        const controls = this.additionalFinancialForm.get('profitBeforeTaxAndStaffBonus') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // staffBonus
    setStaffBonus(currentData) {
        const controls = this.additionalFinancialForm.get('staffBonus') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // profitBeforeTaxes
    setProfitBeforeTaxes(currentData) {
        const controls = this.additionalFinancialForm.get('profitBeforeTaxes') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // taxes
    setTaxes(currentData) {
        const controls = this.additionalFinancialForm.get('taxes') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    setTaxesCategory(currentData) {
        const control = this.additionalFinancialForm.get('taxesCategory') as FormArray;
        control.controls.length = 0;
        currentData.forEach(singleData => {
            control.push(
                this.formBuilder.group({
                    name: [singleData.name],
                    amount: this.setTaxesCategoryAmount(singleData)
                })
            );
        });
    }

    setTaxesCategoryAmount(singleData) {
        const amountControl = this.formBuilder.array([]);
        console.log(singleData.amount);
        singleData.amount.forEach(singleAmount => {
            amountControl.push(
                this.formBuilder.group({
                    value: [singleAmount.value],
                    year: [singleAmount.year]
                })
            );
        });
        return amountControl;
    }

    // profitAfterTax
    setProfitAfterTax(currentData) {
        const controls = this.additionalFinancialForm.get('profitAfterTax') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // dividendOrDrawing
    setDividendOrDrawing(currentData) {
        const controls = this.additionalFinancialForm.get('dividendOrDrawing') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // otherAdjustment
    setOtherAdjustment(currentData) {
        const controls = this.additionalFinancialForm.get('otherAdjustment') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // accumulatedProfitBOrD
    setAccumulatedProfitBOrD(currentData) {
        const controls = this.additionalFinancialForm.get('accumulatedProfitBOrD') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // netProfitTransferredToBalanceSheet
    setNetProfitTransferredToBalanceSheet(currentData) {
        const controls = this.additionalFinancialForm.get('netProfitTransferredToBalanceSheet') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
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
        // push Total Sales
        const totalSalesControl = this.additionalFinancialForm.get('totalSalesRevenue') as FormArray;
        totalSalesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // push Total Sales Category
        const totalSalesSubCategoryControl = this.additionalFinancialForm.get('totalSalesSubCategory') as FormArray;
        totalSalesSubCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [yearValue]
                })
            );
        });
        // Push Cost of Goods Sold
        const costOfGoodsSoldControl = this.additionalFinancialForm.get('costOfGoodsSold') as FormArray;
        costOfGoodsSoldControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Cost of Goods Sold Category
        const costOfGoodsSoldCategoryControl = this.additionalFinancialForm.get('costOfGoodsSoldCategory') as FormArray;
        costOfGoodsSoldCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [yearValue]
                })
            );
        });
        // Push Gross Profit
        const grossProfitControl = this.additionalFinancialForm.get('grossProfit') as FormArray;
        grossProfitControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Cost of Goods Sold
        const operatingExpensesControl = this.additionalFinancialForm.get('operatingExpenses') as FormArray;
        operatingExpensesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Cost of Goods Sold Category
        const operatingExpensesCategoryControl = this.additionalFinancialForm.get('operatingExpensesCategory') as FormArray;
        operatingExpensesCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [yearValue]
                })
            );
        });
        // Push Operating Profit
        const operatingProfitControl = this.additionalFinancialForm.get('operatingProfit') as FormArray;
        operatingProfitControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Interest Expenses
        const interestExpensesControl = this.additionalFinancialForm.get('interestExpenses') as FormArray;
        interestExpensesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Interest Expenses Category
        const interestExpensesCategoryControl = this.additionalFinancialForm.get('interestExpensesCategory') as FormArray;
        interestExpensesCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [yearValue]
                })
            );
        });
        // Push Non-Operating Income/Expenses
        const nonOperatingIncomeOrExpensesControl = this.additionalFinancialForm.get('nonOperatingIncomeOrExpenses') as FormArray;
        nonOperatingIncomeOrExpensesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Non-Operating Income/Expenses Category
        const nonOperatingIncomeOrExpensesCategoryControl = this.additionalFinancialForm.get('nonOperatingIncomeOrExpensesCategory') as
            FormArray;
        nonOperatingIncomeOrExpensesCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [yearValue]
                })
            );
        });
        // Push Profit Before Tax and Staff Bonus
        const profitBeforeTaxAndStaffBonusControl = this.additionalFinancialForm.get('profitBeforeTaxAndStaffBonus') as FormArray;
        profitBeforeTaxAndStaffBonusControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Profit Before Tax and Staff Bonus
        const staffBonusControl = this.additionalFinancialForm.get('staffBonus') as FormArray;
        staffBonusControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Profit Before Taxes
        const profitBeforeTaxesControl = this.additionalFinancialForm.get('profitBeforeTaxes') as FormArray;
        profitBeforeTaxesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Taxes
        const taxesControl = this.additionalFinancialForm.get('taxes') as FormArray;
        taxesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Taxes Category
        const taxesCategoryControl = this.additionalFinancialForm.get('taxesCategory') as FormArray;
        taxesCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [yearValue]
                })
            );
        });
        // Push Profit After Tax
        const profitAfterTaxControl = this.additionalFinancialForm.get('profitAfterTax') as FormArray;
        profitAfterTaxControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Dividend/Drawing
        const dividendOrDrawingControl = this.additionalFinancialForm.get('dividendOrDrawing') as FormArray;
        dividendOrDrawingControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Other adjustment
        const otherAdjustmentControl = this.additionalFinancialForm.get('otherAdjustment') as FormArray;
        otherAdjustmentControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Accumulated profit b/d
        const accumulatedProfitBOrDControl = this.additionalFinancialForm.get('accumulatedProfitBOrD') as FormArray;
        accumulatedProfitBOrDControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Net Profit Transferred to Balance Sheet
        const netProfitTransferredToBalanceSheetControl = this.additionalFinancialForm.get('netProfitTransferredToBalanceSheet') as
            FormArray;
        netProfitTransferredToBalanceSheetControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Current Assets
        const currentAssetsControl = this.additionalFinancialForm.get('currentAssets') as FormArray;
        currentAssetsControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Current Assets Category
        const currentAssetsCategoryControl = this.additionalFinancialForm.get('currentAssetsCategory') as FormArray;
        currentAssetsCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [yearValue]
                })
            );
        });
        // Push inventories
        const inventoriesControl = this.additionalFinancialForm.get('inventories') as FormArray;
        inventoriesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push inventories Category
        const inventoriesCategoryControl = this.additionalFinancialForm.get('inventoriesCategory') as FormArray;
        inventoriesCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [yearValue]
                })
            );
        });
        // Push Fixed Assets
        const fixedAssetsControl = this.additionalFinancialForm.get('fixedAssets') as FormArray;
        fixedAssetsControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Fixed Assets Category
        const fixedAssetsCategoryControl = this.additionalFinancialForm.get('fixedAssetsCategory') as FormArray;
        fixedAssetsCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [yearValue]
                })
            );
        });
        // Push Other Assets
        const otherAssetsControl = this.additionalFinancialForm.get('otherAssets') as FormArray;
        otherAssetsControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Other Assets Category
        const otherAssetsCategoryControl = this.additionalFinancialForm.get('otherAssetsCategory') as FormArray;
        otherAssetsCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [yearValue]
                })
            );
        });
        // Push Total Assets
        const totalAssetsControl = this.additionalFinancialForm.get('totalAssets') as FormArray;
        totalAssetsControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Current Liabilities
        const currentLiabilitiesControl = this.additionalFinancialForm.get('currentLiabilities') as FormArray;
        currentLiabilitiesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Current Liabilities Category
        const currentLiabilitiesCategoryControl = this.additionalFinancialForm.get('currentLiabilitiesCategory') as FormArray;
        currentLiabilitiesCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [yearValue]
                })
            );
        });
        // Push Long Term Loan
        const longTermLoanControl = this.additionalFinancialForm.get('longTermLoan') as FormArray;
        longTermLoanControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Long Term Loan Category
        const longTermLoanCategoryControl = this.additionalFinancialForm.get('longTermLoanCategory') as FormArray;
        longTermLoanCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [yearValue]
                })
            );
        });
        // Push Other Long Term Liabilities
        const otherLongTermLiabilitiesControl = this.additionalFinancialForm.get('otherLongTermLiabilities') as FormArray;
        otherLongTermLiabilitiesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Other Long Term Liabilities Category
        const otherLongTermLiabilitiesCategoryControl = this.additionalFinancialForm.get('otherLongTermLiabilitiesCategory') as FormArray;
        otherLongTermLiabilitiesCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [yearValue]
                })
            );
        });
        // Push Other Provisions
        const otherProvisionsControl = this.additionalFinancialForm.get('otherProvisions') as FormArray;
        otherProvisionsControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Net Worth
        const netWorthControl = this.additionalFinancialForm.get('netWorth') as FormArray;
        netWorthControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Net Worth Category
        const netWorthCategoryControl = this.additionalFinancialForm.get('netWorthCategory') as FormArray;
        netWorthCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [yearValue]
                })
            );
        });
        // Push Total Liabilities and Equity
        const totalLiabilitiesAndEquityControl = this.additionalFinancialForm.get('totalLiabilitiesAndEquity') as FormArray;
        totalLiabilitiesAndEquityControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Difference BS
        const differenceBSControl = this.additionalFinancialForm.get('differenceBS') as FormArray;
        differenceBSControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Cash From Operating Activities
        const cashFromOperatingActivitiesControl = this.additionalFinancialForm.get('cashFromOperatingActivities') as FormArray;
        cashFromOperatingActivitiesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push netProfitForThePeriod
        const netProfitForThePeriodControl = this.additionalFinancialForm.get('netProfitForThePeriod') as FormArray;
        netProfitForThePeriodControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push depreciation
        const depreciationControl = this.additionalFinancialForm.get('depreciation') as FormArray;
        depreciationControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push otherAmortizationAndNonCashExpenses
        const otherAmortizationAndNonCashExpensesControl = this.additionalFinancialForm.get('otherAmortizationAndNonCashExpenses') as
            FormArray;
        otherAmortizationAndNonCashExpensesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push increaseDecreaseInInventory
        const increaseDecreaseInInventoryControl = this.additionalFinancialForm.get('increaseDecreaseInInventory') as FormArray;
        increaseDecreaseInInventoryControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push increaseDecreaseInAccountsReceivable
        const increaseDecreaseInAccountsReceivableControl = this.additionalFinancialForm.get('increaseDecreaseInAccountsReceivable') as
            FormArray;
        increaseDecreaseInAccountsReceivableControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push increaseDecreaseInShortTermInvestment
        const increaseDecreaseInShortTermInvestmentControl = this.additionalFinancialForm.get('increaseDecreaseInShortTermInvestment') as
            FormArray;
        increaseDecreaseInShortTermInvestmentControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push increaseDecreaseInAdvanceAndDeposit
        const increaseDecreaseInAdvanceAndDepositControl = this.additionalFinancialForm.get('increaseDecreaseInAdvanceAndDeposit') as
            FormArray;
        increaseDecreaseInAdvanceAndDepositControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push increaseDecreaseInOtherCurrentAssets
        const increaseDecreaseInOtherCurrentAssetsControl = this.additionalFinancialForm.get('increaseDecreaseInOtherCurrentAssets') as
            FormArray;
        increaseDecreaseInOtherCurrentAssetsControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push increaseDecreaseInCreditors
        const increaseDecreaseInCreditorsControl = this.additionalFinancialForm.get('increaseDecreaseInCreditors') as
            FormArray;
        increaseDecreaseInCreditorsControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push increaseDecreaseInOtherCurrentLiabilities
        const increaseDecreaseInOtherCurrentLiabilitiesControl =
            this.additionalFinancialForm.get('increaseDecreaseInOtherCurrentLiabilities') as
                FormArray;
        increaseDecreaseInOtherCurrentLiabilitiesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push adjustmentForNonOperatingIncome
        const adjustmentForNonOperatingIncomeControl = this.additionalFinancialForm.get('adjustmentForNonOperatingIncome') as FormArray;
        adjustmentForNonOperatingIncomeControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push interestExpensesCFSaControl
        const interestExpensesCFSaControl = this.additionalFinancialForm.get('interestExpensesCFSa') as FormArray;
        interestExpensesCFSaControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push cashFromInvestingActivities
        const cashFromInvestingActivitiesControl = this.additionalFinancialForm.get('cashFromInvestingActivities') as FormArray;
        cashFromInvestingActivitiesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push changedInFixedAsset
        const changedInFixedAssetControl = this.additionalFinancialForm.get('changedInFixedAsset') as FormArray;
        changedInFixedAssetControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push nonOperatingIncomeExpenses
        const nonOperatingIncomeExpensesControl = this.additionalFinancialForm.get('nonOperatingIncomeExpenses') as FormArray;
        nonOperatingIncomeExpensesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push changeInOtherAssets
        const changeInOtherAssetsControl = this.additionalFinancialForm.get('changeInOtherAssets') as FormArray;
        changeInOtherAssetsControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push changeInOtherLongTermLiabilities
        const changeInOtherLongTermLiabilitiesControl = this.additionalFinancialForm.get('changeInOtherLongTermLiabilities') as FormArray;
        changeInOtherLongTermLiabilitiesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push cashFromFinancingActivities
        const cashFromFinancingActivitiesControl = this.additionalFinancialForm.get('cashFromFinancingActivities') as FormArray;
        cashFromFinancingActivitiesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push paidUpCapitalEquity
        const paidUpCapitalEquityControl = this.additionalFinancialForm.get('paidUpCapitalEquity') as FormArray;
        paidUpCapitalEquityControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push shortTermLoan
        const shortTermLoanControl = this.additionalFinancialForm.get('shortTermLoan') as FormArray;
        shortTermLoanControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push longTermLoanReceived
        const longTermLoanReceivedControl = this.additionalFinancialForm.get('longTermLoanReceived') as FormArray;
        longTermLoanReceivedControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push dividendDrawing
        const dividendDrawingControl = this.additionalFinancialForm.get('dividendDrawing') as FormArray;
        dividendDrawingControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push interestExpensesCFSb
        const interestExpensesCFSbControl = this.additionalFinancialForm.get('interestExpensesCFSb') as FormArray;
        interestExpensesCFSbControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push otherAdjustments
        const otherAdjustmentsControl = this.additionalFinancialForm.get('otherAdjustments') as FormArray;
        otherAdjustmentsControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push netCashFlow
        const netCashFlowControl = this.additionalFinancialForm.get('netCashFlow') as FormArray;
        netCashFlowControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push addOpeningBalance
        const addOpeningBalanceControl = this.additionalFinancialForm.get('addOpeningBalance') as FormArray;
        addOpeningBalanceControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push closingCash
        const closingCashControl = this.additionalFinancialForm.get('closingCash') as FormArray;
        closingCashControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push closingBalance
        const closingBalanceControl = this.additionalFinancialForm.get('closingBalance') as FormArray;
        closingBalanceControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Difference CFS
        const differenceCFSControl = this.additionalFinancialForm.get('differenceCFS') as FormArray;
        differenceCFSControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push growth
        const growthControl = this.additionalFinancialForm.get('growth') as FormArray;
        growthControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push sales
        const salesControl = this.additionalFinancialForm.get('sales') as FormArray;
        salesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push grossProfitKI
        const grossProfitKIControl = this.additionalFinancialForm.get('grossProfitKI') as FormArray;
        grossProfitKIControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push operatingProfitKI
        const operatingProfitKIControl = this.additionalFinancialForm.get('operatingProfitKI') as FormArray;
        operatingProfitKIControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push pAT
        const pATControl = this.additionalFinancialForm.get('pAT') as FormArray;
        pATControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push profitability
        const profitabilityControl = this.additionalFinancialForm.get('profitability') as FormArray;
        profitabilityControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push grossProfitMargin
        const grossProfitMarginControl = this.additionalFinancialForm.get('grossProfitMargin') as FormArray;
        grossProfitMarginControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push netProfitMargin
        const netProfitMarginControl = this.additionalFinancialForm.get('netProfitMargin') as FormArray;
        netProfitMarginControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push eBITtoSales
        const eBITtoSalesControl = this.additionalFinancialForm.get('eBITtoSales') as FormArray;
        eBITtoSalesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push returnOnEquity
        const returnOnEquity = this.additionalFinancialForm.get('returnOnEquity') as FormArray;
        returnOnEquity.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push solvency
        const solvency = this.additionalFinancialForm.get('solvency') as FormArray;
        solvency.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push quickRatio
        const quickRatio = this.additionalFinancialForm.get('quickRatio') as FormArray;
        quickRatio.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push currentRatio
        const currentRatio = this.additionalFinancialForm.get('currentRatio') as FormArray;
        currentRatio.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push debtServiceCoverageRatio
        const debtServiceCoverageRatio = this.additionalFinancialForm.get('debtServiceCoverageRatio') as FormArray;
        debtServiceCoverageRatio.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push interestCoverageRatio
        const interestCoverageRatio = this.additionalFinancialForm.get('interestCoverageRatio') as FormArray;
        interestCoverageRatio.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push debtEquityRatioOverall
        const debtEquityRatioOverall = this.additionalFinancialForm.get('debtEquityRatioOverall') as FormArray;
        debtEquityRatioOverall.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push debtEquityRatioLongTerm
        const debtEquityRatioLongTerm = this.additionalFinancialForm.get('debtEquityRatioLongTerm') as FormArray;
        debtEquityRatioLongTerm.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push debtEquityRatioWorkingCapital
        const debtEquityRatioWorkingCapital = this.additionalFinancialForm.get('debtEquityRatioWorkingCapital') as FormArray;
        debtEquityRatioWorkingCapital.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push debtEquityRatioGeneral
        const debtEquityRatioGeneral = this.additionalFinancialForm.get('debtEquityRatioGeneral') as FormArray;
        debtEquityRatioGeneral.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push operatingCycle
        const operatingCycle = this.additionalFinancialForm.get('operatingCycle') as FormArray;
        operatingCycle.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push inventoryTurnoverRatio
        const inventoryTurnoverRatio = this.additionalFinancialForm.get('inventoryTurnoverRatio') as FormArray;
        inventoryTurnoverRatio.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push stockInHandDays
        const stockInHandDays = this.additionalFinancialForm.get('stockInHandDays') as FormArray;
        stockInHandDays.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push debtorTurnOverRatio
        const debtorTurnOverRatio = this.additionalFinancialForm.get('debtorTurnOverRatio') as FormArray;
        debtorTurnOverRatio.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push averageCollectionPeriod
        const averageCollectionPeriod = this.additionalFinancialForm.get('averageCollectionPeriod') as FormArray;
        averageCollectionPeriod.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push averagePaymentPeriod
        const averagePaymentPeriod = this.additionalFinancialForm.get('averagePaymentPeriod') as FormArray;
        averagePaymentPeriod.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push netOperatingCycle
        const netOperatingCycle = this.additionalFinancialForm.get('netOperatingCycle') as FormArray;
        netOperatingCycle.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push netWCBeforeBank
        const netWCBeforeBank = this.additionalFinancialForm.get('netWCBeforeBank') as FormArray;
        netWCBeforeBank.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        this.addYear = false;
    }

    removeFiscalYear(index) {
        // splice fiscal year
        this.fiscalYear.splice(index, 1);
        // remove Total Sales
        const totalSalesControl = this.additionalFinancialForm.get('totalSalesRevenue') as FormArray;
        totalSalesControl.removeAt(index);
        // remove Total Sales Category
        const totalSalesSubCategoryControl = this.additionalFinancialForm.get('totalSalesSubCategory') as FormArray;
        totalSalesSubCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.removeAt(index);
        });
        // remove Cost of Goods Sold
        const costOfGoodsSoldControl = this.additionalFinancialForm.get('costOfGoodsSold') as FormArray;
        costOfGoodsSoldControl.removeAt(index);
        // remove Cost of Goods Sold Category
        const costOfGoodsSoldCategoryControl = this.additionalFinancialForm.get('costOfGoodsSoldCategory') as FormArray;
        costOfGoodsSoldCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.removeAt(index);
        });
        // remove Gross Profit
        const grossProfitControl = this.additionalFinancialForm.get('grossProfit') as FormArray;
        grossProfitControl.removeAt(index);
        // remove Operating Expenses
        const operatingExpensesControl = this.additionalFinancialForm.get('operatingExpenses') as FormArray;
        operatingExpensesControl.removeAt(index);
        // remove Operating Expenses Category
        const operatingExpensesCategoryControl = this.additionalFinancialForm.get('operatingExpensesCategory') as FormArray;
        operatingExpensesCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.removeAt(index);
        });
        // remove Gross Profit
        const operatingProfitControl = this.additionalFinancialForm.get('operatingProfit') as FormArray;
        operatingProfitControl.removeAt(index);
        // remove Interest Expenses
        const interestExpensesControl = this.additionalFinancialForm.get('interestExpenses') as FormArray;
        interestExpensesControl.removeAt(index);
        // remove Interest Expenses Category
        const interestExpensesCategoryControl = this.additionalFinancialForm.get('interestExpensesCategory') as FormArray;
        interestExpensesCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.removeAt(index);
        });
        // remove Non-Operating Income/Expenses
        const nonOperatingIncomeOrExpensesControl = this.additionalFinancialForm.get('nonOperatingIncomeOrExpenses') as FormArray;
        nonOperatingIncomeOrExpensesControl.removeAt(index);
        // remove Non-Operating Income/Expenses Category
        const nonOperatingIncomeOrExpensesCategoryControl = this.additionalFinancialForm.get('nonOperatingIncomeOrExpensesCategory') as
            FormArray;
        nonOperatingIncomeOrExpensesCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.removeAt(index);
        });
        // remove Profit Before Tax and Staff Bonus
        const profitBeforeTaxAndStaffBonusControl = this.additionalFinancialForm.get('profitBeforeTaxAndStaffBonus') as FormArray;
        profitBeforeTaxAndStaffBonusControl.removeAt(index);
        // remove Staff Bonus
        const staffBonusControl = this.additionalFinancialForm.get('staffBonus') as FormArray;
        staffBonusControl.removeAt(index);
        // remove Profit Before Taxes
        const profitBeforeTaxesControl = this.additionalFinancialForm.get('profitBeforeTaxes') as FormArray;
        profitBeforeTaxesControl.removeAt(index);
        // remove Taxes
        const taxesControl = this.additionalFinancialForm.get('taxes') as FormArray;
        taxesControl.removeAt(index);
        // remove Taxes Category
        const taxesCategoryControl = this.additionalFinancialForm.get('taxesCategory') as FormArray;
        taxesCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.removeAt(index);
        });
        // remove Profit Before Taxes
        const profitAfterTaxControl = this.additionalFinancialForm.get('profitAfterTax') as FormArray;
        profitAfterTaxControl.removeAt(index);
        // remove Dividend/Drawing
        const dividendOrDrawingControl = this.additionalFinancialForm.get('dividendOrDrawing') as FormArray;
        dividendOrDrawingControl.removeAt(index);
        // remove Other adjustment
        const otherAdjustmentControl = this.additionalFinancialForm.get('otherAdjustment') as FormArray;
        otherAdjustmentControl.removeAt(index);
        // remove Accumulated profit b/d
        const accumulatedProfitBOrDControl = this.additionalFinancialForm.get('accumulatedProfitBOrD') as FormArray;
        accumulatedProfitBOrDControl.removeAt(index);
        // remove Net Profit Transferred to Balance Sheet
        const netProfitTransferredToBalanceSheetControl = this.additionalFinancialForm.get('netProfitTransferredToBalanceSheet') as
            FormArray;
        netProfitTransferredToBalanceSheetControl.removeAt(index);
        // remove Current Assets
        const currentAssetsControl = this.additionalFinancialForm.get('currentAssets') as FormArray;
        currentAssetsControl.removeAt(index);
        // remove Current Assets Category
        const currentAssetsCategoryControl = this.additionalFinancialForm.get('currentAssetsCategory') as FormArray;
        currentAssetsCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.removeAt(index);
        });
        // remove Inventories
        const inventoriesControl = this.additionalFinancialForm.get('inventories') as FormArray;
        inventoriesControl.removeAt(index);
        // remove Inventories Category
        const inventoriesCategoryControl = this.additionalFinancialForm.get('inventoriesCategory') as FormArray;
        inventoriesCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.removeAt(index);
        });
        // remove Fixed Assets
        const fixedAssetsControl = this.additionalFinancialForm.get('fixedAssets') as FormArray;
        fixedAssetsControl.removeAt(index);
        // remove Fixed Assets Category
        const fixedAssetsCategoryControl = this.additionalFinancialForm.get('fixedAssetsCategory') as FormArray;
        fixedAssetsCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.removeAt(index);
        });
        // remove Other Assets
        const otherAssetsControl = this.additionalFinancialForm.get('otherAssets') as FormArray;
        otherAssetsControl.removeAt(index);
        // remove Other Assets Category
        const otherAssetsCategoryControl = this.additionalFinancialForm.get('otherAssetsCategory') as FormArray;
        otherAssetsCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.removeAt(index);
        });
        // remove Total Assets
        const totalAssetsControl = this.additionalFinancialForm.get('totalAssets') as FormArray;
        totalAssetsControl.removeAt(index);
        // remove Current Liabilities
        const currentLiabilitiesControl = this.additionalFinancialForm.get('currentLiabilities') as FormArray;
        currentLiabilitiesControl.removeAt(index);
        // remove Current Liabilities Category
        const currentLiabilitiesCategoryControl = this.additionalFinancialForm.get('currentLiabilitiesCategory') as FormArray;
        currentLiabilitiesCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.removeAt(index);
        });
        // remove Long Term Loan
        const longTermLoanControl = this.additionalFinancialForm.get('longTermLoan') as FormArray;
        longTermLoanControl.removeAt(index);
        // remove Long Term Loan Category
        const longTermLoanCategoryControl = this.additionalFinancialForm.get('longTermLoanCategory') as FormArray;
        longTermLoanCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.removeAt(index);
        });
        // remove Other Long Term Liabilities
        const otherLongTermLiabilitiesControl = this.additionalFinancialForm.get('otherLongTermLiabilities') as FormArray;
        otherLongTermLiabilitiesControl.removeAt(index);
        // remove Other Long Term Liabilities Category
        const otherLongTermLiabilitiesCategoryControl = this.additionalFinancialForm.get('otherLongTermLiabilitiesCategory') as FormArray;
        otherLongTermLiabilitiesCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.removeAt(index);
        });
        // remove Other Provisions
        const otherProvisionsControl = this.additionalFinancialForm.get('otherProvisions') as FormArray;
        otherProvisionsControl.removeAt(index);
        // remove Net Worth
        const netWorthControl = this.additionalFinancialForm.get('netWorth') as FormArray;
        netWorthControl.removeAt(index);
        // remove Net Worth Category
        const netWorthCategoryControl = this.additionalFinancialForm.get('netWorthCategory') as FormArray;
        netWorthCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.removeAt(index);
        });
        // remove Total Liabilities and Equity
        const totalLiabilitiesAndEquityControl = this.additionalFinancialForm.get('totalLiabilitiesAndEquity') as FormArray;
        totalLiabilitiesAndEquityControl.removeAt(index);
        // remove Difference
        const differenceBSControl = this.additionalFinancialForm.get('differenceBS') as FormArray;
        differenceBSControl.removeAt(index);

        // remove cashFromOperatingActivities
        const cashFromOperatingActivities = this.additionalFinancialForm.get('cashFromOperatingActivities') as FormArray;
        cashFromOperatingActivities.removeAt(index);
        // remove netProfitForThePeriod
        const netProfitForThePeriod = this.additionalFinancialForm.get('netProfitForThePeriod') as FormArray;
        netProfitForThePeriod.removeAt(index);
        // remove depreciation
        const depreciation = this.additionalFinancialForm.get('depreciation') as FormArray;
        depreciation.removeAt(index);
        // remove otherAmortizationAndNonCashExpenses
        const otherAmortizationAndNonCashExpenses = this.additionalFinancialForm.get('otherAmortizationAndNonCashExpenses') as FormArray;
        otherAmortizationAndNonCashExpenses.removeAt(index);
        // remove increaseDecreaseInInventory
        const increaseDecreaseInInventory = this.additionalFinancialForm.get('increaseDecreaseInInventory') as FormArray;
        increaseDecreaseInInventory.removeAt(index);
        // remove increaseDecreaseInAccountsReceivable
        const increaseDecreaseInAccountsReceivable = this.additionalFinancialForm.get('increaseDecreaseInAccountsReceivable') as FormArray;
        increaseDecreaseInAccountsReceivable.removeAt(index);
        // remove increaseDecreaseInShortTermInvestment
        const increaseDecreaseInShortTermInvestment =
            this.additionalFinancialForm.get('increaseDecreaseInShortTermInvestment') as FormArray;
        increaseDecreaseInShortTermInvestment.removeAt(index);
        // remove increaseDecreaseInAdvanceAndDeposit
        const increaseDecreaseInAdvanceAndDeposit = this.additionalFinancialForm.get('increaseDecreaseInAdvanceAndDeposit') as FormArray;
        increaseDecreaseInAdvanceAndDeposit.removeAt(index);
        // remove increaseDecreaseInOtherCurrentAssets
        const increaseDecreaseInOtherCurrentAssets = this.additionalFinancialForm.get('increaseDecreaseInOtherCurrentAssets') as FormArray;
        increaseDecreaseInOtherCurrentAssets.removeAt(index);
        // remove increaseDecreaseInCreditors
        const increaseDecreaseInCreditors = this.additionalFinancialForm.get('increaseDecreaseInCreditors') as FormArray;
        increaseDecreaseInCreditors.removeAt(index);
        // remove increaseDecreaseInOtherCurrentLiabilities
        const increaseDecreaseInOtherCurrentLiabilities =
            this.additionalFinancialForm.get('increaseDecreaseInOtherCurrentLiabilities') as FormArray;
        increaseDecreaseInOtherCurrentLiabilities.removeAt(index);
        // remove adjustmentForNonOperatingIncome
        const adjustmentForNonOperatingIncome = this.additionalFinancialForm.get('adjustmentForNonOperatingIncome') as FormArray;
        adjustmentForNonOperatingIncome.removeAt(index);
        // remove interestExpensesCFSa
        const interestExpensesCFSa = this.additionalFinancialForm.get('interestExpensesCFSa') as FormArray;
        interestExpensesCFSa.removeAt(index);
        // remove cashFromInvestingActivities
        const cashFromInvestingActivities = this.additionalFinancialForm.get('cashFromInvestingActivities') as FormArray;
        cashFromInvestingActivities.removeAt(index);
        // remove changedInFixedAsset
        const changedInFixedAsset = this.additionalFinancialForm.get('changedInFixedAsset') as FormArray;
        changedInFixedAsset.removeAt(index);
        // remove nonOperatingIncomeExpenses
        const nonOperatingIncomeExpenses = this.additionalFinancialForm.get('nonOperatingIncomeExpenses') as FormArray;
        nonOperatingIncomeExpenses.removeAt(index);
        // remove changeInOtherAssets
        const changeInOtherAssets = this.additionalFinancialForm.get('changeInOtherAssets') as FormArray;
        changeInOtherAssets.removeAt(index);
        // remove changeInOtherLongTermLiabilities
        const changeInOtherLongTermLiabilities = this.additionalFinancialForm.get('changeInOtherLongTermLiabilities') as FormArray;
        changeInOtherLongTermLiabilities.removeAt(index);
        // remove cashFromFinancingActivities
        const cashFromFinancingActivities = this.additionalFinancialForm.get('cashFromFinancingActivities') as FormArray;
        cashFromFinancingActivities.removeAt(index);
        // remove paidUpCapitalEquity
        const paidUpCapitalEquity = this.additionalFinancialForm.get('paidUpCapitalEquity') as FormArray;
        paidUpCapitalEquity.removeAt(index);
        // remove shortTermLoan
        const shortTermLoan = this.additionalFinancialForm.get('shortTermLoan') as FormArray;
        shortTermLoan.removeAt(index);
        // remove longTermLoanReceived
        const longTermLoanReceived = this.additionalFinancialForm.get('longTermLoanReceived') as FormArray;
        longTermLoanReceived.removeAt(index);
        // remove dividendDrawing
        const dividendDrawing = this.additionalFinancialForm.get('dividendDrawing') as FormArray;
        dividendDrawing.removeAt(index);
        // remove interestExpensesCFSb
        const interestExpensesCFSb = this.additionalFinancialForm.get('interestExpensesCFSb') as FormArray;
        interestExpensesCFSb.removeAt(index);
        // remove otherAdjustments
        const otherAdjustments = this.additionalFinancialForm.get('otherAdjustments') as FormArray;
        otherAdjustments.removeAt(index);
        // remove netCashFlow
        const netCashFlow = this.additionalFinancialForm.get('netCashFlow') as FormArray;
        netCashFlow.removeAt(index);
        // remove addOpeningBalance
        const addOpeningBalance = this.additionalFinancialForm.get('addOpeningBalance') as FormArray;
        addOpeningBalance.removeAt(index);
        // remove closingCash
        const closingCash = this.additionalFinancialForm.get('closingCash') as FormArray;
        closingCash.removeAt(index);
        // remove closingBalance
        const closingBalance = this.additionalFinancialForm.get('closingBalance') as FormArray;
        closingBalance.removeAt(index);
        // remove differenceCFS
        const differenceCFS = this.additionalFinancialForm.get('differenceCFS') as FormArray;
        differenceCFS.removeAt(index);

        // remove growth
        const growth = this.additionalFinancialForm.get('growth') as FormArray;
        growth.removeAt(index);
        // remove sales
        const sales = this.additionalFinancialForm.get('sales') as FormArray;
        sales.removeAt(index);
        // remove grossProfitKI
        const grossProfitKI = this.additionalFinancialForm.get('grossProfitKI') as FormArray;
        grossProfitKI.removeAt(index);
        // remove operatingProfitKI
        const operatingProfitKI = this.additionalFinancialForm.get('operatingProfitKI') as FormArray;
        operatingProfitKI.removeAt(index);
        // remove pAT
        const pAT = this.additionalFinancialForm.get('pAT') as FormArray;
        pAT.removeAt(index);
        // remove profitability
        const profitability = this.additionalFinancialForm.get('profitability') as FormArray;
        profitability.removeAt(index);
        // remove grossProfitMargin
        const grossProfitMargin = this.additionalFinancialForm.get('grossProfitMargin') as FormArray;
        grossProfitMargin.removeAt(index);
        // remove netProfitMargin
        const netProfitMargin = this.additionalFinancialForm.get('netProfitMargin') as FormArray;
        netProfitMargin.removeAt(index);
        // remove eBITtoSales
        const eBITtoSales = this.additionalFinancialForm.get('eBITtoSales') as FormArray;
        eBITtoSales.removeAt(index);
        // remove returnOnEquity
        const returnOnEquity = this.additionalFinancialForm.get('returnOnEquity') as FormArray;
        returnOnEquity.removeAt(index);
        // remove solvency
        const solvency = this.additionalFinancialForm.get('solvency') as FormArray;
        solvency.removeAt(index);
        // remove quickRatio
        const quickRatio = this.additionalFinancialForm.get('quickRatio') as FormArray;
        quickRatio.removeAt(index);
        // remove currentRatio
        const currentRatio = this.additionalFinancialForm.get('currentRatio') as FormArray;
        currentRatio.removeAt(index);
        // remove debtServiceCoverageRatio
        const debtServiceCoverageRatio = this.additionalFinancialForm.get('debtServiceCoverageRatio') as FormArray;
        debtServiceCoverageRatio.removeAt(index);
        // remove interestCoverageRatio
        const interestCoverageRatio = this.additionalFinancialForm.get('interestCoverageRatio') as FormArray;
        interestCoverageRatio.removeAt(index);
        // remove debtEquityRatioOverall
        const debtEquityRatioOverall = this.additionalFinancialForm.get('debtEquityRatioOverall') as FormArray;
        debtEquityRatioOverall.removeAt(index);
        // remove debtEquityRatioLongTerm
        const debtEquityRatioLongTerm = this.additionalFinancialForm.get('debtEquityRatioLongTerm') as FormArray;
        debtEquityRatioLongTerm.removeAt(index);
        // remove debtEquityRatioWorkingCapital
        const debtEquityRatioWorkingCapital = this.additionalFinancialForm.get('debtEquityRatioWorkingCapital') as FormArray;
        debtEquityRatioWorkingCapital.removeAt(index);
        // remove debtEquityRatioGeneral
        const debtEquityRatioGeneral = this.additionalFinancialForm.get('debtEquityRatioGeneral') as FormArray;
        debtEquityRatioGeneral.removeAt(index);
        // remove operatingCycle
        const operatingCycle = this.additionalFinancialForm.get('operatingCycle') as FormArray;
        operatingCycle.removeAt(index);
        // remove inventoryTurnoverRatio
        const inventoryTurnoverRatio = this.additionalFinancialForm.get('inventoryTurnoverRatio') as FormArray;
        inventoryTurnoverRatio.removeAt(index);
        // remove stockInHandDays
        const stockInHandDays = this.additionalFinancialForm.get('stockInHandDays') as FormArray;
        stockInHandDays.removeAt(index);
        // remove debtorTurnOverRatio
        const debtorTurnOverRatio = this.additionalFinancialForm.get('debtorTurnOverRatio') as FormArray;
        debtorTurnOverRatio.removeAt(index);
        // remove averageCollectionPeriod
        const averageCollectionPeriod = this.additionalFinancialForm.get('averageCollectionPeriod') as FormArray;
        averageCollectionPeriod.removeAt(index);
        // remove averagePaymentPeriod
        const averagePaymentPeriod = this.additionalFinancialForm.get('averagePaymentPeriod') as FormArray;
        averagePaymentPeriod.removeAt(index);
        // remove netOperatingCycle
        const netOperatingCycle = this.additionalFinancialForm.get('netOperatingCycle') as FormArray;
        netOperatingCycle.removeAt(index);
        // remove netWCBeforeBank
        const netWCBeforeBank = this.additionalFinancialForm.get('netWCBeforeBank') as FormArray;
        netWCBeforeBank.removeAt(index);
    }

    // Total Sales Revenue Sub Category--
    addSubCategoryTotalSales(name) {
        const amount = this.formBuilder.array([]);
        this.fiscalYear.forEach((year, index) => {
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [year]
                })
            );
        });
        const control = this.additionalFinancialForm.get('totalSalesSubCategory') as FormArray;
        control.push(
            this.formBuilder.group({
                name: [name],
                amount: amount
            })
        );
    }

    removeSubCategoryTotalSales(index, amountArray) {
        amountArray.forEach((amount, i) => {
            amount.controls['value'].setValue(0);
            this.onValueChange(i);
        });
        const control = this.additionalFinancialForm.get('totalSalesSubCategory') as FormArray;
        control.removeAt(index);
    }

    onValueChange(index) {
        let totalSalesSum = 0;
        const totalSalesSubCategory = this.additionalFinancialForm.get('totalSalesSubCategory') as FormArray;
        totalSalesSubCategory.controls.forEach((categoryGroup, j) => {
            const amount = categoryGroup.get('amount') as FormArray;
            const yearCategoryValue = amount.controls[index].get('value').value as number;
            totalSalesSum = Number(totalSalesSum) + Number(yearCategoryValue);
        });
        const totalSalesControl = this.additionalFinancialForm.get('totalSalesRevenue') as FormArray;
        const formGroup = totalSalesControl.controls[index] as FormGroup;
        formGroup.controls['value'].setValue(totalSalesSum);
    }

    // Cost of Goods Sold Category
    addCostOfGoodsSoldCategory(name) {
        const amount = this.formBuilder.array([]);
        this.fiscalYear.forEach((year) => {
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [year]
                })
            );
        });
        const control = this.additionalFinancialForm.get('costOfGoodsSoldCategory') as FormArray;
        control.push(
            this.formBuilder.group({
                name: [name],
                amount: amount
            })
        );
    }

    removeCostOfGoodsSoldCategory(index) {
        const control = this.additionalFinancialForm.get('costOfGoodsSoldCategory') as FormArray;
        control.removeAt(index);
    }

    // Operating Expenses Category
    addOperatingExpensesCategory(name) {
        const amount = this.formBuilder.array([]);
        this.fiscalYear.forEach((year) => {
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [year]
                })
            );
        });
        const control = this.additionalFinancialForm.get('operatingExpensesCategory') as FormArray;
        control.push(
            this.formBuilder.group({
                name: [name],
                amount: amount
            })
        );
    }

    removeOperatingExpensesCategory(index) {
        const control = this.additionalFinancialForm.get('operatingExpensesCategory') as FormArray;
        control.removeAt(index);
    }

    // Interest Expenses Category
    addInterestExpensesCategory(name) {
        const amount = this.formBuilder.array([]);
        this.fiscalYear.forEach((year) => {
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [year]
                })
            );
        });
        const control = this.additionalFinancialForm.get('interestExpensesCategory') as FormArray;
        control.push(
            this.formBuilder.group({
                name: [name],
                amount: amount
            })
        );
    }

    removeInterestExpensesCategory(index) {
        const control = this.additionalFinancialForm.get('interestExpensesCategory') as FormArray;
        control.removeAt(index);
    }

    // Non-Operating Income/Expenses Category
    addNonOperatingIncomeOrExpensesCategory(name) {
        const amount = this.formBuilder.array([]);
        this.fiscalYear.forEach((year) => {
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [year]
                })
            );
        });
        const control = this.additionalFinancialForm.get('nonOperatingIncomeOrExpensesCategory') as FormArray;
        control.push(
            this.formBuilder.group({
                name: [name],
                amount: amount
            })
        );
    }

    removeNonOperatingIncomeOrExpensesCategory(index) {
        const control = this.additionalFinancialForm.get('nonOperatingIncomeOrExpensesCategory') as FormArray;
        control.removeAt(index);
    }

    // Current Assets Category
    addCurrentAssetsCategory(name) {
        const amount = this.formBuilder.array([]);
        this.fiscalYear.forEach((year) => {
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [year]
                })
            );
        });
        const control = this.additionalFinancialForm.get('currentAssetsCategory') as FormArray;
        control.push(
            this.formBuilder.group({
                name: [name],
                amount: amount
            })
        );
    }

    removeCurrentAssetsCategory(index) {
        const control = this.additionalFinancialForm.get('currentAssetsCategory') as FormArray;
        control.removeAt(index);
    }

    // Fixed Assets Category
    addFixedAssetsCategory(name) {
        const amount = this.formBuilder.array([]);
        this.fiscalYear.forEach((year) => {
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [year]
                })
            );
        });
        const control = this.additionalFinancialForm.get('fixedAssetsCategory') as FormArray;
        control.push(
            this.formBuilder.group({
                name: [name],
                amount: amount
            })
        );
    }

    removeFixedAssetsCategory(index) {
        const control = this.additionalFinancialForm.get('fixedAssetsCategory') as FormArray;
        control.removeAt(index);
    }

    // Other Assets Category
    addOtherAssetsCategory(name) {
        const amount = this.formBuilder.array([]);
        this.fiscalYear.forEach((year) => {
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [year]
                })
            );
        });
        const control = this.additionalFinancialForm.get('otherAssetsCategory') as FormArray;
        control.push(
            this.formBuilder.group({
                name: [name],
                amount: amount
            })
        );
    }

    removeOtherAssetsCategory(index) {
        const control = this.additionalFinancialForm.get('otherAssetsCategory') as FormArray;
        control.removeAt(index);
    }

    // Current Liabilities Category
    addCurrentLiabilitiesCategory(name) {
        const amount = this.formBuilder.array([]);
        this.fiscalYear.forEach((year) => {
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [year]
                })
            );
        });
        const control = this.additionalFinancialForm.get('currentLiabilitiesCategory') as FormArray;
        control.push(
            this.formBuilder.group({
                name: [name],
                amount: amount
            })
        );
    }

    removeCurrentLiabilitiesCategory(index) {
        const control = this.additionalFinancialForm.get('currentLiabilitiesCategory') as FormArray;
        control.removeAt(index);
    }

    // 	Other Long Term Liabilities Category
    addOtherLongTermLiabilitiesCategory(name) {
        const amount = this.formBuilder.array([]);
        this.fiscalYear.forEach((year) => {
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [year]
                })
            );
        });
        const control = this.additionalFinancialForm.get('otherLongTermLiabilitiesCategory') as FormArray;
        control.push(
            this.formBuilder.group({
                name: [name],
                amount: amount
            })
        );
    }

    removeOtherLongTermLiabilitiesCategory(index) {
        const control = this.additionalFinancialForm.get('otherLongTermLiabilitiesCategory') as FormArray;
        control.removeAt(index);
    }

    // Net Worth Category
    addNetWorthCategory(name) {
        const amount = this.formBuilder.array([]);
        this.fiscalYear.forEach((year) => {
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [year]
                })
            );
        });
        const control = this.additionalFinancialForm.get('netWorthCategory') as FormArray;
        control.push(
            this.formBuilder.group({
                name: [name],
                amount: amount
            })
        );
    }

    removeNetWorthCategory(index) {
        const control = this.additionalFinancialForm.get('netWorthCategory') as FormArray;
        control.removeAt(index);
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

    onSubmit() {
        const additionalForm = this.additionalFinancialForm.value;
        const initialForm = this.financialForm.value;
        const financialData = {initialForm: initialForm, financialForm: additionalForm, brr: this.brr.borrowerRiskRating.value};
        this.financialData = {data: financialData};
    }
}
