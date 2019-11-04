import {Component, Input, OnInit} from '@angular/core';
import {Financial} from '../../../model/financial';
import {FinancialService} from '../../loan-main-template/financial/financial.service';

@Component({
  selector: 'app-financial-summary',
  templateUrl: './financial-summary.component.html',
  styleUrls: ['./financial-summary.component.scss']
})
export class FinancialSummaryComponent implements OnInit {
  @Input() formData: Financial;

  financialData: Object;

  // Additional Summary Fields---
  totalDebtValueArray = [];
  debtServiceCostArray = [];

  constructor(private financialService: FinancialService) { }

  ngOnInit() {
    if (this.formData !== undefined) {
      this.financialData = JSON.parse(this.formData.data);
      this.setTotalDebtValue();
      this.setDebtServiceCost();
    }
  }

  accountReceivableArray() {
    return this.financialData['balanceSheetData'].currentAssetsCategory[3].amount;
  }

  setTotalDebtValue() {
    this.financialData['fiscalYear'].forEach( (value, index) => {
      const totalDebtValue = (Number(this.financialService.fetchValuesForJsonSubCategories(this.financialData['balanceSheetData'].currentLiabilitiesCategory,
          'Short Term Loan', index)) +
          Number(this.financialService.fetchValuesForJsonSubCategories(this.financialData['balanceSheetData'].longTermLoanCategory,
              'Term Loan', index)));
      this.totalDebtValueArray.push(totalDebtValue);
    });
  }

  setDebtServiceCost() {
    this.financialData['fiscalYear'].forEach( (value, index) => {
      if (index > 0) {
        this.debtServiceCostArray.push(Number(this.financialData['incomeStatementData'].interestExpenses[index].value +
            Number(this.financialData['balanceSheetData'].longTermLoan[index-1].value) -
            Number(this.financialData['balanceSheetData'].longTermLoan[index].value))
        );
      } else {
        this.debtServiceCostArray.push(Number(this.financialData['incomeStatementData'].interestExpenses[index].value));
      }
    });
  }
}
