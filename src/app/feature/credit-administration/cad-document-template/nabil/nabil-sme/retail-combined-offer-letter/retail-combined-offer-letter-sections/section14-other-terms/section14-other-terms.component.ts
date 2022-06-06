import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-section14-other-terms',
  templateUrl: './section14-other-terms.component.html',
  styleUrls: ['./section14-other-terms.component.scss']
})
export class Section14OtherTermsComponent implements OnInit {
  @Input() cadData;
  form: FormGroup;
  tempData;
  loanName: Array<any> = new Array<any>();
  assignedData;
  isShareLoan: boolean;
  NCELL: boolean;
  isEduLoan: boolean;
  tempInformation;

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
    if (!ObjectUtil.isEmpty(this.cadData)) {
      this.tempData = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
      if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList[0]) &&
          !ObjectUtil.isEmpty(this.cadData.offerDocumentList[0].supportedInformation)) {
        this.tempInformation = JSON.parse(this.cadData.offerDocumentList[0].supportedInformation);
      }
    }
    this.checkCondition();
    if (!ObjectUtil.isEmpty(this.tempInformation) &&
        !ObjectUtil.isEmpty(this.tempInformation.section14)) {
      this.form.get('nameOfEmbassyFreeTxt').patchValue(this.tempInformation.section14);
    }
    this.checkLoan();
  }

  checkLoan() {
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.assignedData = this.cadData.assignedLoan.forEach(value => {
        if (!this.loanName.includes(value.loan.name)) {
          this.loanName.push(value.loan.name);
        }
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

  buildForm() {
    return this.form = this.formBuilder.group({
      nameOfEmbassyFreeTxt: [undefined]
    });
  }
  checkCondition() {
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.assignedData = this.cadData.assignedLoan.forEach(value => {
        if (!this.loanName.includes(value.loan.name)) {
          this.loanName.push(value.loan.name);
        }
      });
      this.loanName.forEach(value => {
        if (value === 'NABIL SHARE LOAN POD COMBINED' || value === 'SHARE LOAN DEMAND COMBINED') {
          this.isShareLoan = true;
        }
        if (value === 'HOME LOAN COMBINED') {
          this.tempData.homeLoanCombinedForm.homeLoanCombinedFormArray.forEach(val => {
            if (val.NcellStaffCheck === true) {
              this.NCELL = true;
            }
          });
        }
        if (value === 'EDUCATION LOAN COMBINED') {
          this.isEduLoan = true;
        }
      });
    }
  }
}
