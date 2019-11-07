import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {FinancialService} from '../financial.service';

@Component({
    selector: 'app-income-statement',
    templateUrl: './income-statement.component.html',
    styleUrls: ['./income-statement.component.scss']
})
export class IncomeStatementComponent implements OnInit, OnDestroy {
    @Input() fiscalYear: Array<number>;
    @Input() formData;
    @Output() removeFiscalYear = new EventEmitter<any>();
    incomeStatementForm: FormGroup;

    constructor(private formBuilder: FormBuilder,
                private financialService: FinancialService) {
    }

    ngOnInit() {
        this.buildIncomeStatementForm();
        if (this.formData['incomeStatementData'] !== undefined) {
            const incomeStatementFormData = this.formData['incomeStatementData'];

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

    // Removing Fiscal Year--
    removingFiscalYear(index) {
        this.removeFiscalYear.next(index);
    }

    // Formula implementation---
    onValueChange(headingTitle: string, index) {
        const totalSalesRevenue = ((this.incomeStatementForm.get('totalSalesRevenue') as FormArray).controls[index] as FormGroup);
        const costOfGoodsSold = (this.incomeStatementForm.get('costOfGoodsSold') as FormArray).controls[index] as FormGroup;
        const grossProfit = (this.incomeStatementForm.get('grossProfit') as FormArray).controls[index] as FormGroup;
        const operatingExpenses = (this.incomeStatementForm.get('operatingExpenses') as FormArray).controls[index] as FormGroup;
        const operatingProfit = (this.incomeStatementForm.get('operatingProfit') as FormArray).controls[index] as FormGroup;
        const interestExpenses = (this.incomeStatementForm.get('interestExpenses') as FormArray).controls[index] as FormGroup;
        const nonOperatingIncomeOrExpenses = (this.incomeStatementForm.get('nonOperatingIncomeOrExpenses') as FormArray)
            .controls[index] as FormGroup;
        const profitBeforeTaxAndStaffBonus = (this.incomeStatementForm.get('profitBeforeTaxAndStaffBonus') as FormArray)
            .controls[index] as FormGroup;
        const staffBonus = (this.incomeStatementForm.get('staffBonus') as FormArray).controls[index] as FormGroup;
        const profitBeforeTaxes = (this.incomeStatementForm.get('profitBeforeTaxes') as FormArray).controls[index] as FormGroup;
        const taxes = (this.incomeStatementForm.get('taxes') as FormArray).controls[index] as FormGroup;
        const profitAfterTax = (this.incomeStatementForm.get('profitAfterTax') as FormArray).controls[index] as FormGroup;
        const dividendOrDrawing = (this.incomeStatementForm.get('dividendOrDrawing') as FormArray).controls[index] as FormGroup;
        const otherAdjustment = (this.incomeStatementForm.get('otherAdjustment') as FormArray).controls[index] as FormGroup;
        const accumulatedProfitBOrD = (this.incomeStatementForm.get('accumulatedProfitBOrD') as FormArray).controls[index] as FormGroup;
        const netProfitTransferredToBalanceSheet = (this.incomeStatementForm.get('netProfitTransferredToBalanceSheet') as FormArray)
            .controls[index] as FormGroup;
        // Balance Sheet variable--
        const balanceSheet = this.formData['balanceSheetData'];
        // Cash Flow Statement variable--
        const cashFlowStatement = this.formData['cashFlowStatementData'];
        // KeyIndicators variable--
        const keyIndicators = this.formData['keyIndicatorsData'];

        switch (headingTitle) {
            case 'totalSalesRevenue':
                this.financialService.onValueChangeForArraySum(this.incomeStatementForm.get('totalSalesRevenue'),
                    this.incomeStatementForm.get('totalSalesSubCategory'), index);
                break;
            case 'costOfGoodsSold':
                this.financialService.onValueChangeForArraySum(this.incomeStatementForm.get('costOfGoodsSold'),
                    this.incomeStatementForm.get('costOfGoodsSoldCategory'), index);
                break;
            case 'operatingExpenses':
                this.financialService.onValueChangeForArraySum(this.incomeStatementForm.get('operatingExpenses'),
                    this.incomeStatementForm.get('operatingExpensesCategory'), index);
                break;
            case 'interestExpenses':
                this.financialService.onValueChangeForArraySum(this.incomeStatementForm.get('interestExpenses'),
                    this.incomeStatementForm.get('interestExpensesCategory'), index);
                break;
            case 'nonOperatingIncomeOrExpenses':
                this.financialService.onValueChangeForArraySum(this.incomeStatementForm.get('nonOperatingIncomeOrExpenses'),
                    this.incomeStatementForm.get('nonOperatingIncomeOrExpensesCategory'), index);
                break;
            case 'taxes':
                this.financialService.onValueChangeForArraySum(this.incomeStatementForm.get('taxes'),
                    this.incomeStatementForm.get('taxesCategory'), index);
                break;
        }
        // Calculating Gross Profit--
        const grossProfitValue = Number(totalSalesRevenue.controls['value'].value) - Number(costOfGoodsSold.controls['value'].value);
        grossProfit.controls['value'].setValue(grossProfitValue);

        // Calculating operatingProfitValue--
        const operatingProfitValue = Number(grossProfit.controls['value'].value) - Number(operatingExpenses.controls['value'].value);
        operatingProfit.controls['value'].setValue(operatingProfitValue);

        // Calculating profitBeforeTaxAndStaffBonusValue --
        const profitBeforeTaxAndStaffBonusValue = Number(operatingProfit.controls['value'].value)
            - Number(interestExpenses.controls['value'].value)
            + Number(nonOperatingIncomeOrExpenses.controls['value'].value);
        profitBeforeTaxAndStaffBonus.controls['value'].setValue(profitBeforeTaxAndStaffBonusValue);

        // Calculating profitBeforeTaxesValue --
        const profitBeforeTaxesValue = Number(profitBeforeTaxAndStaffBonus.controls['value'].value)
            - Number(staffBonus.controls['value'].value);
        profitBeforeTaxes.controls['value'].setValue(profitBeforeTaxesValue);

        // Calculating profitAfterTaxValue --
        const profitAfterTaxValue = Number(profitBeforeTaxes.controls['value'].value) - Number(taxes.controls['value'].value);
        profitAfterTax.controls['value'].setValue(profitAfterTaxValue);

        // Calculating accumulatedProfitBOrDValue --
        const accumulatedProfitBOrDValue = profitAfterTax.controls['value'].value === 0 ? 0 :
            (index <= 0 ? accumulatedProfitBOrD.controls['value'].value
                : ((this.incomeStatementForm.get('netProfitTransferredToBalanceSheet') as FormArray)
                    .controls[index - 1] as FormGroup).controls['value'].value);
        accumulatedProfitBOrD.controls['value'].setValue(accumulatedProfitBOrDValue);

        // Calculating netProfitTransferredToBalanceSheetValue --
        const netProfitTransferredToBalanceSheetValue = Number(profitAfterTax.controls['value'].value)
            - (Number(dividendOrDrawing.controls['value'].value)
                + Number(otherAdjustment.controls['value'].value)) + Number(accumulatedProfitBOrD.controls['value'].value);
        netProfitTransferredToBalanceSheet.controls['value'].setValue(netProfitTransferredToBalanceSheetValue);
        // Reflecting the value of netProfitTransferredToBalanceSheetValue into Balance Sheet (BS43)---
        // balanceSheet.netWorthCategory[index]


        //
        // Cash Flow Statement Calculation--
        cashFlowStatement.netProfitForThePeriod[index].value = profitAfterTax.controls['value'].value;
        cashFlowStatement.depreciation[index].value = this.financialService
            .fetchValuesForSubCategories(this.incomeStatementForm.get('operatingExpensesCategory'), 'Depreciation', index);
        cashFlowStatement.otherAmortizationAndNonCashExpenses[index].value = this.financialService
            .fetchValuesForSubCategories(this.incomeStatementForm.get('operatingExpensesCategory'),
                'Amortization/Other Non-Cash Expenses', index);
        cashFlowStatement.adjustmentForNonOperatingIncome[index].value = -Math.abs(
            Number(nonOperatingIncomeOrExpenses.controls['value'].value));
        cashFlowStatement.interestExpensesCFSa[index].value = interestExpenses.controls['value'].value;

        this.financialService.cashFromOperatingActivitiesTotal(cashFlowStatement, index);

        if (index > 0) {
            cashFlowStatement.changedInFixedAsset[index].value = Number(
                this.financialService.fetchValuesForJsonSubCategories(balanceSheet.fixedAssetsCategory,
                    'Net Fixed Assets', (index - 1))) - Number(this.financialService
                    .fetchValuesForJsonSubCategories(balanceSheet.fixedAssetsCategory, 'Net Fixed Assets', index))
                - Number(cashFlowStatement.depreciation[index].value);

            cashFlowStatement.changeInOtherAssets[index].value = Number(balanceSheet.otherAssets[index - 1].value)
                - Number(balanceSheet.otherAssets[index].value) - Number(this.financialService
                    .fetchValuesForSubCategories(this.incomeStatementForm
                        .get('operatingExpensesCategory'), 'Amortization/Other Non-Cash Expenses', index));
            cashFlowStatement.addOpeningBalance[index].value = cashFlowStatement.closingBalance[index - 1].value;

        } else {
            cashFlowStatement.changedInFixedAsset[index].value =
                Number(this.financialService
                    .fetchValuesForJsonSubCategories(balanceSheet.fixedAssetsCategory, 'Net Fixed Assets', index))
                - Number(cashFlowStatement.depreciation[index].value);

            cashFlowStatement.changeInOtherAssets[index].value = Number(balanceSheet.otherAssets[index].value)
                - Number(this.financialService.fetchValuesForSubCategories(this.incomeStatementForm
                    .get('operatingExpensesCategory'), 'Amortization/Other Non-Cash Expenses', index));
        }

        cashFlowStatement.nonOperatingIncomeExpenses[index].value = nonOperatingIncomeOrExpenses.controls['value'].value;

        this.financialService.cashFromInvestingActivitiesTotal(cashFlowStatement, index);

        cashFlowStatement.dividendDrawing[index].value = -Math.abs(Number(dividendOrDrawing.controls['value'].value));
        cashFlowStatement.interestExpensesCFSb[index].value = -Math.abs(Number(interestExpenses.controls['value'].value));
        cashFlowStatement.otherAdjustments[index].value = -Math.abs(Number(otherAdjustment.controls['value'].value));

        this.financialService.cashFromFinancingActivitiesTotal(cashFlowStatement, index);
        this.financialService.netCashFlowTotal(cashFlowStatement, index);
        this.financialService.closingCashTotal(cashFlowStatement, index);
        this.financialService.differenceCFSTotal(cashFlowStatement, index);

        //
        // Key Indicators Calculation--
        if (index > 0) {
            keyIndicators.sales[index].value = Number(totalSalesRevenue.controls['value'].value) === 0 ? 0 :
                ((((Number(totalSalesRevenue.controls['value'].value)
                    - Number(((this.incomeStatementForm.get('totalSalesRevenue') as FormArray)
                        .controls[index - 1] as FormGroup).controls['value'].value))
                    / Number(((this.incomeStatementForm.get('totalSalesRevenue') as FormArray)
                        .controls[index - 1] as FormGroup).controls['value'].value))) * 100).toFixed(2);

            keyIndicators.grossProfitKI[index].value = Number(this.financialService.fetchValuesForSubCategories(this.incomeStatementForm
                .get('totalSalesSubCategory'), 'Direct Sales', index)) === 0 ? 0 :
                ((((Number(grossProfit.controls['value'].value)
                    - Number(((this.incomeStatementForm.get('grossProfit') as FormArray)
                        .controls[index - 1] as FormGroup).controls['value'].value))
                    / Number(((this.incomeStatementForm.get('grossProfit') as FormArray)
                        .controls[index - 1] as FormGroup).controls['value'].value))) * 100).toFixed(2);

            keyIndicators.operatingProfitKI[index].value = Number(operatingProfit.controls['value'].value) === 0 ? 0 :
                ((((Number(operatingProfit.controls['value'].value)
                    - Number(((this.incomeStatementForm.get('operatingProfit') as FormArray)
                        .controls[index - 1] as FormGroup).controls['value'].value))
                    / Number(((this.incomeStatementForm.get('operatingProfit') as FormArray)
                        .controls[index - 1] as FormGroup).controls['value'].value))) * 100).toFixed(2);

            keyIndicators.pAT[index].value = Number(profitAfterTax.controls['value'].value) === 0 ? 0 :
                ((((Number(profitAfterTax.controls['value'].value)
                    - Number(((this.incomeStatementForm.get('profitAfterTax') as FormArray)
                        .controls[index - 1] as FormGroup).controls['value'].value))
                    / Number(((this.incomeStatementForm.get('profitAfterTax') as FormArray)
                        .controls[index - 1] as FormGroup).controls['value'].value))) * 100).toFixed(2);
        }

        if (Number(totalSalesRevenue.controls['value'].value) !== 0) {
            keyIndicators.grossProfitMargin[index].value = this.financialService.convertToPercent(
                Number(grossProfit.controls['value'].value) / Number(totalSalesRevenue.controls['value'].value));
            keyIndicators.netProfitMargin[index].value = this.financialService.convertToPercent(
                Number(profitAfterTax.controls['value'].value) / Number(totalSalesRevenue.controls['value'].value));
            keyIndicators.eBITtoSales[index].value = this.financialService.convertToPercent(
                Number(operatingProfit.controls['value'].value) / Number(totalSalesRevenue.controls['value'].value));
        }
        keyIndicators.returnOnEquity[index].value = Number(this.financialService
                .fetchValuesForJsonSubCategories(balanceSheet.netWorthCategory, 'Paid up Capital/Equity', index)) === 0 ? 0 :
            this.financialService
                .convertToPercent(Number(profitAfterTax.controls['value'].value) / Number(balanceSheet.netWorth[index].value));

        keyIndicators.debtServiceCoverageRatio[index].value = Number(balanceSheet.longTermLoan[index].value) === 0 ? 0 :
            (Number(operatingProfit.controls['value'].value)
                + Number(this.financialService.fetchValuesForSubCategories(this.incomeStatementForm
                    .get('operatingExpensesCategory'), 'Depreciation', index))
                + Number(this.financialService.fetchValuesForSubCategories(this.incomeStatementForm
                    .get('operatingExpensesCategory'), 'Amortization/Other Non-Cash Expenses', index))) /
            (Number(interestExpenses.controls['value'].value)
                + Number( index > 0 ? balanceSheet.longTermLoan[index - 1].value : balanceSheet.longTermLoan[index].value)
                - Number(balanceSheet.longTermLoan[index].value));

        keyIndicators.interestCoverageRatio[index].value = Number(interestExpenses.controls['value'].value) === 0 ? 0 :
            ((Number(operatingProfit.controls['value'].value)
                + Number(this.financialService.fetchValuesForSubCategories(this.incomeStatementForm
                    .get('operatingExpensesCategory'), 'Depreciation', index))
                + Number(this.financialService.fetchValuesForSubCategories(this.incomeStatementForm
                    .get('operatingExpensesCategory'), 'Amortization/Other Non-Cash Expenses', index))) /
            Number(interestExpenses.controls['value'].value)).toFixed(2);

        keyIndicators.inventoryTurnoverRatio[index].value =
            ((Number(costOfGoodsSold.controls['value'].value) === 0 || Number(balanceSheet.inventories[index].value) === 0) ? 0 :
                Number(costOfGoodsSold.controls['value'].value) / Number(balanceSheet.inventories[index].value)).toFixed(2);
        keyIndicators.stockInHandDays[index].value = Number(this.financialService.fetchValuesForSubCategories(this.incomeStatementForm
            .get('costOfGoodsSoldCategory'), 'Raw Material Consumed', index)) === 0 ? 0 : (365 /
            Number(keyIndicators.inventoryTurnoverRatio[index].value)).toFixed();

        keyIndicators.debtorTurnOverRatio[index].value = Number(this.financialService
            .fetchValuesForJsonSubCategories(balanceSheet.currentAssetsCategory, 'Account Receivable', index)) === 0 ? 0 :
            (Number(totalSalesRevenue.controls['value'].value) / Number(this.financialService
                .fetchValuesForJsonSubCategories(balanceSheet.currentAssetsCategory, 'Account Receivable', index))).toFixed(2);
        keyIndicators.averageCollectionPeriod[index].value = Number(keyIndicators.debtorTurnOverRatio[index].value) === 0 ? 0 : (365 /
            Number(keyIndicators.debtorTurnOverRatio[index].value)).toFixed();

        keyIndicators.averagePaymentPeriod[index].value = Number(costOfGoodsSold.controls['value'].value) === 0 ? 0 : (365 /
            (Number(costOfGoodsSold.controls['value'].value) / Number(this.financialService.fetchValuesForJsonSubCategories(balanceSheet
                .currentLiabilitiesCategory, 'Creditors', index)))).toFixed();

        keyIndicators.netOperatingCycle[index].value = Number(keyIndicators.stockInHandDays[index].value)
            + Number(keyIndicators.averageCollectionPeriod[index].value) - Number(keyIndicators.averagePaymentPeriod[index].value);
    }

    // Adding and deleting fields
    // Total Sales Revenue Sub Category--
    addSubCategoryTotalSales(name) {
        const amount = this.formBuilder.array([]);
        this.fiscalYear.forEach((year) => {
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
        const subCategoryControl = this.incomeStatementForm.get('totalSalesSubCategory') as FormArray;
        const headingControl = this.incomeStatementForm.get('totalSalesRevenue') as FormArray;
        amountArray.forEach((amount, i) => {
            amount.controls['value'].setValue(0);
            this.financialService.onValueChangeForArraySum(headingControl, subCategoryControl, i);
        });
        subCategoryControl.removeAt(index);
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
        this.formData['incomeStatementData'] = this.incomeStatementForm.value;
    }
}
