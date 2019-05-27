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
    documentPath: string[];
    tenure: Date;
    priority: string;
    documentMap: string[];
    recommendationConclusion: string;
    loanConfig: LoanConfig;
    waiver: string;
    documentPathMaps: [];
    documents: Array<LoanDocument>;
    createdAt: Date;
    documentStatus: string;
}
