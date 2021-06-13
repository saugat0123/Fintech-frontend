import {LoanConfig} from "./loan-config";
import {Answer} from "./answer";
import {EligibilityLoanConfigurationAnswer} from "./eligibilityLoanConfigurationAnswer";
import {EligibilityLoanConfiguration} from "../component/eligibility/eligibility-loan-config/EligibilityLoanConfiguration";
export class EligibilityLoanConfigQuestion {
    id: number;
    description: string;
    maximumPoints: number;
    status: string;
    version: number;
    appearanceOrder: number;
    loanConfig: EligibilityLoanConfiguration;
    answers: Array<EligibilityLoanConfigurationAnswer>;
    new: string;
}
