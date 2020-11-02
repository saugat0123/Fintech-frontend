import {LoanType} from '../../loan/model/loanType';
import {DocStatus} from '../../loan/model/docStatus';

export class SingleCombinedLoanDto {
  id?: number;
  customerInfoCustomerName?: string;
  branchName?: string;
  loanId?: number;
  loanName?: string;
  loanIsFundable?: boolean;
  proposalProposedLimit?: number;
  loanType?: LoanType | string;
  documentStatus?: DocStatus | string;
  createdAt?: Date;
  combinedLoans?: SingleCombinedLoanDto[];
  requiredCollateral: number;
  collateralRequirement: number;
}
