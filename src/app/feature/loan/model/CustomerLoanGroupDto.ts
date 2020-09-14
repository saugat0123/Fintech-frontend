import {CustomerInfoData} from './customerInfoData';
import {LoanDataHolder} from './loanData';

export class CustomerLoanGroupDto {
  totalApprovedLimit: number;
  totalPendingLimit: number;
  loanHolder: CustomerInfoData;
  customerLoans: LoanDataHolder;
}
