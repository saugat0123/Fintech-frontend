import {LoanDocument} from './loan-document';

export class DmsLoanFile{
    id: number;
    customerName: string;
    citizenshipNumber: number;
    contactNumber: number;
    interestRate: number;
    securities: string;
    security: string;
    proposedAmount: number;
    documentPaths: string[];
    documentPath: string[];
    tenure: Date;
    priority: string;
    documentMap:string[];
    recommendationConclusion: string;
    waiver: string;
    documentPathDocument:[];
    documents: Array<LoanDocument>;
    createdAt: Date;
}