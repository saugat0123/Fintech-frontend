import {DocStatus} from './docStatus';
import {Proposal} from '../../admin/modal/proposal';
import {LoanType} from './loanType';
import {LoanConfig} from '../../admin/modal/loan-config';

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
    loanConfig: LoanConfig;
}
