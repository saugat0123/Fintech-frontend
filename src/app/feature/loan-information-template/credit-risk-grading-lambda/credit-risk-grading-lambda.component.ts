import {Component, Input, OnInit} from '@angular/core';
import {Security} from '../../loan/model/security';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BankingRelationshipIndividualMap} from '../../admin/modal/banking-relationship';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {CreditRiskGradingLambda} from '../../admin/modal/CreditRiskGradingLambda';
import {Customer} from '../../admin/modal/customer';
import {FacCategoryMap} from '../../admin/modal/crg/fac-category';
import {RoadAccessMap} from '../../admin/modal/crg/RoadAccess';
import {MajorSourceIncomeMap} from '../../admin/modal/crg/major-source-income-type';
import {RepaymentTrackCurrentBankMap} from '../../admin/modal/crg/RepaymentTrackCurrentBank';
import {RepaymentTrackMap} from '../../admin/modal/crg/RepaymentTrack';
import {CiclArray} from '../../admin/modal/cicl';
import {IncomeFromAccount} from '../../admin/modal/incomeFromAccount';
import {DocStatus} from '../../loan/model/docStatus';
import {LoanFormService} from '../../loan/component/loan-form/service/loan-form.service';
import {CalculationUtil} from '../../../@core/utils/CalculationUtil';
import {LoanDataKey} from '../../../@core/utils/constants/loan-data-key';

