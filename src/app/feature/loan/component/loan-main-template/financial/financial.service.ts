import {Injectable} from '@angular/core';

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
                year: yearValue
            }
        );
    }

    addFiscalYearForJsonCategory(headingCategoryProperty: Array<any>, yearValue) {
        headingCategoryProperty.forEach(subCategory => {
            const amount = subCategory['amount'] as Array<any>;
            amount.push(
                {
                    value: 0,
                    year: yearValue
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
}
