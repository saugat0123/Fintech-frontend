import {Status} from '../../../@core/Status';
import {LoanCategory} from '../../loan/model/loan-category';
import {CrgAnswer} from './CrgAnswer';

export class CrgQuestion {
    id: number;
    description: string;
    maximumPoints: number;
    appearanceOrder: number;
    weightage: number;
    status: Status;
    version: number;
    crgGroupId: number;
    loanApprovalType: LoanCategory;
    answers: Array<CrgAnswer>;
}
