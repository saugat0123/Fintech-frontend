import {AccountType} from './accountType';
import {Document} from './document';

export class AccountCategory {
    id: number;
    name: string;
    accountType: AccountType;
    documents: Array<Document>;
}
