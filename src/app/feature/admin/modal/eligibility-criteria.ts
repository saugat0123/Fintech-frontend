import {EligibilityQuestion} from './eligibility-question';

export class EligibilityCriteria {
    id: number;
    formula: string;
    version: number;
    status: string;
    questions: Array<EligibilityQuestion>;
    percentageOfAmount: number;
}
