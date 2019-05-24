import {LoanTemplate} from './template';
import {Document} from './document';

export class LoanConfig {
    id: number;
    name: string;
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
    eligibilityDocuments: Array<Document>;
}
