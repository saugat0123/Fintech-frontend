import {Component, Input, OnInit} from '@angular/core';
import {Financial} from '../../../model/financial';
import {FinancialService} from '../../../../loan-information-template/financial/financial.service';
import {environment} from '../../../../../../environments/environment';
import {Clients} from '../../../../../../environments/Clients';
import {SummaryType} from '../../SummaryType';

@Component({
  selector: 'app-financial-summary',
  templateUrl: './financial-summary.component.html',
  styleUrls: ['./financial-summary.component.scss']
})
export class FinancialSummaryComponent implements OnInit {
  @Input() formData: Financial;
  @Input() loanType: any;

  financialData: any;

  isBusinessLoan = false;
  activateOldFinancialSummary = false;

  // Additional Summary Fields---
  totalDebtValueArray = [];
  debtServiceCostArray = [];

  // Fiscal years for Drawing power calculation (projected years)--
  projectedYearsMap: Map<number, string> = new Map<number, string>();

  // Working capital Drawing calculation arrays--
  stockArray = [];
  debtorsArray = [];
  totalCurrentAssetArray = [];
  creditorsArray = [];
  ntcaArray = [];
  drawingPowerArray = [];
  loanLimitArray = [];
  loanToNtcaArray = [];

  // Term Loan Drawing Power Calculation--
  totalFixedAssetsArray = [];
  termDrawingPowerArray = [];
  termLoanTLArray = [];
  termLoanDPC = [];
  auditorList = [];

  // Client Name
  client = environment.client;
  clientName = Clients;
  @Input() count;
  summaryType = environment.summaryType;
  summaryTypeName = SummaryType;

  constructor(private financialService: FinancialService) { }

  ngOnInit() {
    if (this.loanType === 'INSTITUTION') {
      this.isBusinessLoan = true;
    }
    if (this.formData !== undefined) {
      this.financialData = JSON.parse(this.formData.data);
      if (this.isBusinessLoan) {
        this.setTotalDebtValue();
        this.setDebtServiceCost();

        // Drawing power calculation projected years only--
        this.financialData.fiscalYear.forEach( (singleYear, i) => {
          if (singleYear.toUpperCase().includes('PROJECTED')) {
            this.projectedYearsMap.set(i, singleYear);
          }
        });

        // Working Capital Loan Drawing power calculation---
        this.getStockForDPC();
        this.getAccountRecievableDPC();
        this.getTotalCurrentAssetDPC();
        this.getCreditorsForDPC();
        this.getNtcaDPC();
        this.getDrawingPowerWCP();
        this.getLoanLimit();
        this.getLoanToNtca();

        // Term Loan Drawing power calculation---
        this.getTotalFixedAssets();
        this.getDPTermLoan();
        this.getTermLoan();
        this.getDPCalculationTermLoan();
        this.auditorList = this.financialData.auditorList;
      }
    }
  }

  accountReceivableArray() {
    return this.financialData['balanceSheetData'].currentAssetsCategory[3].amount;
  }

  setTotalDebtValue() {
    this.financialData['fiscalYear'].forEach( (value, index) => {
      const totalDebtValue = (Number(this.financialService.fetchValuesForJsonSubCategories(
          this.financialData['balanceSheetData'].currentLiabilitiesCategory,
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
            Number(this.financialData['balanceSheetData'].longTermLoan[index - 1].value) -
            Number(this.financialData['balanceSheetData'].longTermLoan[index].value))
        );
      } else {
        this.debtServiceCostArray.push(Number(this.financialData['incomeStatementData'].interestExpenses[index].value));
      }
    });
  }

  getAccountRecievableDPC() {
    this.projectedYearsMap.forEach( (value, key) => {
      this.debtorsArray.push(
          this.financialService.fetchValuesForJsonSubCategories(this.financialData['balanceSheetData'].currentAssetsCategory,
          'Account Receivable', key));
    });
  }

  getStockForDPC() {
    this.projectedYearsMap.forEach( (value, key) => {
      this.stockArray.push(this.financialData.balanceSheetData.inventories[key].value);
    });
  }

