import {LoanDocument} from './loan-document';
import {Customer} from './customer';

export class DmsLoanFile {
    id: number;
    customer: Customer = new Customer();
    companyName: string;
    registrationNumber: string;
    interestRate: number;
    proposedAmount: number;
    proposedAmountWord: string;
    security: string;
    serviceChargeType: string;
    serviceChargeAmount: number;
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
    fmvTotal: number;
    totalLoanLimit: number;
    groupExpo: String;
    fmvFundingPercent: number;
}
