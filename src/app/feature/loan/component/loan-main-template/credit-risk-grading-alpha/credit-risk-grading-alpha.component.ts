import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {QuestionService} from '../../../../service/question.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CreditRiskGradingAlpha} from '../../../../admin/modal/CreditRiskGradingAlpha';
import {LoanDataHolder} from '../../../model/loanData';

@Component({
  selector: 'app-credit-risk-grading-alpha',
  templateUrl: './credit-risk-grading-alpha.component.html',
  styleUrls: ['./credit-risk-grading-alpha.component.scss']
})
export class CreditRiskGradingAlphaComponent implements OnInit {
  creditRiskGrading: FormGroup;
  creditRiskData: CreditRiskGradingAlpha = new CreditRiskGradingAlpha();

  @Input() loanData: LoanDataHolder;

  crgData: CreditRiskGradingAlpha;

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

  totalPointMapper: Map<string, number>;
  totalPoints = 0;
  grading: string;
  formDataForEdit;

  constructor(
      private questionService: QuestionService,
      private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.totalPointMapper = new Map<string, number>();
    if (!ObjectUtil.isEmpty(this.loanData.creditRiskGradingAlpha)) {
      this.crgData = this.loanData.creditRiskGradingAlpha;
      this.formDataForEdit = JSON.parse(this.crgData.data);
    }
    this.buildForm();
    if (this.formDataForEdit !== undefined) {
      this.totalPoints = this.formDataForEdit.totalPoint;
      this.grading = this.formDataForEdit.grade;
      this.totalPointMapper.set('leverage', this.formDataForEdit.leverage);
      this.totalPointMapper.set('liquidity', this.formDataForEdit.liquidity);
      this.totalPointMapper.set('profit', this.formDataForEdit.profit);
      this.totalPointMapper.set('coverage', this.formDataForEdit.coverage);
      this.totalPointMapper.set('sizeOfBusiness', this.formDataForEdit.sizeOfBusiness);
      this.totalPointMapper.set('ageOfBusiness', this.formDataForEdit.ageOfBusiness);
      this.totalPointMapper.set('businessOutlook', this.formDataForEdit.businessOutlook);
      this.totalPointMapper.set('industryGrowth', this.formDataForEdit.industryGrowth);
      this.totalPointMapper.set('marketCompetition', this.formDataForEdit.marketCompetition);
      this.totalPointMapper.set('entryExitBarriers', this.formDataForEdit.entryExitBarriers);
      this.totalPointMapper.set('experience', this.formDataForEdit.experience);
      this.totalPointMapper.set('secondLineSuccession', this.formDataForEdit.secondLineSuccession);
      this.totalPointMapper.set('teamWork', this.formDataForEdit.teamWork);
      this.totalPointMapper.set('securityCoverage', this.formDataForEdit.securityCoverage);
      this.totalPointMapper.set('collateralCoverage', this.formDataForEdit.collateralCoverage);
      this.totalPointMapper.set('support', this.formDataForEdit.support);
      this.totalPointMapper.set('accountConduct', this.formDataForEdit.accountConduct);
      this.totalPointMapper.set('utilizationOfLimit', this.formDataForEdit.utilizationOfLimit);
      this.totalPointMapper.set('complianceOfCovenants', this.formDataForEdit.complianceOfCovenants);
      this.totalPointMapper.set('personalDeposits', this.formDataForEdit.personalDeposits);
    }
    if (!ObjectUtil.isEmpty(this.loanData.financial)) {
      this.financialParsedData = JSON.parse(this.loanData.financial.data);
      this.fiscalYearArray = this.financialParsedData.fiscalYear;
      if (this.fiscalYearArray.length > 0) {
        this.recentFiscalYearIndex = this.fiscalYearArray.length - 1;
        this.setFinancialScore();
        this.setSizeOfBusiness();
      }
    }
    if (!ObjectUtil.isEmpty(this.loanData.companyInfo)
        && !ObjectUtil.isEmpty(this.loanData.companyInfo.establishmentDate)) {
      this.ageOfBusinessValue = this.calculateAge(new Date(this.loanData.companyInfo.establishmentDate));
      this.setAgeOfBusiness();
    }
  }

