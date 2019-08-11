import {LoanDocument} from './loan-document';
import {Customer} from './customer';
import {EntityInfo} from './entity-info';

export class DmsLoanFile {
    id: number;
    interestRate: number;
    proposedAmount: number;
    proposedAmountWord: string;
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
