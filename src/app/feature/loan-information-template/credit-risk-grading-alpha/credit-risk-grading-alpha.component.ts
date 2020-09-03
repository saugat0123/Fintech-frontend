import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {QuestionService} from '../../service/question.service';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {CreditRiskGradingAlpha} from '../../admin/modal/CreditRiskGradingAlpha';
import {LoanDataHolder} from '../../loan/model/loanData';
import {CompanyInfo} from '../../admin/modal/company-info';
import {Financial} from '../../loan/model/financial';

@Component({
  selector: 'app-credit-risk-grading-alpha',
  templateUrl: './credit-risk-grading-alpha.component.html',
  styleUrls: ['./credit-risk-grading-alpha.component.scss']
})
export class CreditRiskGradingAlphaComponent implements OnInit {
  creditRiskGrading: FormGroup;
  creditRiskData: CreditRiskGradingAlpha = new CreditRiskGradingAlpha();

  @Input() financial: Financial;
  @Input() companyInfo: CompanyInfo;
  @Input() creditRiskGradingAlpha: CreditRiskGradingAlpha;
  @Input() fromProfile: boolean;
  @Output() crgAlphaDataEmitter = new EventEmitter();

  crgData: CreditRiskGradingAlpha;

  financialTotalMapsArray = [];

  totalPointsArray = [];
  gradesArray = [];

  nonFinancialTotalMap = new Map<string, number>();

  // Financial data--
  financialParsedData: any;
  fiscalYearArray = [];
  recentFiscalYearIndex = 0;
  debtEquityRatioOverall;
  currentRatio;
  operatingMarginProfit;
  interestCoverageRatio;

  ageOfBusinessValue;
  points: any;

  leverage = [5, 4, 3, 2, 1, 0];
  liquidity = [10, 9, 8, 7, 6, 5, 4, 3, 0];
  profit = [10, 9, 8, 7, 6, 5, 4, 0];
  coverage = [5, 4, 3, 2, 0];

  sizeOfBusiness = [3, 2, 1, 0];
  ageOfBusiness = [2, 1, 0];
  businessOutlook = [2, 1, 0];
  industryGrowth = [2, 1, 0];
  marketCompetition = [2, 1, 0];
  entryExitBarriers = [1, 0];

  experience = [5, 3, 2, 0];
  secondLineSuccession = [4, 3, 2, 0];
  teamWork = [1, 0];

  securityCoverage = [15, 12, 7, 2, 0];
  collateralCoverage = [15, 12, 7, 2, 0];
  support = [10, 5, 0];

  accountConduct = [5, 4, 2, 0];
  utilizationOfLimit = [1, 0];
  complianceOfCovenants = [1, 0];
  personalDeposits = [1, 0];

  formDataForEdit;