  buildForm() {
    this.creditRiskGrading = this.formBuilder.group({
      leverage: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.leverage, [Validators.required]],
      liquidity: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.liquidity, [Validators.required]],
      profit: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.profit, [Validators.required]],
      coverage: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.coverage, [Validators.required]],
      sizeOfBusiness: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.sizeOfBusiness, [Validators.required]],
      ageOfBusiness: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.ageOfBusiness, [Validators.required]],
      businessOutlook: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.businessOutlook, [Validators.required]],
      industryGrowth: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.industryGrowth, [Validators.required]],
      marketCompetition: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.marketCompetition, [Validators.required]],
      entryExitBarriers: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.entryExitBarriers, [Validators.required]],
      experience: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.experience, [Validators.required]],
      secondLineSuccession: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.secondLineSuccession, [Validators.required]],
      teamWork: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.teamWork, [Validators.required]],
      securityCoverage: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.securityCoverage, [Validators.required]],
      collateralCoverage: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.collateralCoverage, [Validators.required]],
      support: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.support, [Validators.required]],
      accountConduct: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.accountConduct, [Validators.required]],
      utilizationOfLimit: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.utilizationOfLimit, [Validators.required]],
      complianceOfCovenants: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.complianceOfCovenants, [Validators.required]],
      personalDeposits: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.personalDeposits, [Validators.required]],
      totalPoint: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.totalPoints],
      grade: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.grading]
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

  onChangeOption(field, point) {
    this.totalPointMapper.set(field, point);
    if (this.totalPointMapper.size === 20) {
      let sum = 0;
      this.totalPointMapper.forEach(data => {
        sum = sum + Number(data);
      });
      this.totalPoints = sum;
      this.creditRiskGrading.get('totalPoint').patchValue(this.totalPoints);
      if (this.totalPoints === 100) {
        this.grading = 'Superior';
      } else if (this.totalPoints >= 85) {
        this.grading = 'Good';
      } else if (this.totalPoints >= 75 && this.totalPoints < 85) {
        this.grading = 'Acceptable';
      } else if (this.totalPoints >= 65 && this.totalPoints < 75) {
        this.grading = 'Marginal/Watchlist';
      } else if (this.totalPoints >= 55 && this.totalPoints < 65) {
        this.grading = 'Special Mention';
      } else if (this.totalPoints >= 45 && this.totalPoints < 55) {
        this.grading = 'Substandard';
      } else if (this.totalPoints >= 35 && this.totalPoints < 45) {
        this.grading = 'Doubtful';
      } else if (this.totalPoints <= 35) {
        this.grading = 'Bad & Loss';
      }
      this.creditRiskGrading.get('grade').patchValue(this.grading);
    }
  }

  setFinancialScore() {
    this.debtEquityRatioOverall =
        Number(this.financialParsedData.keyIndicatorsData.debtEquityRatioOverall[this.recentFiscalYearIndex].value) / 100;
    this.currentRatio = Number(this.financialParsedData.keyIndicatorsData.currentRatio[this.recentFiscalYearIndex].value);
    this.operatingMarginProfit =
        (Number(this.financialParsedData.incomeStatementData.operatingProfit[this.recentFiscalYearIndex].value) * 100)
        / Number(this.financialParsedData.incomeStatementData.totalSalesSubCategory[0].amount[this.recentFiscalYearIndex].value);
    this.interestCoverageRatio = Number(this.financialParsedData.keyIndicatorsData.interestCoverageRatio[this.recentFiscalYearIndex].value);

    if (this.debtEquityRatioOverall < 0.25) {
      this.setDebtEquityRatioOverall(5);
    } else if (this.debtEquityRatioOverall >= 0.25 && this.debtEquityRatioOverall <= 0.50) {
      this.setDebtEquityRatioOverall(4);
    } else if (this.debtEquityRatioOverall >= 0.51 && this.debtEquityRatioOverall <= 1.25) {
      this.setDebtEquityRatioOverall(3);
    } else if (this.debtEquityRatioOverall >= 1.26 && this.debtEquityRatioOverall <= 2.00) {
      this.setDebtEquityRatioOverall(2);
    } else if (this.debtEquityRatioOverall >= 2.01 && this.debtEquityRatioOverall <= 2.75) {
      this.setDebtEquityRatioOverall(1);
    } else if (this.debtEquityRatioOverall > 2.75) {
      this.setDebtEquityRatioOverall(0);
    }

    if (this.currentRatio > 2.74) {
      this.setCurrentRatio(10);
    } else if (this.currentRatio >= 2.50 && this.currentRatio <= 2.74) {
      this.setCurrentRatio(9);
    } else if (this.currentRatio >= 2.00 && this.currentRatio <= 2.49) {
      this.setCurrentRatio(8);
    } else if (this.currentRatio >= 1.50 && this.currentRatio <= 1.99) {
      this.setCurrentRatio(7);
    } else if (this.currentRatio >= 1.10 && this.currentRatio <= 1.49) {
      this.setCurrentRatio(6);
    } else if (this.currentRatio >= 0.90 && this.currentRatio <= 1.09) {
      this.setCurrentRatio(5);
    } else if (this.currentRatio >= 0.80 && this.currentRatio <= 0.89) {
      this.setCurrentRatio(4);
    } else if (this.currentRatio >= 0.70 && this.currentRatio <= 0.79) {
      this.setCurrentRatio(3);
    } else if (this.currentRatio < 0.70) {
      this.setCurrentRatio(0);
    }

    if (this.operatingMarginProfit > 25) {
      this.setOperatingMarginProfit(10);
    } else if (this.operatingMarginProfit >= 20 && this.operatingMarginProfit <= 24) {
      this.setOperatingMarginProfit(9);
    } else if (this.operatingMarginProfit >= 15 && this.operatingMarginProfit <= 19) {
      this.setOperatingMarginProfit(8);
    } else if (this.operatingMarginProfit >= 10 && this.operatingMarginProfit <= 14) {
      this.setOperatingMarginProfit(7);
    } else if (this.operatingMarginProfit >= 7 && this.operatingMarginProfit <= 9) {
      this.setOperatingMarginProfit(6);
    } else if (this.operatingMarginProfit >= 4 && this.operatingMarginProfit <= 6) {
      this.setOperatingMarginProfit(5);
    } else if (this.operatingMarginProfit >= 1 && this.operatingMarginProfit <= 3) {
      this.setOperatingMarginProfit(3);
    } else if (this.operatingMarginProfit < 1) {
      this.setOperatingMarginProfit(0);
    } else {
      this.setOperatingMarginProfit(0);
    }

    if (this.interestCoverageRatio > 2.00) {
      this.setInterestCoverageRatio(5);
    } else if (this.interestCoverageRatio >= 1.51 && this.interestCoverageRatio <= 2) {
      this.setInterestCoverageRatio(4);
    } else if (this.interestCoverageRatio >= 1.25 && this.interestCoverageRatio <= 1.50) {
      this.setInterestCoverageRatio(3);
    } else if (this.interestCoverageRatio >= 1 && this.interestCoverageRatio <= 1.24) {
      this.setInterestCoverageRatio(2);
    } else if (this.interestCoverageRatio < 1) {
      this.setInterestCoverageRatio(0);
    }
  }

  setDebtEquityRatioOverall(points) {
    this.totalPointMapper.set('leverage', points);
    this.creditRiskGrading.get('leverage').patchValue(points);
    this.onChangeOption('leverage', points);
  }

  setCurrentRatio(points) {
    this.totalPointMapper.set('liquidity', points);
    this.creditRiskGrading.get('liquidity').patchValue(points);
    this.onChangeOption('liquidity', points);
  }

  setOperatingMarginProfit(points) {
    this.totalPointMapper.set('profit', points);
    this.creditRiskGrading.get('profit').patchValue(points);
    this.onChangeOption('profit', points);
  }

  setInterestCoverageRatio(points) {
    this.totalPointMapper.set('coverage', points);
    this.creditRiskGrading.get('coverage').patchValue(points);
    this.onChangeOption('coverage', points);
  }

  // Size of business automated evaluation--
  setSizeOfBusiness() {
    const sizeOfBusinessValue =
        Number(this.financialParsedData.incomeStatementData.totalSalesSubCategory[0].amount[this.recentFiscalYearIndex].value);
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
    this.totalPointMapper.set('sizeOfBusiness', points);
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
    this.totalPointMapper.set('ageOfBusiness', points);
    this.creditRiskGrading.get('ageOfBusiness').patchValue(points);
    this.onChangeOption('ageOfBusiness', points);
  }

  onSubmit() {
    if (!ObjectUtil.isEmpty(this.loanData.creditRiskGradingAlpha)) {
      this.creditRiskData = this.crgData;
    }
    this.creditRiskData.data = JSON.stringify(this.creditRiskGrading.value);
  }
}
