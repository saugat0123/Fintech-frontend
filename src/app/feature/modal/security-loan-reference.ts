import {SecurityType} from '../constants/security-type';
import {LoanDataHolder} from '../loan/model/loanData';

export class SecurityLoanReference {
    loanId: number;
    securityId: number;
    securityType: SecurityType;
    usedAmount: number;
    coverage: number;
    data: string;
    customerLoan: LoanDataHolder;
}