  constructor(
      private questionService: QuestionService,
      private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.financial)) {
      this.financialParsedData = JSON.parse(this.financial.data);
      this.fiscalYearArray = this.financialParsedData.fiscalYear;
      if (this.fiscalYearArray.length > 0) {
        this.recentFiscalYearIndex = this.fiscalYearArray.length - 1;
        this.fiscalYearArray.forEach( (value, index) => {
          const map = new Map<string, number>();
          this.setFinancialScore(map, index);
        });
      }
    }

    // Replace with existing data --
    if (!ObjectUtil.isEmpty(this.creditRiskGradingAlpha)) {
      this.crgData = this.creditRiskGradingAlpha;
      this.formDataForEdit = JSON.parse(this.crgData.data);
    }
    this.buildForm();
    if (this.formDataForEdit !== undefined) {
      this.nonFinancialTotalMap.set('sizeOfBusiness', this.formDataForEdit.sizeOfBusiness);
      this.nonFinancialTotalMap.set('ageOfBusiness', this.formDataForEdit.ageOfBusiness);
      this.nonFinancialTotalMap.set('businessOutlook', this.formDataForEdit.businessOutlook);
      this.nonFinancialTotalMap.set('industryGrowth', this.formDataForEdit.industryGrowth);
      this.nonFinancialTotalMap.set('marketCompetition', this.formDataForEdit.marketCompetition);
      this.nonFinancialTotalMap.set('entryExitBarriers', this.formDataForEdit.entryExitBarriers);
      this.nonFinancialTotalMap.set('experience', this.formDataForEdit.experience);
      this.nonFinancialTotalMap.set('secondLineSuccession', this.formDataForEdit.secondLineSuccession);
      this.nonFinancialTotalMap.set('teamWork', this.formDataForEdit.teamWork);
      this.nonFinancialTotalMap.set('securityCoverage', this.formDataForEdit.securityCoverage);
      this.nonFinancialTotalMap.set('collateralCoverage', this.formDataForEdit.collateralCoverage);
      this.nonFinancialTotalMap.set('support', this.formDataForEdit.support);
      this.nonFinancialTotalMap.set('accountConduct', this.formDataForEdit.accountConduct);
      this.nonFinancialTotalMap.set('utilizationOfLimit', this.formDataForEdit.utilizationOfLimit);
      this.nonFinancialTotalMap.set('complianceOfCovenants', this.formDataForEdit.complianceOfCovenants);
      this.nonFinancialTotalMap.set('personalDeposits', this.formDataForEdit.personalDeposits);
      this.onChangeOption();
    }
    if (this.fiscalYearArray.length > 0) {
      // enclosed within the same condition twice because size of business requires building of form group--
      this.setSizeOfBusiness(this.recentFiscalYearIndex);
    }
    if (!ObjectUtil.isEmpty(this.companyInfo)
        && !ObjectUtil.isEmpty(this.companyInfo.establishmentDate)) {
      this.ageOfBusinessValue = this.calculateAge(new Date(this.companyInfo.establishmentDate));
      this.setAgeOfBusiness();
    }
  }

  buildForm() {
    this.creditRiskGrading = this.formBuilder.group({
      sizeOfBusiness: [this.formDataForEdit === undefined ? undefined : this.formDataForEdit.sizeOfBusiness, [Validators.required]],
      ageOfBusiness: [this.formDataForEdit === undefined ? undefined : this.formDataForEdit.ageOfBusiness, [Validators.required]],
      businessOutlook: [this.formDataForEdit === undefined ? undefined : this.formDataForEdit.businessOutlook, [Validators.required]],
      industryGrowth: [this.formDataForEdit === undefined ? undefined : this.formDataForEdit.industryGrowth, [Validators.required]],
      marketCompetition: [this.formDataForEdit === undefined ? undefined : this.formDataForEdit.marketCompetition, [Validators.required]],
      entryExitBarriers: [this.formDataForEdit === undefined ? undefined : this.formDataForEdit.entryExitBarriers, [Validators.required]],
      experience: [this.formDataForEdit === undefined ? undefined : this.formDataForEdit.experience, [Validators.required]],
      secondLineSuccession:
          [this.formDataForEdit === undefined ? undefined : this.formDataForEdit.secondLineSuccession, [Validators.required]],
      teamWork: [this.formDataForEdit === undefined ? undefined : this.formDataForEdit.teamWork, [Validators.required]],
      securityCoverage: [this.formDataForEdit === undefined ? undefined : this.formDataForEdit.securityCoverage, [Validators.required]],
      collateralCoverage: [this.formDataForEdit === undefined ? undefined : this.formDataForEdit.collateralCoverage, [Validators.required]],
      support: [this.formDataForEdit === undefined ? undefined : this.formDataForEdit.support, [Validators.required]],
      accountConduct: [this.formDataForEdit === undefined ? undefined : this.formDataForEdit.accountConduct, [Validators.required]],
      utilizationOfLimit: [this.formDataForEdit === undefined ? undefined : this.formDataForEdit.utilizationOfLimit, [Validators.required]],
      complianceOfCovenants:
          [this.formDataForEdit === undefined ? undefined : this.formDataForEdit.complianceOfCovenants, [Validators.required]],
      personalDeposits: [this.formDataForEdit === undefined ? undefined : this.formDataForEdit.personalDeposits, [Validators.required]],
      totalPointsArray: [this.formDataForEdit === undefined ? undefined : this.formDataForEdit.totalPoints],
      gradesArray: [this.formDataForEdit === undefined ? undefined : this.formDataForEdit.grading],
      fiscalYearArray: undefined
    });
  }

  calculateAge(initializationDate: Date) {
    const currentDate = new Date();
    const calculateYear = currentDate.getFullYear();
    const calculateMonth = currentDate.getMonth();
    const calculateDay = currentDate.getDate();

    const birthYear = initializationDate.getFullYear();
    const birthMonth = initializationDate.getMonth();
    const birthDay = initializationDate.getDate();

    const age = calculateYear - birthYear;
    const ageMonth = calculateMonth - birthMonth;
    const ageDay = calculateDay - birthDay;

    if (ageMonth < 0 || (ageMonth === 0 && ageDay < 0)) {
      Number(age - 1);
    }
    return age;
  }

  onChangeOption(field?, point?) {
    if (field !== undefined) {
      this.nonFinancialTotalMap.set(field, point);
    }
    if (this.nonFinancialTotalMap.size === 16) {
      this.totalPointsArray = [];
      this.gradesArray = [];
      let nonFinancialTotal = 0;
      this.nonFinancialTotalMap.forEach(data => {
        nonFinancialTotal = nonFinancialTotal + Number(data);
      });

      // Calculating total for each year --
      this.financialTotalMapsArray.forEach( (map, index) => {
        let singleFiscalYearTotal = 0;
        map.forEach( (value: number) => {
          singleFiscalYearTotal = singleFiscalYearTotal + value;
        });
        const totalPointForSingleYear = singleFiscalYearTotal + nonFinancialTotal;
        this.totalPointsArray.push(totalPointForSingleYear);
        this.gradesArray.push(this.calculateGrade(totalPointForSingleYear));
      });
      this.creditRiskGrading.get('totalPointsArray').patchValue(this.totalPointsArray);
      this.creditRiskGrading.get('gradesArray').patchValue(this.gradesArray);
    }
  }

  calculateGrade(totalPoints) {
    let grading = 'None';
    if (totalPoints === 100) {
      grading = 'Superior';
    } else if (totalPoints >= 85) {
      grading = 'Good';
    } else if (totalPoints >= 75 && totalPoints < 85) {
      grading = 'Acceptable';
    } else if (totalPoints >= 65 && totalPoints < 75) {
      grading = 'Marginal/Watchlist';
    } else if (totalPoints >= 55 && totalPoints < 65) {
      grading = 'Special Mention';
    } else if (totalPoints >= 45 && totalPoints < 55) {
      grading = 'Substandard';
    } else if (totalPoints >= 35 && totalPoints < 45) {
      grading = 'Doubtful';
    } else if (totalPoints <= 35) {
      grading = 'Bad & Loss';
    }
    return grading;
  }

  setFinancialScore(map, fiscalYearIndex) {
    this.debtEquityRatioOverall =
        Number(this.financialParsedData.keyIndicatorsData.debtEquityRatioOverall[fiscalYearIndex].value) / 100;
    this.currentRatio = Number(this.financialParsedData.keyIndicatorsData.currentRatio[fiscalYearIndex].value);
    this.operatingMarginProfit =
        (Number(this.financialParsedData.incomeStatementData.operatingProfit[fiscalYearIndex].value) * 100)
        / Number(this.financialParsedData.incomeStatementData.totalSalesSubCategory[0].amount[fiscalYearIndex].value);
    this.interestCoverageRatio = Number(this.financialParsedData.keyIndicatorsData.interestCoverageRatio[fiscalYearIndex].value);

    if (this.debtEquityRatioOverall < 0.25) {
      this.setDebtEquityRatioOverall(map, 5);
    } else if (this.debtEquityRatioOverall >= 0.25 && this.debtEquityRatioOverall <= 0.50) {
      this.setDebtEquityRatioOverall(map, 4);
    } else if (this.debtEquityRatioOverall >= 0.51 && this.debtEquityRatioOverall <= 1.25) {
      this.setDebtEquityRatioOverall(map, 3);
    } else if (this.debtEquityRatioOverall >= 1.26 && this.debtEquityRatioOverall <= 2.00) {
      this.setDebtEquityRatioOverall(map, 2);
    } else if (this.debtEquityRatioOverall >= 2.01 && this.debtEquityRatioOverall <= 2.75) {
      this.setDebtEquityRatioOverall(map, 1);
    } else if (this.debtEquityRatioOverall > 2.75) {
      this.setDebtEquityRatioOverall(map, 0);
    }

    if (this.currentRatio > 2.74) {
      this.setCurrentRatio(map, 10);
    } else if (this.currentRatio >= 2.50 && this.currentRatio <= 2.74) {
      this.setCurrentRatio(map, 9);
    } else if (this.currentRatio >= 2.00 && this.currentRatio <= 2.49) {
      this.setCurrentRatio(map, 8);
    } else if (this.currentRatio >= 1.50 && this.currentRatio <= 1.99) {
      this.setCurrentRatio(map, 7);
    } else if (this.currentRatio >= 1.10 && this.currentRatio <= 1.49) {
      this.setCurrentRatio(map, 6);
    } else if (this.currentRatio >= 0.90 && this.currentRatio <= 1.09) {
      this.setCurrentRatio(map, 5);
    } else if (this.currentRatio >= 0.80 && this.currentRatio <= 0.89) {
      this.setCurrentRatio(map, 4);
    } else if (this.currentRatio >= 0.70 && this.currentRatio <= 0.79) {
      this.setCurrentRatio(map, 3);
    } else if (this.currentRatio < 0.70) {
      this.setCurrentRatio(map, 0);
    }

    if (this.operatingMarginProfit > 25) {
      this.setOperatingMarginProfit(map, 10);
    } else if (this.operatingMarginProfit >= 20 && this.operatingMarginProfit <= 24) {
      this.setOperatingMarginProfit(map, 9);
    } else if (this.operatingMarginProfit >= 15 && this.operatingMarginProfit <= 19) {
      this.setOperatingMarginProfit(map, 8);
    } else if (this.operatingMarginProfit >= 10 && this.operatingMarginProfit <= 14) {
      this.setOperatingMarginProfit(map, 7);
    } else if (this.operatingMarginProfit >= 7 && this.operatingMarginProfit <= 9) {
      this.setOperatingMarginProfit(map, 6);
    } else if (this.operatingMarginProfit >= 4 && this.operatingMarginProfit <= 6) {
      this.setOperatingMarginProfit(map, 5);
    } else if (this.operatingMarginProfit >= 1 && this.operatingMarginProfit <= 3) {
      this.setOperatingMarginProfit(map, 3);
    } else if (this.operatingMarginProfit < 1) {
      this.setOperatingMarginProfit(map, 0);
    } else {
      this.setOperatingMarginProfit(map, 0);
    }

    if (this.interestCoverageRatio > 2.00) {
      this.setInterestCoverageRatio(map, 5);
    } else if (this.interestCoverageRatio >= 1.51 && this.interestCoverageRatio <= 2) {
      this.setInterestCoverageRatio(map, 4);
    } else if (this.interestCoverageRatio >= 1.25 && this.interestCoverageRatio <= 1.50) {
      this.setInterestCoverageRatio(map, 3);
    } else if (this.interestCoverageRatio >= 1 && this.interestCoverageRatio <= 1.24) {
      this.setInterestCoverageRatio(map, 2);
    } else if (this.interestCoverageRatio < 1) {
      this.setInterestCoverageRatio(map, 0);
    }

    this.financialTotalMapsArray.push(map);
  }

  setDebtEquityRatioOverall(map, points) {
    map.set('leverage', points);
  }

  setCurrentRatio(map, points) {
    map.set('liquidity', points);
  }

  setOperatingMarginProfit(map, points) {
    map.set('profit', points);
  }

  setInterestCoverageRatio(map, points) {
    map.set('coverage', points);
  }

  // Size of business automated evaluation--
  setSizeOfBusiness(fiscalYearIndex) {
    const sizeOfBusinessValue =
        Number(this.financialParsedData.incomeStatementData.totalSalesSubCategory[0].amount[fiscalYearIndex].value);
    if (sizeOfBusinessValue > 15000000) {
      this.changeSizeOfBusinessPoints(3);
    } else if (sizeOfBusinessValue >= 10000000 && sizeOfBusinessValue <= 15000000) {
      this.changeSizeOfBusinessPoints(2);
    } else if (sizeOfBusinessValue >= 5000000 && sizeOfBusinessValue < 10000000) {
      this.changeSizeOfBusinessPoints(1);
    } else if (sizeOfBusinessValue < 5000000) {
      this.changeSizeOfBusinessPoints(0);
    }
  }

  changeSizeOfBusinessPoints(points) {
    this.nonFinancialTotalMap.set('sizeOfBusiness', points);
    this.creditRiskGrading.get('sizeOfBusiness').patchValue(points);
    this.onChangeOption('sizeOfBusiness', points);
  }

  // Setting age of business--
  setAgeOfBusiness() {
    if (this.ageOfBusinessValue >= 5) {
      this.changeAgeOfBusinessPoints(2);
    } else if (this.ageOfBusinessValue >= 2 && this.ageOfBusinessValue < 5) {
      this.changeAgeOfBusinessPoints(1);
    } else if (this.ageOfBusinessValue < 2) {
      this.changeAgeOfBusinessPoints(0);
    }
  }

  changeAgeOfBusinessPoints(points) {
    this.nonFinancialTotalMap.set('ageOfBusiness', points);
    this.creditRiskGrading.get('ageOfBusiness').patchValue(points);
    this.onChangeOption('ageOfBusiness', points);
  }

  onSubmit() {
    if (!ObjectUtil.isEmpty(this.creditRiskGradingAlpha)) {
      this.creditRiskData = this.crgData;
    }
    this.creditRiskGrading.get('fiscalYearArray').patchValue(this.fiscalYearArray);
    this.creditRiskData.data = JSON.stringify(this.creditRiskGrading.value);
    this.crgAlphaDataEmitter.emit(this.creditRiskData.data);
  }
}
