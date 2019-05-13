import {LoanDocument} from './loan-document';

export class DmsLoanFile{
    id: number;
    customerName: string;
    citizenshipNumber: number;
    contactNumber: number;
    interestRate: number;
    securities: string;
    proposedAmount: number;
    documentPath: string[];
    documentPaths: string[];
    tenure: Date;
    priority: string;
    recommendationConclusion: string;
    waiver: string;
    documents: Array<LoanDocument>;
}