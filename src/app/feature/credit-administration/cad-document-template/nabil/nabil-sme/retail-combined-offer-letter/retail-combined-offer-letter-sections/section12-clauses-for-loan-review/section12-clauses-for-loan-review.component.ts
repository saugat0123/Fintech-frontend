import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-section12-clauses-for-loan-review',
  templateUrl: './section12-clauses-for-loan-review.component.html',
  styleUrls: ['./section12-clauses-for-loan-review.component.scss']
})
export class Section12ClausesForLoanReviewComponent implements OnInit {
  @Input() cadData;
  form: FormGroup;
  tempData;
  loanName: Array<any> = new Array<any>();
  assignedData;
  isPersonalOD: boolean;
  isNabilSahayatri: boolean;
  isPersonalWoCollateral: boolean;
  isShareLoanPOD: boolean;
  isShareLoanDemand: boolean;
  isMortgageLoan: boolean;
  isHomeLoan: boolean;
  isAutoLoan: boolean;
  isPersonalLoan: boolean;
  isEducationLoan:  boolean;
  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
    this.tempData = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
    this.checkLoan();
  }
  buildForm() {
    return this.form = this.formBuilder.group({

    });
  }
  checkLoan() {
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.assignedData = this.cadData.assignedLoan.forEach(value => {
        this.loanName.push(value.loan.name);
      });
      this.loanName.forEach(value => {
        if (value === 'PERSONAL OVERDRAFT COMBINED') {
          this.isPersonalOD = true;
        }
        if (value === 'NABIL SAHAYATRI KARJA') {
          this.isNabilSahayatri = true;
        }
        if (value === 'PERSONAL OVERDRAFT WITHOUT COLLATERAL COMBINED') {
          this.isPersonalWoCollateral = true;
        }
        if (value === 'NABIL SHARE LOAN POD COMBINED') {
          this.isShareLoanPOD = true;
        }
        if (value === 'SHARE LOAN DEMAND COMBINED') {
          this.isShareLoanDemand = true;
        }
        if (value === 'MORTGAGE LOAN COMBINED') {
          this.isMortgageLoan = true;
        }
        if (value === 'HOME LOAN COMBINED') {
          this.isHomeLoan = true;
        }
        if (value === 'AUTO LOAN COMBINED') {
          this.isAutoLoan = true;
        }
        if (value === 'PERSONAL LOAN COMBINED') {
          this.isPersonalLoan = true;
        }
        if (value === 'EDUCATION LOAN COMBINED') {
          this.isEducationLoan = true;
        }
      });
    }
  }
}
