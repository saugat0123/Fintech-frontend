import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {CreditRiskGradingAlpha} from '../../admin/modal/CreditRiskGradingAlpha';
import {CompanyInfo} from '../../admin/modal/company-info';
import {NetWorthOfFirmOrCompanyPointsMap} from '../model/net-worth-of-firm-or-company';
import {SalesProjectionVsAchievementPointsMap} from '../model/sales-projection-vs-achievement';
import {TaxCompliancePointsMap} from '../model/tax-compliance';
import {LandAndBuildingLocationPointsMap} from '../model/land-and-building-location';
import {VehicleSecurityCoveragePointsMap} from '../model/vehicle-security-coverage';
import {SecurityGuaranteePointsMap} from '../model/security-guarantee';
import {BankingRelationshipMap} from '../../admin/modal/banking-relationship';
import {AccountTurnoverMap} from '../../admin/modal/account-turnover';
import {RepaymentHistoryMap} from '../../admin/modal/repayment-history';
import {RegulatoryConcernMap} from '../../admin/modal/regulatory-concern';
import {IndustryGrowthMap} from '../../admin/modal/industryGrowth';
import {MarketCompetitionMap} from '../../admin/modal/marketCompetition';
import {SuccessionMap} from '../../admin/modal/succession';
import {BuyerMap} from '../../admin/modal/buyer';
import {SupplierMap} from '../../admin/modal/supplier';
import {ExperienceMap} from '../../admin/modal/experience';
import {Security} from '../../loan/model/security';
import {LoanTag} from '../../loan/model/loanTag';
import {CustomerInfoData} from '../../loan/model/customerInfoData';

@Component({
  selector: 'app-credit-risk-grading-alpha',
  templateUrl: './credit-risk-grading-alpha.component.html',
  styleUrls: ['./credit-risk-grading-alpha.component.scss']
})
export class CreditRiskGradingAlphaComponent implements OnInit {

  constructor(
      private formBuilder: FormBuilder,
      private el: ElementRef,
  ) {}
  @Input() formData: CreditRiskGradingAlpha;
  @Input() financialData;
  @Input() security: Security;
  @Input() companyInfo: CompanyInfo;
  @Input() customerInfo: CustomerInfoData;
  // @Input() proposedLimit;
  @Input() loanTag: string;

  historicalDataPresent: boolean;

  missingAlerts = [];

  creditRiskGradingForm: FormGroup;
  creditRiskData: CreditRiskGradingAlpha = new CreditRiskGradingAlpha();
  submitted = true;
  financialCurrentYearIndex: number;
  fiscalYearList = [];
  parsedFinancialData: any;
  loanTagEnum = LoanTag;

  totalWorkingCapitalLimit = 0;

  relationshipRiskArray = [
    'bankingRelationship',
    'accountTurnover',
    'repaymentHistory'
  ];
  businessAndIndustryArray = [
    'regulatoryConcern',
    'industryGrowth',
    'marketCompetition',
    'supplier',
    'buyer'
  ];
  securityRiskArray = [
    'FACLocation',
    'securityCoverageVehicle',
    'guarantee',
    'securityCoverageFAC'
  ];
  managementRiskArray = [
    'experience',
    'succession',
  ];
  financialRiskCriteriaArray = [
    'salesToWclLimit',
    'salesGrowth',
    'profitability',
    'currentRatio',
    'workingCapitalCycle',
    'deRatio',
    'iscrAndDscr',
    'salesProjectionVsAchievement',
    'netWorthOfFirmOrCompany',
    'taxCompliance'
  ];

  // Financial points map --
  netWorthOfFirmOrCompanyPointsMap: Map<string, number> =
      NetWorthOfFirmOrCompanyPointsMap.netWorthOfFirmOrCompanyPointsMap;

  salesProjectionVsAchievementPointsMap: Map<string, number> =
      SalesProjectionVsAchievementPointsMap.salesProjectionVsAchievementPointsMap;

  taxCompliancePointsMap: Map<string, number> = TaxCompliancePointsMap.taxCompliancePointsMap;

  // Security points map --
  landAndBuildingLocationPointsMap: Map<string, number> = LandAndBuildingLocationPointsMap.landAndBuildingLocationPointsMap;
  vehicleSecurityCoveragePointsMap: Map<string, number> = VehicleSecurityCoveragePointsMap.vehicleSecurityCoveragePointsMap;
  securityGuaranteePointsMap: Map<string, number> = SecurityGuaranteePointsMap.securityGuaranteePointsMap;

  // Relationship points map --
  bankingRelationshipMap: Map<string, number> = BankingRelationshipMap.bankingRelationshipMap;
  accountTurnoverMap: Map<string, number> = AccountTurnoverMap.accountTurnoverMap;
  repaymentHistoryMap: Map<string, number> = RepaymentHistoryMap.repaymentHistoryMap;

