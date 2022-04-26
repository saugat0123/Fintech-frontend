import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-section8-loan-disbursement-related-clause',
  templateUrl: './section8-loan-disbursement-related-clause.component.html',
  styleUrls: ['./section8-loan-disbursement-related-clause.component.scss']
})
export class Section8LoanDisbursementRelatedClauseComponent implements OnInit {
  form: FormGroup;
  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    return this.form = this.formBuilder.group({
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined],
      nameOfBeneficiary: [undefined],
      nameOfBeneficiary1: [undefined],
      branchName: [undefined],
      loanAmt: [undefined],
      nameOfFig: [undefined],
      loanAmtWords: [undefined],
      nameOfBank: [undefined],
      nameOfBank1: [undefined],
      nameOfBeneficiary2: [undefined],
      nameOfBeneficiary3: [undefined],
      loanFig: [undefined],
      loanWords: [undefined],
      branchName1: [undefined],
      loanAmtInWords: [undefined],
      loanAmtInFig: [undefined],
      branchName2: [undefined],
      loanAmtFig: [undefined],
      loanAmtWords1: [undefined],
      amtNum: [undefined],
      loanAmtInWords1: [undefined],
      loanAmtFig1: [undefined],
      loanAmtWords3: [undefined],
      loanAmtFigure1: [undefined],
      nameOfBeneficiary4: [undefined],
      branchName3: [undefined],
      loanAmtWords4: [undefined],
      loanAmtFig4: [undefined],
      bName: [undefined],
      loanAmtDemand: [undefined],
      loanAmtFigDemand: [undefined]
    });
  }
}
