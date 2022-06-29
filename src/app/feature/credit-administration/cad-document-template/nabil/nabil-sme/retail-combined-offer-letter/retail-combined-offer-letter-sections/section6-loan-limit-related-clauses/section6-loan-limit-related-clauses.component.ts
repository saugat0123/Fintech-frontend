import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-section6-loan-limit-related-clauses',
  templateUrl: './section6-loan-limit-related-clauses.component.html',
  styleUrls: ['./section6-loan-limit-related-clauses.component.scss']
})
export class Section6LoanLimitRelatedClausesComponent implements OnInit {
  @Input() cadData;
  form: FormGroup;
  tempData;
  loanName: Array<any> = new Array<any>();
  loanNepaliName: Array<any> = new Array<any>();
  assignedData;
  isOthers: boolean;
  isMortgageLoan: boolean;
  isHomeLoan: boolean;
  isAutoLoan: boolean;
  isPersonalLoan: boolean;
  isShareLoan: boolean;
  isPersonalOD: boolean;
  isPersonalWoCollateral: boolean;
  isNabilShareLoan: boolean;
  isNabilSahayatri: boolean;
  isNotOthers: boolean;
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
      totalLimitInFigure: [undefined],
      totalLimitInWords: [undefined]
    });
  }
  fillForm() {
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.assignedData = this.cadData.assignedLoan.forEach(value => {
        if (!this.loanName.includes(value.loan.name)) {
          this.loanName.push(value.loan.name);
          this.loanNepaliName.push(value.loan.nepaliName);
        }
      });
      this.loanName.forEach(value => {
        if (value === 'AUTO LOAN COMBINED') {
          this.isAutoLoan = true;
        }
        if (value === 'EDUCATION LOAN COMBINED') {
          this.tempData.educationLoanForm.educationLoanCombinedFormArray.forEach(val => {
            if (val.countryName === 'OTHERS') {
              this.isOthers = true;
            }
            if (val.countryName !== 'OTHERS') {
              this.isNotOthers = true;
            }
          });
        }
        if (value === 'HOME LOAN COMBINED') {
          this.isHomeLoan = true;
        }
        if (value === 'MORTGAGE LOAN COMBINED') {
          this.isMortgageLoan = true;
        }
        if (value === 'NABIL SAHAYATRI KARJA') {
          this.isNabilSahayatri = true;
        }
        if (value === 'NABIL SHARE LOAN POD COMBINED') {
          this.isNabilShareLoan = true;
        }
        if (value === 'PERSONAL LOAN COMBINED') {
          this.isPersonalLoan = true;
        }
        if (value === 'PERSONAL OVERDRAFT COMBINED') {
          this.isPersonalOD = true;
        }
        if (value === 'PERSONAL OVERDRAFT WITHOUT COLLATERAL COMBINED') {
          this.isPersonalWoCollateral = true;
        }
        if (value === 'SHARE LOAN DEMAND COMBINED') {
          this.isShareLoan = true;
        }
      });
    }
    this.form.patchValue({
      totalLimitInFigure: this.tempData.retailGlobalForm.totalLimitInFigureCT ? this.tempData.retailGlobalForm.totalLimitInFigureCT : '',
      totalLimitInWords: this.tempData.retailGlobalForm.totalLimitInWordsCT ? this.tempData.retailGlobalForm.totalLimitInWordsCT : '',
    });


  }
}