  // Business/Industry risk points map --
  regulatoryConcernMap: Map<string, number> = RegulatoryConcernMap.regulatoryConcernMap;
  industryGrowthMap: Map<string, number> = IndustryGrowthMap.industryGrowthMap;
  marketCompetitionMap: Map<string, number> = MarketCompetitionMap.marketCompetitionMap;
  supplierMap: Map<string, number> = SupplierMap.supplierMap;
  buyerMap: Map<string, number> = BuyerMap.buyerMap;

  // Management risk points map --
  experienceMap: Map<string, number> = ExperienceMap.experienceMap;
  successionMap: Map<string, number> = SuccessionMap.successionMap;

  private static getTopOffset(controlEl: HTMLElement): number {
    const labelOffset = 50;
    return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
  }

  ngOnInit() {
    this.buildForm();
    this.calculateCrgMatrix();
  }

  calculateCrgMatrix() {
    // Calculate risks within company info portion --
    if (!ObjectUtil.isEmpty(this.companyInfo)) {
      const bankingRelationshipParsed = JSON.parse(this.customerInfo.bankingRelationship);
      const businessAndIndustryParsed = JSON.parse(this.companyInfo.businessAndIndustry);
      this.setValueForCriteria('bankingRelationship', bankingRelationshipParsed.bankingRelationship,
          this.bankingRelationshipMap.get(bankingRelationshipParsed.bankingRelationship));
      this.setValueForCriteria('accountTurnover', bankingRelationshipParsed.accountTurnover,
          this.accountTurnoverMap.get(bankingRelationshipParsed.accountTurnover));
      this.setValueForCriteria('repaymentHistory', bankingRelationshipParsed.repaymentHistory,
          this.repaymentHistoryMap.get(bankingRelationshipParsed.repaymentHistory));

      this.setValueForCriteria('regulatoryConcern', businessAndIndustryParsed.regulatoryConcern,
          this.regulatoryConcernMap.get(businessAndIndustryParsed.regulatoryConcern));
      this.setValueForCriteria('supplier', businessAndIndustryParsed.supplier,
          this.supplierMap.get(businessAndIndustryParsed.supplier));
      this.setValueForCriteria('buyer', businessAndIndustryParsed.buyer,
          this.buyerMap.get(businessAndIndustryParsed.buyer));
      this.setValueForCriteria('industryGrowth', this.companyInfo.industryGrowth,
          this.industryGrowthMap.get(this.companyInfo.industryGrowth));
      this.setValueForCriteria('marketCompetition', this.companyInfo.marketCompetition,
          this.marketCompetitionMap.get(this.companyInfo.marketCompetition));

      this.setValueForCriteria('experience', this.companyInfo.experience,
          this.experienceMap.get(this.companyInfo.experience));
      this.setValueForCriteria('succession', this.companyInfo.succession,
          this.successionMap.get(this.companyInfo.succession));
    }
    // Calculate financial risk portion --
    if (!ObjectUtil.isEmpty(this.financialData)) {
      this.parsedFinancialData = JSON.parse(this.financialData);
      this.historicalDataPresent = this.parsedFinancialData.initialForm.historicalDataPresent;
      this.totalWorkingCapitalLimit = Number(this.parsedFinancialData.initialForm.totalWorkingCapitalLimit);
      if (this.parsedFinancialData.fiscalYear.length > 0) {
        this.fiscalYearList = this.parsedFinancialData.fiscalYear;

        if (this.parsedFinancialData.fiscalYear.length > 0) {
          let selectedFiscalYearIndex = Number(this.parsedFinancialData.fiscalYear.length - 1);

          if (!ObjectUtil.isEmpty(this.formData)) {
            const parsedCrgAlphaData = JSON.parse(this.formData.data);
            if (!ObjectUtil.isEmpty(parsedCrgAlphaData.selectedFiscalYearIndex)) {
              selectedFiscalYearIndex = parsedCrgAlphaData.selectedFiscalYearIndex;
            }
          }
          this.reCalculateFinancial(selectedFiscalYearIndex);

        } else {
          this.missingAlerts.push({
            type: 'danger',
            message: 'No Fiscal year detected for grade automation in financial section!',
          });
        }
      } else {
        this.missingAlerts.push({
          type: 'danger',
          message: 'No Financial data detected for grade automation in financial section!',
        });
      }
      this.setValueForCriteria('salesProjectionVsAchievement', this.parsedFinancialData.initialForm.salesProjectionVsAchievement,
          this.salesProjectionVsAchievementPointsMap.get(this.parsedFinancialData.initialForm.salesProjectionVsAchievement));
      this.setValueForCriteria('netWorthOfFirmOrCompany', this.parsedFinancialData.initialForm.netWorthOfFirmOrCompany,
          this.netWorthOfFirmOrCompanyPointsMap.get(this.parsedFinancialData.initialForm.netWorthOfFirmOrCompany));
      this.setValueForCriteria('taxCompliance', this.parsedFinancialData.initialForm.taxCompliance,
          this.taxCompliancePointsMap.get(this.parsedFinancialData.initialForm.taxCompliance));
    } else {
      this.missingAlerts.push({
        type: 'danger',
        message: 'Financial data absent! Please refer financial tab for necessary data entries',
      });
    }
    /*if (ObjectUtil.isEmpty(this.proposedLimit)) {
      this.missingAlerts.push({
        type: 'danger',
        message: 'Proposed limit is missing! Please refer proposal tab for data entry',
      });
    }*/
    // Calculate Security risk portion --
    if (!ObjectUtil.isEmpty(this.security) && !ObjectUtil.isEmpty(this.security.data)) {
      const parsedSecurityData = JSON.parse(this.security.data);
      if (this.loanTag === this.loanTagEnum.GENERAL) {
        this.calculateTotalFMV(parsedSecurityData);
        this.setValueForCriteria('FACLocation', parsedSecurityData.buildingLocation,
            this.landAndBuildingLocationPointsMap.get(parsedSecurityData.buildingLocation));
      } else if (this.loanTag === this.loanTagEnum.VEHICLE) {
        this.setValueForCriteria('securityCoverageVehicle', parsedSecurityData.vehicleSecurityCoverage,
            this.vehicleSecurityCoveragePointsMap.get(parsedSecurityData.vehicleSecurityCoverage));
      }
      this.setValueForCriteria('guarantee', parsedSecurityData.securityGuarantee,
          this.securityGuaranteePointsMap.get(parsedSecurityData.securityGuarantee));
    } else {
      this.missingAlerts.push({
        type: 'danger',
        message: 'Security data absent! Please refer security tab for necessary data entries',
      });
    }
    this.calculateTotalScore();
  }

