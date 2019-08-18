import {LoanTemplate} from './loan-template';
import {Document} from './document';
import {OfferLetter} from './offerLetter';

export class LoanConfig {
    id: number;
    name: string;
    interestRate: number;
    totalPoints: number;
    eligibilityPoints: number;
    isFundable: boolean;
    version: number;
    templateList: Array<LoanTemplate>;
    status: string;
    isRenewable: boolean;
    loanConfigCode: string;
    eligibilityPercentage: number;
    initial: Array<Document>;
    renew: Array<Document>;
    closure: Array<Document>;
    eligibilityDocuments: Array<Document>;
    offerLetters: Array<OfferLetter>;
    enableEligibility: boolean;
    minimumProposedAmount: number;
}
