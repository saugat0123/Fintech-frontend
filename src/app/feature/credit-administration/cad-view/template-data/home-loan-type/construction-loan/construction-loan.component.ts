import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-construction-loan',
  templateUrl: './construction-loan.component.html',
  styleUrls: ['./construction-loan.component.scss']
})
export class ConstructionLoanComponent implements OnInit {

  constructionLoanForm: FormGroup;
  dateType = [{key: 'AD', value: 'AD'}, {key: 'BS', value: 'BS'}];
  ADApproval = false;
  ADApplication = false;
  BSApproval = false;
  BSApplication = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): FormGroup {
    return this.constructionLoanForm = this.formBuilder.group({
      referenceNumber: [undefined],
      referenceNumberCT: [undefined],
      dateType: [undefined],
      dateTypeCT: [undefined],
      dateOfApproval: [undefined],
      dateOfApprovalCT: [undefined],
      nepaliDateOfApproval: [undefined],
      nepaliDateOfApprovalCT: [undefined],
      applicationDateType: [undefined],
      applicationDateTypeCT: [undefined],
      nepaliDateOfApplication: [undefined],
      nepaliDateOfApplicationCT: [undefined],
      dateOfApplication: [undefined],
      dateOfApplicationCT: [undefined],
      purposeOfLoan: [undefined],
      purposeOfLoanCT: [undefined],
      drawingPower: [undefined],
      drawingPowerCT: [undefined],
      loanAmountInFigure: [undefined],
      loanAmountInFigureCT: [undefined],
      loanAmountInfWord: [undefined],
      loanAmountInfWordCT: [undefined],
      baseRate: [undefined],
      baseRateCT: [undefined],
      premiumRate: [undefined],
      premiumRateCT: [undefined],
      interestRate: [undefined],
      interestRateCT: [undefined],
      loanAdminFeeInFigure: [undefined],
      loanAdminFeeInFigureCT: [undefined],
      loanAdminFeeInWord: [undefined],
      loanAdminFeeInWordCT: [undefined],
      emiInFigure: [undefined],
      emiInFigureCT: [undefined],
      emiInWord: [undefined],
      emiInWordCT: [undefined],
      loanPeriodInMonths: [undefined],
      loanPeriodInMonthsCT: [undefined],
      moratoriumPeriodInMonth: [undefined],
      moratoriumPeriodInMonthCT: [undefined],
      loanCommitmentFee: [undefined],
      loanCommitmentFeeCT: [undefined],
      costOfConstruction: [undefined],
      costOfConstructionCT: [undefined],
      firstInstallmentAmount: [undefined],
      firstInstallmentAmountCT: [undefined],
    });
  }

  public dateOfApproval(value): void {
    this.ADApproval = value === 'AD';
    this.BSApproval = value === 'BS';
  }

  public dateOfApplication(value) {
    this.ADApplication = value === 'AD';
    this.BSApplication = value === 'BS';
  }

}
