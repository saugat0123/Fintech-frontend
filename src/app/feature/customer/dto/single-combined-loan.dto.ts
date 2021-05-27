import {LoanType} from '../../loan/model/loanType';
import {DocStatus} from '../../loan/model/docStatus';
import {LoanStage} from '../../loan/model/loanStage';

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
  currentStage: LoanStage = new LoanStage();
  parentId?: number;

}
