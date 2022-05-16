import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ObjectUtil } from '../../../@core/utils/ObjectUtil';
import { LoanDataHolder } from '../../loan/model/loanData';

@Component({
  selector: 'app-financial-account-information',
  templateUrl: './financial-account-information.component.html',
  styleUrls: ['./financial-account-information.component.scss']
})
export class FinancialAccountInformationComponent implements OnInit {
  financialAccountForm: FormGroup;
  financialAccountData = new LoanDataHolder();
  @Input() financialFormValue = LoanDataHolder;

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.financialFormValue)) {
      this.financialAccountForm.patchValue(this.financialFormValue);
    }
    this.buildForm();
  }

  buildForm() {
    this.financialAccountForm = this.formBuilder.group({
      netProfitHistorical: [undefined],
      netProfitProjected: [undefined],
      deRatioHistorical: [undefined],
      deRatioProjected: [undefined],
      nonPerformingLoan: [undefined],
      capitalLoanHistorical: [undefined],
      capitalLoanProjected: [undefined],
      iscrHistorical: [undefined],
      iscrProjected: [undefined],
      iscrRatioHistorical: [undefined],
      iscrRatioProjected: [undefined],
      repayment: [undefined],
      cashFlowHistorical: [undefined],
      cashFlowProjected: [undefined],
      avgAccHistorical: [undefined],
      avgAccProjected: [undefined],
      actualAccHistorical: [undefined],
      actualAccProjected: [undefined],
      avgUtilization: [undefined],
      loanOutstd: [undefined],
      ytdSales: [undefined],
      creditTransactionLast: [undefined],
      creditTransactionCurrent: [undefined],
      creditTransactionAmtLast: [undefined],
      creditTransactionAmtCurrent: [undefined],
      stlBookedNumber: [undefined],
      stlBookedAmount: [undefined],
      lcBookedNumber: [undefined],
      lcBookedAmt: [undefined],
      trNumber: [undefined],
      trAmount: [undefined],
      dnIrIssuedNum: [undefined],
      dnIrIssuedDate: [undefined],
      dnIrIssuedPurposr: [undefined]
    });
  }

  // submitForm() {
  //   this.financialAccountData.financialAccountInformation = JSON.stringify(this.financialAccountForm.value);
  // }

}
