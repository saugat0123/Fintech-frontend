import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-section13-clauses-personal-loan-and-overdraft',
  templateUrl: './section13-clauses-personal-loan-and-overdraft.component.html',
  styleUrls: ['./section13-clauses-personal-loan-and-overdraft.component.scss']
})
export class Section13ClausesPersonalLoanAndOverdraftComponent implements OnInit {
  @Input() cadData;
  form: FormGroup;
  tempData;
  assignedData;
  loanName: Array<any> = new Array<any>();
  isPersonalLoan: boolean;
  isPersonalWoCollateral: boolean;
  companyName;
  nameOfCompany: Array<any> = new Array<any>();
  personalArray: Array<any> = new Array<any>();
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
      nameOfCompany: [undefined]
    });
  }
  checkLoan() {
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.assignedData = this.cadData.assignedLoan.forEach(value => {
        this.loanName.push(value.loan.name);
      });
      this.getLoan();
      if (!ObjectUtil.isEmpty(this.tempData) &&
      !ObjectUtil.isEmpty(this.tempData.personalLoanCombinedForm) &&
      !ObjectUtil.isEmpty(this.tempData.personalLoanCombinedForm.personalLoanCombinedFormArray)) {
        this.personalArray = this.tempData.personalLoanCombinedForm.personalLoanCombinedFormArray.filter(val =>
            !ObjectUtil.isEmpty(val.nameOfCompanyCT) ? val.nameOfCompanyCT : ''
      );
      }
      if (!ObjectUtil.isEmpty(this.tempData) &&
        !ObjectUtil.isEmpty(this.tempData.personalOverDraftWithoutCollateralCombinedForm) &&
        // tslint:disable-next-line:max-line-length
        !ObjectUtil.isEmpty(this.tempData.personalOverDraftWithoutCollateralCombinedForm.personalOverDraftWithoutCollateralCombinedFormArray)) {
        // tslint:disable-next-line:max-line-length
        this.personalArray = this.tempData.personalOverDraftWithoutCollateralCombinedForm.personalOverDraftWithoutCollateralCombinedFormArray.filter(val =>
            !ObjectUtil.isEmpty(val.nameOfCompanyCT) ? val.nameOfCompanyCT : '');
      }
      if (this.personalArray.length > 0) {
        this.companyName = this.personalArray[0];
      }
    }
    this.form.patchValue({
      nameOfCompany: this.companyName ? this.companyName.nameOfCompanyCT : '',
    });
  }
  getLoan() {
    this.loanName.forEach(value => {
      if (value === 'PERSONAL LOAN COMBINED') {
        this.isPersonalLoan = true;
      }
      if (value === 'PERSONAL OVERDRAFT WITHOUT COLLATERAL COMBINED') {
        this.isPersonalWoCollateral = true;
      }
    });
  }
}
