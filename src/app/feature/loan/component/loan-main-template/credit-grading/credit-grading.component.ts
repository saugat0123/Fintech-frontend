import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {QuestionService} from '../../../../service/question.service';
import {CreditRiskGrading} from '../../../../admin/modal/creditRiskGrading';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';


@Component({
  selector: 'app-credit-grading',
  templateUrl: './credit-grading.component.html',
  styleUrls: ['./credit-grading.component.scss']
})
export class CreditGradingComponent implements OnInit {
  @Input() formData: CreditRiskGrading;
  creditRiskGrading: FormGroup;
  creditRiskData: CreditRiskGrading = new CreditRiskGrading();
  points: any;
  leverage = [15, 14, 13, 12, 11, 10, 8, 7, 0];
  liquidity = [15, 14, 13, 12, 11, 10, 8, 7, 0];
  profit = [15, 14, 13, 12, 10, 9, 7, 0];
  coverage = [5, 4, 3, 2, 0];
  sizeOfBusiness = [5, 4, 3, 2, 1, 0];
  ageOfBusiness = [3, 2, 1, 0];
  businessOutlook = [3, 2, 1, 0];
  industryGrowth = [3, 2, 1, 0];
  marketCompetition = [2, 1, 0];
  entryExitBarriers = [2, 1, 0];
  experience = [5, 3, 2, 0];
  secondLineSuccession = [4, 3, 2, 0];
  teamWork = [3, 2, 1, 0];
  securityCoverage = [4, 3, 2, 1, 0];
  collateralCoverage = [4, 3, 2, 1, 0];
  support = [2, 1, 0];
  accountConduct = [5, 4, 2, 0];
  utilizationOfLimit = [2, 1, 0];
  complianceOfCovenants = [2, 1, 0];
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
    if (!ObjectUtil.isEmpty(this.formData)) {
      this.formDataForEdit = JSON.parse(this.formData.data);
    }
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
    this.buildForm();
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

  onChangeOption(field, point) {
    this.totalPointMapper.set(field, point);
    if (this.totalPointMapper.size === 20) {
      let sum = 0;
      this.totalPointMapper.forEach(data => {
        sum = sum + data;
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

  onSubmit() {
    if (!ObjectUtil.isEmpty(this.formData)) {
      this.creditRiskData = this.formData;
    }
    this.creditRiskData.data = JSON.stringify(this.creditRiskGrading.value);
  }
}
