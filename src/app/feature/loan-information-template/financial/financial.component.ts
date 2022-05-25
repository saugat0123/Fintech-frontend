import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IncomeStatementComponent} from './income-statement/income-statement.component';
import {BalanceSheetComponent} from './balance-sheet/balance-sheet.component';
import {CashFlowStatementComponent} from './cash-flow-statement/cash-flow-statement.component';
import {KeyIndicatorsComponent} from './key-indicators/key-indicators.component';
import * as currentFormData from './financial.json';
import {FinancialService} from './financial.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FiscalYearModalComponent} from './fiscal-year-modal/fiscal-year-modal.component';
import {ActivatedRoute} from '@angular/router';
import {Financial} from '../../loan/model/financial';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {CustomerType} from '../../customer/model/customerType';
import {MajorSourceIncomeType} from '../../admin/modal/crg/major-source-income-type';
import {NumberUtils} from '../../../@core/utils/number-utils';
import {TypeOfSourceOfIncome, TypeOfSourceOfIncomeArray, TypeOfSourceOfIncomeMap} from '../../admin/modal/crg/typeOfSourceOfIncome';
import {NgSelectComponent} from '@ng-select/ng-select';
import {environment} from '../../../../environments/environment';
import {NgxSpinnerService} from 'ngx-spinner';
import {RiskGradingService} from '../../credit-risk-grading/service/risk-grading.service';
import {CrgQuestion} from '../../credit-risk-grading/model/CrgQuestion';
import {CustomerInfoData} from '../../loan/model/customerInfoData';

@Component({
    selector: 'app-financial',
    templateUrl: './financial.component.html',
    styleUrls: ['./financial.component.scss']
})
export class FinancialComponent implements OnInit {
    @ViewChild('incomeStatement', {static: false}) incomeStatement: IncomeStatementComponent;
    @ViewChild('balanceSheet', {static: false}) balanceSheet: BalanceSheetComponent;
    @ViewChild('cashFlowStatement', {static: false}) cashFlowStatement: CashFlowStatementComponent;
    @ViewChild('keyIndicators', {static: false}) keyIndicators: KeyIndicatorsComponent;
    @Input() formData: Financial;
    @Input() fromProfile: boolean;
    @Output() financialDataEmitter = new EventEmitter();
    @Input() customerInfo: CustomerInfoData;

    disableCrgAlphaParams = environment.disableCrgAlpha;

    isBusinessLoan = true;
    historicalDataPresent = true;

    fiscalYear = [];
    auditorList = [];
    activeTab: string;
    financialForm: FormGroup;
    financialData: Financial = new Financial();
    currentFormData: Object;
    submitted = false;
    totalIncome = 0;
    totalObligationValue = 0;
    totalExpenses = 0;


    // Risk factors---

