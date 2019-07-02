import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FinancialService} from './financial.service';
import {single} from 'rxjs/operators';

@Component({
    selector: 'app-financial',
    templateUrl: './financial.component.html',
    styleUrls: ['./financial.component.scss']
})
export class FinancialComponent implements OnInit {
    fiscalYear = [];
    financialForm: FormGroup;
    additionalFinancialForm: FormGroup;

    constructor(private formBuilder: FormBuilder,
                private service: FinancialService) {
    }

    ngOnInit() {
        this.buildForm();
        /*this.service.detail(4).subscribe((res: any) => {
            const data = res.detail.financial;
            const formData = JSON.parse(data);
            console.log(formData.totalSalesRevenue);
            this.setTotalSalesRevenue(formData.totalSalesRevenue);
            this.setTotalSalesSubCategory(formData.totalSalesSubCategory);
        });*/
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

            interestExpenses: this.formBuilder.array([
                this.formBuilder.group({
                    name: ['Interest on Term Loan'],
                    amount: this.formBuilder.array([])
                }),
                this.formBuilder.group({
                    name: ['Interest on Working Capital Loan'],
                    amount: this.formBuilder.array([])
                }),
            ]),

            nonOperatingIncomeOrExpenses: this.formBuilder.array([
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

        // functions for adding fields
        this.addIncomeOfBorrower();
        this.addExpensesOfBorrower();
    }

    // Setting existing data--
    setTotalSalesRevenue(totalSalesRevenue) {
        this.fiscalYear = [];
        const controls = this.additionalFinancialForm.get('totalSalesRevenue') as FormArray;
        totalSalesRevenue.forEach(singleTotalSalesRevenue => {
            this.fiscalYear.push(singleTotalSalesRevenue.year);
            controls.push(
                this.formBuilder.group({
                    value: [singleTotalSalesRevenue.value],
                    year: [singleTotalSalesRevenue.year]
                })
            );
        });
    }

    setTotalSalesSubCategory(totalSalesSubCategory) {
        const control = this.additionalFinancialForm.get('totalSalesSubCategory') as FormArray;
        totalSalesSubCategory.forEach(singleTotalSalesSubCategory => {
            control.push(
                this.formBuilder.group({
                    name: [singleTotalSalesSubCategory.name],
                    amount: this.setSubCategoryAmount(singleTotalSalesSubCategory)
                })
            );
        });
    }

    setSubCategoryAmount(totalSalesSubCategory) {
        const amountControl = this.formBuilder.array([]);
        console.log(totalSalesSubCategory.amount);
        totalSalesSubCategory.amount.forEach( singleAmount => {
            amountControl.push(
                this.formBuilder.group({
                    value: [singleAmount.value],
                    year: [singleAmount.year]
                })
            );
        });
        return amountControl;
    }

    // Fiscal Year --
    addFiscalYear(yearValue) {

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
        totalSalesSubCategoryControl.controls.forEach((group, index) => {
            const amount = group.get('amount') as FormArray;
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [yearValue]
                })
            );
        });
    }

    removeFiscalYear(index) {

        // splice fiscal year
        this.fiscalYear.splice(index, 1);

        // remove Total Sales
        const totalSalesControl = this.additionalFinancialForm.get('totalSalesRevenue') as FormArray;
        totalSalesControl.removeAt(index);

        // remove Total Sales Category
        const totalSalesSubCategoryControl = this.additionalFinancialForm.get('totalSalesSubCategory') as FormArray;
        totalSalesSubCategoryControl.controls.forEach((group, i) => {
            const amount = group.get('amount') as FormArray;
            amount.removeAt(index);
        });
    }

    // Adding Total Sales Revenue Sub Category--
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

    removeSubCategoryTotalSales(index) {
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
        const a = JSON.stringify(this.additionalFinancialForm.value);
        const f = {
            financial: a
        };

        this.service.save(f).subscribe((res: any) => {
            console.log(res);
        });
    }
}