  reCalculateFinancial(currentFiscalYearIndex) {
    this.financialCurrentYearIndex = currentFiscalYearIndex;
    this.calculateSalesToWclLimit(this.parsedFinancialData, this.financialCurrentYearIndex);
    this.calculateSalesGrowth(this.parsedFinancialData, this.financialCurrentYearIndex);
    this.calculateProfitability(this.parsedFinancialData, this.financialCurrentYearIndex);
    this.calculateCurrentRatio(this.parsedFinancialData, this.financialCurrentYearIndex);
    this.calculateWorkingCapitalCycle(this.parsedFinancialData, this.financialCurrentYearIndex);
    this.calculateDERatio(this.parsedFinancialData, this.financialCurrentYearIndex);
    this.calculateIscrAndDscr(this.parsedFinancialData, this.financialCurrentYearIndex);
  }

  fiscalYearChangeHandler(yearIndex) {
    this.resetFinancialRiskAutoCalc();
    this.reCalculateFinancial(yearIndex);
    this.calculateTotalScore();
  }

  resetFinancialRiskAutoCalc() {
    this.financialRiskCriteriaArray.forEach(v => {
      if (!['salesProjectionVsAchievement',
        'netWorthOfFirmOrCompany',
        'taxCompliance'].includes(v)) {
        this.creditRiskGradingForm.get(v).patchValue({
          parameter: undefined,
          value: undefined,
          automatedValue: undefined
        });
      }
    });
    this.creditRiskGradingForm.get('financialTotal').patchValue(undefined);
  }

  buildForm() {
    this.creditRiskGradingForm = this.formBuilder.group({
      // Relationship risk
      bankingRelationship: this.criteriaFormGroup(),
      accountTurnover: this.criteriaFormGroup(),
      repaymentHistory: this.criteriaFormGroup(),
      relationshipTotal: undefined,
      // Financial Risk
      salesToWclLimit: this.criteriaFormGroup(),
      salesGrowth: this.criteriaFormGroup(),
      profitability: this.criteriaFormGroup(),
      currentRatio: this.criteriaFormGroup(),
      workingCapitalCycle: this.criteriaFormGroup(),
      deRatio: this.criteriaFormGroup(),
      iscrAndDscr: this.criteriaFormGroup(),
      salesProjectionVsAchievement: this.criteriaFormGroup(),
      netWorthOfFirmOrCompany: this.criteriaFormGroup(),
      taxCompliance: this.criteriaFormGroup(),
      financialTotal: undefined,
      // Security Risk
      securityCoverageFAC: this.criteriaFormGroup(),
      FACLocation: this.criteriaFormGroup(),
      securityCoverageVehicle: this.criteriaFormGroup(),
      guarantee: this.criteriaFormGroup(),
      securityTotal: undefined,
      // Business and Industry risk
      regulatoryConcern: this.criteriaFormGroup(),
      industryGrowth: this.criteriaFormGroup(),
      marketCompetition: this.criteriaFormGroup(),
      supplier: this.criteriaFormGroup(),
      buyer: this.criteriaFormGroup(),
      businessAndIndustryTotal: undefined,
      // Management risk
      experience: this.criteriaFormGroup(),
      succession: this.criteriaFormGroup(),
      managementTotal: undefined,
      // Aggregate properties--
      totalScore: undefined,
      creditRiskGrade: undefined,
      creditRiskRating: undefined,
      premium: undefined,
    });
  }

