import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ObjectUtil } from '../../../@core/utils/ObjectUtil';
import { LoanDataHolder } from '../../loan/model/loanData';
import {Financial} from '../../loan/model/financial';

@Component({
  selector: 'app-financial-account-information',
  templateUrl: './financial-account-information.component.html',
  styleUrls: ['./financial-account-information.component.scss']
})
export class FinancialAccountInformationComponent implements OnInit {
  financialAccountForm: FormGroup;
  @Input() financialFormValue: LoanDataHolder;
  @Input() fromLoan: boolean;
  @Output() financialAccountEmitter = new EventEmitter();
  financialData;
  @Input() loanDataHolder: LoanDataHolder;
  @Input() financialValue: Financial;

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.financialFormValue.financialAccountInformation)) {
      this.financialData = JSON.parse(this.financialFormValue.financialAccountInformation);
      this.financialAccountForm.patchValue(this.financialData);
    }
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

  submitForm() {
    this.financialFormValue.financialAccountInformation = JSON.stringify(this.financialAccountForm.value);
    this.financialAccountEmitter.emit(this.financialFormValue);
  }

}
