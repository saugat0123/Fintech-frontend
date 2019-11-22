import {LoanDocument} from './loan-document';

export class DmsLoanFile {
    id: number;
    customerName: string;
    companyName: string;
    registrationNumber: string;
    citizenshipNumber: string;
    contactNumber: string;
    interestRate: number;
    proposedAmount: number;
    proposedAmountWord: string;
    security: string;
    serviceChargeType: string;
    serviceChargeAmount: number;
    documentPath: string;
    documentMap: Array<string>;
    documents: Array<LoanDocument>;
    securities: string;
    tenure: Date;
    tenureDuration: number;
    priority: string;
    recommendationConclusion: string;
    waiver: string;
    documentPathMaps: any;
    fmvTotal: number;
    distressValue: number;
    totalLoanLimit: number;
    individualExposure: number;
    institutionExposure: number;
    groupExpo: number;
    fmvFundingPercent: number;
    incomeCoverageRatio: number;
    debtServiceCoverageRatio: number;
    keyPersonName: string;
    dealingProductName: string;
}
