import {Branch} from './branch';
import {Answer} from './answer';
import {LoanConfig} from './loan-config';
import {SubmissionDocument} from './submission-document';

export class Applicant {
    id: number;
    branch = new Branch();
    age: number;
    answers: Array<Answer>;
    documents: Array<SubmissionDocument>;
    eligibilityStatus: string;
    fullName: string;
    loanConfig = new LoanConfig();
    phoneNumber: number;
    requestAmount: number;
    version: number;
    obtainedMarks: number;
}
