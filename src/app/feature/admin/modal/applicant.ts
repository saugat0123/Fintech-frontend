import {Branch} from './branch';
import {Answer} from './answer';
import {LoanConfig} from './loan-config';
import {SubmissionDocument} from './submission-document';
import {GeneralEligibilityAnswer} from './generalEligibilityAnswer';

export class Applicant {
    id: number;
    branch = new Branch();
    age: number;
    dob: Date;
    answers: Array<Answer>;
    documents: Array<SubmissionDocument>;
    eligibilityStatus: string;
    fullName: string;
    loanConfig = new LoanConfig();
    email: string;
    phoneNumber: number;
    requestAmount: number;
    version: number;
    obtainedMarks: number;
    eligibleAmount: number;
    createdAt: string;
    eligibilityAnswers: Array<GeneralEligibilityAnswer>;
}
