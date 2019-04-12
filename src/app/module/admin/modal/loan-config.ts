import {LoanTemplate} from './template';
import {Document} from './document';

export class LoanConfig {
    id: number;
    name: string;
    templateList: Array<LoanTemplate>;
    status: string;
    initial: Array<Document>;
    renew: Array<Document>;
}
