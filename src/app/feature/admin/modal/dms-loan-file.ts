import {LoanDocument} from './loan-document';
import {LoanConfig} from './loan-config';

export class DmsLoanFile {
    id: number;
    customerName: string;
    citizenshipNumber: number;
    contactNumber: number;
    interestRate: number;
    proposedAmount: number;
    security: string;
    documentPath: string;
    documentMap: Array<string>;
    documents = new Array<LoanDocument>();
    securities: string;
    tenure: Date;
    tenureDuration: number;
    priority: string;
    recommendationConclusion: string;
    waiver: string;
    documentPathMaps: any;
}
