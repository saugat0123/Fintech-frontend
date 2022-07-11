import {Role} from './role';
import {LoanConfig} from './loan-config';

export class ApprovalLimit {
    id: number;
    amount: number;
    renewalAmount: number;
    loanCategory: LoanConfig;
    authorities: Role;
    loanApprovalType: string;
}