  criteriaFormGroup(): FormGroup {
    return this.formBuilder.group({
      parameter: undefined,
      value: undefined,
      automatedValue: undefined
    });
  }

  setValueForCriteria(criteria, parameter, value, automatedValue?: any) {
    this.creditRiskGradingForm.get(criteria).patchValue({
      parameter: parameter,
      value: value,
      automatedValue: automatedValue
    });
  }

  getDirectSales(financialData) {
    return this.getSubCategory(financialData, 'incomeStatementData', 'totalSalesSubCategory', 'Direct Sales');
  }

  getSubCategory(financialData, financialSection, categoryArrayName, categoryName: string) {
    return (financialData[financialSection][categoryArrayName] as Array<any>).filter(
        singleCategory => singleCategory['name'] === categoryName
    );
  }

  calculateTotalFMV(securityParsedData) {
    let totalFMV = 0;
    securityParsedData.selectedArray.forEach(selectedSecurity => {
      if (selectedSecurity === 'LandSecurity') {
        const landDetailsArray = securityParsedData.initialForm.landDetails as Array<any>;
        for (let i = 0; i < landDetailsArray.length; i++) {
          totalFMV = Number(landDetailsArray[i].marketValue) + totalFMV;
        }
      } else if (selectedSecurity === 'VehicleSecurity') {
        const vehicleDetailsArray = securityParsedData.initialForm.vehicleDetails as Array<any>;
        for (let i = 0; i < vehicleDetailsArray.length; i++) {
          totalFMV = Number(vehicleDetailsArray[i].valuationAmount) + totalFMV;
        }
      } else if (selectedSecurity === 'ApartmentSecurity') {
        const buildingDetailsArray = securityParsedData.initialForm.buildingDetails as Array<any>;
        for (let i = 0; i < buildingDetailsArray.length; i++) {
          totalFMV = Number(buildingDetailsArray[i].buildingFairMarketValue) + totalFMV;
        }
      } else if (selectedSecurity === 'PlantSecurity') {
        const plantDetailsArray = securityParsedData.initialForm.plantDetails as Array<any>;
        for (let i = 0; i < plantDetailsArray.length; i++) {
          totalFMV = Number(plantDetailsArray[i].quotation) + totalFMV;
        }
      } else if (selectedSecurity === 'Land and Building Security') {
        const landBuildingsArray = securityParsedData.initialForm.landBuilding as Array<any>;
        for (let i = 0; i < landBuildingsArray.length; i++) {
          totalFMV = Number(landBuildingsArray[i].marketValue) + totalFMV;
        }
      }
    });
    const securityCoverageFAC = (totalFMV / Number(this.totalWorkingCapitalLimit)) * 100;
    const automatedValue = securityCoverageFAC.toFixed(2);
    if (securityCoverageFAC >= 100) {
      this.setValueForCriteria('securityCoverageFAC', '100% FMV and above', 40.00, automatedValue);
    } else if (securityCoverageFAC <= 99.99 && securityCoverageFAC >= 95) {
      this.setValueForCriteria('securityCoverageFAC', '95% - 99.99% FMV', 35.00, automatedValue);
    } else if (securityCoverageFAC <= 94.99) {
      this.setValueForCriteria('securityCoverageFAC', 'Below 95% FMV', 30.00, automatedValue);
    }
  }

  calculateSalesToWclLimit(financialData, currentFiscalYearIndex) {
    const salesToWclLimit = Number(this.getDirectSales(financialData)[0]['amount'][currentFiscalYearIndex].value) /
        (Number(
            (financialData.balanceSheetData.currentLiabilitiesCategory as Array<any>).filter(
                singleCategory => singleCategory['name'] === 'Short Term Loan'
            )[0]['amount'][currentFiscalYearIndex].value
        ));
    const automatedValue = salesToWclLimit.toFixed(2);
    if (salesToWclLimit > 3) {
      this.setValueForCriteria('salesToWclLimit', 'Above 3 times', 4.50, automatedValue);
    } else if (salesToWclLimit > 2 && salesToWclLimit <= 3) {
      this.setValueForCriteria('salesToWclLimit', 'Between 2 - 3 times', 3.50, automatedValue);
    } else if (salesToWclLimit > 1.5 && salesToWclLimit <= 2) {
      this.setValueForCriteria('salesToWclLimit', 'Between 1.5 - 2 times', 2.50, automatedValue);
    } else if (salesToWclLimit >= 1 && salesToWclLimit <= 1.5) {
      this.setValueForCriteria('salesToWclLimit', 'Between 1 - 1.5 times', 1, automatedValue);
    } else if (salesToWclLimit < 1) {
      this.setValueForCriteria('salesToWclLimit', 'Below 1 times', 0, automatedValue);
    }
  }