@Component({
  selector: 'app-credit-risk-grading-lambda',
  templateUrl: './credit-risk-grading-lambda.component.html',
  styleUrls: ['./credit-risk-grading-lambda.component.scss']
})
export class CreditRiskGradingLambdaComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
              private customerLoanService: LoanFormService) { }

  @Input() formData: CreditRiskGradingLambda;
  @Input() financialData;
  @Input() security: Security;
  @Input() customer: Customer;
  @Input() customerInfoData: CustomerInfoData;
  @Input() ciCl: CiclArray;
  @Input() incomeFromAccount: IncomeFromAccount;
  @Input() proposedLimit;
  @Input() fromSummery = false;

  missingAlerts = [];

  creditRiskGradingForm: FormGroup;
  creditRiskData: CreditRiskGradingLambda = new CreditRiskGradingLambda();
  parsedFinancialData: any;

  repaymentRiskArray = [
    'typeOfSourceOfIncome',
    'multipleSourceOfIncome',
    'periodOfEarningOrEmployment',
    'incomeRoutingThroughBank',
    'totalGrossMonthlyIncomeOrTotalGrossMonthlyExpenses',
    'alternateOrSecondarySourceOfIncome',
  ];
  relationshipRiskArray = [
    'bankingRelationship',
    'repaymentHistory'
  ];
  securityRiskArray = [
    'locationOfProperty',
    'roadAccess',
    'netWorth',
    'securityCoverage'
  ];
  exposureRiskArray = [
    'multibanking',
    'repaymentTrackInOtherBfIs',
  ];

  customerGroupLoanList = [];

  // Security points map --
  locationOfPropertyMap: Map<string, number> = FacCategoryMap.facCategoryMap;
  roadAccessMap: Map<string, number> = RoadAccessMap.roadAccessMap;

  // Relationship points map --
  bankingRelationshipMap: Map<string, number> = BankingRelationshipIndividualMap.bankingRelationshipMap;
  repaymentHistoryMap: Map<string, number> = RepaymentTrackCurrentBankMap.repaymentTrackCurrentBankMap;

  // Repayment risk points map --
  multipleSourceOfIncomeMap: Map<string, number> = MajorSourceIncomeMap.majorSourceIncomeMap;

  // Exposure risk points map --
  repaymentTrackInOtherBfIs: Map<string, number> = RepaymentTrackMap.repaymentTrackMap;

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.financialData)) {
      this.parsedFinancialData = JSON.parse(this.financialData);
      this.setValueForCriteria('typeOfSourceOfIncome', null, this.parsedFinancialData.initialForm.typeOfSourceOfIncomeObtainedScore);
      this.setValueForCriteria('multipleSourceOfIncome', this.parsedFinancialData.initialForm.majorSourceIncomeType,
          this.multipleSourceOfIncomeMap.get(this.parsedFinancialData.initialForm.majorSourceIncomeType));
      this.calculatePeriodOfEarningOrEmployment(this.parsedFinancialData.initialForm.periodOfEarning);
      this.calculateIncomeRoutingThroughBank();
      this.calculateTotalGrossMonthlyIncomeOrTotalGrossMonthlyExpenses(this.parsedFinancialData.initialForm.totalNetMonthlyIncome);
      this.calculateAlternateOrSecondarySourceOfIncome();
    } else {
      this.missingAlerts.push({
        type: 'danger',
        message: 'No Fiscal year data detected for grade automation in financial section!',
      });
    }

    if (!ObjectUtil.isEmpty(this.security)) {
      const parsedSecurityData = JSON.parse(this.security.data);
      this.calculateSecurityCoverage();
      this.calculateNetWorth();
      this.setValueForCriteria('locationOfProperty', parsedSecurityData.facCategory,
          this.locationOfPropertyMap.get(parsedSecurityData.facCategory));
      this.setValueForCriteria('roadAccess', parsedSecurityData.roadAccessOfPrimaryProperty,
          this.roadAccessMap.get(parsedSecurityData.roadAccessOfPrimaryProperty));
    } else {
      this.missingAlerts.push({
        type: 'danger',
        message: 'No Security data detected for grade automation in security section!',
      });
    }

    if (!ObjectUtil.isEmpty(this.customer)) {
      this.setValueForCriteria('bankingRelationship', JSON.parse(this.customerInfoData.bankingRelationship),
          this.bankingRelationshipMap.get(JSON.parse(this.customerInfoData.bankingRelationship)));
    } else {
      this.missingAlerts.push({
        type: 'danger',
        message: 'No Customer data detected for grade automation!',
      });
    }

    if (!ObjectUtil.isEmpty(this.incomeFromAccount)) {
      const incomeFromAccountParsed = JSON.parse(this.incomeFromAccount.data);
      if (!incomeFromAccountParsed.newCustomerChecked) {
        this.setValueForCriteria('repaymentHistory', incomeFromAccountParsed.accountTransactionForm.repaymentTrackWithCurrentBank,
            this.repaymentHistoryMap.get(incomeFromAccountParsed.accountTransactionForm.repaymentTrackWithCurrentBank));
      }
    } else {
      this.missingAlerts.push({
        type: 'danger',
        message: 'No data detected for grade automation in Income From Account section!',
      });
    }

    if (!ObjectUtil.isEmpty(this.ciCl)) {
      const ciClParsed = JSON.parse(this.ciCl.data);
      this.calculateMultibanking(ciClParsed);
      this.setValueForCriteria('repaymentTrackInOtherBfIs', this.ciCl.repaymentTrack,
          this.repaymentTrackInOtherBfIs.get(this.ciCl.repaymentTrack));
    } else {
      this.missingAlerts.push({
        type: 'danger',
        message: 'No data detected for grade automation in CICL section!',
      });
    }

    this.calculateTotalScore();
  }

  calculateMultibanking(ciClParsed) {
    const conditionValue = CalculationUtil.calculateTotalFromList(LoanDataKey.OUTSTANDING_AMOUNT, ciClParsed);
    const automatedValue = conditionValue.toFixed(2);
    if (conditionValue > 10000000) {
      this.setValueForCriteria('multibanking', 'Above 10 Million', 1.25, automatedValue);
    } else if (conditionValue > 7500000 && conditionValue <= 10000000) {
      this.setValueForCriteria('multibanking', 'Above NPR 7.5 Million to NPR 10 Million', 1.50, automatedValue);
    } else if (conditionValue > 5000000 && conditionValue <= 7500000) {
      this.setValueForCriteria('multibanking', 'Above NPR 5 Million to NPR 7.5 Million', 1.88, automatedValue);
    } else if (conditionValue > 2500000 && conditionValue <= 5000000) {
      this.setValueForCriteria('multibanking', 'Above NPR 2.5 Million to NPR 5 Million', 2.25, automatedValue);
    } else if (conditionValue === 2500000) {
      this.setValueForCriteria('multibanking', 'Loan upto NPR 2.5 Million', 2.50, automatedValue);
    } else {
      this.setValueForCriteria('multibanking', 'Not applicable ', 2.50, automatedValue);
    }
  }

  calculateNetWorth() {
    const conditionValue = Number(this.customer.netWorth) / Number(this.security.totalSecurityAmount);
    const automatedValue = conditionValue.toFixed(2);
    if (conditionValue > 2) {
      this.setValueForCriteria('netWorth', 'Above 2 times of FAC', 3, automatedValue);
    } else if (conditionValue >= 1.5 && conditionValue <= 2) {
      this.setValueForCriteria('netWorth', 'Between 1.5 to 2 times', 2.25, automatedValue);
    } else if (conditionValue >= 1 && conditionValue < 1.5) {
      this.setValueForCriteria('netWorth', 'Equals to FAC', 1.50, automatedValue);
    } else if (conditionValue < 1) {
      this.setValueForCriteria('netWorth', 'Lower than FAC', 0, automatedValue);
    }
  }

  calculateSecurityCoverage() {
    let proposedLimitTotal = 0;
    let approvalLimitTotal = 0;
    this.customerLoanService.getLoansByLoanHolderId(this.customerInfoData.id).subscribe((res: any) => {
      this.customerGroupLoanList = res.detail;
      this.customerGroupLoanList.forEach(l => {
        if (l.proposal) {
          if (l.documentStatus.toString() === DocStatus.value(DocStatus.APPROVED)) {
            approvalLimitTotal += l.proposal.proposedLimit;
          } else {
            proposedLimitTotal += l.proposal.proposedLimit;
          }
        }
      });
    });
    const conditionValue = (Number(this.security.totalSecurityAmount) / Number(proposedLimitTotal) + Number(approvalLimitTotal)) * 100;
    const automatedValue = conditionValue.toFixed(2);
    if (conditionValue > 200) {
      this.setValueForCriteria('securityCoverage', 'Above 200%', 21, automatedValue);
    } else if (conditionValue > 150 && conditionValue <= 200) {
      this.setValueForCriteria('securityCoverage', '151% to 200%', 16.80, automatedValue);
    } else if (conditionValue > 124 && conditionValue <= 150) {
      this.setValueForCriteria('securityCoverage', '125% to 150%', 15.75, automatedValue);
    } else if (conditionValue >= 100 && conditionValue <= 124) {
      this.setValueForCriteria('securityCoverage', '100%', 13.65, automatedValue);
    } else {
      this.setValueForCriteria('securityCoverage', 'Below 100%', 0, automatedValue);
    }
  }

  calculatePeriodOfEarningOrEmployment(periodValueInYears) {
    if (periodValueInYears >= 5) {
      this.setValueForCriteria('periodOfEarningOrEmployment', 'Equivalent or More than 5 years', 3);
    } else if (periodValueInYears >= 2 && periodValueInYears < 5) {
      this.setValueForCriteria('periodOfEarningOrEmployment', 'Equivalent to 2 years or less than 5 years', 2.25);
    } else if (periodValueInYears >= 1 && periodValueInYears < 2) {
      this.setValueForCriteria('periodOfEarningOrEmployment', 'Equivalent or more than 1 year and less than 2 years', 1.50);
    } else if (periodValueInYears < 1) {
      this.setValueForCriteria('periodOfEarningOrEmployment', 'Less than one year', 0);
    }
  }

  calculateAlternateOrSecondarySourceOfIncome() {
    const conditionValue = (Number(this.parsedFinancialData.initialForm.alternateIncomeSourceAmount)
        / Number(this.parsedFinancialData.initialForm.emiWithProposal)) * 100;
    const automatedValue = conditionValue.toFixed(2);
    if (conditionValue > 20) {
      this.setValueForCriteria('alternateOrSecondarySourceOfIncome', 'Equivalent or above 20% of EMI/EQI', 6, automatedValue);
    } else if (conditionValue > 15 && conditionValue <= 20) {
      this.setValueForCriteria('alternateOrSecondarySourceOfIncome', 'Equivalent or above 15% of EMI/EQI', 5.40, automatedValue);
    } else if (conditionValue > 10 && conditionValue <= 15) {
      this.setValueForCriteria('alternateOrSecondarySourceOfIncome', 'Equivalent or above 10% of EMI/EQI', 4.50, automatedValue);
    } else if (conditionValue > 5 && conditionValue <= 10) {
      this.setValueForCriteria('alternateOrSecondarySourceOfIncome', 'Equivalent or above 5% of EMI/EQI', 3.00, automatedValue);
    } else if (conditionValue < 5) {
      this.setValueForCriteria('alternateOrSecondarySourceOfIncome', 'No alternate source of income or below 5%', 0, automatedValue);
    }
  }

  calculateTotalGrossMonthlyIncomeOrTotalGrossMonthlyExpenses(totalNetMonthlyIncome) {
    if (totalNetMonthlyIncome > 2) {
      this.setValueForCriteria('totalGrossMonthlyIncomeOrTotalGrossMonthlyExpenses', 'More than 2 times', 12);
    } else if (totalNetMonthlyIncome === 2) {
      this.setValueForCriteria('totalGrossMonthlyIncomeOrTotalGrossMonthlyExpenses', '2 times', 9.60);
    } else if (totalNetMonthlyIncome < 2) {
      this.setValueForCriteria('totalGrossMonthlyIncomeOrTotalGrossMonthlyExpenses', 'Less than two times', 0);
    }
  }

  calculateIncomeRoutingThroughBank() {
    if (!ObjectUtil.isEmpty(this.incomeFromAccount) && !ObjectUtil.isEmpty(this.financialData)) {
      const incomeFromAccountParsed = JSON.parse(this.incomeFromAccount.data);
      if (!incomeFromAccountParsed.newCustomerChecked) {
        const conditionValue = (Number(incomeFromAccountParsed.accountTransactionForm.creditTransactionValue)
            / Number(this.parsedFinancialData.initialForm.totalIncome)) * 100;
        const automatedValue = conditionValue.toFixed(2);
        if (conditionValue > 70) {
          this.setValueForCriteria('incomeRoutingThroughBank',
              'Amount routed (total credit transaction amount) more than 70% of income proceeds i.e. deposit via pure cash/cheque/IPS/RTGS only',
              3, automatedValue);
        } else if (conditionValue >= 50 && conditionValue <= 70) {
          this.setValueForCriteria('incomeRoutingThroughBank',
              'Amount routed (total credit transaction amount) between 50% - 70% of income proceeds i.e. deposit via pure cash/cheque/IPS/RTGS only',
              2.25, automatedValue);
        } else if (conditionValue < 50) {
          this.setValueForCriteria('incomeRoutingThroughBank',
              'Amount routed (total credit transaction amount) less than 50% of income proceeds', 1.50, automatedValue);
        }
      } else {
        this.setValueForCriteria('incomeRoutingThroughBank', 'New Customer with no account history', 0, 'N/A');
      }
    } else {
      this.missingAlerts.push({
        type: 'danger',
        message: 'No Data detected for grade automation in "Income from account" or "Financial" section!',
      });
    }
  }

  buildForm() {
    this.creditRiskGradingForm = this.formBuilder.group({
      typeOfSourceOfIncome: this.criteriaFormGroup(),
      multipleSourceOfIncome: this.criteriaFormGroup(),
      periodOfEarningOrEmployment: this.criteriaFormGroup(),
      incomeRoutingThroughBank: this.criteriaFormGroup(),
      totalGrossMonthlyIncomeOrTotalGrossMonthlyExpenses: this.criteriaFormGroup(),
      alternateOrSecondarySourceOfIncome: this.criteriaFormGroup(),

      bankingRelationship: this.criteriaFormGroup(),
      repaymentHistory: this.criteriaFormGroup(),
      locationOfProperty: this.criteriaFormGroup(),
      roadAccess: this.criteriaFormGroup(),
      netWorth: this.criteriaFormGroup(),

      securityCoverage: this.criteriaFormGroup(),
      multibanking: this.criteriaFormGroup(),
      repaymentTrackInOtherBfIs: this.criteriaFormGroup(),

      repaymentRiskTotal: undefined,
      relationshipRiskTotal: undefined,
      securityRiskTotal: undefined,
      exposureRiskTotal: undefined,
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

  calculateRepaymentRiskTotal(): number {
    let total = 0;
    this.repaymentRiskArray.forEach(singleCriteria => {
      total = Number(this.creditRiskGradingForm.get(singleCriteria).get('value').value) + total;
    });
    this.creditRiskGradingForm.get('repaymentRiskTotal').patchValue(total.toFixed(2));
    return total;
  }

  calculateRelationshipRiskTotal(): number {
    let total = 0;
    this.relationshipRiskArray.forEach(singleCriteria => {
      total = Number(this.creditRiskGradingForm.get(singleCriteria).get('value').value) + total;
    });
    this.creditRiskGradingForm.get('relationshipRiskTotal').patchValue(total.toFixed(2));
    return total;
  }

  calculateSecurityRiskTotal(): number {
    let total = 0;
    this.securityRiskArray.forEach(singleCriteria => {
      total = Number(this.creditRiskGradingForm.get(singleCriteria).get('value').value) + total;
    });
    this.creditRiskGradingForm.get('securityRiskTotal').patchValue(total.toFixed(2));
    return total;
  }

  calculateExposureRiskTotal(): number {
    let total = 0;
    this.exposureRiskArray.forEach(singleCriteria => {
      total = Number(this.creditRiskGradingForm.get(singleCriteria).get('value').value) + total;
    });
    this.creditRiskGradingForm.get('exposureRiskTotal').patchValue(total.toFixed(2));
    return total;
  }

  calculateTotalScore() {
    let total = 0;
    total = total + this.calculateRepaymentRiskTotal();
    total = total + this.calculateRelationshipRiskTotal();
    total = total + this.calculateSecurityRiskTotal();
    total = total + this.calculateExposureRiskTotal();
    this.creditRiskGradingForm.get('totalScore').patchValue(total.toFixed(2));
    if (total >= 90) {
      this.creditRiskGradingForm.get('creditRiskGrade').patchValue('Excellent');
      this.creditRiskGradingForm.get('creditRiskRating').patchValue('Low Risk');
      this.creditRiskGradingForm.get('premium').patchValue('2%');
    } else if (total >= 75 && total <= 89) {
      this.creditRiskGradingForm.get('creditRiskGrade').patchValue('Very Good');
      this.creditRiskGradingForm.get('creditRiskRating').patchValue('Average Risk');
      this.creditRiskGradingForm.get('premium').patchValue('2.5%');
    } else if (total >= 65 && total <= 74) {
      this.creditRiskGradingForm.get('creditRiskGrade').patchValue('Good');
      this.creditRiskGradingForm.get('creditRiskRating').patchValue('Moderate Risk');
      this.creditRiskGradingForm.get('premium').patchValue('3%');
    } else if (total >= 50 && total <= 64) {
      this.creditRiskGradingForm.get('creditRiskGrade').patchValue('Acceptable');
      this.creditRiskGradingForm.get('creditRiskRating').patchValue('Tolerable Risk');
      this.creditRiskGradingForm.get('premium').patchValue('3.5%');
    } else if (total < 50) {
      this.creditRiskGradingForm.get('creditRiskGrade').patchValue('Not Eligible for New Loans');
      this.creditRiskGradingForm.get('creditRiskRating').patchValue('High Risk');
      this.creditRiskGradingForm.get('premium').patchValue('4');
    }
  }

  close(alert) {
    this.missingAlerts.splice(this.missingAlerts.indexOf(alert), 1);
  }

  onSubmit() {
    if (!ObjectUtil.isEmpty(this.formData)) {
      this.creditRiskData = this.formData;
    }
    this.creditRiskData.data = JSON.stringify(this.creditRiskGradingForm.value);
  }
}
