import {SecurityType} from '../constants/security-type';

export class SecurityLoanReference {
    loanId: number;
    securityId: number;
    securityType: SecurityType;
    usedAmount: number;
    coverage: number;
    data: string;
}