  calculateSalesGrowth(financialData, currentFiscalYearIndex) {
    if (currentFiscalYearIndex === 0) {
      this.setValueForCriteria('salesGrowth', 'Initial year (Absence of previous year data)', 0, '--');
    } else {

      /*const salesGrowth = ((Number(this.getDirectSales(financialData)[0]['amount'][currentFiscalYearIndex].value) -
          Number(this.getDirectSales(financialData)[0]['amount'][currentFiscalYearIndex - 1].value)) /
          Number(this.getDirectSales(financialData)[0]['amount'][currentFiscalYearIndex - 1].value)) * 100;*/

      const salesGrowth = Number(financialData.keyIndicatorsData.sales[currentFiscalYearIndex].value);
      const automatedValue = salesGrowth.toFixed(2);
      if (salesGrowth > 15) {
        this.setValueForCriteria('salesGrowth', 'Sales growth above 15%', 3, automatedValue);
      } else if (salesGrowth > 10 && salesGrowth <= 15) {
        this.setValueForCriteria('salesGrowth', 'Sales growth between 10% to 15%', 2.25, automatedValue);
      } else if (salesGrowth >= 5 && salesGrowth <= 10) {
        this.setValueForCriteria('salesGrowth', 'Sales growth between 5% to 10%', 1.50, automatedValue);
      } else if (salesGrowth > 0 && salesGrowth < 5) {
        this.setValueForCriteria('salesGrowth', 'Sales growth below 5%', 0.75, automatedValue);
      } else if (salesGrowth <= 0) {
        this.setValueForCriteria('salesGrowth', 'Declining Sales', 0, automatedValue);
      }
    }
  }

  calculateProfitability(financialData, currentFiscalYearIndex: number) {
    /*const profitability = ((Number(financialData.incomeStatementData.profitAfterTax[currentFiscalYearIndex].value) +
        Number(this.getSubCategory(financialData, 'incomeStatementData', 'operatingExpensesCategory', 'Depreciation')
            [0]['amount'][currentFiscalYearIndex].value)) /
        Number(this.getDirectSales(financialData)[0]['amount'][currentFiscalYearIndex].value)) * 100;
    let netCashFlow = Number(financialData.keyIndicatorsData.cashFlowKI[currentFiscalYearIndex].value);
    if (currentFiscalYearIndex > 0) {
      netCashFlow = Number(financialData.keyIndicatorsData.cashFlowKI[currentFiscalYearIndex].value) -
          Number(financialData.keyIndicatorsData.cashFlowKI[currentFiscalYearIndex - 1].value);
    }*/

    /*const automatedValue = `${profitability.toFixed(2)}, ${netCashFlow.toFixed(2)}`;
    if (profitability >= 5 && netCashFlow > 0) {
      this.setValueForCriteria('profitability', 'Minimum net profit of 5%, increasing cash flow', 3, automatedValue);
    } else if ((profitability >= 2 && profitability < 5) && netCashFlow > 0) {
      this.setValueForCriteria('profitability', 'Minimum net profit of 2%, increasing cash flow', 2.25, automatedValue);
    } else if ((profitability > 0 && profitability < 2) && netCashFlow > 0) {
      this.setValueForCriteria('profitability', 'Growing net profit and cash flow', 1.50, automatedValue);
    } else if (profitability <= 0 && netCashFlow <= 0) {
      this.setValueForCriteria('profitability', 'Net loss/ negative cash flow', 0, automatedValue);
    } else {
      this.setValueForCriteria('profitability', 'Net loss/ negative cash flow', 0, automatedValue);
    }*/

    const profitability = Number(financialData.keyIndicatorsData.netProfitMargin[currentFiscalYearIndex].value);
    const automatedValue = `${profitability.toFixed(2)}`;

    if (profitability >= 5) {
      this.setValueForCriteria('profitability', 'Minimum net profit margin of 5% and higher', 3, automatedValue);
    } else if (profitability >= 2 && profitability < 5) {
      this.setValueForCriteria('profitability', 'Minimum net profit margin 2% to 5%', 2.25, automatedValue);
    } else if (profitability >= 1 && profitability < 2) {
      this.setValueForCriteria('profitability', 'Minimum net profit margin 1% to 2%', 1.50, automatedValue);
    } else if (profitability < 1 && profitability > 0) {
      this.setValueForCriteria('profitability', 'Net profit margin below 1%', 0.75, automatedValue);
    } else {
      this.setValueForCriteria('profitability', 'Net loss', 0, automatedValue);
    }
  }

