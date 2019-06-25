import {LoanConfig} from '../../admin/modal/loan-config';

export class Proposal {
    creditFacility: LoanConfig;
    proposedLimit: number;
    interestRate: number;
    baseRate: number;
    premiumRateOnBaseRate: number;
    serviceChargeMethod: string;
    serviceCharge: number;
    tenureYear: Date;
    cibCharge: number;
    repaymentMode: string;
    purposeOfSubmission: string;
    disbursementCriteria: string;
    creditInformationReportStatus: string;
    incomeFromTheAccount: string;
    borrowerInformation: string;

}
