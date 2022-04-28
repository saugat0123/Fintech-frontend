import {SecurityType} from '../constants/security-type';

export class SecurityLoanReference {
    loanId: number;
    securityId: number;
    securityType: SecurityType;
    usedAmount: number;
    data: string;
}
