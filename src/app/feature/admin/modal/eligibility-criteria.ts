import {EligibilityQuestion} from './eligibility-question';

export class EligibilityCriteria {
    id: number;
    formula: string;
    thresholdAmount: number;
    version: number;
    status: string;
    questions: Array<EligibilityQuestion>;
    percentageOfAmount: number;
}