    // Lambda risk factors---
    typeOfSourceOfIncomeArray = TypeOfSourceOfIncomeArray.typeOfSourceOfIncomeArray;
    majorSourceIncomeType = MajorSourceIncomeType.enumObject();

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
        'differenceBS',
        'principleInstalmentPaidDuringTheYear'
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
        'deRatioExcludingLoanFromShareholderOrDirector',
        'deRatioIncludingLoanFromShareholderOrDirector',
        'debtEquityRatioOverall',
        'debtEquityRatioLongTerm',
        'debtEquityRatioWorkingCapital',
        'debtTotalAssetsRatio',
        'leverageRatio',
        'operatingCycle',
        'inventoryTurnoverRatio',
        'stockInHandDays',
        'debtorTurnOverRatio',
        'averageCollectionPeriod',
        'averagePaymentPeriod',
        'netOperatingCycle',
        'netWCBeforeBank',
        'cashFlowKI',
        'returnOnAssets'
    ];

    numberUtils = NumberUtils;
    crgQuestionsList: CrgQuestion;
    projectedFinancialData = [
        'Reliability of projections',
        'Debt equity ratio',
        'Debt to assets ratio',
        'Current ratio',
        'Net profitability',
        'Rerurn on assets',
        'Debt service coverage ratio',
        'Stock turnover (days)',
        'Debtors turnover (days)',
        'FBWC loans / sales'
    ];

    constructor(private formBuilder: FormBuilder,
                private financialService: FinancialService,
                private modalService: NgbModal,
                private overlay: NgxSpinnerService,
                private activatedRoute: ActivatedRoute,
                private questionService: RiskGradingService) {
    }

    get form() {
        return this.financialForm.controls;
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(queryParams => {
            if (CustomerType.INDIVIDUAL === CustomerType[queryParams.customerType]) {
                this.isBusinessLoan = false;
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
            this.setObligationAtOtherBank(initialFormData.obligationAtOtherBank);
            this.financialForm.get('totalIncome').setValue(initialFormData.totalIncome);
            this.financialForm.get('totalExpense').setValue(initialFormData.totalExpense);
            this.financialForm.get('totalExpenseObligation').setValue(initialFormData.totalExpenseObligation);
            this.financialForm.get('netSaving').setValue(initialFormData.netSaving);
            this.financialForm.get('historicalDataPresent').setValue(initialFormData.historicalDataPresent);
            this.financialForm.get('totalWorkingCapitalLimit').setValue(initialFormData.totalWorkingCapitalLimit);
            this.historicalDataPresent = initialFormData.historicalDataPresent;
            this.financialForm.patchValue(initialFormData);
            this.methodListeners();
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
            if (!this.isBusinessLoan) {
                this.addIncomeOfBorrower();
                this.addExpensesOfBorrower();
                this.addObligationAtOtherBank();
            }
        }
        this.checkDisableAlpha();
        this.questionService.getAllQuestions(0).subscribe(s => {
            console.log(s, 'QUESTION');
            this.crgQuestionsList = s.detail[0];
            console.log(this.crgQuestionsList, 'LISSSTT');
        });

      this.patchTotalIncome();
    }

    patchTotalIncome() {
        console.log(JSON.parse(this.formData.data).initialForm, 'FORMDATA');
        const data = JSON.parse(this.formData.data).initialForm;
        data.incomeOfBorrower.forEach((v: any) => {
            this.totalIncome = Number(this.totalIncome) + Number(v.amount);
            console.log(this.totalIncome, 'income');
        });
        console.log(this.totalIncome, 'income');

        if (this.totalIncome !== 0) {
            this.financialForm.get('totalIncome').patchValue(this.totalIncome);
        }

        if (!ObjectUtil.isEmpty(data.obligationAtOtherBank)) {
        data.obligationAtOtherBank.forEach((v: any) => {
            this.totalObligationValue = Number(this.totalObligationValue) + Number(v.obliAmount);
        }); }

        if (this.totalObligationValue !== 0) {
            this.financialForm.get('totalExpenseObligation').patchValue(this.totalObligationValue);
            this.financialForm.get('existingObligationOtherBank').patchValue(this.totalObligationValue);
        }

        if (!ObjectUtil.isEmpty(data.expensesOfBorrower)) {
            data.expensesOfBorrower.forEach((v: any) => {
                this.totalExpenses = Number(this.totalExpenses) + Number(v.amount);
            });
        }

        if (this.totalExpenses !== 0) {
            this.financialForm.get('totalExpense').patchValue(this.totalExpenses);
        }
    }

    buildForm() {
        this.financialForm = this.formBuilder.group({
            incomeOfBorrower: this.formBuilder.array([]),
            expensesOfBorrower: this.formBuilder.array([]),
            obligationAtOtherBank: this.formBuilder.array([]),
            typeOfSourceOfIncomeObtainedScore: undefined,
            totalIncome: [0],
            totalExpense: [0],
            totalExpenseObligation: [0],
            currentTotal: [0],
            netSaving: [0],
            historicalDataPresent: [true],
            totalWorkingCapitalLimit: [0],
            // crg lambda fields---
            majorSourceIncomeType: [undefined],
            periodOfEarning: [undefined],
            alternateIncomeSource: [undefined],
            alternateIncomeSourceAmount: [undefined],
            // grossMonthlyObligation: [undefined],
            totalNetMonthlyIncome: [undefined],
            totalEMIInterest: [undefined],
            emiWithProposal: [undefined, !this.disableCrgAlphaParams && !this.isBusinessLoan ? Validators.required : undefined],
            emiGrossMonthly: [undefined],
            emiNetMonthly: [undefined],
            note: [undefined],

            existingObligationOtherBank: [undefined],
            totalObligationCurrentBank: [undefined],
            totalBankObligation: [undefined],
            obligationGrossIncomeRatio: [undefined],
            crgProfileOfAuditors: [undefined],
            financialDetailCheckBtn: ['old'],
            projectedFinancialsCheckBtn: [undefined]
            // riskFactorForm: this.buildRiskFactorForm(),
        });
    }

    toggleHistory($event: boolean) {
        this.historicalDataPresent = $event;
        this.financialForm.get('historicalDataPresent').setValue($event);
    }

    setTotalWorkingCapitalLimit(amount) {
        this.financialForm.get('totalWorkingCapitalLimit').setValue(amount);
    }

    // Setting existing data--
    // Set Initial Financial form--
    setIncomeOfBorrower(currentData) {
        const controls = this.financialForm.get('incomeOfBorrower') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    incomeSource: [singleData.incomeSource],
                    organization: [singleData.organization],
                    amount: [singleData.amount],
                    remarks: [singleData.remarks],
                })
            );
        });
    }

    setExpensesOfBorrower(currentData) {
        const controls = this.financialForm.get('expensesOfBorrower') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    particulars: [singleData.particulars],
                    amount: [singleData.amount],
                    remarks: [singleData.remarks]
                })
            );
        });
    }

    setObligationAtOtherBank(currentData) {
        const controls = this.financialForm.get('obligationAtOtherBank') as FormArray;
        currentData.forEach(singleData => {
            controls.push(
                this.formBuilder.group({
                    obliParticulars: [singleData.obliParticulars],
                    obliAmount: [singleData.obliAmount],
                    obliRemarks: [singleData.obliRemarks]
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

    openFiscalYearModal(editIndexForAuditor?) {
        const fiscalYearModalRef = this.modalService.open(FiscalYearModalComponent, {backdrop: 'static', size: 'lg'});
        if (!ObjectUtil.isEmpty(editIndexForAuditor)) {
            fiscalYearModalRef.componentInstance.editAuditorInstance = this.auditorList[editIndexForAuditor];
            fiscalYearModalRef.componentInstance.editAuditor = true;
        }
        fiscalYearModalRef.result.then(closeParams => {
            if (!ObjectUtil.isEmpty(editIndexForAuditor)) {
                this.auditorList[editIndexForAuditor] = closeParams.auditorDetails;
            } else {
                this.addFiscalYear(closeParams.fiscalYearValue, closeParams.auditorDetails);
            }
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
        console.log('I am income');
        const control = this.financialForm.controls.incomeOfBorrower as FormArray;
        control.push(
            this.formBuilder.group({
                incomeSource: [undefined, Validators.required],
                organization: [undefined],
                amount: [undefined, Validators.required],
                remarks: [undefined, Validators.required],
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

    addObligationAtOtherBank() {
        const control = this.financialForm.controls.obligationAtOtherBank as FormArray;
        control.push(
            this.formBuilder.group({
                obliParticulars: [undefined, Validators.required],
                obliAmount: [undefined, Validators.required],
                obliRemarks: [undefined, Validators.required]
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

    removeExpensesIndexObligation(incomeIndex) {
        (this.financialForm.get('obligationAtOtherBank') as FormArray).removeAt(incomeIndex);
        this.totalAdditionInitialFormObligation('obligationAtOtherBank', 'totalExpenseObligation');
    }

    totalAdditionInitialForm(formArrayName, resultControllerName) {
        let total = 0;
        (this.financialForm.get(formArrayName) as FormArray).controls.forEach(group => {
            total = Number(group.get('amount').value) + Number(total);
        });
        this.financialForm.get(resultControllerName).setValue(total);
        this.financialForm.get('netSaving').setValue(Number(this.financialForm.get('totalIncome').value)
            - Number(this.financialForm.get('totalExpense').value));
    }

    totalAdditionInitialFormObligation(formArrayName, resultControllerName) {
        let total = 0;
        (this.financialForm.get(formArrayName) as FormArray).controls.forEach(group => {
            total = Number(group.get('obliAmount').value) + Number(total);
        });
        this.financialForm.get(resultControllerName).setValue(total);
        this.financialForm.get('netSaving').setValue(Number(this.financialForm.get('totalIncome').value)
            - Number(this.financialForm.get('totalExpenseObligation').value));
    }

    changeActiveTab(tabs: QueryList<any>) {
        tabs.forEach(tabContent => {
            if (tabContent.active) {
                this.activeTab = tabContent['tabTitle'];
            }
        });
    }

    calculateAndSetHighestScore() {
        const incomeSourcePointsArray = [];
        (this.financialForm.get('incomeOfBorrower') as FormArray).controls.forEach(group => {
            incomeSourcePointsArray.push(TypeOfSourceOfIncomeMap.typeOfSourceOfIncomePointsMap.get(group.get('organization').value));
        });
        this.financialForm.get('typeOfSourceOfIncomeObtainedScore').patchValue(Math.max(...incomeSourcePointsArray));
    }

    onSubmit() {
        this.overlay.show();
        this.submitted = true;
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
        if (this.financialForm.invalid) {
            const controls = this.financialForm.controls;
            for (const name in controls) {
                if (controls[name].invalid) {
                    console.log(name);
                }
            }
            this.overlay.hide();
            return;
        }
        this.calculateAndSetHighestScore();
        this.currentFormData['fiscalYear'] = this.fiscalYear;
        this.currentFormData['initialForm'] = this.financialForm.value;
        if (this.isBusinessLoan) {
            this.currentFormData['auditorList'] = this.auditorList;
        }

        this.financialData.data = JSON.stringify(this.currentFormData);
        this.financialDataEmitter.emit(this.financialData.data);
    }

    totalEmiMonthlyGross() {
        const totalNetMonthly = Number(this.financialForm.get('totalIncome').value) -
            Number(this.financialForm.get('totalExpense').value);
        const totalEmiNetMonthly = ( totalNetMonthly /(Number(this.financialForm.get('emiWithProposal').value) + Number(this.financialForm.get('existingObligationOtherBank').value)) ).toFixed(8);
        this.financialForm.get('emiNetMonthly').patchValue(totalEmiNetMonthly);

        const totalEMIInterest = (Number(this.financialForm.get('totalIncome').value) / Number(this.financialForm.get('emiWithProposal').value))
            .toFixed(8);
        this.financialForm.get('totalEMIInterest').patchValue(totalEMIInterest);
    }

    methodListeners() {
        this.financialForm.get('totalIncome').valueChanges.subscribe(value => {
            this.totalObligationRatio();
        });
    }

    totalObligation() {
        this.financialForm.get('totalBankObligation').setValue(Number(this.form.existingObligationOtherBank.value)
            + Number(this.form.totalObligationCurrentBank.value));
        this.totalObligationRatio();

    }

    totalObligationRatio() {
        this.financialForm.get('obligationGrossIncomeRatio').setValue((
            this.form.totalBankObligation.value / this.form.totalIncome.value).toFixed(8));
    }

    controlValidation(controlNames: string[], validate) {
        controlNames.forEach(s => {
            if (validate) {
                this.financialForm.get(s).setValidators(Validators.required);
            } else {
                this.financialForm.get(s).clearValidators();
            }
            this.financialForm.get(s).updateValueAndValidity();
        });
    }

    checkDisableAlpha() {
        if (!this.isBusinessLoan && !this.disableCrgAlphaParams) {
            this.controlValidation(['majorSourceIncomeType', 'periodOfEarning', 'alternateIncomeSourceAmount'], false);
        } else {
            this.controlValidation(['majorSourceIncomeType', 'periodOfEarning', 'alternateIncomeSourceAmount'], false);
        }
    }

    setObligation(obligationIndex) {
        let total = 0;
        this.totalObligationValue = 0;
       (this.financialForm.get('obligationAtOtherBank') as FormArray).controls.forEach((c: any) => {
           this.totalObligationValue = Number(this.totalObligationValue) + Number(c.get('obliAmount').value);
       });
        total = this.totalIncome - this.totalObligationValue - this.totalExpenses;
        this.financialForm.patchValue({
            totalExpenseObligation: this.totalObligationValue,
            existingObligationOtherBank: this.totalObligationValue,
        });
    }
}
