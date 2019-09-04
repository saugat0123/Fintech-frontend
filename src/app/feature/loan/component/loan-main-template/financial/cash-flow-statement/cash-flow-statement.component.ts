import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-cash-flow-statement',
    templateUrl: './cash-flow-statement.component.html',
    styleUrls: ['./cash-flow-statement.component.scss']
})
export class CashFlowStatementComponent implements OnInit {
    @Input() fiscalYear: Array<number>;
    @Input() formData;
    cashFlowStatementForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.buildCashFlowStatement();
        if (this.formData['data'].cashFlowStatementData !== undefined) {
            const cashFlowStatementData = this.formData['data'].cashFlowStatementData;
            this.setCashFromOperatingActivities(cashFlowStatementData.cashFromOperatingActivities);
            this.setNetProfitForThePeriod(cashFlowStatementData.netProfitForThePeriod);
            this.setDepreciation(cashFlowStatementData.depreciation);
            this.setOtherAmortizationAndNonCashExpenses(cashFlowStatementData.otherAmortizationAndNonCashExpenses);
            this.setIncreaseDecreaseInInventory(cashFlowStatementData.increaseDecreaseInInventory);
            this.setIncreaseDecreaseInAccountsReceivable(cashFlowStatementData.increaseDecreaseInAccountsReceivable);
            this.setIncreaseDecreaseInShortTermInvestment(cashFlowStatementData.increaseDecreaseInShortTermInvestment);
            this.setIncreaseDecreaseInAdvanceAndDeposit(cashFlowStatementData.increaseDecreaseInAdvanceAndDeposit);
            this.setIncreaseDecreaseInOtherCurrentAssets(cashFlowStatementData.increaseDecreaseInOtherCurrentAssets);
            this.setIncreaseDecreaseInCreditors(cashFlowStatementData.increaseDecreaseInCreditors);
            this.setIncreaseDecreaseInOtherCurrentLiabilities(cashFlowStatementData.increaseDecreaseInOtherCurrentLiabilities);
            this.setAdjustmentForNonOperatingIncome(cashFlowStatementData.adjustmentForNonOperatingIncome);
            this.setInterestExpensesCFSa(cashFlowStatementData.interestExpensesCFSa);
            this.setCashFromInvestingActivities(cashFlowStatementData.cashFromInvestingActivities);
            this.setChangedInFixedAsset(cashFlowStatementData.changedInFixedAsset);
            this.setNonOperatingIncomeExpenses(cashFlowStatementData.nonOperatingIncomeExpenses);
            this.setChangeInOtherAssets(cashFlowStatementData.changeInOtherAssets);
            this.setChangeInOtherLongTermLiabilities(cashFlowStatementData.changeInOtherLongTermLiabilities);
            this.setCashFromFinancingActivities(cashFlowStatementData.cashFromFinancingActivities);
            this.setPaidUpCapitalEquity(cashFlowStatementData.paidUpCapitalEquity);
            this.setShortTermLoan(cashFlowStatementData.shortTermLoan);
            this.setLongTermLoanReceived(cashFlowStatementData.longTermLoanReceived);
            this.setDividendDrawing(cashFlowStatementData.dividendDrawing);
            this.setInterestExpensesCFSb(cashFlowStatementData.interestExpensesCFSb);
            this.setOtherAdjustments(cashFlowStatementData.otherAdjustments);
            this.setNetCashFlow(cashFlowStatementData.netCashFlow);
            this.setAddOpeningBalance(cashFlowStatementData.addOpeningBalance);
            this.setClosingCash(cashFlowStatementData.closingCash);
            this.setClosingBalance(cashFlowStatementData.closingBalance);
            this.setDifferenceCFS(cashFlowStatementData.differenceCFS);
        }
        if (this.fiscalYear.length > this.cashFlowStatementForm.get('depreciation')['controls'].length) {
            this.fiscalYear.forEach( yearValue => {
                this.addFiscalYearCashFlowStatement(yearValue);
            });
        }
    }

    buildCashFlowStatement() {
        this.cashFlowStatementForm = this.formBuilder.group({
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
            differenceCFS: this.formBuilder.array([])
        });
    }

    // Adding Fiscal year for Cash flow Statement---
    addFiscalYearCashFlowStatement(yearValue) {
        // Push Cash From Operating Activities
        const cashFromOperatingActivitiesControl = this.cashFlowStatementForm.get('cashFromOperatingActivities') as FormArray;
        cashFromOperatingActivitiesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push netProfitForThePeriod
        const netProfitForThePeriodControl = this.cashFlowStatementForm.get('netProfitForThePeriod') as FormArray;
        netProfitForThePeriodControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push depreciation
        const depreciationControl = this.cashFlowStatementForm.get('depreciation') as FormArray;
        depreciationControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push otherAmortizationAndNonCashExpenses
        const otherAmortizationAndNonCashExpensesControl = this.cashFlowStatementForm.get('otherAmortizationAndNonCashExpenses') as
            FormArray;
        otherAmortizationAndNonCashExpensesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push increaseDecreaseInInventory
        const increaseDecreaseInInventoryControl = this.cashFlowStatementForm.get('increaseDecreaseInInventory') as FormArray;
        increaseDecreaseInInventoryControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push increaseDecreaseInAccountsReceivable
        const increaseDecreaseInAccountsReceivableControl = this.cashFlowStatementForm.get('increaseDecreaseInAccountsReceivable') as
            FormArray;
        increaseDecreaseInAccountsReceivableControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push increaseDecreaseInShortTermInvestment
        const increaseDecreaseInShortTermInvestmentControl = this.cashFlowStatementForm.get('increaseDecreaseInShortTermInvestment') as
            FormArray;
        increaseDecreaseInShortTermInvestmentControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push increaseDecreaseInAdvanceAndDeposit
        const increaseDecreaseInAdvanceAndDepositControl = this.cashFlowStatementForm.get('increaseDecreaseInAdvanceAndDeposit') as
            FormArray;
        increaseDecreaseInAdvanceAndDepositControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push increaseDecreaseInOtherCurrentAssets
        const increaseDecreaseInOtherCurrentAssetsControl = this.cashFlowStatementForm.get('increaseDecreaseInOtherCurrentAssets') as
            FormArray;
        increaseDecreaseInOtherCurrentAssetsControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push increaseDecreaseInCreditors
        const increaseDecreaseInCreditorsControl = this.cashFlowStatementForm.get('increaseDecreaseInCreditors') as
            FormArray;
        increaseDecreaseInCreditorsControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push increaseDecreaseInOtherCurrentLiabilities
        const increaseDecreaseInOtherCurrentLiabilitiesControl =
            this.cashFlowStatementForm.get('increaseDecreaseInOtherCurrentLiabilities') as
                FormArray;
        increaseDecreaseInOtherCurrentLiabilitiesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push adjustmentForNonOperatingIncome
        const adjustmentForNonOperatingIncomeControl = this.cashFlowStatementForm.get('adjustmentForNonOperatingIncome') as FormArray;
        adjustmentForNonOperatingIncomeControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push interestExpensesCFSaControl
        const interestExpensesCFSaControl = this.cashFlowStatementForm.get('interestExpensesCFSa') as FormArray;
        interestExpensesCFSaControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push cashFromInvestingActivities
        const cashFromInvestingActivitiesControl = this.cashFlowStatementForm.get('cashFromInvestingActivities') as FormArray;
        cashFromInvestingActivitiesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push changedInFixedAsset
        const changedInFixedAssetControl = this.cashFlowStatementForm.get('changedInFixedAsset') as FormArray;
        changedInFixedAssetControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push nonOperatingIncomeExpenses
        const nonOperatingIncomeExpensesControl = this.cashFlowStatementForm.get('nonOperatingIncomeExpenses') as FormArray;
        nonOperatingIncomeExpensesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push changeInOtherAssets
        const changeInOtherAssetsControl = this.cashFlowStatementForm.get('changeInOtherAssets') as FormArray;
        changeInOtherAssetsControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push changeInOtherLongTermLiabilities
        const changeInOtherLongTermLiabilitiesControl = this.cashFlowStatementForm.get('changeInOtherLongTermLiabilities') as FormArray;
        changeInOtherLongTermLiabilitiesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push cashFromFinancingActivities
        const cashFromFinancingActivitiesControl = this.cashFlowStatementForm.get('cashFromFinancingActivities') as FormArray;
        cashFromFinancingActivitiesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push paidUpCapitalEquity
        const paidUpCapitalEquityControl = this.cashFlowStatementForm.get('paidUpCapitalEquity') as FormArray;
        paidUpCapitalEquityControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push shortTermLoan
        const shortTermLoanControl = this.cashFlowStatementForm.get('shortTermLoan') as FormArray;
        shortTermLoanControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push longTermLoanReceived
        const longTermLoanReceivedControl = this.cashFlowStatementForm.get('longTermLoanReceived') as FormArray;
        longTermLoanReceivedControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push dividendDrawing
        const dividendDrawingControl = this.cashFlowStatementForm.get('dividendDrawing') as FormArray;
        dividendDrawingControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push interestExpensesCFSb
        const interestExpensesCFSbControl = this.cashFlowStatementForm.get('interestExpensesCFSb') as FormArray;
        interestExpensesCFSbControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push otherAdjustments
        const otherAdjustmentsControl = this.cashFlowStatementForm.get('otherAdjustments') as FormArray;
        otherAdjustmentsControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push netCashFlow
        const netCashFlowControl = this.cashFlowStatementForm.get('netCashFlow') as FormArray;
        netCashFlowControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push addOpeningBalance
        const addOpeningBalanceControl = this.cashFlowStatementForm.get('addOpeningBalance') as FormArray;
        addOpeningBalanceControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push closingCash
        const closingCashControl = this.cashFlowStatementForm.get('closingCash') as FormArray;
        closingCashControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push closingBalance
        const closingBalanceControl = this.cashFlowStatementForm.get('closingBalance') as FormArray;
        closingBalanceControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Difference CFS
        const differenceCFSControl = this.cashFlowStatementForm.get('differenceCFS') as FormArray;
        differenceCFSControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
    }

    // Removing Fiscal year for Cash flow Statement---
    removeFiscalYearCashFlowStatement(index) {
        // remove cashFromOperatingActivities
        const cashFromOperatingActivities = this.cashFlowStatementForm.get('cashFromOperatingActivities') as FormArray;
        cashFromOperatingActivities.removeAt(index);
        // remove netProfitForThePeriod
        const netProfitForThePeriod = this.cashFlowStatementForm.get('netProfitForThePeriod') as FormArray;
        netProfitForThePeriod.removeAt(index);
        // remove depreciation
        const depreciation = this.cashFlowStatementForm.get('depreciation') as FormArray;
        depreciation.removeAt(index);
        // remove otherAmortizationAndNonCashExpenses
        const otherAmortizationAndNonCashExpenses = this.cashFlowStatementForm.get('otherAmortizationAndNonCashExpenses') as FormArray;
        otherAmortizationAndNonCashExpenses.removeAt(index);
        // remove increaseDecreaseInInventory
        const increaseDecreaseInInventory = this.cashFlowStatementForm.get('increaseDecreaseInInventory') as FormArray;
        increaseDecreaseInInventory.removeAt(index);
        // remove increaseDecreaseInAccountsReceivable
        const increaseDecreaseInAccountsReceivable = this.cashFlowStatementForm.get('increaseDecreaseInAccountsReceivable') as FormArray;
        increaseDecreaseInAccountsReceivable.removeAt(index);
        // remove increaseDecreaseInShortTermInvestment
        const increaseDecreaseInShortTermInvestment =
            this.cashFlowStatementForm.get('increaseDecreaseInShortTermInvestment') as FormArray;
        increaseDecreaseInShortTermInvestment.removeAt(index);
        // remove increaseDecreaseInAdvanceAndDeposit
        const increaseDecreaseInAdvanceAndDeposit = this.cashFlowStatementForm.get('increaseDecreaseInAdvanceAndDeposit') as FormArray;
        increaseDecreaseInAdvanceAndDeposit.removeAt(index);
        // remove increaseDecreaseInOtherCurrentAssets
        const increaseDecreaseInOtherCurrentAssets = this.cashFlowStatementForm.get('increaseDecreaseInOtherCurrentAssets') as FormArray;
        increaseDecreaseInOtherCurrentAssets.removeAt(index);
        // remove increaseDecreaseInCreditors
        const increaseDecreaseInCreditors = this.cashFlowStatementForm.get('increaseDecreaseInCreditors') as FormArray;
        increaseDecreaseInCreditors.removeAt(index);
        // remove increaseDecreaseInOtherCurrentLiabilities
        const increaseDecreaseInOtherCurrentLiabilities =
            this.cashFlowStatementForm.get('increaseDecreaseInOtherCurrentLiabilities') as FormArray;
        increaseDecreaseInOtherCurrentLiabilities.removeAt(index);
        // remove adjustmentForNonOperatingIncome
        const adjustmentForNonOperatingIncome = this.cashFlowStatementForm.get('adjustmentForNonOperatingIncome') as FormArray;
        adjustmentForNonOperatingIncome.removeAt(index);
        // remove interestExpensesCFSa
        const interestExpensesCFSa = this.cashFlowStatementForm.get('interestExpensesCFSa') as FormArray;
        interestExpensesCFSa.removeAt(index);
        // remove cashFromInvestingActivities
        const cashFromInvestingActivities = this.cashFlowStatementForm.get('cashFromInvestingActivities') as FormArray;
        cashFromInvestingActivities.removeAt(index);
        // remove changedInFixedAsset
        const changedInFixedAsset = this.cashFlowStatementForm.get('changedInFixedAsset') as FormArray;
        changedInFixedAsset.removeAt(index);
        // remove nonOperatingIncomeExpenses
        const nonOperatingIncomeExpenses = this.cashFlowStatementForm.get('nonOperatingIncomeExpenses') as FormArray;
        nonOperatingIncomeExpenses.removeAt(index);
        // remove changeInOtherAssets
        const changeInOtherAssets = this.cashFlowStatementForm.get('changeInOtherAssets') as FormArray;
        changeInOtherAssets.removeAt(index);
        // remove changeInOtherLongTermLiabilities
        const changeInOtherLongTermLiabilities = this.cashFlowStatementForm.get('changeInOtherLongTermLiabilities') as FormArray;
        changeInOtherLongTermLiabilities.removeAt(index);
        // remove cashFromFinancingActivities
        const cashFromFinancingActivities = this.cashFlowStatementForm.get('cashFromFinancingActivities') as FormArray;
        cashFromFinancingActivities.removeAt(index);
        // remove paidUpCapitalEquity
        const paidUpCapitalEquity = this.cashFlowStatementForm.get('paidUpCapitalEquity') as FormArray;
        paidUpCapitalEquity.removeAt(index);
        // remove shortTermLoan
        const shortTermLoan = this.cashFlowStatementForm.get('shortTermLoan') as FormArray;
        shortTermLoan.removeAt(index);
        // remove longTermLoanReceived
        const longTermLoanReceived = this.cashFlowStatementForm.get('longTermLoanReceived') as FormArray;
        longTermLoanReceived.removeAt(index);
        // remove dividendDrawing
        const dividendDrawing = this.cashFlowStatementForm.get('dividendDrawing') as FormArray;
        dividendDrawing.removeAt(index);
        // remove interestExpensesCFSb
        const interestExpensesCFSb = this.cashFlowStatementForm.get('interestExpensesCFSb') as FormArray;
        interestExpensesCFSb.removeAt(index);
        // remove otherAdjustments
        const otherAdjustments = this.cashFlowStatementForm.get('otherAdjustments') as FormArray;
        otherAdjustments.removeAt(index);
        // remove netCashFlow
        const netCashFlow = this.cashFlowStatementForm.get('netCashFlow') as FormArray;
        netCashFlow.removeAt(index);
        // remove addOpeningBalance
        const addOpeningBalance = this.cashFlowStatementForm.get('addOpeningBalance') as FormArray;
        addOpeningBalance.removeAt(index);
        // remove closingCash
        const closingCash = this.cashFlowStatementForm.get('closingCash') as FormArray;
        closingCash.removeAt(index);
        // remove closingBalance
        const closingBalance = this.cashFlowStatementForm.get('closingBalance') as FormArray;
        closingBalance.removeAt(index);
        // remove differenceCFS
        const differenceCFS = this.cashFlowStatementForm.get('differenceCFS') as FormArray;
        differenceCFS.removeAt(index);
    }

    //
    // Setting data for edit---
    // cashFromOperatingActivities
    setCashFromOperatingActivities(currentData) {
        const controls = this.cashFlowStatementForm.get('cashFromOperatingActivities') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // netProfitForThePeriod
    setNetProfitForThePeriod(currentData) {
        const controls = this.cashFlowStatementForm.get('netProfitForThePeriod') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // depreciation
    setDepreciation(currentData) {
        const controls = this.cashFlowStatementForm.get('depreciation') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // otherAmortizationAndNonCashExpenses
    setOtherAmortizationAndNonCashExpenses(currentData) {
        const controls = this.cashFlowStatementForm.get('otherAmortizationAndNonCashExpenses') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // increaseDecreaseInInventory
    setIncreaseDecreaseInInventory(currentData) {
        const controls = this.cashFlowStatementForm.get('increaseDecreaseInInventory') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // increaseDecreaseInAccountsReceivable
    setIncreaseDecreaseInAccountsReceivable(currentData) {
        const controls = this.cashFlowStatementForm.get('increaseDecreaseInAccountsReceivable') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // increaseDecreaseInShortTermInvestment
    setIncreaseDecreaseInShortTermInvestment(currentData) {
        const controls = this.cashFlowStatementForm.get('increaseDecreaseInShortTermInvestment') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // increaseDecreaseInAdvanceAndDeposit
    setIncreaseDecreaseInAdvanceAndDeposit(currentData) {
        const controls = this.cashFlowStatementForm.get('increaseDecreaseInAdvanceAndDeposit') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // increaseDecreaseInOtherCurrentAssets
    setIncreaseDecreaseInOtherCurrentAssets(currentData) {
        const controls = this.cashFlowStatementForm.get('increaseDecreaseInOtherCurrentAssets') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // increaseDecreaseInCreditors
    setIncreaseDecreaseInCreditors(currentData) {
        const controls = this.cashFlowStatementForm.get('increaseDecreaseInCreditors') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // increaseDecreaseInOtherCurrentLiabilities
    setIncreaseDecreaseInOtherCurrentLiabilities(currentData) {
        const controls = this.cashFlowStatementForm.get('increaseDecreaseInOtherCurrentLiabilities') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // adjustmentForNonOperatingIncome
    setAdjustmentForNonOperatingIncome(currentData) {
        const controls = this.cashFlowStatementForm.get('adjustmentForNonOperatingIncome') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // interestExpensesCFSa
    setInterestExpensesCFSa(currentData) {
        const controls = this.cashFlowStatementForm.get('interestExpensesCFSa') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // cashFromInvestingActivities
    setCashFromInvestingActivities(currentData) {
        const controls = this.cashFlowStatementForm.get('cashFromInvestingActivities') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // changedInFixedAsset
    setChangedInFixedAsset(currentData) {
        const controls = this.cashFlowStatementForm.get('changedInFixedAsset') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // nonOperatingIncomeExpenses
    setNonOperatingIncomeExpenses(currentData) {
        const controls = this.cashFlowStatementForm.get('nonOperatingIncomeExpenses') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // changeInOtherAssets
    setChangeInOtherAssets(currentData) {
        const controls = this.cashFlowStatementForm.get('changeInOtherAssets') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // changeInOtherLongTermLiabilities
    setChangeInOtherLongTermLiabilities(currentData) {
        const controls = this.cashFlowStatementForm.get('changeInOtherLongTermLiabilities') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // cashFromFinancingActivities
    setCashFromFinancingActivities(currentData) {
        const controls = this.cashFlowStatementForm.get('cashFromFinancingActivities') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // paidUpCapitalEquity
    setPaidUpCapitalEquity(currentData) {
        const controls = this.cashFlowStatementForm.get('paidUpCapitalEquity') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // shortTermLoan
    setShortTermLoan(currentData) {
        const controls = this.cashFlowStatementForm.get('shortTermLoan') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // longTermLoanReceived
    setLongTermLoanReceived(currentData) {
        const controls = this.cashFlowStatementForm.get('longTermLoanReceived') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // dividendDrawing
    setDividendDrawing(currentData) {
        const controls = this.cashFlowStatementForm.get('dividendDrawing') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // interestExpensesCFSb
    setInterestExpensesCFSb(currentData) {
        const controls = this.cashFlowStatementForm.get('interestExpensesCFSb') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // otherAdjustments
    setOtherAdjustments(currentData) {
        const controls = this.cashFlowStatementForm.get('otherAdjustments') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // netCashFlow
    setNetCashFlow(currentData) {
        const controls = this.cashFlowStatementForm.get('netCashFlow') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // addOpeningBalance
    setAddOpeningBalance(currentData) {
        const controls = this.cashFlowStatementForm.get('addOpeningBalance') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // closingCash
    setClosingCash(currentData) {
        const controls = this.cashFlowStatementForm.get('closingCash') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // closingBalance
    setClosingBalance(currentData) {
        const controls = this.cashFlowStatementForm.get('closingBalance') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }

    // differenceCFS
    setDifferenceCFS(currentData) {
        const controls = this.cashFlowStatementForm.get('differenceCFS') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    value: [singleData.value],
                    year: [singleData.year]
                })
            );
        });
    }
}