  calculateCurrentRatio(financialData, currentFiscalYearIndex) {
    const currentRatio = Number(financialData.balanceSheetData.currentAssets[currentFiscalYearIndex].value) /
        Number(financialData.balanceSheetData.currentLiabilities[currentFiscalYearIndex].value);
    const automatedValue = currentRatio.toFixed(2);
    if (currentRatio >= 2.50) {
      this.setValueForCriteria('currentRatio', 'Current ratio minimum 2.5 times', 3, automatedValue);
    } else if (currentRatio >= 2.25 && currentRatio < 2.50) {
      this.setValueForCriteria('currentRatio', 'Current ratio minimum 2.25 times', 2.25, automatedValue);
    } else if (currentRatio >= 2 && currentRatio < 2.25) {
      this.setValueForCriteria('currentRatio', 'Current ratio minimum 2 times', 1.50, automatedValue);
    } else if (currentRatio >= 1.5 && currentRatio < 2) {
      this.setValueForCriteria('currentRatio', 'Current ratio minimum 1.5 times / Improving projection', 0.75, automatedValue);
    } else if (currentRatio < 1.5) {
      this.setValueForCriteria('currentRatio', 'Current ratio below 1.5 times', 0, automatedValue);
    }
  }

  calculateWorkingCapitalCycle(financialData, currentFiscalYearIndex) {
    /** Calculation scheme used in the past **/
    /*const workingCapitalCycle = ((Number(financialData.balanceSheetData.currentAssets[currentFiscalYearIndex].value) -
        Number(financialData.balanceSheetData.currentLiabilities[currentFiscalYearIndex].value)) * 365) /
        Number(this.getDirectSales(financialData)[0]['amount'][currentFiscalYearIndex].value);

    const receivableCollectionPeriod = (Number(
        (financialData.balanceSheetData.currentAssetsCategory as Array<any>).filter(
            singleCategory => singleCategory['name'] === 'Account Receivable'
        )[0]['amount'][currentFiscalYearIndex].value
    ) / Number(this.getDirectSales(financialData)[0]['amount'][currentFiscalYearIndex].value)) * 365;*/

    const workingCapitalCycle = Number(financialData.keyIndicatorsData.netOperatingCycle[currentFiscalYearIndex].value);

    /*const receivableCollectionPeriod = Number(financialData.keyIndicatorsData.averageCollectionPeriod[currentFiscalYearIndex].value);
    const automatedValue = `${workingCapitalCycle.toFixed(2)}, ${receivableCollectionPeriod.toFixed(2)}`;*/

    const automatedValue = `${workingCapitalCycle.toFixed(2)}`;

    /*if (workingCapitalCycle < 120 && receivableCollectionPeriod < 60) {
      this.setValueForCriteria('workingCapitalCycle',
          'Working capital cycle below 120 days with receivable collection period below 60 days', 3, automatedValue);
    } else if ((workingCapitalCycle >= 120 && workingCapitalCycle <= 150)
        && (receivableCollectionPeriod >= 60 && receivableCollectionPeriod < 90)) {
      this.setValueForCriteria('workingCapitalCycle',
          'Working capital cycle below 150 days with receivable collection period below 90 days', 2.25, automatedValue);
    } else if (workingCapitalCycle > 150 && workingCapitalCycle <= 180) {
      this.setValueForCriteria('workingCapitalCycle',
          'Working capital cycle above 150 days  to 180 days / Improving projection', 1.50, automatedValue);
    } else if (workingCapitalCycle > 180) {
      this.setValueForCriteria('workingCapitalCycle', 'Working capital cycle above 180 days', 0.75, automatedValue);
    } else {
      this.setValueForCriteria('workingCapitalCycle', 'Default', 0.75, automatedValue);
    }*/

    if (workingCapitalCycle < 120) {
      this.setValueForCriteria('workingCapitalCycle', 'Working capital cycle below 120 days', 3, automatedValue);
    } else if (workingCapitalCycle >= 120 && workingCapitalCycle <= 150) {
      this.setValueForCriteria('workingCapitalCycle', 'Working capital cycle below 150 days', 2.25, automatedValue);
    } else if (workingCapitalCycle > 150 && workingCapitalCycle <= 180) {
      this.setValueForCriteria('workingCapitalCycle', 'Working capital cycle above 150 days', 1.50, automatedValue);
    } else if (workingCapitalCycle > 180) {
      this.setValueForCriteria('workingCapitalCycle', 'Working capital cycle above 180 days', 0.75, automatedValue);
    } else {
      this.setValueForCriteria('workingCapitalCycle', 'Default', 0.75, automatedValue);
    }
  }

