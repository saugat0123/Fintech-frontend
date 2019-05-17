import {Answer} from './answer';
import {LoanConfig} from './loan-config';

export class Questions {
    id: number;
    description: string;
    maximumPoints: number;
    status: string;
    version: number;
    appearanceOrder: number;
    loanConfig: LoanConfig;
    answers: Array<Answer>;
    new: string;
}
