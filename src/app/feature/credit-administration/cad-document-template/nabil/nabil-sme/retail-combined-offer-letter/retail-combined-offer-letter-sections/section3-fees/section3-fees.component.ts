import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-section3-fees',
  templateUrl: './section3-fees.component.html',
  styleUrls: ['./section3-fees.component.scss']
})
export class Section3FeesComponent implements OnInit {
  @Input() cadData;
  form: FormGroup;
  loanName: Array<any> = new Array<any>();
  tempData;
  loanCommitmentCheck;
  loanCommitmentFeeInPercent;
  isFloating: boolean;
  isFixed: boolean;
  isPersonalOD: boolean;
  isNabilSahayatri: boolean;
  isPersonalWoCollateral: boolean;
  isShareLoan: boolean;
  isAutoLoan: boolean;
  isShareLoanDemand: boolean;
  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
    this.tempData = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
    this.fillForm();
  }
  buildForm() {
    return this.form = this.formBuilder.group({
      PODPercentage: [undefined]
    });
  }
  fillForm() {
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.cadData.assignedLoan.forEach(val => {
        this.loanName.push(val.loan.name);
      });
      this.loanName.forEach(value => {
        if (value === 'AUTO LOAN COMBINED') {
          this.tempData.autoLoanCombinedForm.autoLoanCombinedFormArray.forEach(val => {
            if (val.interestRateType === 'FIXED_INTEREST') {
              this.isFixed = true;
            }if (val.interestRateType === 'FLOATING_INTEREST') {
              this.isFloating = true;
            }
          });
        }
        if (value === 'EDUCATION LOAN COMBINED') {
          this.tempData.educationLoanForm.educationLoanCombinedFormArray.forEach(val => {
            if (val.interestRateType === 'FIXED_INTEREST') {
              this.isFixed = true;
            }if (val.interestRateType === 'FLOATING_INTEREST') {
              this.isFloating = true;
            }
          });
        }
        if (value === 'HOME LOAN COMBINED') {
          this.tempData.homeLoanCombinedForm.homeLoanCombinedFormArray.forEach(val => {
            if (val.interestRateType === 'FIXED_INTEREST') {
              this.isFixed = true;
            }if (val.interestRateType === 'FLOATING_INTEREST') {
              this.isFloating = true;
            }
          });
        }
        if (value === 'MORTGAGE LOAN COMBINED') {
          this.tempData.mortgageCombineForm.mortgageCombineLoanFormArray.forEach(val => {
            if (val.interestRateType === 'FIXED_INTEREST') {
              this.isFixed = true;
            }if (val.interestRateType === 'FLOATING_INTEREST') {
              this.isFloating = true;
            }
          });
        }
        if (value === 'NABIL SAHAYATRI KARJA') {
          this.tempData.nabilSahayatriCombinedForm.nabilSahayatriCombinedFormArray.forEach(val => {
            if (val.interestRateType === 'FIXED_INTEREST') {
              this.isFixed = true;
            }if (val.interestRateType === 'FLOATING_INTEREST') {
              this.isFloating = true;
            }
          });
          this.isNabilSahayatri = true;
        }
        if (value === 'NABIL SHARE LOAN POD COMBINED') {
          this.tempData.nabilShareLoanPODForm.nabilShareLoanPODFormArray.forEach(val => {
            if (val.interestRateType === 'FIXED_INTEREST') {
              this.isFixed = true;
            }if (val.interestRateType === 'FLOATING_INTEREST') {
              this.isFloating = true;
            }
          });
          this.isShareLoan = true;
        }
        if (value === 'SHARE LOAN DEMAND COMBINED') {
          this.tempData.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray.forEach(val => {
            if (val.interestRateType === 'FIXED_INTEREST') {
              this.isFixed = true;
            }if (val.interestRateType === 'FLOATING_INTEREST') {
              this.isFloating = true;
            }
          });
          this.isShareLoanDemand = true;
        }
        if (value === 'PERSONAL LOAN COMBINED') {
          this.tempData.personalLoanCombinedForm.personalLoanCombinedFormArray.forEach(val => {
            if (val.interestRateType === 'FIXED_INTEREST') {
              this.isFixed = true;
            }if (val.interestRateType === 'FLOATING_INTEREST') {
              this.isFloating = true;
            }
          });
        }
        if (value === 'PERSONAL OVERDRAFT COMBINED') {
          this.tempData.personalOverdraftCombinedForm.personalOverdraftCombinedFormArray.forEach(val => {
            if (val.interestRateType === 'FIXED_INTEREST') {
              this.isFixed = true;
            }if (val.interestRateType === 'FLOATING_INTEREST') {
              this.isFloating = true;
            }
          });
          this.isPersonalOD = true;
        }
        if (value === 'PERSONAL OVERDRAFT WITHOUT COLLATERAL COMBINED') {
          this.tempData.personalOverDraftWithoutCollateralCombinedForm.personalOverDraftWithoutCollateralCombinedFormArray.forEach(val => {
            if (val.interestRateType === 'FIXED_INTEREST') {
              this.isFixed = true;
            }if (val.interestRateType === 'FLOATING_INTEREST') {
              this.isFloating = true;
            }
          });
          this.isPersonalWoCollateral = true;
        }
        if (value === 'SHARE LOAN DEMAND COMBINED') {
          this.tempData.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray.forEach(val => {
            if (val.interestRateType === 'FIXED_INTEREST') {
              this.isFixed = true;
            }if (val.interestRateType === 'FLOATING_INTEREST') {
              this.isFloating = true;
            }
          });
          this.isPersonalWoCollateral = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
      this.loanCommitmentCheck = this.tempData.retailGlobalForm.loanCommitmentCheck;
      if (this.loanCommitmentCheck === true) {
        this.loanCommitmentFeeInPercent = this.tempData.retailGlobalForm ? this.tempData.retailGlobalForm.loanCommitmentFeeInPercentCT : '';
      }
    }
    this.form.patchValue({
      PODPercentage : this.loanCommitmentFeeInPercent ? this.loanCommitmentFeeInPercent : ''
    });
  }
}
