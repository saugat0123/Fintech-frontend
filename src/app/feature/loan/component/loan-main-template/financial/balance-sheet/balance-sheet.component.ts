import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {FinancialService} from '../financial.service';

@Component({
    selector: 'app-balance-sheet',
    templateUrl: './balance-sheet.component.html',
    styleUrls: ['./balance-sheet.component.scss']
})
export class BalanceSheetComponent implements OnInit, OnDestroy {
    @Input() fiscalYear: Array<number>;
    @Input() formData;
    @Output() removeFiscalYear = new EventEmitter<any>();
    balanceSheetForm: FormGroup;

    constructor(private formBuilder: FormBuilder,
                private financialService: FinancialService) {
    }

    ngOnInit() {
        this.buildBalanceSheetForm();
        if (this.formData['data'].balanceSheetData !== undefined) {
            const balanceSheetFormData = this.formData['data'].balanceSheetData;
            this.setCurrentAssets(balanceSheetFormData.currentAssets);
            this.setCurrentAssetsCategory(balanceSheetFormData.currentAssetsCategory);
            this.setInventories(balanceSheetFormData.inventories);
            this.setInventoriesCategory(balanceSheetFormData.inventoriesCategory);
            this.setFixedAssets(balanceSheetFormData.fixedAssets);
            this.setFixedAssetsCategory(balanceSheetFormData.fixedAssetsCategory);
            this.setOtherAssets(balanceSheetFormData.otherAssets);
            this.setOtherAssetsCategory(balanceSheetFormData.otherAssetsCategory);
            this.setTotalAssets(balanceSheetFormData.totalAssets);
            this.setCurrentLiabilities(balanceSheetFormData.currentLiabilities);
            this.setCurrentLiabilitiesCategory(balanceSheetFormData.currentLiabilitiesCategory);
            this.setLongTermLoan(balanceSheetFormData.longTermLoan);
            this.setLongTermLoanCategory(balanceSheetFormData.longTermLoanCategory);
            this.setOtherLongTermLiabilities(balanceSheetFormData.otherLongTermLiabilities);
            this.setOtherLongTermLiabilitiesCategory(balanceSheetFormData.otherLongTermLiabilitiesCategory);
            this.setOtherProvisions(balanceSheetFormData.otherProvisions);
            this.setNetWorth(balanceSheetFormData.netWorth);
            this.setNetWorthCategory(balanceSheetFormData.netWorthCategory);
            this.setTotalLiabilitiesAndEquity(balanceSheetFormData.totalLiabilitiesAndEquity);
            this.setDifferenceBS(balanceSheetFormData.differenceBS);
        }
    }

    buildBalanceSheetForm() {
        this.balanceSheetForm = this.formBuilder.group({
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
                }),
                this.formBuilder.group({
                    name: ['Others'],
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
                }),
                this.formBuilder.group({
                    name: ['Security Deposits'],
                    amount: this.formBuilder.array([])
                }),
                this.formBuilder.group({
                    name: ['Taxes Payable'],
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
            differenceBS: this.formBuilder.array([])
        });
    }

    removingFiscalYear(index) {
        this.removeFiscalYear.next(index);
    }

