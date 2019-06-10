import {LoanTemplate} from './loan-template';
import {Document} from './document';

export class LoanConfig {
    id: number;
    name: string;
    totalPoints: number;
    eligibilityPoints: number;
    isFundable: boolean;
    templateList: Array<LoanTemplate>;
    status: string;
    isRenewable: boolean;
    loanConfigCode: string;
    initial: Array<Document>;
    renew: Array<Document>;
    eligibilityDocuments: Array<Document>;
}
