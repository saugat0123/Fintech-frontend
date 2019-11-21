import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {QuestionService} from '../../../../service/question.service';


@Component({
  selector: 'app-credit-grading',
  templateUrl: './credit-grading.component.html',
  styleUrls: ['./credit-grading.component.scss']
})
export class CreditGradingComponent implements OnInit {

  totalObtainablePoints: number;
  creditRiskGrading: FormGroup;
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

  totalPointMapper: Map<string, number> = new Map<string, number>();
  totalPoints = 0;
  grading: string;

  constructor(
      private questionService: QuestionService,
      private formBuilder: FormBuilder,
  ) {
  }

  // onChangeOption(qsnFormGroup: FormGroup, qsnId, points: number) {
  //   qsnFormGroup.controls['selectedAnswer'].setValue(points);
  //   this.totalPointMapper.set(qsnId, points);
  //   console.log(qsnId);
  //   if (this.totalPointMapper.size === this.questionList.length) {
  //     let sum = 0;
  //     this.totalPointMapper.forEach((value: number) => {
  //       sum = sum + Number(value);
  //       console.log(sum);
  //     });
  //     this.totalPoints = sum;
  //
  //     if (this.totalPoints === 100) {
  //       this.grading = 'Superior';
  //     } else if (this.totalPoints >= 85) {
  //       this.grading = 'Good';
  //     } else if (this.totalPoints >= 75 && this.totalPoints < 85) {
  //       this.grading = 'Acceptable';
  //     } else if (this.totalPoints >= 65 && this.totalPoints < 75) {
  //       this.grading = 'Marginal/Watchlist';
  //     } else if (this.totalPoints >= 55 && this.totalPoints < 65) {
  //       this.grading = 'Special Mention';
  //     } else if (this.totalPoints >= 45 && this.totalPoints < 55) {
  //       this.grading = 'Substandard';
  //     } else if (this.totalPoints >= 35 && this.totalPoints < 45) {
  //       this.grading = 'Doubtful';
  //     } else if (this.totalPoints <= 35) {
  //       this.grading = 'Bad & Loss';
  //     }
  //   }
  // }

  ngOnInit() {
    this.creditRiskGrading = this.formBuilder.group({
      leverage: [undefined, [Validators.required]],
      liquidity: [undefined, [Validators.required]],
      profit: [undefined, [Validators.required]],
      coverage: [undefined, [Validators.required]],
      sizeOfBusiness: [undefined, [Validators.required]],
      ageOfBusiness: [undefined, [Validators.required]],
      businessOutlook: [undefined, [Validators.required]],
      industryGrowth: [undefined, [Validators.required]],
      marketCompetition: [undefined, [Validators.required]],
      entryExitBarriers: [undefined, [Validators.required]],
      experience: [undefined, [Validators.required]],
      secondLineSuccession: [undefined, [Validators.required]],
      teamWork: [undefined, [Validators.required]],
      securityCoverage: [undefined, [Validators.required]],
      collateralCoverage: [undefined, [Validators.required]],
      support: [undefined, [Validators.required]],
      accountConduct: [undefined, [Validators.required]],
      utilizationOfLimit: [undefined, [Validators.required]],
      complianceOfCovenants: [undefined, [Validators.required]],
      personalDeposits: [undefined, [Validators.required]]
    });
  }

  onChangeOption(field, point) {
    this.totalPointMapper.set(field, point);
    if (this.totalPointMapper.size !== 0) {
      let sum = 0;
      this.totalPointMapper.forEach(data => {
        sum = sum + data;
        console.log(sum);
      });
      this.totalPoints = sum;
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
    }
  }


}
