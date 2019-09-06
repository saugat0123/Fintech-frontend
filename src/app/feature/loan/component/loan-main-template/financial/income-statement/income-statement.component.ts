import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-income-statement',
    templateUrl: './income-statement.component.html',
    styleUrls: ['./income-statement.component.scss']
})
export class IncomeStatementComponent implements OnInit, OnDestroy {
    @Input() fiscalYear: Array<number>;
    @Input() formData;
    incomeStatementForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.buildIncomeStatementForm();
        if (this.formData['data'].incomeStatementData !== undefined) {
            const incomeStatementFormData = this.formData['data'].incomeStatementData;

            this.setTotalSalesRevenue(incomeStatementFormData.totalSalesRevenue);
            this.setTotalSalesSubCategory(incomeStatementFormData.totalSalesSubCategory);
            this.setCostOfGoodsSold(incomeStatementFormData.costOfGoodsSold);
            this.setCostOfGoodsSoldCategory(incomeStatementFormData.costOfGoodsSoldCategory);
            this.setGrossProfit(incomeStatementFormData.grossProfit);
            this.setOperatingExpenses(incomeStatementFormData.operatingExpenses);
            this.setOperatingExpensesCategory(incomeStatementFormData.operatingExpensesCategory);
            this.setOperatingProfit(incomeStatementFormData.operatingProfit);
            this.setInterestExpenses(incomeStatementFormData.interestExpenses);
            this.setInterestExpensesCategory(incomeStatementFormData.interestExpensesCategory);
            this.setNonOperatingIncomeOrExpenses(incomeStatementFormData.nonOperatingIncomeOrExpenses);
            this.setNonOperatingIncomeOrExpensesCategory(incomeStatementFormData.nonOperatingIncomeOrExpensesCategory);
            this.setProfitBeforeTaxAndStaffBonus(incomeStatementFormData.profitBeforeTaxAndStaffBonus);
            this.setStaffBonus(incomeStatementFormData.staffBonus);
            this.setProfitBeforeTaxes(incomeStatementFormData.profitBeforeTaxes);
            this.setTaxes(incomeStatementFormData.taxes);
            this.setTaxesCategory(incomeStatementFormData.taxesCategory);
            this.setProfitAfterTax(incomeStatementFormData.profitAfterTax);
            this.setDividendOrDrawing(incomeStatementFormData.dividendOrDrawing);
            this.setOtherAdjustment(incomeStatementFormData.otherAdjustment);
            this.setAccumulatedProfitBOrD(incomeStatementFormData.accumulatedProfitBOrD);
            this.setNetProfitTransferredToBalanceSheet(incomeStatementFormData.netProfitTransferredToBalanceSheet);
        }
        /*if (this.fiscalYear.length > this.incomeStatementForm.get('totalSalesRevenue')['controls'].length) {
            this.fiscalYear.forEach( yearValue => {
                this.addFiscalYearIncomeStatement(yearValue);
            });
        }*/
    }

    buildIncomeStatementForm() {
        this.incomeStatementForm = this.formBuilder.group({
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
            netProfitTransferredToBalanceSheet: this.formBuilder.array([])
        });
    }

    // Fiscal year addition---
    addFiscalYearIncomeStatement(yearValue) {
        // push Total Sales
        const totalSalesControl = this.incomeStatementForm.get('totalSalesRevenue') as FormArray;
        totalSalesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // push Total Sales Category
        const totalSalesSubCategoryControl = this.incomeStatementForm.get('totalSalesSubCategory') as FormArray;
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
        const costOfGoodsSoldControl = this.incomeStatementForm.get('costOfGoodsSold') as FormArray;
        costOfGoodsSoldControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Cost of Goods Sold Category
        const costOfGoodsSoldCategoryControl = this.incomeStatementForm.get('costOfGoodsSoldCategory') as FormArray;
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
        const grossProfitControl = this.incomeStatementForm.get('grossProfit') as FormArray;
        grossProfitControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Cost of Goods Sold
        const operatingExpensesControl = this.incomeStatementForm.get('operatingExpenses') as FormArray;
        operatingExpensesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Cost of Goods Sold Category
        const operatingExpensesCategoryControl = this.incomeStatementForm.get('operatingExpensesCategory') as FormArray;
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
        const operatingProfitControl = this.incomeStatementForm.get('operatingProfit') as FormArray;
        operatingProfitControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Interest Expenses
        const interestExpensesControl = this.incomeStatementForm.get('interestExpenses') as FormArray;
        interestExpensesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Interest Expenses Category
        const interestExpensesCategoryControl = this.incomeStatementForm.get('interestExpensesCategory') as FormArray;
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
        const nonOperatingIncomeOrExpensesControl = this.incomeStatementForm.get('nonOperatingIncomeOrExpenses') as FormArray;
        nonOperatingIncomeOrExpensesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Non-Operating Income/Expenses Category
        const nonOperatingIncomeOrExpensesCategoryControl = this.incomeStatementForm.get('nonOperatingIncomeOrExpensesCategory') as
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
        const profitBeforeTaxAndStaffBonusControl = this.incomeStatementForm.get('profitBeforeTaxAndStaffBonus') as FormArray;
        profitBeforeTaxAndStaffBonusControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Profit Before Tax and Staff Bonus
        const staffBonusControl = this.incomeStatementForm.get('staffBonus') as FormArray;
        staffBonusControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Profit Before Taxes
        const profitBeforeTaxesControl = this.incomeStatementForm.get('profitBeforeTaxes') as FormArray;
        profitBeforeTaxesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Taxes
        const taxesControl = this.incomeStatementForm.get('taxes') as FormArray;
        taxesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Taxes Category
        const taxesCategoryControl = this.incomeStatementForm.get('taxesCategory') as FormArray;
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
        const profitAfterTaxControl = this.incomeStatementForm.get('profitAfterTax') as FormArray;
        profitAfterTaxControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Dividend/Drawing
        const dividendOrDrawingControl = this.incomeStatementForm.get('dividendOrDrawing') as FormArray;
        dividendOrDrawingControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Other adjustment
        const otherAdjustmentControl = this.incomeStatementForm.get('otherAdjustment') as FormArray;
        otherAdjustmentControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Accumulated profit b/d
        const accumulatedProfitBOrDControl = this.incomeStatementForm.get('accumulatedProfitBOrD') as FormArray;
        accumulatedProfitBOrDControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Net Profit Transferred to Balance Sheet
        const netProfitTransferredToBalanceSheetControl = this.incomeStatementForm.get('netProfitTransferredToBalanceSheet') as
            FormArray;
        netProfitTransferredToBalanceSheetControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
    }

    // Fiscal Year Removal---
    removeFiscalYearIncomeStatement(index) {
        // remove Total Sales
        const totalSalesControl = this.incomeStatementForm.get('totalSalesRevenue') as FormArray;
        totalSalesControl.removeAt(index);
        // remove Total Sales Category
        const totalSalesSubCategoryControl = this.incomeStatementForm.get('totalSalesSubCategory') as FormArray;
        totalSalesSubCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.removeAt(index);
        });
        // remove Cost of Goods Sold
        const costOfGoodsSoldControl = this.incomeStatementForm.get('costOfGoodsSold') as FormArray;
        costOfGoodsSoldControl.removeAt(index);
        // remove Cost of Goods Sold Category
        const costOfGoodsSoldCategoryControl = this.incomeStatementForm.get('costOfGoodsSoldCategory') as FormArray;
        costOfGoodsSoldCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.removeAt(index);
        });
        // remove Gross Profit
        const grossProfitControl = this.incomeStatementForm.get('grossProfit') as FormArray;
        grossProfitControl.removeAt(index);
        // remove Operating Expenses
        const operatingExpensesControl = this.incomeStatementForm.get('operatingExpenses') as FormArray;
        operatingExpensesControl.removeAt(index);
        // remove Operating Expenses Category
        const operatingExpensesCategoryControl = this.incomeStatementForm.get('operatingExpensesCategory') as FormArray;
        operatingExpensesCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.removeAt(index);
        });
        // remove Gross Profit
        const operatingProfitControl = this.incomeStatementForm.get('operatingProfit') as FormArray;
        operatingProfitControl.removeAt(index);
        // remove Interest Expenses
        const interestExpensesControl = this.incomeStatementForm.get('interestExpenses') as FormArray;
        interestExpensesControl.removeAt(index);
        // remove Interest Expenses Category
        const interestExpensesCategoryControl = this.incomeStatementForm.get('interestExpensesCategory') as FormArray;
        interestExpensesCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.removeAt(index);
        });
        // remove Non-Operating Income/Expenses
        const nonOperatingIncomeOrExpensesControl = this.incomeStatementForm.get('nonOperatingIncomeOrExpenses') as FormArray;
        nonOperatingIncomeOrExpensesControl.removeAt(index);
        // remove Non-Operating Income/Expenses Category
        const nonOperatingIncomeOrExpensesCategoryControl = this.incomeStatementForm.get('nonOperatingIncomeOrExpensesCategory') as
            FormArray;
        nonOperatingIncomeOrExpensesCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.removeAt(index);
        });
        // remove Profit Before Tax and Staff Bonus
        const profitBeforeTaxAndStaffBonusControl = this.incomeStatementForm.get('profitBeforeTaxAndStaffBonus') as FormArray;
        profitBeforeTaxAndStaffBonusControl.removeAt(index);
        // remove Staff Bonus
        const staffBonusControl = this.incomeStatementForm.get('staffBonus') as FormArray;
        staffBonusControl.removeAt(index);
        // remove Profit Before Taxes
        const profitBeforeTaxesControl = this.incomeStatementForm.get('profitBeforeTaxes') as FormArray;
        profitBeforeTaxesControl.removeAt(index);
        // remove Taxes
        const taxesControl = this.incomeStatementForm.get('taxes') as FormArray;
        taxesControl.removeAt(index);
        // remove Taxes Category
        const taxesCategoryControl = this.incomeStatementForm.get('taxesCategory') as FormArray;
        taxesCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.removeAt(index);
        });
        // remove Profit Before Taxes
        const profitAfterTaxControl = this.incomeStatementForm.get('profitAfterTax') as FormArray;
        profitAfterTaxControl.removeAt(index);
        // remove Dividend/Drawing
        const dividendOrDrawingControl = this.incomeStatementForm.get('dividendOrDrawing') as FormArray;
        dividendOrDrawingControl.removeAt(index);
        // remove Other adjustment
        const otherAdjustmentControl = this.incomeStatementForm.get('otherAdjustment') as FormArray;
        otherAdjustmentControl.removeAt(index);
        // remove Accumulated profit b/d
        const accumulatedProfitBOrDControl = this.incomeStatementForm.get('accumulatedProfitBOrD') as FormArray;
        accumulatedProfitBOrDControl.removeAt(index);
        // remove Net Profit Transferred to Balance Sheet
        const netProfitTransferredToBalanceSheetControl = this.incomeStatementForm.get('netProfitTransferredToBalanceSheet') as
            FormArray;
        netProfitTransferredToBalanceSheetControl.removeAt(index);
    }

    // Adding and deleting fields
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
        const control = this.incomeStatementForm.get('totalSalesSubCategory') as FormArray;
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
        const control = this.incomeStatementForm.get('totalSalesSubCategory') as FormArray;
        control.removeAt(index);
    }

    onValueChange(index) {
        let totalSalesSum = 0;
        const totalSalesSubCategory = this.incomeStatementForm.get('totalSalesSubCategory') as FormArray;
        totalSalesSubCategory.controls.forEach((categoryGroup, j) => {
            const amount = categoryGroup.get('amount') as FormArray;
            const yearCategoryValue = amount.controls[index].get('value').value as number;
            totalSalesSum = Number(totalSalesSum) + Number(yearCategoryValue);
        });
        const totalSalesControl = this.incomeStatementForm.get('totalSalesRevenue') as FormArray;
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
        const control = this.incomeStatementForm.get('costOfGoodsSoldCategory') as FormArray;
        control.push(
            this.formBuilder.group({
                name: [name],
                amount: amount
            })
        );
    }

    removeCostOfGoodsSoldCategory(index) {
        const control = this.incomeStatementForm.get('costOfGoodsSoldCategory') as FormArray;
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
        const control = this.incomeStatementForm.get('operatingExpensesCategory') as FormArray;
        control.push(
            this.formBuilder.group({
                name: [name],
                amount: amount
            })
        );
    }

    removeOperatingExpensesCategory(index) {
        const control = this.incomeStatementForm.get('operatingExpensesCategory') as FormArray;
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
        const control = this.incomeStatementForm.get('interestExpensesCategory') as FormArray;
        control.push(
            this.formBuilder.group({
                name: [name],
                amount: amount
            })
        );
    }

    removeInterestExpensesCategory(index) {
        const control = this.incomeStatementForm.get('interestExpensesCategory') as FormArray;
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
        const control = this.incomeStatementForm.get('nonOperatingIncomeOrExpensesCategory') as FormArray;
        control.push(
            this.formBuilder.group({
                name: [name],
                amount: amount
            })
        );
    }

    removeNonOperatingIncomeOrExpensesCategory(index) {
        const control = this.incomeStatementForm.get('nonOperatingIncomeOrExpensesCategory') as FormArray;
        control.removeAt(index);
    }

    // ---
    // Setting Values for Edit---
    setTotalSalesRevenue(currentData) {
        const controls = this.incomeStatementForm.get('totalSalesRevenue') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    setTotalSalesSubCategory(currentData) {
        const control = this.incomeStatementForm.get('totalSalesSubCategory') as FormArray;
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
        const controls = this.incomeStatementForm.get('costOfGoodsSold') as FormArray;
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
        const control = this.incomeStatementForm.get('costOfGoodsSoldCategory') as FormArray;
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
        const controls = this.incomeStatementForm.get('grossProfit') as FormArray;
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
        const controls = this.incomeStatementForm.get('operatingExpenses') as FormArray;
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
        const control = this.incomeStatementForm.get('operatingExpensesCategory') as FormArray;
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
        const controls = this.incomeStatementForm.get('operatingProfit') as FormArray;
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
        const controls = this.incomeStatementForm.get('interestExpenses') as FormArray;
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
        const control = this.incomeStatementForm.get('interestExpensesCategory') as FormArray;
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
        const controls = this.incomeStatementForm.get('nonOperatingIncomeOrExpenses') as FormArray;
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
        const control = this.incomeStatementForm.get('nonOperatingIncomeOrExpensesCategory') as FormArray;
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
        const controls = this.incomeStatementForm.get('profitBeforeTaxAndStaffBonus') as FormArray;
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
        const controls = this.incomeStatementForm.get('staffBonus') as FormArray;
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
        const controls = this.incomeStatementForm.get('profitBeforeTaxes') as FormArray;
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
        const controls = this.incomeStatementForm.get('taxes') as FormArray;
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
        const control = this.incomeStatementForm.get('taxesCategory') as FormArray;
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
        const controls = this.incomeStatementForm.get('profitAfterTax') as FormArray;
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
        const controls = this.incomeStatementForm.get('dividendOrDrawing') as FormArray;
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
        const controls = this.incomeStatementForm.get('otherAdjustment') as FormArray;
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
        const controls = this.incomeStatementForm.get('accumulatedProfitBOrD') as FormArray;
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
        const controls = this.incomeStatementForm.get('netProfitTransferredToBalanceSheet') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    ngOnDestroy() {
        this.formData['data'].incomeStatementData = this.incomeStatementForm.value;
    }
}
