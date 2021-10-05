import {DocStatus} from './docStatus';

export class CustomerLoanDto {
    loanHolderId: string;
    name: string;
    groupCode: string;
    groupLimit: string;
    groupId: string;
    proposedLimit: string;
    documentStatus: DocStatus;
    customerLoanId: string;
    interestRate: string;
    premiumRateOnBaseRate: string;
    baseRate: string;
}
