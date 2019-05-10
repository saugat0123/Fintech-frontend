import {LoanDocument} from './loan-document';

export class DmsLoanFile{
    id: number;
    name: string;
    citizenshipNumber: number;
    contactNumber: number;
    interestRate: number;
    securities: string;
    proposedAmount: number;
    documentPath: string[];
}