import {Component, Input, OnInit} from '@angular/core';
import {IncomeFromAccount} from '../../admin/modal/incomeFromAccount';
import {MicroCrgParams} from '../../loan/model/MicroCrgParams';
import {CrgMicro} from '../../loan/model/CrgMicro';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MultipleSourceIncomeTypeMap} from '../../micro-loan/template/micro-crg-params/model/MajorSourceIncomeType';
import {OwnershipOfResidenceMap} from '../../micro-loan/template/micro-crg-params/model/OwnershipOfResidence';
import {ExpOfClientMap} from '../../micro-loan/template/micro-crg-params/model/ExpOfClient';
import {RelationWithMegaMap} from '../../micro-loan/template/micro-crg-params/model/RelationWithMega';
import {InsuranceCoverageMap} from '../../micro-loan/template/micro-crg-params/model/InsuranceCoverage';
import {LocationOfPropertyMap} from '../../micro-loan/template/micro-crg-params/model/LocationOfProperty';
import {RoadAccessMap} from '../../micro-loan/template/micro-crg-params/model/RoadAccess';
import {Security} from '../../loan/model/security';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {MultibankingMap} from '../../micro-loan/template/micro-crg-params/model/Multibanking';
import {RelationWithBankMap} from '../../micro-loan/template/micro-crg-params/model/RelationWithBank';
import {RepaymentHistoryMap} from '../../micro-loan/template/micro-crg-params/model/RepaymentHistory';
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-crg-micro',
  templateUrl: './crg-micro.component.html',
  styleUrls: ['./crg-micro.component.scss']
})
export class CrgMicroComponent implements OnInit {

  @Input() formData: CrgMicro;
  @Input() incomeFromAccount: IncomeFromAccount;
  @Input() microOtherParameters: MicroCrgParams;
  @Input() security: Security;

  creditRiskGradingForm: FormGroup;
  creditRiskData: CrgMicro = new CrgMicro();

  repaymentRiskArray = [
    'typeOfSourceOfIncome',
    'multipleSourceOfIncome',
    'deRatio',
    'incomeRoutingThroughBank',
    'totalGrossMonthlyIncomeOrTotalGrossMonthlyExpenses'
  ];
  relationshipRiskArray = [
    'businessExperience',
    'ownershipOfResidence',
    'loanToNetworth',
    'relationshipWithMega'
  ];
  securityRiskArray = [];
  exposureRiskArray = [
    'bankingRelationship',
    'repaymentHistory',
    'multibanking'
  ];

  // Security points map --
  locationOfPropertyMap: Map<string, number> = LocationOfPropertyMap.map;
  roadAccessMap: Map<string, number> = RoadAccessMap.map;
  insuranceCoverageMap: Map<string, number> = InsuranceCoverageMap.map;

  // Relationship points map --
  businessExperienceMap: Map<string, number> = ExpOfClientMap.map;
  ownershipOfResidenceMap: Map<string, number> = OwnershipOfResidenceMap.map;
  relationshipWithMegaMap: Map<string, number> = RelationWithMegaMap.map;

  // Repayment risk points map --
  multipleSourceOfIncomeMap: Map<string, number> = MultipleSourceIncomeTypeMap.map;

  // Exposure Map --
  multibankingMap: Map<string, number> = MultibankingMap.map;
  relationWithBankMap: Map<string, number> = RelationWithBankMap.map;
  repaymentHistoryMap: Map<string, number> = RepaymentHistoryMap.map;

  isSubsidiary = false;
  noDataForMicroParam = false;

  constructor(protected formBuilder: FormBuilder,
              private overlay: NgxSpinnerService) { }

  ngOnInit() {
    this.buildForm();
    this.calculateCrg();
  }