  getTotalCurrentAssetDPC() {
    this.projectedYearsMap.forEach( (value, key) => {
      this.totalCurrentAssetArray.push(
          Number(this.financialService.fetchValuesForJsonSubCategories(this.financialData['balanceSheetData'].currentAssetsCategory,
          'Account Receivable', key)) - Number(this.financialData.balanceSheetData.inventories[key].value));
    });
  }

  getCreditorsForDPC() {
    this.projectedYearsMap.forEach( (value, key) => {
      this.creditorsArray.push(
          this.financialService.fetchValuesForJsonSubCategories(this.financialData['balanceSheetData'].currentLiabilitiesCategory,
          'Creditors', key));
    });
  }

  getNtcaDPC() {
    this.projectedYearsMap.forEach( (value, key) => {
      this.ntcaArray.push(
          Number(this.financialService.fetchValuesForJsonSubCategories(this.financialData['balanceSheetData'].currentAssetsCategory,
          'Account Receivable', key)) + Number(this.financialData.balanceSheetData.inventories[key].value) -
      Number(this.financialService.fetchValuesForJsonSubCategories(this.financialData['balanceSheetData'].currentLiabilitiesCategory,
          'Creditors', key)));
    });
  }

  getDrawingPowerWCP() {
    this.projectedYearsMap.forEach( (value, key) => {
      this.drawingPowerArray.push(
          (0.9 * (Number(this.financialService.fetchValuesForJsonSubCategories(this.financialData['balanceSheetData'].currentAssetsCategory,
          'Account Receivable', key)) + Number(this.financialData.balanceSheetData.inventories[key].value) -
          Number(this.financialService.fetchValuesForJsonSubCategories(this.financialData['balanceSheetData'].currentLiabilitiesCategory,
              'Creditors', key)))).toFixed(2));
    });
  }

  getLoanLimit() {
    this.projectedYearsMap.forEach( (value, key) => {
      this.loanLimitArray.push(Number(this.financialService.fetchValuesForJsonSubCategories(
          this.financialData['balanceSheetData'].currentLiabilitiesCategory,
          'Short Term Loan', key)));
    });
  }

  getLoanToNtca() {
    this.projectedYearsMap.forEach( (value, key) => {
      this.loanToNtcaArray.push((Number(this.financialService.fetchValuesForJsonSubCategories(
          this.financialData['balanceSheetData'].currentLiabilitiesCategory,
          'Short Term Loan', key)) /
          ((Number(this.financialService.fetchValuesForJsonSubCategories(this.financialData['balanceSheetData'].currentAssetsCategory,
          'Account Receivable', key)) + Number(this.financialData.balanceSheetData.inventories[key].value) -
          Number(this.financialService.fetchValuesForJsonSubCategories(this.financialData['balanceSheetData'].currentLiabilitiesCategory,
              'Creditors', key))) * 100)));
    });
  }

  getTotalFixedAssets() {
    this.projectedYearsMap.forEach( (value, key) => {
      this.totalFixedAssetsArray.push(Number(this.financialData.balanceSheetData.fixedAssets[key].value));
    });
  }

  getDPTermLoan() {
    this.projectedYearsMap.forEach( (value, key) => {
      this.termDrawingPowerArray.push((0.8 * Number(this.financialData.balanceSheetData.fixedAssets[key].value)).toFixed(2));
    });
  }

  getTermLoan() {
    this.projectedYearsMap.forEach( (value, key) => {
      this.termLoanTLArray.push(
          Number(this.financialService.fetchValuesForJsonSubCategories(this.financialData['balanceSheetData'].longTermLoanCategory,
          'Term Loan', key)));
    });
  }

  getDPCalculationTermLoan() {
    this.projectedYearsMap.forEach( (value, key) => {
      this.termLoanDPC.push(
          (100 * (Number(this.financialService.fetchValuesForJsonSubCategories(this.financialData['balanceSheetData'].longTermLoanCategory,
          'Term Loan', key)) / Number(this.financialData.balanceSheetData.fixedAssets[key].value))).toFixed(2));
    });
  }
}
