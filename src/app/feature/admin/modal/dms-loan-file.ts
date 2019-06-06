import {LoanDocument} from './loan-document';
import {LoanConfig} from './loan-config';

export class DmsLoanFile {
    id: number;
    customerName: string;
    citizenshipNumber: number;
    contactNumber: number;
    interestRate: number;
    securities: string;
    security: string;
    proposedAmount: number;
    tenure: Date;
    priority: string;
    documentMap: string[] = [];
    recommendationConclusion: string;
    loanConfig: LoanConfig;
    waiver: string;
    documentPath: string;
    documentPathMaps: [];
    documents = new Array<LoanDocument>();
    createdAt: Date;
    documentStatus: string;
}
