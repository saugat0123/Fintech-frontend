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
      referenceNumberTrans: [undefined],
      dateType: [undefined],
      dateTypeCT: [undefined],
      dateOfApproval: [undefined],
      dateOfApprovalCT: [undefined],
      dateOfApprovalTrans: [undefined],
      nepaliDateOfApproval: [undefined],
      nepaliDateOfApprovalCT: [undefined],
      applicationDateType: [undefined],
      applicationDateTypeCT: [undefined],
      applicationDateTypeTrans: [undefined],
      nepaliDateOfApplication: [undefined],
      nepaliDateOfApplicationCT: [undefined],
      dateOfApplication: [undefined],
      dateOfApplicationCT: [undefined],
      purposeOfLoan: [undefined],
      purposeOfLoanCT: [undefined],
      purposeOfLoanTrans: [undefined],
      drawingPower: [undefined],
      drawingPowerCT: [undefined],
      drawingPowerTrans: [undefined],
      loanAmountInFigure: [undefined],
      loanAmountInFigureCT: [undefined],
      loanAmountInFigureTrans: [undefined],
      loanAmountInfWord: [undefined],
      loanAmountInfWordCT: [undefined],
      loanAmountInfWordTrans: [undefined],
      baseRate: [undefined],
      baseRateCT: [undefined],
      baseRateTrans: [undefined],
      premiumRate: [undefined],
      premiumRateCT: [undefined],
      premiumRateTrans: [undefined],
      interestRate: [undefined],
      interestRateCT: [undefined],
      interestRateTrans: [undefined],
      loanAdminFeeInFigure: [undefined],
      loanAdminFeeInFigureCT: [undefined],
      loanAdminFeeInFigureTrans: [undefined],
      loanAdminFeeInWord: [undefined],
      loanAdminFeeInWordCT: [undefined],
      loanAdminFeeInWordTrans: [undefined],
      emiInFigure: [undefined],
      emiInFigureCT: [undefined],
      emiInFigureTrans: [undefined],
      emiInWord: [undefined],
      emiInWordCT: [undefined],
      emiInWordTrans: [undefined],
      loanPeriodInMonths: [undefined],
      loanPeriodInMonthsCT: [undefined],
      loanPeriodInMonthsTrans: [undefined],
      moratoriumPeriodInMonth: [undefined],
      moratoriumPeriodInMonthCT: [undefined],
      moratoriumPeriodInMonthTrans: [undefined],
      loanCommitmentFee: [undefined],
      loanCommitmentFeeCT: [undefined],
      loanCommitmentFeeTrans: [undefined],
      costOfConstruction: [undefined],
      costOfConstructionCT: [undefined],
      costOfConstructionTrans: [undefined],
      firstInstallmentAmount: [undefined],
      firstInstallmentAmountCT: [undefined],
      firstInstallmentAmountTrans: [undefined],
      costOfConstructionInSecondPhase: [undefined],
      costOfConstructionInSecondPhaseCT: [undefined],
      costOfConstructionInSecondPhaseTrans: [undefined],
      secondInstallmentAmount: [undefined],
      secondInstallmentAmountCT: [undefined],
      secondInstallmentAmountTrans: [undefined],
      costOfFinalProjectCompletion: [undefined],
      costOfFinalProjectCompletionCT: [undefined],
      costOfFinalProjectCompletionTrans: [undefined],
      thirdInstallmentAmount: [undefined],
      thirdInstallmentAmountCT: [undefined],
      thirdInstallmentAmountTrans: [undefined],
      nameOfLandOwner: [undefined],
      nameOfLandOwnerCT: [undefined],
      nameOfLandOwnerTrans: [undefined],
      landLocation: [undefined],
      landLocationCT: [undefined],
      landLocationTrans: [undefined],
      kittaNumber: [undefined],
      kittaNumberCT: [undefined],
      kittaNumberTrans: [undefined],
      area: [undefined],
      areaCT: [undefined],
      areaTrans: [undefined],
      seatNumber: [undefined],
      seatNumberCT: [undefined],
      seatNumberTrans: [undefined],
      insuranceAmountInFigure: [undefined],
      insuranceAmountInFigureCT: [undefined],
      insuranceAmountInFigureTrans: [undefined],
      insuranceAmountInWord: [undefined],
      insuranceAmountInWordCT: [undefined],
      insuranceAmountInWordTrans: [undefined],
      freeTextRequired: [undefined],
      freeTextRequiredCT: [undefined],
      freeTextRequiredTrans: [undefined],
      nameOfRelationshipOfficer: [undefined],
      nameOfRelationshipOfficerCT: [undefined],
      nameOfRelationshipOfficerTrans: [undefined],
      nameOfBranchManager: [undefined],
      nameOfBranchManagerCT: [undefined],
      nameOfBranchManagerTrans: [undefined],
      approvalStaffName: [undefined],
      approvalStaffNameCT: [undefined],
      approvalStaffNameTrans: [undefined],
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
