import {Component, Input, OnInit} from '@angular/core';
import {FetchLoan} from '../../../../customer/model/fetchLoan';
import {LoanAmountType} from '../../../../customer/model/loanAmountType';

@Component({
  selector: 'app-customer-associate',
  templateUrl: './customer-associate.component.html',
  styleUrls: ['./customer-associate.component.scss']
})
export class CustomerAssociateComponent implements OnInit {
  @Input() model;
  fetchLoan = FetchLoan;

  totalProposedAmountByKYC = 0;
  totalProposedAmountByGuarantor = 0;
  totalGroupAmount = 0;
  totalProposalAmount = 0;
  totalLoanProposedAmount = 0;

  constructor() { }

  ngOnInit() {
  }

  getTotalLoanAmount(value: LoanAmountType) {
    if (value.type === this.fetchLoan.CUSTOMER_LOAN) {
      this.totalLoanProposedAmount = value.value;
    }
    if (value.type === this.fetchLoan.CUSTOMER_AS_KYC) {
      this.totalProposedAmountByKYC = value.value;
    }
    if (value.type === this.fetchLoan.CUSTOMER_AS_GUARANTOR) {
      this.totalProposedAmountByGuarantor = value.value;
    }
    this.totalGroupAmount = this.totalProposedAmountByGuarantor + this.totalProposedAmountByKYC;
    this.totalProposalAmount = this.totalProposedAmountByGuarantor + this.totalProposedAmountByKYC + this.totalLoanProposedAmount;
  }
}
