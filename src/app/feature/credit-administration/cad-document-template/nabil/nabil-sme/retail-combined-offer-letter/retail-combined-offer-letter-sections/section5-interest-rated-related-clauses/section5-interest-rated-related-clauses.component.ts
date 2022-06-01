import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-section5-interest-rated-related-clauses',
  templateUrl: './section5-interest-rated-related-clauses.component.html',
  styleUrls: ['./section5-interest-rated-related-clauses.component.scss']
})
export class Section5InterestRatedRelatedClausesComponent implements OnInit {
  @Input() cadData;
  form: FormGroup;
  tempData;
  loanName: Array<any> = new Array<any>();
  assignedData;
  isFixed;
  isFloating;
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

    });
  }
  fillForm() {
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.assignedData = this.cadData.assignedLoan.forEach(val => {
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
        }
        if (value === 'NABIL SHARE LOAN POD COMBINED') {
          this.tempData.nabilShareLoanPODForm.nabilShareLoanPODFormArray.forEach(val => {
            if (val.interestRateType === 'FIXED_INTEREST') {
              this.isFixed = true;
            }if (val.interestRateType === 'FLOATING_INTEREST') {
              this.isFloating = true;
            }
          });
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
        }
        if (value === 'PERSONAL OVERDRAFT WITHOUT COLLATERAL COMBINED') {
          this.tempData.personalOverDraftWithoutCollateralCombinedForm.personalOverDraftWithoutCollateralCombinedFormArray.forEach(val => {
            if (val.interestRateType === 'FIXED_INTEREST') {
              this.isFixed = true;
            }if (val.interestRateType === 'FLOATING_INTEREST') {
              this.isFloating = true;
            }
          });
        }
        if (value === 'SHARE LOAN DEMAND COMBINED') {
          this.tempData.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray.forEach(val => {
            if (val.interestRateType === 'FIXED_INTEREST') {
              this.isFixed = true;
            }if (val.interestRateType === 'FLOATING_INTEREST') {
              this.isFloating = true;
            }
          });
        }
      });
    }
  }
}
