import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-financial',
    templateUrl: './financial.component.html',
    styleUrls: ['./financial.component.scss']
})
export class FinancialComponent implements OnInit {
    financialForm: FormGroup;
    fiscalYear = [];
    additionalFinancialForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.buildForm();
    }

    buildForm() {
        this.financialForm = this.formBuilder.group({
            incomeOfBorrower: this.formBuilder.array([]),
            expensesOfBorrower: this.formBuilder.array([]),
            selectDenomination: [undefined, Validators.required]
        });

        this.additionalFinancialForm = this.formBuilder.group({

            totalSalesRevenue: this.formBuilder.array([
                this.formBuilder.group({
                    value: [undefined],
                    year: [undefined]
                })
            ]),

            totalSalesSubCategory: this.formBuilder.array([
                this.formBuilder.group({
                    name: ['Direct Sales'],
                    amount: this.formBuilder.array([
                        this.formBuilder.group({
                            value: [undefined],
                            year: [undefined]
                        })
                    ])
                })
            ]),

            costOfGoodsSold: this.formBuilder.array([
                this.formBuilder.group({
                    value: [undefined],
                    year: [undefined]
                })
            ]),

            costOfGoodsSubCategory: this.formBuilder.array([
                this.formBuilder.group({
                    name: ['Raw Material Consumed'],
                    amount: this.formBuilder.array([
                        this.formBuilder.group({
                            value: [undefined],
                            year: [undefined]
                        })
                    ])
                }),
                this.formBuilder.group({
                    name: ['Labor'],
                    amount: this.formBuilder.array([
                        this.formBuilder.group({
                            value: [undefined],
                            year: [undefined]
                        })
                    ])
                }),
                this.formBuilder.group({
                    name: ['Other Direct Costs'],
                    amount: this.formBuilder.array([
                        this.formBuilder.group({
                            value: [undefined],
                            year: [undefined]
                        })
                    ])
                })
            ])
        });

        // functions for adding fields
        this.addIncomeOfBorrower();
        this.addExpensesOfBorrower();
    }

    /*pushValuesTotal(value, year) {
        const control = this.incomeStatementForm.controls.totalSalesRevenue['controls'].amount as FormArray;
        control.push(
            this.formBuilder.group({
                value:  [value],
                year: [year]
            })
        );
    }*/

    // Fiscal Year --
    addFiscalYear(yearValue) {
        this.fiscalYear.push(yearValue);
    }

    removeFiscalYear(index) {
        this.fiscalYear.splice(index, 1);
    }

    // Total Sales Revenue--
    addSubCategoryTotalSales(name) {
        const control = this.additionalFinancialForm.get('totalSalesSubCategory') as FormArray;
        control.push(
            this.formBuilder.group({
                name: [name],
                amount: this.formBuilder.array([
                    this.formBuilder.group({
                        value: [undefined],
                        year: [undefined]
                    })
                ])
            })
        );
    }

    removeSubCategoryTotalSales(index) {
        (this.financialForm.get('incomeOfBorrower') as FormArray).removeAt(index);
    }

    // Cost of Goods Sold
    addSubCategoryCostOfGoods(name) {
        const control = this.additionalFinancialForm.get('costOfGoodsSubCategory') as FormArray;
        control.push(
            this.formBuilder.group({
                name: [name],
                amount: this.formBuilder.array([
                    this.formBuilder.group({
                        value: [undefined],
                        year: [undefined]
                    })
                ])
            })
        );
    }

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

}
