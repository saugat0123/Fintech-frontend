import {LoanDataHolder} from '../../feature/loan/model/loanData';

export class CustomerLoanFlag {
  id: number;
  flag: number;
  description: string;
  order: number;
  customerLoan: LoanDataHolder;
}
