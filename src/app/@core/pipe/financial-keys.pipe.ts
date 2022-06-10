import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'financialPipe'
})
export class FinancialKeysPipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        if (value === 'balanceSheetData') {
            return 'Balance Sheet';
        } else  if (value === 'executiveSummaryData') {
            return 'Executive Summary';
        }  else  if (value === 'plAccountData') {
            return 'PL Account';
        }  else  if (value === 'commonSizePlData') {
            return 'Common Size PL';
        }  else  if (value === 'cashFlowData') {
            return 'Detail CF';
        } else  if (value === 'commonSizeBs') {
            return 'Common Size BS';
        } else  if (value === 'quickCashFlow') {
            return 'Quick Cash Flow';
        } else {
            return value;
        }
    }
}