  calculateCrg() {
    let microOtherParametersData;
    let incomeFromAccountData;
    if (this.microOtherParameters) {
      microOtherParametersData = JSON.parse(this.microOtherParameters.data).initialForm;

      // repaymentRisk
      if (this.incomeFromAccount) {
        incomeFromAccountData = JSON.parse(this.microOtherParameters.data);
        this.calculateIncomeRoutingThroughBank(incomeFromAccountData, microOtherParametersData);
      }
      this.setValueForCriteria('typeOfSourceOfIncome', null, microOtherParametersData.typeOfSourceOfIncomeObtainedScore);
      this.setValueForCriteria('multipleSourceOfIncome', microOtherParametersData.majorSourceIncomeType,
          this.multipleSourceOfIncomeMap.get(microOtherParametersData.majorSourceIncomeType));
      this.calculateDeRatio(microOtherParametersData);
      this.calculateTotalGrossMonthlyIncomeOrTotalGrossMonthlyExpenses(microOtherParametersData);

      this.setValueForCriteria('businessExperience', microOtherParametersData.expOfClient,
          this.businessExperienceMap.get(microOtherParametersData.expOfClient));
      this.setValueForCriteria('ownershipOfResidence', microOtherParametersData.ownershipOfResidence,
          this.ownershipOfResidenceMap.get(microOtherParametersData.ownershipOfResidence));
      this.setValueForCriteria('relationshipWithMega', microOtherParametersData.relationWithMega,
          this.relationshipWithMegaMap.get(microOtherParametersData.relationWithMega));
      this.calculateLoanToNetworth(microOtherParametersData);

      this.isSubsidiary = microOtherParametersData.isSubsidized;
      if (this.isSubsidiary) {
        this.setValueForCriteria('insuranceCoverage', microOtherParametersData.insuranceCoverage,
            this.insuranceCoverageMap.get(microOtherParametersData.insuranceCoverage));
        this.securityRiskArray.push('insuranceCoverage');
      } else {
        this.setValueForCriteria('locationOfProperty', microOtherParametersData.locationOfProperty,
            this.locationOfPropertyMap.get(microOtherParametersData.locationOfProperty));
        this.setValueForCriteria('roadAccess', microOtherParametersData.roadAccess,
            this.roadAccessMap.get(microOtherParametersData.roadAccess));
        if (!ObjectUtil.isEmpty(this.security)) {
          const parsedSecurityData = JSON.parse(this.security.data);
          this.calculateSecurityCoverage(microOtherParametersData, parsedSecurityData);
        }
        this.securityRiskArray = ['locationOfProperty', 'roadAccess', 'securityCoverage'];
      }

      this.setValueForCriteria('bankingRelationship', microOtherParametersData.relationWithBank,
          this.relationWithBankMap.get(microOtherParametersData.relationWithBank));
      this.setValueForCriteria('repaymentHistory', microOtherParametersData.repaymentHistory,
          this.repaymentHistoryMap.get(microOtherParametersData.repaymentHistory));
      this.setValueForCriteria('multibanking', microOtherParametersData.multibanking,
          this.multibankingMap.get(microOtherParametersData.multibanking));

      this.calculateTotalScore();
    } else {
      this.noDataForMicroParam = true;
    }
  }

  buildForm() {
    this.creditRiskGradingForm = this.formBuilder.group({
      typeOfSourceOfIncome: this.criteriaFormGroup(),
      multipleSourceOfIncome: this.criteriaFormGroup(),
      deRatio: this.criteriaFormGroup(),
      incomeRoutingThroughBank: this.criteriaFormGroup(),
      totalGrossMonthlyIncomeOrTotalGrossMonthlyExpenses: this.criteriaFormGroup(),

      businessExperience: this.criteriaFormGroup(),
      ownershipOfResidence: this.criteriaFormGroup(),
      loanToNetworth: this.criteriaFormGroup(),
      relationshipWithMega: this.criteriaFormGroup(),

      locationOfProperty: this.criteriaFormGroup(),
      roadAccess: this.criteriaFormGroup(),
      securityCoverage: this.criteriaFormGroup(),
      insuranceCoverage: this.criteriaFormGroup(),

      bankingRelationship: this.criteriaFormGroup(),
      repaymentHistory: this.criteriaFormGroup(),
      multibanking: this.criteriaFormGroup(),

      repaymentRiskTotal: undefined,
      relationshipRiskTotal: undefined,
      securityRiskTotal: undefined,
      exposureRiskTotal: undefined,

      isSubsidiary: [false],
      // Aggregate properties--
      totalScore: undefined,
      creditRiskGrade: undefined,
      creditRiskRating: undefined,
      premium: undefined,
    });
  }

  calculateTotalGrossMonthlyIncomeOrTotalGrossMonthlyExpenses(microData) {
    const conditionValue = Number(microData.totalIncome) / Number(microData.totalExpense);
    const automatedValue = conditionValue.toFixed(2);
    if (conditionValue > 2) {
      this.setValueForCriteria('totalGrossMonthlyIncomeOrTotalGrossMonthlyExpenses', 'More than 2 times', 8, automatedValue);
    } else if (conditionValue === 2) {
      this.setValueForCriteria('totalGrossMonthlyIncomeOrTotalGrossMonthlyExpenses', '2 times', 5.60, automatedValue);
    } else if (conditionValue < 2) {
      this.setValueForCriteria('totalGrossMonthlyIncomeOrTotalGrossMonthlyExpenses', 'Less than two times', 0, automatedValue);
    }
  }

