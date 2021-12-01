import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-sme-global-content',
  templateUrl: './sme-global-content.component.html',
  styleUrls: ['./sme-global-content.component.scss']
})
export class SmeGlobalContentComponent implements OnInit {
  globalForm: FormGroup;
  loanOptions = [
      {value: 'New Plain Renewal'},
      {value: 'Plain Renewal'},
      {value: 'Renewal with Enhancement or Additional Loan'},
      {value: 'Additional Loan'}
  ];
  yesNoOptions = [
    {value: 'Yes'},
    {value: 'No'}
  ];
  mortgageType = [
    {value: 'New'},
    {value: 'Existing'},
    {value: 'Enhancement'}
  ];
  hypothecationType = [
    {value: 'New'},
    {value: 'Existing'}
  ];
  chargeType = [
    {value: 'For All Loan'},
    {value: 'For Specific Loan Only'},
  ];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): FormGroup {
    return this.globalForm = this.formBuilder.group({
      loanOption: [undefined],
      subsidyOrAgricultureLoan: [undefined],
      mortgageType: [undefined],
      hypothecation: [undefined],
      borrowerNaturalPerson: [undefined],
      loanAmountAbove50Crore: [undefined],
      workingCapitalAbove25Crore: [undefined],
      dateOfApproval: [undefined],
      dateOfApprovalTrans: [undefined],
      dateOfApprovalCT: [undefined],
      loanApplicationDate: [undefined],
      loanApplicationDateTrans: [undefined],
      loanApplicationDateCT: [undefined],
      sanctionLetterDate: [undefined],
      sanctionLetterDateTrans: [undefined],
      sanctionLetterDateCT: [undefined],
      serviceChargeType: [undefined],
      serviceChargeInFigure: [undefined],
      serviceChargeInFigureTrans: [undefined],
      serviceChargeInFigureCT: [undefined],
      serviceChargeInWords: [undefined],
      serviceChargeInWordsTrans: [undefined],
      serviceChargeInWordsCT: [undefined],
      detailOfFacility: [undefined],
      detailOfFacilityTrans: [undefined],
      detailOfFacilityCT: [undefined],
      serviceChargeInPercent: [undefined],
      serviceChargeInPercentTrans: [undefined],
      serviceChargeInPercentCT: [undefined],
      totalFundedLimitInFigure: [undefined],
      totalFundedLimitInFigureTrans: [undefined],
      totalFundedLimitInFigureCT: [undefined],
      totalFundedLimitInWords: [undefined],
      totalFundedLimitInWordsTrans: [undefined],
      totalFundedLimitInWordsCT: [undefined],
      totalNonFundedLimitInFigure: [undefined],
      totalNonFundedLimitInFigureTrans: [undefined],
      totalNonFundedLimitInFigureCT: [undefined],
      totalNonFundedLimitInWords: [undefined],
      totalNonFundedLimitInWordsTrans: [undefined],
      totalNonFundedLimitInWordsCT: [undefined],
      totalLimitInFigure: [undefined],
      totalLimitInFigureTrans: [undefined],
      totalLimitInFigureCT: [undefined],
      totalLimitInWords: [undefined],
      totalLimitInWordsTrans: [undefined],
      totalLimitInWordsCT: [undefined],
      nameOfRelationshipManager: [undefined],
      nameOfRelationshipManagerTrans: [undefined],
      nameOfRelationshipManagerCT: [undefined],
      nameOfBranchManager: [undefined],
      nameOfBranchManagerTrans: [undefined],
      nameOfBranchManagerCT: [undefined],
    });
  }

}