  calculateDERatio(financialData, currentFiscalYearIndex) {
    const deRatio = Number(financialData.keyIndicatorsData.debtEquityRatioOverall[currentFiscalYearIndex].value);
    const automatedValue = deRatio.toFixed(2);
    if (!this.historicalDataPresent) {
      this.setValueForCriteria('deRatio',
          'Overall DE ratio above 80% / mismatch in DE / Fully projection based / no historical data ', 0, automatedValue);
    } else if (deRatio <= 50) {
      this.setValueForCriteria('deRatio', 'Overall DE ratio  at 50% or below', 3, automatedValue);
    } else if (deRatio > 50 && deRatio < 60) {
      this.setValueForCriteria('deRatio', 'Overall DE ratio  below 60%', 2.25, automatedValue);
    } else if (deRatio >= 60 && deRatio < 70) {
      this.setValueForCriteria('deRatio', 'Overall DE ratio  below 70%', 1.50, automatedValue);
    } else if (deRatio >= 70 && deRatio <= 80 ) {
      this.setValueForCriteria('deRatio', 'Overall DE ratio  below 80% / Improving projection', 0.75, automatedValue);
    } else if (deRatio > 80) {
      this.setValueForCriteria('deRatio',
          'Overall DE ratio above 80% / mismatch in DE / Fully projection based / no historical data ', 0, automatedValue);
    }
  }

  calculateIscrAndDscr(financialData, currentFiscalYearIndex) {
    const iscr = Number(financialData.keyIndicatorsData.interestCoverageRatio[currentFiscalYearIndex].value);
    const dscr = Number(financialData.keyIndicatorsData.debtServiceCoverageRatio[currentFiscalYearIndex].value);

    const automatedValue = `${iscr.toFixed(2)}, ${dscr.toFixed(2)}`;

    const setThreeScore = () => {
      return this.setValueForCriteria('iscrAndDscr', 'ISCR and DSCR above 2.5 times', 3, automatedValue);
    };
    const setTwoAndQuarterScore = () => {
      return this.setValueForCriteria('iscrAndDscr', 'ISCR and DSCR above 2 times', 2.25, automatedValue);
    };
    const setOneAndHalfScore = () => {
      return this.setValueForCriteria('iscrAndDscr', 'ISCR and DSCR above 1.5 times / Improving projection', 1.50, automatedValue);
    };
    const setHalfAndQuarterScore = () => {
      return this.setValueForCriteria('iscrAndDscr', 'ISCR and DSCR above 1.25 times', 0.75, automatedValue);
    };
    const setZeroScore = () => {
      return this.setValueForCriteria('iscrAndDscr', 'ISCR and DSCR above 1.00 times', 0, automatedValue);
    };
    if (iscr >= 2.5 && dscr >= 2.5) {
      setThreeScore();
    } else if ((iscr < 2.5 && iscr >= 2) || (dscr < 2.5 && dscr >= 2)) {
      if ((iscr < 2.5 && iscr >= 2) && iscr <= dscr) {
        setTwoAndQuarterScore();
      } else if ((dscr < 2.5 && dscr >= 2) && dscr <= iscr) {
        setTwoAndQuarterScore();
      }
    } else if ((iscr < 2 && iscr >= 1.5) || (dscr < 2 && dscr >= 1.5)) {
      if ((iscr < 2 && iscr >= 1.5) && iscr <= dscr) {
        setOneAndHalfScore();
      } else if ((dscr < 2 && dscr >= 1.5) && dscr <= iscr) {
        setOneAndHalfScore();
      }
    } else if ((iscr < 1.5 && iscr >= 1.25) || (dscr < 1.5 && dscr >= 1.25)) {
      if ((iscr < 1.5 && iscr >= 1.25) && iscr <= dscr) {
        setHalfAndQuarterScore();
      } else if ((dscr < 1.5 && dscr >= 1.25) && dscr <= iscr) {
        setHalfAndQuarterScore();
      }
    } else if ((iscr < 1.25 && iscr >= 1) || (dscr < 1.25 && dscr >= 1)) {
      if ((iscr < 1.25 && iscr >= 1) && iscr <= dscr) {
        setZeroScore();
      } else if ((dscr < 1.25 && dscr >= 1) && dscr <= iscr) {
        setZeroScore();
      }
    } else {
      setZeroScore();
    }
  }

