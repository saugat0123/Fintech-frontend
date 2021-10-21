import {DocStatus} from './docStatus';
import {Proposal} from '../../admin/modal/proposal';
import {LoanType} from './loanType';

export class CustomerLoanDto {
    loanHolderId: string;
    name: string;
    groupCode: string;
    groupLimit: string;
    groupId: string;
    proposedLimit: string;
    documentStatus: DocStatus;
    customerLoanId: string;
    proposal: Proposal;
    loanType: LoanType;
    createdAt?: Date;
    isFundable: boolean;
}
