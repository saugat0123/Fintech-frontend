import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-balance-sheet',
    templateUrl: './balance-sheet.component.html',
    styleUrls: ['./balance-sheet.component.scss']
})
export class BalanceSheetComponent implements OnInit {
    @Input() fiscalYear: Array<number>;
    @Input() formData;
    balanceSheetForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.buildBalanceSheetForm();
        if (this.formData !== undefined) {
            const balanceSheetFormData = this.formData.data.balanceSheetData;
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

    // Fiscal year addition---
    addFiscalYearBalanceSheet(yearValue) {
        // Push Current Assets
        const currentAssetsControl = this.balanceSheetForm.get('currentAssets') as FormArray;
        currentAssetsControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Current Assets Category
        const currentAssetsCategoryControl = this.balanceSheetForm.get('currentAssetsCategory') as FormArray;
        currentAssetsCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [yearValue]
                })
            );
        });
        // Push inventories
        const inventoriesControl = this.balanceSheetForm.get('inventories') as FormArray;
        inventoriesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push inventories Category
        const inventoriesCategoryControl = this.balanceSheetForm.get('inventoriesCategory') as FormArray;
        inventoriesCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [yearValue]
                })
            );
        });
        // Push Fixed Assets
        const fixedAssetsControl = this.balanceSheetForm.get('fixedAssets') as FormArray;
        fixedAssetsControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Fixed Assets Category
        const fixedAssetsCategoryControl = this.balanceSheetForm.get('fixedAssetsCategory') as FormArray;
        fixedAssetsCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [yearValue]
                })
            );
        });
        // Push Other Assets
        const otherAssetsControl = this.balanceSheetForm.get('otherAssets') as FormArray;
        otherAssetsControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Other Assets Category
        const otherAssetsCategoryControl = this.balanceSheetForm.get('otherAssetsCategory') as FormArray;
        otherAssetsCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [yearValue]
                })
            );
        });
        // Push Total Assets
        const totalAssetsControl = this.balanceSheetForm.get('totalAssets') as FormArray;
        totalAssetsControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Current Liabilities
        const currentLiabilitiesControl = this.balanceSheetForm.get('currentLiabilities') as FormArray;
        currentLiabilitiesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Current Liabilities Category
        const currentLiabilitiesCategoryControl = this.balanceSheetForm.get('currentLiabilitiesCategory') as FormArray;
        currentLiabilitiesCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [yearValue]
                })
            );
        });
        // Push Long Term Loan
        const longTermLoanControl = this.balanceSheetForm.get('longTermLoan') as FormArray;
        longTermLoanControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Long Term Loan Category
        const longTermLoanCategoryControl = this.balanceSheetForm.get('longTermLoanCategory') as FormArray;
        longTermLoanCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [yearValue]
                })
            );
        });
        // Push Other Long Term Liabilities
        const otherLongTermLiabilitiesControl = this.balanceSheetForm.get('otherLongTermLiabilities') as FormArray;
        otherLongTermLiabilitiesControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Other Long Term Liabilities Category
        const otherLongTermLiabilitiesCategoryControl = this.balanceSheetForm.get('otherLongTermLiabilitiesCategory') as FormArray;
        otherLongTermLiabilitiesCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [yearValue]
                })
            );
        });
        // Push Other Provisions
        const otherProvisionsControl = this.balanceSheetForm.get('otherProvisions') as FormArray;
        otherProvisionsControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Net Worth
        const netWorthControl = this.balanceSheetForm.get('netWorth') as FormArray;
        netWorthControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Net Worth Category
        const netWorthCategoryControl = this.balanceSheetForm.get('netWorthCategory') as FormArray;
        netWorthCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.push(
                this.formBuilder.group({
                    value: [0],
                    year: [yearValue]
                })
            );
        });
        // Push Total Liabilities and Equity
        const totalLiabilitiesAndEquityControl = this.balanceSheetForm.get('totalLiabilitiesAndEquity') as FormArray;
        totalLiabilitiesAndEquityControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
        // Push Difference BS
        const differenceBSControl = this.balanceSheetForm.get('differenceBS') as FormArray;
        differenceBSControl.push(
            this.formBuilder.group({
                value: [0],
                year: [yearValue]
            })
        );
    }

    // Fiscal Year Removal---
    removeFiscalYearBalanceSheet(index) {
        // remove Current Assets
        const currentAssetsControl = this.balanceSheetForm.get('currentAssets') as FormArray;
        currentAssetsControl.removeAt(index);
        // remove Current Assets Category
        const currentAssetsCategoryControl = this.balanceSheetForm.get('currentAssetsCategory') as FormArray;
        currentAssetsCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.removeAt(index);
        });
        // remove Inventories
        const inventoriesControl = this.balanceSheetForm.get('inventories') as FormArray;
        inventoriesControl.removeAt(index);
        // remove Inventories Category
        const inventoriesCategoryControl = this.balanceSheetForm.get('inventoriesCategory') as FormArray;
        inventoriesCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.removeAt(index);
        });
        // remove Fixed Assets
        const fixedAssetsControl = this.balanceSheetForm.get('fixedAssets') as FormArray;
        fixedAssetsControl.removeAt(index);
        // remove Fixed Assets Category
        const fixedAssetsCategoryControl = this.balanceSheetForm.get('fixedAssetsCategory') as FormArray;
        fixedAssetsCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.removeAt(index);
        });
        // remove Other Assets
        const otherAssetsControl = this.balanceSheetForm.get('otherAssets') as FormArray;
        otherAssetsControl.removeAt(index);
        // remove Other Assets Category
        const otherAssetsCategoryControl = this.balanceSheetForm.get('otherAssetsCategory') as FormArray;
        otherAssetsCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.removeAt(index);
        });
        // remove Total Assets
        const totalAssetsControl = this.balanceSheetForm.get('totalAssets') as FormArray;
        totalAssetsControl.removeAt(index);
        // remove Current Liabilities
        const currentLiabilitiesControl = this.balanceSheetForm.get('currentLiabilities') as FormArray;
        currentLiabilitiesControl.removeAt(index);
        // remove Current Liabilities Category
        const currentLiabilitiesCategoryControl = this.balanceSheetForm.get('currentLiabilitiesCategory') as FormArray;
        currentLiabilitiesCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.removeAt(index);
        });
        // remove Long Term Loan
        const longTermLoanControl = this.balanceSheetForm.get('longTermLoan') as FormArray;
        longTermLoanControl.removeAt(index);
        // remove Long Term Loan Category
        const longTermLoanCategoryControl = this.balanceSheetForm.get('longTermLoanCategory') as FormArray;
        longTermLoanCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.removeAt(index);
        });
        // remove Other Long Term Liabilities
        const otherLongTermLiabilitiesControl = this.balanceSheetForm.get('otherLongTermLiabilities') as FormArray;
        otherLongTermLiabilitiesControl.removeAt(index);
        // remove Other Long Term Liabilities Category
        const otherLongTermLiabilitiesCategoryControl = this.balanceSheetForm.get('otherLongTermLiabilitiesCategory') as FormArray;
        otherLongTermLiabilitiesCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.removeAt(index);
        });
        // remove Other Provisions
        const otherProvisionsControl = this.balanceSheetForm.get('otherProvisions') as FormArray;
        otherProvisionsControl.removeAt(index);
        // remove Net Worth
        const netWorthControl = this.balanceSheetForm.get('netWorth') as FormArray;
        netWorthControl.removeAt(index);
        // remove Net Worth Category
        const netWorthCategoryControl = this.balanceSheetForm.get('netWorthCategory') as FormArray;
        netWorthCategoryControl.controls.forEach(group => {
            const amount = group.get('amount') as FormArray;
            amount.removeAt(index);
        });
        // remove Total Liabilities and Equity
        const totalLiabilitiesAndEquityControl = this.balanceSheetForm.get('totalLiabilitiesAndEquity') as FormArray;
        totalLiabilitiesAndEquityControl.removeAt(index);
        // remove Difference
        const differenceBSControl = this.balanceSheetForm.get('differenceBS') as FormArray;
        differenceBSControl.removeAt(index);
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

}
