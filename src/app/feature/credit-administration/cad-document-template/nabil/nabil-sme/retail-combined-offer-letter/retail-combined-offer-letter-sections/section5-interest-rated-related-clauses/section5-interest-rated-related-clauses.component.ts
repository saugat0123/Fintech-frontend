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
  loanName;
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
      this.assignedData = this.cadData.assignedLoan[0];
      this.loanName = this.assignedData.loan.name;
      if (this.loanName === 'AUTO LOAN COMBINED') {
        this.tempData.autoLoanCombinedForm.autoLoanCombinedFormArray.forEach(val => {
          if (val.interestRateType === 'FIXED_INTEREST') {
            this.isFixed = true;
          }if (val.interestRateType === 'FLOATING_INTEREST') {
            this.isFloating = true;
          }
        });
      }
      if (this.loanName === 'EDUCATION LOAN COMBINED') {
        this.tempData.educationLoanCombinedForm.educationLoanCombinedFormArray.forEach(val => {
          if (val.interestRateType === 'FIXED_INTEREST') {
            this.isFixed = true;
          }if (val.interestRateType === 'FLOATING_INTEREST') {
            this.isFloating = true;
          }
        });
      }
      if (this.tempData.existingLoanForm.isExistingLoan = true) {
        this.tempData.existingLoanForm.existingLoanFormArray.forEach(val => {
          if (val.interestRateType === 'FIXED_INTEREST') {
            this.isFixed = true;
          }if (val.interestRateType === 'FLOATING_INTEREST') {
            this.isFloating = true;
          }
        });
      }
      if (this.loanName === 'HOME LOAN COMBINED') {
        this.tempData.homeLoanCombinedForm.homeLoanCombinedFormArray.forEach(val => {
          if (val.interestRateType === 'FIXED_INTEREST') {
            this.isFixed = true;
          }if (val.interestRateType === 'FLOATING_INTEREST') {
            this.isFloating = true;
          }
        });
      }
      if (this.loanName === 'MORTGAGE LOAN COMBINED') {
        this.tempData.mortgageCombineLoanForm.mortgageCombineLoanFormArray.forEach(val => {
          if (val.interestRateType === 'FIXED_INTEREST') {
            this.isFixed = true;
          }if (val.interestRateType === 'FLOATING_INTEREST') {
            this.isFloating = true;
          }
        });
      }
      if (this.loanName === 'NABIL SAHAYATRI KARJA') {
        this.tempData.nabilSahayatriCombinedForm.nabilSahayatriCombinedFormArray.forEach(val => {
          if (val.interestRateType === 'FIXED_INTEREST') {
            this.isFixed = true;
          }if (val.interestRateType === 'FLOATING_INTEREST') {
            this.isFloating = true;
          }
        });
      }
      if (this.loanName === 'NABIL SHARE LOAN POD COMBINED') {
        this.tempData.nabilShareLoanPODForm.nabilShareLoanPODFormArray.forEach(val => {
          if (val.interestRateType === 'FIXED_INTEREST') {
            this.isFixed = true;
          }if (val.interestRateType === 'FLOATING_INTEREST') {
            this.isFloating = true;
          }
        });
      }
      if (this.loanName === 'PERSONAL LOAN COMBINED') {
        this.tempData.personalLoanCombinedForm.personalLoanCombinedFormArray.forEach(val => {
          if (val.interestRateType === 'FIXED_INTEREST') {
            this.isFixed = true;
          }if (val.interestRateType === 'FLOATING_INTEREST') {
            this.isFloating = true;
          }
        });
      }
      if (this.loanName === 'PERSONAL OVERDRAFT COMBINED') {
        this.tempData.personalOverdraftCombinedForm.personalOverdraftCombinedFormArray.forEach(val => {
          if (val.interestRateType === 'FIXED_INTEREST') {
            this.isFixed = true;
          }if (val.interestRateType === 'FLOATING_INTEREST') {
            this.isFloating = true;
          }
        });
      }
      if (this.loanName === 'PERSONAL OVERDRAFT WITHOUT COLLATERAL COMBINED') {
        this.tempData.personalOverDraftWithoutCollateralCombinedForm.personalOverDraftWithoutCollateralCombinedFormArray.forEach(val => {
          if (val.interestRateType === 'FIXED_INTEREST') {
            this.isFixed = true;
          }if (val.interestRateType === 'FLOATING_INTEREST') {
            this.isFloating = true;
          }
        });
      }
    }
  }
}