    // Formula implementation---
    onValueChange(headingTitle: string, index) {
        const currentAssets = ((this.balanceSheetForm.get('currentAssets') as FormArray).controls[index] as FormGroup);
        const inventories = (this.balanceSheetForm.get('inventories') as FormArray).controls[index] as FormGroup;
        const fixedAssets = (this.balanceSheetForm.get('fixedAssets') as FormArray).controls[index] as FormGroup;
        const otherAssets = (this.balanceSheetForm.get('otherAssets') as FormArray).controls[index] as FormGroup;
        const totalAssets = (this.balanceSheetForm.get('totalAssets') as FormArray).controls[index] as FormGroup;
        const currentLiabilities = (this.balanceSheetForm.get('currentLiabilities') as FormArray).controls[index] as FormGroup;
        const longTermLoan = (this.balanceSheetForm.get('longTermLoan') as FormArray).controls[index] as FormGroup;
        const otherLongTermLiabilities = (this.balanceSheetForm.get('otherLongTermLiabilities') as FormArray)
            .controls[index] as FormGroup;
        const otherProvisions = (this.balanceSheetForm.get('otherProvisions') as FormArray).controls[index] as FormGroup;
        const netWorth = (this.balanceSheetForm.get('netWorth') as FormArray).controls[index] as FormGroup;
        const totalLiabilitiesAndEquity = (this.balanceSheetForm.get('totalLiabilitiesAndEquity') as FormArray)
            .controls[index] as FormGroup;
        const differenceBS = (this.balanceSheetForm.get('differenceBS') as FormArray).controls[index] as FormGroup;
        // Income Statement variable--
        const incomeStatement = this.formData['data'].incomeStatementData;
        // Cash Flow Statement variable--
        const cashFlowStatement = this.formData['data'].cashFlowStatementData;
        // KeyIndicators variable--
        const keyIndicators = this.formData['data'].keyIndicatorsData;

        switch (headingTitle) {
            case 'currentAssets':
                this.financialService.onValueChangeForArraySum(this.balanceSheetForm.get('currentAssets'),
                    this.balanceSheetForm.get('currentAssetsCategory'), index);
                currentAssets.controls['value'].setValue(Number(currentAssets.controls['value'].value)
                    + Number(inventories.controls['value'].value));
                break;
            case 'inventories':
                this.financialService.onValueChangeForArraySum(this.balanceSheetForm.get('inventories'),
                    this.balanceSheetForm.get('inventoriesCategory'), index);
                this.financialService.onValueChangeForArraySum(this.balanceSheetForm.get('currentAssets'),
                    this.balanceSheetForm.get('currentAssetsCategory'), index);
                currentAssets.controls['value'].setValue(Number(currentAssets.controls['value'].value)
                    + Number(inventories.controls['value'].value));
                break;
            case 'fixedAssets':
                this.financialService.onValueChangeForArraySum(this.balanceSheetForm.get('fixedAssets'),
                    this.balanceSheetForm.get('fixedAssetsCategory'), index);
                break;
            case 'otherAssets':
                this.financialService.onValueChangeForArraySum(this.balanceSheetForm.get('otherAssets'),
                    this.balanceSheetForm.get('otherAssetsCategory'), index);
                break;
            case 'currentLiabilities':
                this.financialService.onValueChangeForArraySum(this.balanceSheetForm.get('currentLiabilities'),
                    this.balanceSheetForm.get('currentLiabilitiesCategory'), index);
                break;
            case 'longTermLoan':
                this.financialService.onValueChangeForArraySum(this.balanceSheetForm.get('longTermLoan'),
                    this.balanceSheetForm.get('longTermLoanCategory'), index);
                break;
            case 'otherLongTermLiabilities':
                this.financialService.onValueChangeForArraySum(this.balanceSheetForm.get('otherLongTermLiabilities'),
                    this.balanceSheetForm.get('otherLongTermLiabilitiesCategory'), index);
                break;
            case 'netWorth':
                this.financialService.onValueChangeForArraySum(this.balanceSheetForm.get('netWorth'),
                    this.balanceSheetForm.get('netWorthCategory'), index);
                break;
        }
        // Calculating Total Assets--
        const totalAssetsValue = Number(currentAssets.controls['value'].value) + Number(fixedAssets.controls['value'].value)
            + Number(otherAssets.controls['value'].value);
        totalAssets.controls['value'].setValue(totalAssetsValue);

        // Calculating retainedEarningsValue--
        const retainedEarningsValue = (this.formData['data'].incomeStatementData
            .netProfitTransferredToBalanceSheet as Array<Object>)[index]['value'];
        this.balanceSheetForm.get('netWorthCategory')['controls'].forEach( category => {
            if (category.get('name').value === 'Retained Earning') {
                const amountIndex = (category.get('amount') as FormArray).controls[index] as FormGroup;
                amountIndex.controls['value'].setValue(retainedEarningsValue);
            }
        });
        // Calculating totalLiabilitiesAndEquity--
        const totalLiabilitiesAndEquityValue = Number(currentLiabilities.controls['value'].value)
            + Number(longTermLoan.controls['value'].value) + Number(otherLongTermLiabilities.controls['value'].value)
            + Number(otherProvisions.controls['value'].value) + Number(netWorth.controls['value'].value);
        totalLiabilitiesAndEquity.controls['value'].setValue(totalLiabilitiesAndEquityValue);
        // Calculating Differences--
        const differenceBSValue = Number(totalAssets.controls['value'].value) - Number(totalLiabilitiesAndEquity.controls['value'].value);
        differenceBS.controls['value'].setValue(differenceBSValue);

        //
        // CFS calculation --
        if (index > 0) {
            cashFlowStatement.increaseDecreaseInInventory[index].value =
                Number(((this.balanceSheetForm.get('inventories') as FormArray).controls[index - 1] as FormGroup).controls['value'].value)
                - Number(inventories.controls['value'].value);
            cashFlowStatement.increaseDecreaseInAccountsReceivable[index].value =
                Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('currentAssetsCategory') as FormArray,
                    'Account Receivable', (index - 1)))
                - Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('currentAssetsCategory'),
                    'Account Receivable', index));
            cashFlowStatement.increaseDecreaseInShortTermInvestment[index].value =
                Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('currentAssetsCategory'),
                    'Short term investment', (index - 1)))
                - Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('currentAssetsCategory'),
                'Short term investment', index));
            cashFlowStatement.increaseDecreaseInAdvanceAndDeposit[index].value =
                Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('currentAssetsCategory'),
                    'Advances and Deposits', (index - 1)))
                - Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('currentAssetsCategory'),
                'Advances and Deposits', index));
            cashFlowStatement.increaseDecreaseInOtherCurrentAssets[index].value =
                Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('currentAssetsCategory'),
                    'Others', (index - 1)))
                - Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('currentAssetsCategory'),
                'Others', index));
            cashFlowStatement.increaseDecreaseInCreditors[index].value =
                Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('currentLiabilitiesCategory'),
                    'Creditors', index))
                - Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('currentLiabilitiesCategory'),
                'Creditors', (index - 1)));
            cashFlowStatement.increaseDecreaseInOtherCurrentLiabilities[index].value =
                Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('currentLiabilitiesCategory'),
                    'Security Deposits', index))
                + Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('currentLiabilitiesCategory'),
                'Taxes Payable', index))
                - Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('currentLiabilitiesCategory'),
                'Taxes Payable', (index - 1)))
                - Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('currentLiabilitiesCategory'),
                'Security Deposits', (index - 1)));

            cashFlowStatement.changedInFixedAsset[index].value =
                Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('fixedAssetsCategory'),
                    'Net Fixed Assets', (index - 1)))
                - Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('fixedAssetsCategory'),
                'Net Fixed Assets', index))
                - Number(this.financialService
                    .fetchValuesForJsonSubCategories(incomeStatement.operatingExpensesCategory, 'Depreciation', index));
            cashFlowStatement.changeInOtherAssets[index].value =
                Number(((this.balanceSheetForm.get('otherAssets') as FormArray).controls[index - 1] as FormGroup).controls['value'].value)
                - Number(otherAssets.controls['value'].value)
                - Number(this.financialService.fetchValuesForJsonSubCategories(incomeStatement.operatingExpensesCategory,
                'Amortization/Other Non-Cash Expenses', index));
            cashFlowStatement.changeInOtherLongTermLiabilities[index].value =
                Number(otherLongTermLiabilities.controls['value'].value)
                - Number(((this.balanceSheetForm.get('otherLongTermLiabilities') as FormArray)
                    .controls[index - 1] as FormGroup).controls['value'].value);
            cashFlowStatement.changeInOtherProvisions[index].value =
                Number(otherProvisions.controls['value'].value)
                - Number(((this.balanceSheetForm.get('otherProvisions') as FormArray)
                    .controls[index - 1] as FormGroup).controls['value'].value);
            cashFlowStatement.paidUpCapitalEquity[index].value =
                Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('netWorthCategory'),
                    'Paid up Capital/Equity', index))
                - Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('netWorthCategory'),
                'Paid up Capital/Equity', (index - 1)));
            cashFlowStatement.shortTermLoan[index].value =
                Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('currentLiabilitiesCategory'),
                    'Short Term Loan', index))
                - Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('currentLiabilitiesCategory'),
                'Short Term Loan', (index - 1)));
            cashFlowStatement.longTermLoanReceived[index].value =
                Number(longTermLoan.controls['value'].value)
                - Number(((this.balanceSheetForm.get('longTermLoan') as FormArray).controls[index] as FormGroup).controls['value'].value);
            cashFlowStatement.addOpeningBalance[index].value = cashFlowStatement.closingBalance[index - 1].value;
        } else {
            cashFlowStatement.increaseDecreaseInInventory[index].value = -Math.abs(Number(inventories.controls['value'].value));
            cashFlowStatement.increaseDecreaseInAccountsReceivable[index].value =
                -Math.abs(Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('currentAssetsCategory'),
                'Account Receivable', index)));
            cashFlowStatement.increaseDecreaseInShortTermInvestment[index].value =
                -Math.abs(Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('currentAssetsCategory'),
                'Short term investment', index)));
            cashFlowStatement.increaseDecreaseInAdvanceAndDeposit[index].value =
                -Math.abs(Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('currentAssetsCategory'),
                'Advances and Deposits', index)));
            cashFlowStatement.increaseDecreaseInOtherCurrentAssets[index].value =
                -Math.abs(Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('currentAssetsCategory'),
                'Others', index)));
            cashFlowStatement.increaseDecreaseInCreditors[index].value =
                Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('currentLiabilitiesCategory'),
                    'Creditors', index));
            cashFlowStatement.increaseDecreaseInOtherCurrentLiabilities[index].value =
                Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('currentLiabilitiesCategory'),
                    'Security Deposits', index))
                + Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('currentLiabilitiesCategory'),
                'Taxes Payable', index));

            cashFlowStatement.changedInFixedAsset[index].value = -Math.abs(
                Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('fixedAssetsCategory'),
                'Net Fixed Assets', index))
                - Number(this.financialService
                    .fetchValuesForJsonSubCategories(incomeStatement.operatingExpensesCategory, 'Depreciation', index)));
            cashFlowStatement.changeInOtherAssets[index].value = -Math.abs(
                Number(otherAssets.controls['value'].value)
                - Number(this.financialService.fetchValuesForJsonSubCategories(incomeStatement.operatingExpensesCategory,
                'Amortization/Other Non-Cash Expenses', index)));
            cashFlowStatement.changeInOtherLongTermLiabilities[index].value = Number(otherLongTermLiabilities.controls['value'].value);
            cashFlowStatement.changeInOtherProvisions[index].value = Number(otherProvisions.controls['value'].value);
            cashFlowStatement.paidUpCapitalEquity[index].value =
                Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('netWorthCategory'),
                    'Paid up Capital/Equity', index));
            cashFlowStatement.shortTermLoan[index].value =
                Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('currentLiabilitiesCategory'),
                    'Short Term Loan', index));
            cashFlowStatement.longTermLoanReceived[index].value = Number(longTermLoan.controls['value'].value);
        }

        cashFlowStatement.closingBalance[index].value =
            this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('currentAssetsCategory'),
            'Cash/Bank Balance', index);
        this.financialService.cashFromOperatingActivitiesTotal(cashFlowStatement, index);
        this.financialService.cashFromInvestingActivitiesTotal(cashFlowStatement, index);
        this.financialService.cashFromFinancingActivitiesTotal(cashFlowStatement, index);
        this.financialService.netCashFlowTotal(cashFlowStatement, index);
        this.financialService.closingCashTotal(cashFlowStatement, index);
        this.financialService.differenceCFSTotal(cashFlowStatement, index);

        //
        // Key Indicators Calculation--
        keyIndicators.returnOnEquity[index].value = Number(this.financialService
            .fetchValuesForSubCategories(this.balanceSheetForm.get('netWorthCategory'), 'Paid up Capital/Equity', index)) === 0
        ? 0 : this.financialService
                .convertToPercent(Number(incomeStatement.profitAfterTax[index].value) / Number(netWorth.controls['value'].value));

        keyIndicators.debtServiceCoverageRatio[index].value = Number(longTermLoan.controls['value'].value) === 0 ? 0 :
            ((Number(incomeStatement.operatingProfit[index].value)
                + Number(this.financialService
                    .fetchValuesForJsonSubCategories(incomeStatement.operatingExpensesCategory, 'Depreciation', index))
                + Number(this.financialService.fetchValuesForJsonSubCategories(incomeStatement.operatingExpensesCategory,
                    'Amortization/Other Non-Cash Expenses', index))) /
            (Number(incomeStatement.interestExpenses[index].value)
                + Number(index > 0 ? (((this.balanceSheetForm.get('longTermLoan') as FormArray).controls[index - 1] as FormGroup)
                    .controls['value'].value) : longTermLoan.controls['value'].value)
                - Number(longTermLoan.controls['value'].value))).toFixed(2);

        if (!(Number(currentAssets.controls['value'].value) === 0 || Number(currentLiabilities.controls['value'].value) === 0)) {
            keyIndicators.quickRatio[index].value =
                ((Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm
                        .get('currentAssetsCategory'), 'Cash/Bank Balance', index))
                    + Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm
                        .get('currentAssetsCategory'), 'Short term investment', index))
                    + Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm
                        .get('currentAssetsCategory'), 'Account Receivable', index))) /
                Number(currentLiabilities.controls['value'].value)).toFixed(2);
            keyIndicators.currentRatio[index].value = (Number(currentAssets.controls['value'].value)
                / Number(Number(currentLiabilities.controls['value'].value))).toFixed(2);
        }

        keyIndicators.debtEquityRatioOverall[index].value = Number(totalAssets.controls['value'].value) === 0 ? 0 :
            this.financialService.convertToPercent((Number(this.financialService
                .fetchValuesForSubCategories(this.balanceSheetForm.get('currentLiabilitiesCategory'),
                    'Short Term Loan', index)) + Number(longTermLoan.controls['value'].value))
                / (Number(totalAssets.controls['value'].value) - Number(this.financialService
                    .fetchValuesForSubCategories(this.balanceSheetForm.get('otherAssetsCategory'),
                        'Preliminary expenses', index))));
        keyIndicators.debtEquityRatioLongTerm[index].value = Number(longTermLoan.controls['value'].value) === 0 ? 0 :
            this.financialService.convertToPercent((Number(longTermLoan.controls['value'].value))
                / (Number(fixedAssets.controls['value'].value) + Number(otherAssets.controls['value'].value)));
        keyIndicators.debtEquityRatioWorkingCapital[index].value = Number(this.financialService
            .fetchValuesForSubCategories(this.balanceSheetForm.get('currentLiabilitiesCategory'),
                'Short Term Loan', index)) === 0 ? 0 : this.financialService.convertToPercent(
                    (Number(this.financialService
            .fetchValuesForSubCategories(this.balanceSheetForm.get('currentLiabilitiesCategory'),
                'Short Term Loan', index))) / (Number(currentAssets.controls['value'].value)
            - Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm
                .get('currentLiabilitiesCategory'), 'Creditors', index))
            - Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm
                .get('currentLiabilitiesCategory'), 'Security Deposits', index))
            - Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm
                .get('currentLiabilitiesCategory'), 'Taxes Payable', index))));

        keyIndicators.inventoryTurnoverRatio[index].value =
            (Number(incomeStatement.costOfGoodsSold[index].value) === 0 || Number(inventories.controls['value'].value) === 0) ? 0 :
                (Number(incomeStatement.costOfGoodsSold[index].value) / Number(inventories.controls['value'].value)).toFixed(2);
        keyIndicators.stockInHandDays[index].value = Number(this.financialService
            .fetchValuesForJsonSubCategories(incomeStatement.costOfGoodsSoldCategory, 'Raw Material Consumed', index)) === 0 ?
            0 : (365 / Number(keyIndicators.inventoryTurnoverRatio[index].value)).toFixed();

        keyIndicators.debtorTurnOverRatio[index].value = Number(this.financialService
            .fetchValuesForSubCategories(this.balanceSheetForm.get('currentAssetsCategory'), 'Account Receivable', index)) === 0 ? 0 :
            (Number(incomeStatement.totalSalesRevenue[index].value) / Number(this.financialService
                .fetchValuesForSubCategories(this.balanceSheetForm.get('currentAssetsCategory'), 'Account Receivable', index))).toFixed(2);
        keyIndicators.averageCollectionPeriod[index].value = Number(keyIndicators.debtorTurnOverRatio[index].value) === 0 ? 0 : (365 /
            Number(keyIndicators.debtorTurnOverRatio[index].value)).toFixed();
        keyIndicators.averagePaymentPeriod[index].value = Number(incomeStatement.costOfGoodsSold[index].value) === 0 ? 0 : (365 /
            (Number(incomeStatement.costOfGoodsSold[index].value) /
                Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm
                    .get('currentLiabilitiesCategory'), 'Creditors', index)))).toFixed();

        keyIndicators.netOperatingCycle[index].value = Number(keyIndicators.stockInHandDays[index].value)
            + Number(keyIndicators.averageCollectionPeriod[index].value) - Number(keyIndicators.averagePaymentPeriod[index].value);
        keyIndicators.netWCBeforeBank[index].value = Number(currentAssets.controls['value'].value) === 0 ? 0 :
            Number(currentAssets.controls['value'].value) - Number(this.financialService
                .fetchValuesForSubCategories(this.balanceSheetForm.get('currentAssetsCategory'), 'Cash/Bank Balance', index))
        - Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm.get('currentLiabilitiesCategory'),
            'Creditors', index)) - Number(this.financialService.fetchValuesForSubCategories(this.balanceSheetForm
                .get('currentLiabilitiesCategory'), 'Security Deposits', index));
    }

    // Adding and deleting fields---
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
        const control = this.balanceSheetForm.get('currentAssetsCategory') as FormArray;
        control.push(
            this.formBuilder.group({
                name: [name],
                amount: amount
            })
        );
    }

    removeCurrentAssetsCategory(index) {
        const control = this.balanceSheetForm.get('currentAssetsCategory') as FormArray;
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
        const control = this.balanceSheetForm.get('fixedAssetsCategory') as FormArray;
        control.push(
            this.formBuilder.group({
                name: [name],
                amount: amount
            })
        );
    }

    removeFixedAssetsCategory(index) {
        const control = this.balanceSheetForm.get('fixedAssetsCategory') as FormArray;
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
        const control = this.balanceSheetForm.get('otherAssetsCategory') as FormArray;
        control.push(
            this.formBuilder.group({
                name: [name],
                amount: amount
            })
        );
    }

    removeOtherAssetsCategory(index) {
        const control = this.balanceSheetForm.get('otherAssetsCategory') as FormArray;
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
        const control = this.balanceSheetForm.get('currentLiabilitiesCategory') as FormArray;
        control.push(
            this.formBuilder.group({
                name: [name],
                amount: amount
            })
        );
    }

    removeCurrentLiabilitiesCategory(index) {
        const control = this.balanceSheetForm.get('currentLiabilitiesCategory') as FormArray;
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
        const control = this.balanceSheetForm.get('otherLongTermLiabilitiesCategory') as FormArray;
        control.push(
            this.formBuilder.group({
                name: [name],
                amount: amount
            })
        );
    }

    removeOtherLongTermLiabilitiesCategory(index) {
        const control = this.balanceSheetForm.get('otherLongTermLiabilitiesCategory') as FormArray;
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
        const control = this.balanceSheetForm.get('netWorthCategory') as FormArray;
        control.push(
            this.formBuilder.group({
                name: [name],
                amount: amount
            })
        );
    }

    removeNetWorthCategory(index) {
        const control = this.balanceSheetForm.get('netWorthCategory') as FormArray;
        control.removeAt(index);
    }

    //
    // Setting data for Edit---
    // currentAssets
    setCurrentAssets(currentData) {
        const controls = this.balanceSheetForm.get('currentAssets') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    setCurrentAssetsCategory(currentData) {
        const control = this.balanceSheetForm.get('currentAssetsCategory') as FormArray;
        control.controls.length = 0;
        currentData.forEach(singleData => {
            control.push(
                this.formBuilder.group({
                    name: [singleData.name],
                    amount: this.setCurrentAssetsCategoryAmount(singleData)
                })
            );
        });
    }

    setCurrentAssetsCategoryAmount(singleData) {
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

    // inventories
    setInventories(currentData) {
        const controls = this.balanceSheetForm.get('inventories') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    setInventoriesCategory(currentData) {
        const control = this.balanceSheetForm.get('inventoriesCategory') as FormArray;
        control.controls.length = 0;
        currentData.forEach(singleData => {
            control.push(
                this.formBuilder.group({
                    name: [singleData.name],
                    amount: this.setInventoriesCategoryAmount(singleData)
                })
            );
        });
    }

    setInventoriesCategoryAmount(singleData) {
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

    // fixedAssets
    setFixedAssets(currentData) {
        const controls = this.balanceSheetForm.get('fixedAssets') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    setFixedAssetsCategory(currentData) {
        const control = this.balanceSheetForm.get('fixedAssetsCategory') as FormArray;
        control.controls.length = 0;
        currentData.forEach(singleData => {
            control.push(
                this.formBuilder.group({
                    name: [singleData.name],
                    amount: this.setFixedAssetsCategoryAmount(singleData)
                })
            );
        });
    }

    setFixedAssetsCategoryAmount(singleData) {
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

    // otherAssets
    setOtherAssets(currentData) {
        const controls = this.balanceSheetForm.get('otherAssets') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    setOtherAssetsCategory(currentData) {
        const control = this.balanceSheetForm.get('otherAssetsCategory') as FormArray;
        control.controls.length = 0;
        currentData.forEach(singleData => {
            control.push(
                this.formBuilder.group({
                    name: [singleData.name],
                    amount: this.setOtherAssetsCategoryAmount(singleData)
                })
            );
        });
    }

    setOtherAssetsCategoryAmount(singleData) {
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

    // totalAssets
    setTotalAssets(currentData) {
        const controls = this.balanceSheetForm.get('totalAssets') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // currentLiabilities
    setCurrentLiabilities(currentData) {
        const controls = this.balanceSheetForm.get('currentLiabilities') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    setCurrentLiabilitiesCategory(currentData) {
        const control = this.balanceSheetForm.get('currentLiabilitiesCategory') as FormArray;
        control.controls.length = 0;
        currentData.forEach(singleData => {
            control.push(
                this.formBuilder.group({
                    name: [singleData.name],
                    amount: this.setCurrentLiabilitiesCategoryAmount(singleData)
                })
            );
        });
    }

    setCurrentLiabilitiesCategoryAmount(singleData) {
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

    // longTermLoan
    setLongTermLoan(currentData) {
        const controls = this.balanceSheetForm.get('longTermLoan') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    setLongTermLoanCategory(currentData) {
        const control = this.balanceSheetForm.get('longTermLoanCategory') as FormArray;
        control.controls.length = 0;
        currentData.forEach(singleData => {
            control.push(
                this.formBuilder.group({
                    name: [singleData.name],
                    amount: this.setLongTermLoanCategoryAmount(singleData)
                })
            );
        });
    }

    setLongTermLoanCategoryAmount(singleData) {
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

    // otherLongTermLiabilities
    setOtherLongTermLiabilities(currentData) {
        const controls = this.balanceSheetForm.get('otherLongTermLiabilities') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    setOtherLongTermLiabilitiesCategory(currentData) {
        const control = this.balanceSheetForm.get('otherLongTermLiabilitiesCategory') as FormArray;
        control.controls.length = 0;
        currentData.forEach(singleData => {
            control.push(
                this.formBuilder.group({
                    name: [singleData.name],
                    amount: this.setOtherLongTermLiabilitiesCategoryAmount(singleData)
                })
            );
        });
    }

    setOtherLongTermLiabilitiesCategoryAmount(singleData) {
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

    // otherProvisions
    setOtherProvisions(currentData) {
        const controls = this.balanceSheetForm.get('otherProvisions') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // netWorth
    setNetWorth(currentData) {
        const controls = this.balanceSheetForm.get('netWorth') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    setNetWorthCategory(currentData) {
        const control = this.balanceSheetForm.get('netWorthCategory') as FormArray;
        control.controls.length = 0;
        currentData.forEach(singleData => {
            control.push(
                this.formBuilder.group({
                    name: [singleData.name],
                    amount: this.setNetWorthCategoryAmount(singleData)
                })
            );
        });
    }

    setNetWorthCategoryAmount(singleData) {
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

    // totalLiabilitiesAndEquity
    setTotalLiabilitiesAndEquity(currentData) {
        const controls = this.balanceSheetForm.get('totalLiabilitiesAndEquity') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // differenceBS
    setDifferenceBS(currentData) {
        const controls = this.balanceSheetForm.get('differenceBS') as FormArray;
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
        this.formData['data'].balanceSheetData = this.balanceSheetForm.value;
    }
}
