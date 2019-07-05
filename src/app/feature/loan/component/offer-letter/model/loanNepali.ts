import {Applicant} from './applicant';

export class LoanNepali {
    date: string;
    loanType: string;
    amountLimit: string;
    amountLimitWord: string;
    interest: string;
    interestWord: string;
    interestRate: string;
    totalApplicant: string;
    applicants: Array<Applicant>;
}
