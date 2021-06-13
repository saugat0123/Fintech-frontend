import {Questions} from "./question";
import {EligibilityLoanConfigQuestion} from "./eligibilityLoanConfigQuestion";

export class EligibilityLoanConfigurationAnswer {
    id: number;
    description: string;
    version: number;
    points: number;
    status: string;
    question: EligibilityLoanConfigQuestion;
}
