import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FinancialDeleteComponentComponent} from '../financial-delete-component/financial-delete-component.component';
import {ModalResponse} from '../../../../@core/utils';
import {Editor} from '../../../../@core/utils/constants/editor';

@Component({
    selector: 'app-cash-flow-statement',
    templateUrl: './cash-flow-statement.component.html',
    styleUrls: ['./cash-flow-statement.component.scss']
})
export class CashFlowStatementComponent implements OnInit, OnDestroy {
    @Input() fiscalYear: Array<number>;
    @Input() formData;
    @Output() removeFiscalYear = new EventEmitter<any>();
    cashFlowStatementForm: FormGroup;
    ckeConfig = Editor.CK_CONFIG;

    constructor(private formBuilder: FormBuilder,
                private modalService: NgbModal) {
    }

    ngOnInit() {
        this.buildCashFlowStatement();
        if (this.formData['cashFlowStatementData'] !== undefined) {
            const cashFlowStatementData = this.formData['cashFlowStatementData'];
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
            this.setChangeInOtherProvisions(cashFlowStatementData.changeInOtherProvisions);
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
            this.cashFlowStatementForm.get('justificationCashFlowStatement')
                .patchValue(cashFlowStatementData.justificationCashFlowStatement);
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
            changeInOtherProvisions: this.formBuilder.array([]),
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
            justificationCashFlowStatement: [undefined]
        });
    }

    // Removing Fiscal Year--
    removingFiscalYear(fiscalYear, index) {
        this.modalService.open(FinancialDeleteComponentComponent).result.then(message => {
            if (message === ModalResponse.SUCCESS) {
                const removeParamsObject = {fiscalYear: fiscalYear, index: index};
                this.removeFiscalYear.next(removeParamsObject);
            }
        });
    }

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

    // Change in Other provisions
    setChangeInOtherProvisions(currentData) {
        const controls = this.cashFlowStatementForm.get('changeInOtherProvisions') as FormArray;
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

    ngOnDestroy(): void {
        this.formData['cashFlowStatementData'].justificationCashFlowStatement = this.cashFlowStatementForm.get('justificationCashFlowStatement').value;
        const firstYearOpeningBalanceFormData = this.cashFlowStatementForm.get('addOpeningBalance') as FormArray;
        if (firstYearOpeningBalanceFormData.controls.length > 0) {
            this.formData['cashFlowStatementData'].addOpeningBalance[0].value = firstYearOpeningBalanceFormData.value[0].value;
        }
    }
}
