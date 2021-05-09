import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FinancialDeleteComponentComponent} from '../financial-delete-component/financial-delete-component.component';
import {ModalResponse} from '../../../../@core/utils';
import {Editor} from '../../../../@core/utils/constants/editor';
import {environment} from '../../../../../environments/environment';
import {Clients} from '../../../../../environments/Clients';

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
    isSRDB = environment.client === Clients.SHINE_RESUNGA;

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

    handleFirstYearInputChanges() {
        const netProfitForThePeriod = (this.cashFlowStatementForm.get('netProfitForThePeriod') as FormArray).value[0].value;
        const depreciation = (this.cashFlowStatementForm.get('depreciation') as FormArray).value[0].value;
        const otherAmortizationAndNonCashExpenses =
            (this.cashFlowStatementForm.get('otherAmortizationAndNonCashExpenses') as FormArray).value[0].value;
        const increaseDecreaseInInventory = (this.cashFlowStatementForm.get('increaseDecreaseInInventory') as FormArray).value[0].value;
        const increaseDecreaseInAccountsReceivable =
            (this.cashFlowStatementForm.get('increaseDecreaseInAccountsReceivable') as FormArray).value[0].value;
        const increaseDecreaseInShortTermInvestment =
            (this.cashFlowStatementForm.get('increaseDecreaseInShortTermInvestment') as FormArray).value[0].value;
        const increaseDecreaseInAdvanceAndDeposit =
            (this.cashFlowStatementForm.get('increaseDecreaseInAdvanceAndDeposit') as FormArray).value[0].value;
        const increaseDecreaseInOtherCurrentAssets =
            (this.cashFlowStatementForm.get('increaseDecreaseInOtherCurrentAssets') as FormArray).value[0].value;
        const increaseDecreaseInCreditors = (this.cashFlowStatementForm.get('increaseDecreaseInCreditors') as FormArray).value[0].value;
        const increaseDecreaseInOtherCurrentLiabilities =
            (this.cashFlowStatementForm.get('increaseDecreaseInOtherCurrentLiabilities') as FormArray).value[0].value;
        const adjustmentForNonOperatingIncome =
            (this.cashFlowStatementForm.get('adjustmentForNonOperatingIncome') as FormArray).value[0].value;
        const interestExpensesCFSa = (this.cashFlowStatementForm.get('interestExpensesCFSa') as FormArray).value[0].value;

        ((this.cashFlowStatementForm.get('cashFromOperatingActivities') as FormArray).controls[0] as FormGroup)
            .controls['value'].patchValue((Number(netProfitForThePeriod)
            + Number(depreciation)
            + Number(otherAmortizationAndNonCashExpenses)
            + Number(increaseDecreaseInInventory)
            + Number(increaseDecreaseInAccountsReceivable)
            + Number(increaseDecreaseInShortTermInvestment)
            + Number(increaseDecreaseInAdvanceAndDeposit)
            + Number(increaseDecreaseInOtherCurrentAssets)
            + Number(increaseDecreaseInCreditors)
            + Number(increaseDecreaseInOtherCurrentLiabilities)
            + Number(adjustmentForNonOperatingIncome)
            + Number(interestExpensesCFSa)).toFixed(2));

        const cashFromOperatingActivities = (this.cashFlowStatementForm.get('cashFromOperatingActivities') as FormArray).value[0].value;
        const addOpeningBalance = (this.cashFlowStatementForm.get('addOpeningBalance') as FormArray).value[0].value;

        /** For cashFromInvestingActivities **/
        const changedInFixedAsset = (this.cashFlowStatementForm.get('changedInFixedAsset') as FormArray).value[0].value;
        const nonOperatingIncomeExpenses = (this.cashFlowStatementForm.get('nonOperatingIncomeExpenses') as FormArray).value[0].value;
        const changeInOtherAssets = (this.cashFlowStatementForm.get('changeInOtherAssets') as FormArray).value[0].value;
        const changeInOtherLongTermLiabilities = (this.cashFlowStatementForm
            .get('changeInOtherLongTermLiabilities') as FormArray).value[0].value;
        const changeInOtherProvisions = (this.cashFlowStatementForm.get('changeInOtherProvisions') as FormArray).value[0].value;

        ((this.cashFlowStatementForm.get('cashFromInvestingActivities') as FormArray).controls[0] as FormGroup)
            .controls['value'].patchValue((Number(changedInFixedAsset)
            + Number(nonOperatingIncomeExpenses)
            + Number(changeInOtherAssets)
            + Number(changeInOtherLongTermLiabilities)
            + Number(changeInOtherProvisions)).toFixed(2));
        const cashFromInvestingActivities = (this.cashFlowStatementForm.get('cashFromInvestingActivities') as FormArray).value[0].value;

        /** For cashFromFinancingActivities **/
        const paidUpCapitalEquity = (this.cashFlowStatementForm.get('paidUpCapitalEquity') as FormArray).value[0].value;
        const shortTermLoan = (this.cashFlowStatementForm.get('shortTermLoan') as FormArray).value[0].value;
        const longTermLoanReceived = (this.cashFlowStatementForm.get('longTermLoanReceived') as FormArray).value[0].value;
        const dividendDrawing = (this.cashFlowStatementForm.get('dividendDrawing') as FormArray).value[0].value;
        const interestExpensesCFSb = (this.cashFlowStatementForm.get('interestExpensesCFSb') as FormArray).value[0].value;
        const otherAdjustments = (this.cashFlowStatementForm.get('otherAdjustments') as FormArray).value[0].value;

        ((this.cashFlowStatementForm.get('cashFromFinancingActivities') as FormArray).controls[0] as FormGroup)
            .controls['value'].patchValue((Number(paidUpCapitalEquity)
            + Number(shortTermLoan)
            + Number(longTermLoanReceived)
            + Number(dividendDrawing)
            + Number(interestExpensesCFSb)
            + Number(otherAdjustments)).toFixed(2));
        const cashFromFinancingActivities = (this.cashFlowStatementForm.get('cashFromFinancingActivities') as FormArray).value[0].value;

        /** Calculating net cash flow **/
        ((this.cashFlowStatementForm.get('netCashFlow') as FormArray).controls[0] as FormGroup)
            .controls['value'].patchValue((Number(cashFromOperatingActivities)
            + Number(cashFromInvestingActivities)
            + Number(cashFromFinancingActivities)).toFixed(2));
        const netCashFlow = (this.cashFlowStatementForm.get('netCashFlow') as FormArray).value[0].value;

        /** Calculating closing cash */
        ((this.cashFlowStatementForm.get('closingCash') as FormArray).controls[0] as FormGroup)
            .controls['value'].patchValue((Number(netCashFlow)
            + Number(addOpeningBalance)).toFixed(2));
        const closingBalance = (this.cashFlowStatementForm.get('closingBalance') as FormArray).value[0].value;
        const closingCash = (this.cashFlowStatementForm.get('closingCash') as FormArray).value[0].value;

        /** Calculating difference in CFS **/
        ((this.cashFlowStatementForm.get('differenceCFS') as FormArray).controls[0] as FormGroup)
            .controls['value'].patchValue((Number(closingCash) - Number(closingBalance)).toFixed(2));
    }

    saveAdjustmentForWorkingCapital() {
        /** This method has been create to separate the calculations part while taking input */
        const cashFromInvestingActivities = this.cashFlowStatementForm.get('cashFromInvestingActivities') as FormArray;
        const changedInFixedAsset = this.cashFlowStatementForm.get('changedInFixedAsset') as FormArray;
        const changeInOtherAssets = this.cashFlowStatementForm.get('changeInOtherAssets') as FormArray;
        const changeInOtherLongTermLiabilities = this.cashFlowStatementForm.get('changeInOtherLongTermLiabilities') as FormArray;
        const changeInOtherProvisions = this.cashFlowStatementForm.get('changeInOtherProvisions') as FormArray;

        const cashFromFinancingActivities = this.cashFlowStatementForm.get('cashFromFinancingActivities') as FormArray;
        const paidUpCapitalEquity = this.cashFlowStatementForm.get('paidUpCapitalEquity') as FormArray;
        const shortTermLoan = this.cashFlowStatementForm.get('shortTermLoan') as FormArray;
        const longTermLoanReceived = this.cashFlowStatementForm.get('longTermLoanReceived') as FormArray;

        const netCashFlow = this.cashFlowStatementForm.get('netCashFlow') as FormArray;
        const closingCash = this.cashFlowStatementForm.get('closingCash') as FormArray;
        const differenceCFS = this.cashFlowStatementForm.get('differenceCFS') as FormArray;

        const increaseDecreaseInInventory = this.cashFlowStatementForm.get('increaseDecreaseInInventory') as FormArray;
        const increaseDecreaseInAccountsReceivable = this.cashFlowStatementForm.get('increaseDecreaseInAccountsReceivable') as FormArray;
        const increaseDecreaseInShortTermInvestment = this.cashFlowStatementForm.get('increaseDecreaseInShortTermInvestment') as FormArray;
        const increaseDecreaseInAdvanceAndDeposit = this.cashFlowStatementForm.get('increaseDecreaseInAdvanceAndDeposit') as FormArray;
        const increaseDecreaseInOtherCurrentAssets = this.cashFlowStatementForm.get('increaseDecreaseInOtherCurrentAssets') as FormArray;
        const increaseDecreaseInCreditors = this.cashFlowStatementForm.get('increaseDecreaseInCreditors') as FormArray;
        const increaseDecreaseInOtherCurrentLiabilities =
            this.cashFlowStatementForm.get('increaseDecreaseInOtherCurrentLiabilities') as FormArray;

        if (increaseDecreaseInInventory.controls.length > 0) {
            this.formData['cashFlowStatementData'].increaseDecreaseInInventory[0].value = increaseDecreaseInInventory.value[0].value;
            this.formData['cashFlowStatementData'].increaseDecreaseInAccountsReceivable[0].value =
                increaseDecreaseInAccountsReceivable.value[0].value;
            this.formData['cashFlowStatementData'].increaseDecreaseInShortTermInvestment[0].value =
                increaseDecreaseInShortTermInvestment.value[0].value;
            this.formData['cashFlowStatementData'].increaseDecreaseInAdvanceAndDeposit[0].value =
                increaseDecreaseInAdvanceAndDeposit.value[0].value;
            this.formData['cashFlowStatementData'].increaseDecreaseInOtherCurrentAssets[0].value =
                increaseDecreaseInOtherCurrentAssets.value[0].value;
            this.formData['cashFlowStatementData'].increaseDecreaseInCreditors[0].value = increaseDecreaseInCreditors.value[0].value;
            this.formData['cashFlowStatementData'].increaseDecreaseInOtherCurrentLiabilities[0].value =
                increaseDecreaseInOtherCurrentLiabilities.value[0].value;

            this.formData['cashFlowStatementData'].cashFromInvestingActivities[0].value = cashFromInvestingActivities.value[0].value;
            this.formData['cashFlowStatementData'].changedInFixedAsset[0].value = changedInFixedAsset.value[0].value;
            this.formData['cashFlowStatementData'].changeInOtherAssets[0].value = changeInOtherAssets.value[0].value;
            this.formData['cashFlowStatementData'].changeInOtherLongTermLiabilities[0].value =
                changeInOtherLongTermLiabilities.value[0].value;
            this.formData['cashFlowStatementData'].changeInOtherProvisions[0].value = changeInOtherProvisions.value[0].value;
            this.formData['cashFlowStatementData'].cashFromFinancingActivities[0].value = cashFromFinancingActivities.value[0].value;
            this.formData['cashFlowStatementData'].paidUpCapitalEquity[0].value = paidUpCapitalEquity.value[0].value;
            this.formData['cashFlowStatementData'].shortTermLoan[0].value = shortTermLoan.value[0].value;
            this.formData['cashFlowStatementData'].longTermLoanReceived[0].value = longTermLoanReceived.value[0].value;
            this.formData['cashFlowStatementData'].netCashFlow[0].value = netCashFlow.value[0].value;
            this.formData['cashFlowStatementData'].closingCash[0].value = closingCash.value[0].value;
            this.formData['cashFlowStatementData'].differenceCFS[0].value = differenceCFS.value[0].value;
        }
    }

    onChangeAddOpeningBalance() {
        const netCashFlowForInitialYear = (this.cashFlowStatementForm.get('netCashFlow') as FormArray).value[0].value;
        const addOpeningBalanceForInitialYear = (this.cashFlowStatementForm.get('addOpeningBalance') as FormArray).value[0].value;

        ((this.cashFlowStatementForm.get('closingCash') as FormArray).controls[0] as FormGroup)
            .controls['value'].patchValue((Number(netCashFlowForInitialYear) + Number(addOpeningBalanceForInitialYear)).toFixed(2));

        const closingCashForInitialYear = (this.cashFlowStatementForm.get('closingCash') as FormArray).value[0].value;
        const closingBalanceForInitialYear = (this.cashFlowStatementForm.get('closingBalance') as FormArray).value[0].value;

        ((this.cashFlowStatementForm.get('differenceCFS') as FormArray).controls[0] as FormGroup)
            .controls['value'].patchValue((Number(closingCashForInitialYear) - Number(closingBalanceForInitialYear)).toFixed(2));
    }

    ngOnDestroy(): void {
        this.formData['cashFlowStatementData'].justificationCashFlowStatement = this.cashFlowStatementForm.get('justificationCashFlowStatement').value;

        this.saveAdjustmentForWorkingCapital();
        const firstYearOpeningBalanceFormData = this.cashFlowStatementForm.get('addOpeningBalance') as FormArray;
        const firstYearClosingCashFormData = this.cashFlowStatementForm.get('closingCash') as FormArray;
        const firstYearDifferenceCFSFormData = this.cashFlowStatementForm.get('differenceCFS') as FormArray;

        if (firstYearOpeningBalanceFormData.controls.length > 0) {
            this.formData['cashFlowStatementData'].addOpeningBalance[0].value = firstYearOpeningBalanceFormData.value[0].value;
            this.formData['cashFlowStatementData'].closingCash[0].value = firstYearClosingCashFormData.value[0].value;
            this.formData['cashFlowStatementData'].differenceCFS[0].value = firstYearDifferenceCFSFormData.value[0].value;
        }
    }
}
