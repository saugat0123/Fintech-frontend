import {LoanCycle} from './loan-cycle';

export class Document {
    id: number;
    name: string;
    displayName: string;
    url: string;
    loanCycle: Array<LoanCycle>;
    status: string;
}
