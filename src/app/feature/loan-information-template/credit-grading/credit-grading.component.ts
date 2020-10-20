import {Component, EventEmitter, Input, OnInit, Output, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {QuestionService} from '../../service/question.service';
import {CreditRiskGrading} from '../../admin/modal/creditRiskGrading';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';


@Component({
  selector: 'app-credit-grading',
  templateUrl: './credit-grading.component.html',
  styleUrls: ['./credit-grading.component.scss']
})
export class CreditGradingComponent implements OnInit {
  @Input() formData: CreditRiskGrading;
  @Input() fromProfile: boolean;
  @Output() crgDataEmitter = new EventEmitter();
  totalPointsColspan = 4;
  submitted = false;
  creditRiskGrading: FormGroup;
  creditRiskData: CreditRiskGrading = new CreditRiskGrading();
  points: any;
  leverageMap: Map<any, any> = new Map<any, any>([
          [15, 'Less than 0.25x'],
          [14, '0.26x to 0.35x'],
          [13, '0.36x to 0.50x'],
          [12, '0.51x to 0.75x'],
          [11, '0.76x to 1.25x'],
          [10, '1.26x to 2.00x'],
          [8 , '2.01x to 2.50x'],
          [7 , '2.51x to 2.75x'],
          [0 , 'More than 2.75x']
      ]
  );
  liquidityMap: Map<any, any> = new Map<any, any>([
        [15, 'Greater than 2.74x'],
        [14, '2.50x to 2.74x'],
        [13, '1.50x to 1.99x'],
        [12, '1.10x to 1.49x'],
        [11, '0.90x to 1.09x'],
        [10, '0.80x to 0.89x'],
        [8 , '0.70x to 0.79x'],
        [0 , 'Less than 0.70x']
      ]
  );
  profitMap: Map<any, any> = new Map<any, any>([
        [15, 'Greater than 25%'],
        [14, '20% to 24%'],
        [13, '15% to 19%'],
        [12, '10% to 14%'],
        [10, '7% to 9%'],
        [9 , '4% to 6%'],
        [7 , '1% to 3%'],
        [0 , 'Less than 1%']
      ]
  );
  coverageMap: Map<any, any> = new Map<any, any>([
        [5, 'More than 2.00x'],
        [4, 'More than 1.51x Less than 2.00x'],
        [3, 'More than 1.25x Less than 1.50x'],
        [2, 'More than 1.00x Less than 1.24x'],
        [0, 'Less than 1.00x']
      ]
  );

    sizeOfBusinessMap: Map<any, any> = new Map<any, any>([
            [5, '> 60.00'],
            [4, '30.00 – 59.99'],
            [3, '10.00 – 29.99'],
            [2, '5.00 - 9.99'],
            [1, '2.50 - 4.99'],
            [0, '< 2.50']
        ]
    );
    ageOfBusinessMap: Map<any, any> = new Map<any, any>([
            [3, '> 10 years'],
            [2, '> 5 - 10 years'],
            [1, '2 -5 years'],
            [0, '< 2 years']
        ]
    );
    businessOutlookMap: Map<any, any> = new Map<any, any>([
            [3, 'Favorable'],
            [2, 'Stable'],
            [1, 'Slightly Uncertain'],
            [0, 'Cause for Concern']
        ]
    );
    industryGrowthMap: Map<any, any> = new Map<any, any>([
            [3, 'Strong (10% +)'],
            [2, 'Good ( > 5% - 10%)'],
            [1, 'Moderate (1% - 5%)'],
            [0, 'No Growth ( < 1%)']
        ]
    );
    marketCompetitionMap: Map<any, any> = new Map<any, any>([
            [2, 'Dominant Player'],
            [1, 'Moderately Competitive'],
            [0, 'Highly Competitive']
        ]
    );
    entryExitBarriersMap: Map<any, any> = new Map<any, any>([
            [2, 'Difficult'],
            [1, 'Average'],
            [0, 'Easy']
        ]
    );

    experienceMap: Map<any, any> = new Map<any, any>([
            [5, 'More than 10 years in the related line of business'],
            [3, '5-10 years in the related line of business'],
            [2, '1-5 years in the related line of business'],
            [0, 'No experience']
        ]
    );
    secondLineSuccessionMap: Map<any, any> = new Map<any, any>([
            [4, 'Ready Succession'],
            [3, 'Succession within 1-2 years'],
            [2, 'Succession within 2-3 years'],
            [0, 'Succession in question']
        ]
    );
    teamWorkMap: Map<any, any> = new Map<any, any>([
            [3, 'Very Good'],
            [2, 'Moderate'],
            [1, 'Poor'],
            [0, 'Regular Conflict']
        ]
    );
    securityCoverageMap: Map<any, any> = new Map<any, any>([
            [4, 'Fully pledged facilities/substantially cash covered/Reg. Mortg, for HBL'],
            [3, 'Registered Hypothecation (1st charge/1st Pari passu charge)'],
            [2, '2nd Charge/Inferior charge'],
            [1, 'Simple hypothecation/negative lien on assets'],
            [0, 'No Security']
        ]
    );
    collateralCoverageMap: Map<any, any> = new Map<any, any>([
            [4, 'Registered Mortgage on Municipal Corporation/Prime area property'],
            [3, 'Registered Mortgage on Pourashava/semi-urban area property'],
            [2, 'Equitable Mortgage or No property but plant & machinery as collateral'],
            [1, 'Negative lien on collateral'],
            [0, 'No collateral']
        ]
    );

    supportMap: Map<any, any> = new Map<any, any>([
            [2, 'Personal guarantee with high net worth or Strong Corporate Guarantee'],
            [1, 'Personal Guarantees or Corporate Guarantee with average financial strength'],
            [0, 'No Support/Guarantee']
        ]
    );
    accountConductMap: Map<any, any> = new Map<any, any>([
            [5, 'More than 3 (three) years accounts with faultless record'],
            [4, 'Less than 3 (three) years accounts with faultless record'],
            [2, 'Accounts having satisfactory dealings with some late payments'],
            [0, 'Frequent Past dues & Irregular dealings in account']
        ]
    );
    utilizationOfLimitMap: Map<any, any> = new Map<any, any>([
            [2, 'More than 60%'],
            [1, '40% - 60%'],
            [0, 'Less than 40%']
        ]
    );
    complianceOfCovenantsMap: Map<any, any> = new Map<any, any>([
            [2, 'Full Compliance'],
            [1, 'Some Non-Compliance'],
            [0, 'No Compliance']
        ]
    );
    personalDepositsMap: Map<any, any> = new Map<any, any>([
            [1, 'Personal accounts of the key business Sponsors/ Principals are maintained in the bank, with significant deposits'],
            [0, 'No depository relationship']
        ]
    );

  totalPointMapper: Map<string, number>;
  totalPoints = 0;
  grading: string;
  formDataForEdit;

  constructor(
      private questionService: QuestionService,
      private formBuilder: FormBuilder,
      private el: ElementRef,
  ) {
  }

  ngOnInit() {
    if (!this.fromProfile) {
      this.totalPointsColspan = 2;
    }
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

  /**
   *  @description
   *  Orders elements of particular map in insertion order wile using
   *  keyvalue pipe
   */
  asIsOrder(a, b) {
      return 1;
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
      totalPoint: [this.formDataForEdit === undefined ? 0 : this.formDataForEdit.totalPoints],
      grade: [this.formDataForEdit === undefined ? '' : this.formDataForEdit.grading]
    });
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
    scrollToFirstInvalidControl() {
        const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
            'form .ng-invalid'
        );
        window.scroll({
            top: this.getTopOffset(firstInvalidControl),
            left: 0,
            behavior: 'smooth'
        });
        firstInvalidControl.focus();
    }

    private getTopOffset(controlEl: HTMLElement): number {
        const labelOffset = 50;
        return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
    }


    onSubmit() {
        this.submitted = true;
        if (this.creditRiskGrading.invalid) {
            this.scrollToFirstInvalidControl();
            return;
        }

        if (!ObjectUtil.isEmpty(this.formData)) {
      this.creditRiskData = this.formData;
    }
    this.creditRiskData.data = JSON.stringify(this.creditRiskGrading.value);
    this.crgDataEmitter.emit(this.creditRiskData.data);
  }
}
