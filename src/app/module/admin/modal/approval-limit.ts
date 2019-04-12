import {Role} from './role';

export class ApprovalLimit {
    id: number;
    amount: number;
    loanCategory: any;
    authorities: Role;
    loanApprovalType: string;
}
