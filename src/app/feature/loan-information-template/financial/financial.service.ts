import {Injectable} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Injectable({
    providedIn: 'root'
})
export class FinancialService {

    constructor() {
    }

    addFiscalYearForJson(headingProperty: Array<any>, yearValue) {
        headingProperty.push(
            {
                value: 0,
                year: yearValue,
                showLabel: false
            }
        );
    }

    addFiscalYearForJsonCategory(headingCategoryProperty: Array<any>, yearValue) {
        headingCategoryProperty.forEach(subCategory => {
            const amount = subCategory['amount'] as Array<any>;
            amount.push(
                {
                    value: 0,
                    year: yearValue,
                    showLabel: false
                }
            );
        });
    }

    removeFiscalYearForJson(headingProperty: Array<any>, index) {
        headingProperty.splice(index, 1);
    }

    removeFiscalYearForJsonCategory(headingCategoryProperty: Array<any>, index) {
        headingCategoryProperty.forEach(subCategory => {
            const amount = subCategory['amount'] as Array<any>;
            amount.splice(index, 1);
        });
    }

    onValueChangeForArraySum(headingArray, categoryFormArray, index) {
        let totalSum = 0;
        const subCategoryArray = categoryFormArray as FormArray;
        subCategoryArray.controls.forEach((categoryGroup, j) => {
            const amount = categoryGroup.get('amount') as FormArray;
            const yearCategoryValue = amount.controls[index].get('value').value as number;
            totalSum = Number(totalSum) + Number(yearCategoryValue);
        });
        const headingControl = headingArray as FormArray;
        const formGroup = headingControl.controls[index] as FormGroup;
        formGroup.controls['value'].setValue(totalSum.toFixed(2));
    }

    // Fetching sub category values for FormControls--
    fetchValuesForSubCategories(categoryFormArray, subCategoryName: string, index) {
        let value = 0;
        const subCategoryArray = categoryFormArray as FormArray;
        subCategoryArray.controls.forEach((categoryGroup: FormGroup) => {
            if (categoryGroup.controls['name'].value === subCategoryName) {
                const amount = categoryGroup.get('amount') as FormArray;
                value = amount.controls[index].get('value').value;
            }
        });
        return value;
    }

    // Fetching sub category values for Json--
    fetchValuesForJsonSubCategories(categoryArray, subCategoryName: string, index) {
        let value = 0;
        const subCategoryArray = categoryArray as Array<Object>;
        subCategoryArray.forEach(categoryGroup => {
            if (categoryGroup['name'] === subCategoryName) {
                const amount = categoryGroup['amount'];
                value = amount[index].value as number;
            }
        });
        return value;
    }

    // Convert a number to percentage--
    convertToPercent(numberValue) {
        return ((numberValue) * 100).toFixed(2);
    }

    //
    // Cash Flow Statement Total Calculation--
    cashFromOperatingActivitiesTotal(cashFlowStatementData, index) {
        cashFlowStatementData.cashFromOperatingActivities[index].value =
            (Number(cashFlowStatementData.netProfitForThePeriod[index].value)
            + Number(cashFlowStatementData.depreciation[index].value)
            + Number(cashFlowStatementData.otherAmortizationAndNonCashExpenses[index].value)
            + Number(cashFlowStatementData.increaseDecreaseInInventory[index].value)
            + Number(cashFlowStatementData.increaseDecreaseInAccountsReceivable[index].value)
            + Number(cashFlowStatementData.increaseDecreaseInShortTermInvestment[index].value)
            + Number(cashFlowStatementData.increaseDecreaseInAdvanceAndDeposit[index].value)
            + Number(cashFlowStatementData.increaseDecreaseInOtherCurrentAssets[index].value)
            + Number(cashFlowStatementData.increaseDecreaseInCreditors[index].value)
            + Number(cashFlowStatementData.increaseDecreaseInOtherCurrentLiabilities[index].value)
            + Number(cashFlowStatementData.adjustmentForNonOperatingIncome[index].value)
            + Number(cashFlowStatementData.interestExpensesCFSa[index].value)).toFixed(2);
    }

    cashFromInvestingActivitiesTotal(cashFlowStatementData, index) {
        const changeInOtherLongTermLiabilities = cashFlowStatementData.changeInOtherLongTermLiabilities.length > 0 ?
            cashFlowStatementData.changeInOtherLongTermLiabilities[index].value : 0;
        const changeInOtherProvisions = cashFlowStatementData.changeInOtherProvisions.length > 0 ?
            cashFlowStatementData.changeInOtherProvisions[index].value : 0;
        cashFlowStatementData.cashFromInvestingActivities[index].value =
            (Number(cashFlowStatementData.changedInFixedAsset[index].value)
            + Number(cashFlowStatementData.nonOperatingIncomeExpenses[index].value)
            + Number(cashFlowStatementData.changeInOtherAssets[index].value)
            + Number(changeInOtherLongTermLiabilities) + Number(changeInOtherProvisions)).toFixed(2);
    }

    cashFromFinancingActivitiesTotal(cashFlowStatementData, index) {
        if (!ObjectUtil.isEmpty(cashFlowStatementData.additionalCapital)) {
            cashFlowStatementData.cashFromFinancingActivities[index].value =
                (Number(cashFlowStatementData.paidUpCapitalEquity[index].value)
                    + Number(cashFlowStatementData.shortTermLoan[index].value)
                    + Number(cashFlowStatementData.longTermLoanReceived[index].value)
                    + Number(cashFlowStatementData.dividendDrawing[index].value)
                    + Number(cashFlowStatementData.interestExpensesCFSb[index].value)
                    + Number(cashFlowStatementData.otherAdjustments[index].value)
                    + Number(cashFlowStatementData.additionalCapital[index].value)).toFixed(2);
        } else {
            cashFlowStatementData.cashFromFinancingActivities[index].value =
                (Number(cashFlowStatementData.paidUpCapitalEquity[index].value)
                    + Number(cashFlowStatementData.shortTermLoan[index].value)
                    + Number(cashFlowStatementData.longTermLoanReceived[index].value)
                    + Number(cashFlowStatementData.dividendDrawing[index].value)
                    + Number(cashFlowStatementData.interestExpensesCFSb[index].value)
                    + Number(cashFlowStatementData.otherAdjustments[index].value)).toFixed(2);
        }
    }

    netCashFlowTotal(cashFlowStatementData, index) {
        cashFlowStatementData.netCashFlow[index].value =
            (Number(cashFlowStatementData.cashFromOperatingActivities[index].value)
            + Number(cashFlowStatementData.cashFromInvestingActivities[index].value)
            + Number(cashFlowStatementData.cashFromFinancingActivities[index].value)).toFixed(2);
    }

    closingCashTotal(cashFlowStatementData, index) {
        cashFlowStatementData.closingCash[index].value =
            (Number(cashFlowStatementData.netCashFlow[index].value)
            + Number(cashFlowStatementData.addOpeningBalance[index].value)).toFixed(2);
    }

    differenceCFSTotal(cashFlowStatementData, index) {
        cashFlowStatementData.differenceCFS[index].value =
            (Number(cashFlowStatementData.closingCash[index].value)
            - Number(cashFlowStatementData.closingBalance[index].value)).toFixed(2);
    }
}
