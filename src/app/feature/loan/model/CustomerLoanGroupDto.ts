import {CustomerInfoData} from './customerInfoData';
import {LoanDataHolder} from './loanData';
import {Proposal} from "../../admin/modal/proposal";
import {Security} from "./security";
import {LoanConfig} from "../../admin/modal/loan-config";
import {DocStatus} from "./docStatus";

export class CustomerLoanGroupDto {

  customerName: string;

  loanHolderId: number;

  totalPendingLimit: number;

  associateId: number;

  totalApprovedLimit: number;

  proposal: Proposal;

  security: Security;

  customerLoanId: number;

  loanConfig: LoanConfig;

  docStatus: DocStatus;
}