  calculateTotalScore() {
    let total = 0;
    total = total + this.calculateRelationshipRiskTotal();
    total = total + this.calculateBusinessAndIndustryRiskTotal();
    total = total + this.calculateManagementRiskTotal();
    total = total + this.calculateSecurityRiskTotal();
    total = total + this.calculateTotalForFinancialRisk();
    this.creditRiskGradingForm.get('totalScore').patchValue(total.toFixed(2));
    if (total >= 80) {
      this.creditRiskGradingForm.get('creditRiskGrade').patchValue('Excellent');
      this.creditRiskGradingForm.get('creditRiskRating').patchValue('Low risk');
      this.creditRiskGradingForm.get('premium').patchValue('2%');
    } else if (total >= 70 && total < 80) {
      this.creditRiskGradingForm.get('creditRiskGrade').patchValue('Very Good');
      this.creditRiskGradingForm.get('creditRiskRating').patchValue('Average risk');
      this.creditRiskGradingForm.get('premium').patchValue('2.5%');
    } else if (total >= 60 && total < 70) {
      this.creditRiskGradingForm.get('creditRiskGrade').patchValue('Good');
      this.creditRiskGradingForm.get('creditRiskRating').patchValue('Moderate Risk');
      this.creditRiskGradingForm.get('premium').patchValue('3%');
    } else if (total >= 50 && total < 60) {
      this.creditRiskGradingForm.get('creditRiskGrade').patchValue('Satisfactory');
      this.creditRiskGradingForm.get('creditRiskRating').patchValue('Tolerable risk');
      this.creditRiskGradingForm.get('premium').patchValue('3.5%');
    } else if (total >= 40 && total < 50) {
      this.creditRiskGradingForm.get('creditRiskGrade').patchValue('Acceptable');
      this.creditRiskGradingForm.get('creditRiskRating').patchValue('High risk');
      this.creditRiskGradingForm.get('premium').patchValue('4%');
    } else if (total < 40) {
      this.creditRiskGradingForm.get('creditRiskGrade').patchValue('Reject');
      this.creditRiskGradingForm.get('creditRiskRating').patchValue('NA');
      this.creditRiskGradingForm.get('premium').patchValue('NA');
    }
  }

  calculateRelationshipRiskTotal(): number {
    let total = 0;
    this.relationshipRiskArray.forEach(singleCriteria => {
      total = Number(this.creditRiskGradingForm.get(singleCriteria).get('value').value) + total;
    });
    this.creditRiskGradingForm.get('relationshipTotal').patchValue(total.toFixed(2));
    return total;
  }

  calculateBusinessAndIndustryRiskTotal(): number {
    let total = 0;
    this.businessAndIndustryArray.forEach(singleCriteria => {
      total = Number(this.creditRiskGradingForm.get(singleCriteria).get('value').value) + total;
    });
    this.creditRiskGradingForm.get('businessAndIndustryTotal').patchValue(total.toFixed(2));
    return total;
  }

  calculateManagementRiskTotal(): number {
    let total = 0;
    this.managementRiskArray.forEach(singleCriteria => {
      total = Number(this.creditRiskGradingForm.get(singleCriteria).get('value').value) + total;
    });
    this.creditRiskGradingForm.get('managementTotal').patchValue(total.toFixed(2));
    return total;
  }

  calculateSecurityRiskTotal(): number {
    let total = 0;
    this.securityRiskArray.forEach(singleCriteria => {
      total = Number(this.creditRiskGradingForm.get(singleCriteria).get('value').value) + total;
    });
    this.creditRiskGradingForm.get('securityTotal').patchValue(total.toFixed(2));
    return total;
  }

  calculateTotalForFinancialRisk(): number {
    let total = 0;
    this.financialRiskCriteriaArray.forEach(singleCriteria => {
      total = Number(this.creditRiskGradingForm.get(singleCriteria).get('value').value) + total;
    });
    if (!this.historicalDataPresent) {
      total = 0.15 * total;
    }
    this.creditRiskGradingForm.get('financialTotal').patchValue(total.toFixed(2));
    return total;
  }

  close(alert) {
    this.missingAlerts.splice(this.missingAlerts.indexOf(alert), 1);
  }

  scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
        'form .ng-invalid'
    );
    window.scroll({
      top: CreditRiskGradingAlphaComponent.getTopOffset(firstInvalidControl),
      left: 0,
      behavior: 'smooth'
    });
    firstInvalidControl.focus();
  }

  onSubmit() {
    this.submitted = true;
    if (this.creditRiskGradingForm.invalid) {
      this.scrollToFirstInvalidControl();
      return;
    }

    if (!ObjectUtil.isEmpty(this.formData)) {
      this.creditRiskData = this.formData;
    }

    this.creditRiskData.data = JSON.stringify({
      ...this.creditRiskGradingForm.value,
      currentFiscalYear: this.fiscalYearList[this.financialCurrentYearIndex],
      selectedFiscalYearIndex: this.financialCurrentYearIndex
    });
  }
}