  calculateSecurityCoverage(microData, parsedSecurityData) {
    const conditionValue = (Number(microData.totalLoan) / Number(parsedSecurityData.totalSecurityAmount) * 100);
    const automatedValue = conditionValue.toFixed(2);
    if (conditionValue > 200) {
      this.setValueForCriteria('securityCoverage', 'Above 200%', 24.0, automatedValue);
    } else if (conditionValue > 150 && conditionValue <= 200) {
      this.setValueForCriteria('securityCoverage', '151% to 200%', 21.60, automatedValue);
    } else {
      this.setValueForCriteria('securityCoverage', 'Out of range (Below 150%)', 0, automatedValue);
    }
  }

  calculateDeRatio(microData) {
    const conditionValue = ((Number(microData.totalDebt) / Number(microData.totalEquity)) * 100) /
        Number(microData.projectCostTotal);
    const automatedValue = conditionValue.toFixed(2);
    if (conditionValue >= 80) {
      this.setValueForCriteria('deRatio', '80% of total project cost', 1, automatedValue);
    } else if (conditionValue >= 70 && conditionValue < 80) {
      this.setValueForCriteria('deRatio', '70% of total project cost', 1.40, automatedValue);
    } else if (conditionValue >= 60 && conditionValue < 70) {
      this.setValueForCriteria('deRatio', '60% of total project cost', 1.80, automatedValue);
    } else if (conditionValue >= 50 && conditionValue < 60) {
      this.setValueForCriteria('deRatio', '50% of total project cost', 2.00, automatedValue);
    } else {
      this.setValueForCriteria('deRatio', '50% of total project cost', 2.00, automatedValue);
    }
  }

  calculateIncomeRoutingThroughBank(incomeFromAccountData, microData) {
    if (incomeFromAccountData.newCustomerChecked) {
      const conditionValue = (Number(incomeFromAccountData.creditTransactionValue) / (Number(microData.totalIncome) * 12)) * 100;
      const automatedValue = conditionValue.toFixed(2);
      if (conditionValue > 70) {
        this.setValueForCriteria('incomeRoutingThroughBank', 'Amount routed (total credit transaction amount) more than 70% of income proceeds i.e. deposit via pure cash/cheque/IPS/RTGS only', 2, automatedValue);
      } else if (conditionValue >= 50 && conditionValue <= 70) {
        this.setValueForCriteria('incomeRoutingThroughBank', 'Amount routed (total credit transaction amount) between 50% - 70% of income proceeds i.e. deposit via pure cash/cheque/IPS/RTGS only', 1.5, automatedValue);
      } else if ( conditionValue < 50) {
        this.setValueForCriteria('incomeRoutingThroughBank', 'Amount routed (total credit transaction amount) less than 50% of income proceeds', 1, automatedValue);
      } else {
        this.setValueForCriteria('incomeRoutingThroughBank', 'Income Verfied By local Body assured as to route through bank after financing', 1.80, automatedValue);
      }
    } else {
      this.setValueForCriteria('incomeRoutingThroughBank', 'New Customer with no account history', 0, 0);
    }
  }

  calculateLoanToNetworth(microData) {
    const conditionValue = (Number(microData.totalLoan) / Number(microData.netWorth)) * 100;
    const automatedValue = conditionValue.toFixed(2);
    if (conditionValue > 100) {
      this.setValueForCriteria('loanToNetworth', 'Above 100%', 1.5, automatedValue);
    } else if (conditionValue > 50 && conditionValue <= 100) {
      this.setValueForCriteria('loanToNetworth', 'above 50% to 100%', 0.60, automatedValue);
    } else if (conditionValue <= 50) {
      this.setValueForCriteria('loanToNetworth', 'Upto 50%', 0.150, automatedValue);
    } else {
      this.setValueForCriteria('loanToNetworth', 'Below 50%', 0, automatedValue);
    }
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

  onSubmit() {
    this.overlay.show();
    if (!ObjectUtil.isEmpty(this.formData)) {
      this.creditRiskData = this.formData;
    }
    this.creditRiskData.data = JSON.stringify(this.creditRiskGradingForm.value);
  }

}
