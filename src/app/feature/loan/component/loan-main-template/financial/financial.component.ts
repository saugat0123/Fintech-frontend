import {Component, Input, OnInit, QueryList, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BorrowerRiskRatingComponent} from './borrower-risk-rating/borrower-risk-rating.component';
import {IncomeStatementComponent} from './income-statement/income-statement.component';
import {BalanceSheetComponent} from './balance-sheet/balance-sheet.component';
import {CashFlowStatementComponent} from './cash-flow-statement/cash-flow-statement.component';
import {KeyIndicatorsComponent} from './key-indicators/key-indicators.component';
import * as currentFormData from './financial.json';

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
    formDataForEdit: Object;

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        console.log(currentFormData['default']);
        this.buildForm();
        if (this.formData !== undefined) {
            const formDataString = JSON.stringify(this.formData);
            this.formDataForEdit = JSON.parse(formDataString);
            this.fiscalYear = this.formDataForEdit['data'].fiscalYear;
            const initialFormData = this.formDataForEdit['data'].initialForm;

            this.setIncomeOfBorrower(initialFormData.incomeOfBorrower);
            this.setExpensesOfBorrower(initialFormData.expensesOfBorrower);
        } else {
            this.formDataForEdit = {
                data: {
                    fiscalYear: undefined,
                    initialForm: undefined,
                    incomeStatementData: undefined,
                    balanceSheetData: undefined,
                    cashFlowStatementData: undefined,
                    keyIndicatorsData: undefined,
                    brr: undefined
                }
            };
            // functions for adding fields
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
                // Push Income Statement---
                this.incomeStatement.addFiscalYearIncomeStatement(yearValue);
                break;
            case 'Balance Sheet':
                // Push Balance Sheet---
                this.balanceSheet.addFiscalYearBalanceSheet(yearValue);
                break;
            case 'Cash Flow Statement':
                // Push Cash Flow Statement---
                this.cashFlowStatement.addFiscalYearCashFlowStatement(yearValue);
                break;
            case 'Key Indicators':
                // Push Key Indicators---
                this.keyIndicators.addFiscalYearKeyIndicators(yearValue);
        }
        this.addYear = false;
    }

    removeFiscalYear(index) {
        // splice fiscal year
        this.fiscalYear.splice(index, 1);

        // Splice Income Statement year--
        this.incomeStatement.removeFiscalYearIncomeStatement(index);

        // Splice Balance Sheet year---
        this.balanceSheet.removeFiscalYearBalanceSheet(index);

        // Splice Cash Flow Statement---
        this.cashFlowStatement.removeFiscalYearCashFlowStatement(index);

        // Splice Key Indicators---
        this.keyIndicators.removeFiscalYearKeyIndicators(index);
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
        tabs.forEach( tabContent => {
           if (tabContent.active) {
               this.activeTab = tabContent['tabTitle'];
           }
        });
        console.log(this.activeTab);
    }

    onSubmit() {
        const financialData = {
            fiscalYear: this.fiscalYear,
            initialForm: this.financialForm.value,
            incomeStatementData: this.incomeStatement.incomeStatementForm.value,
            balanceSheetData: this.balanceSheet.balanceSheetForm.value,
            cashFlowStatementData: this.cashFlowStatement.cashFlowStatementForm.value,
            keyIndicatorsData: this.keyIndicators.keyIndicatorsForm.value,
            brr: this.brr.borrowerRiskRating.value
        };
        this.financialData = { data: financialData };
    }
}
