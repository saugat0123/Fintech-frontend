export enum LoanType {
    NEW_LOAN = 'New Loan',
    RENEWED_LOAN = 'Renewed Loan',
    CLOSURE_LOAN = 'Closure Loan',
    ENHANCED_LOAN = 'Enhanced Loan',
    PARTIAL_SETTLEMENT_LOAN = 'Partial Settlement Loan',
    FULL_SETTLEMENT_LOAN = 'Full Settlement Loan',
    RENEW_WITH_ENHANCEMENT = 'Renew with Enhancement',
}

export namespace LoanType {

    export function values() {
        return Object.keys(LoanType).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'value'
        );
    }
    export function value() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: LoanType[elem],
            });
        });
        return enums;
    }

    export function keyValue(loanType: LoanType) {
        if (loanType === LoanType.NEW_LOAN) {
            return 'NEW_LOAN';
        } else if (loanType === LoanType.RENEWED_LOAN) {
            return 'RENEWED_LOAN';
        } else if (loanType === LoanType.CLOSURE_LOAN) {
            return 'CLOSURE_LOAN';
        } else if (loanType === LoanType.ENHANCED_LOAN) {
            return 'ENHANCED_LOAN';
        } else if (loanType === LoanType.PARTIAL_SETTLEMENT_LOAN) {
            return 'PARTIAL_SETTLEMENT_LOAN';
        } else if (loanType === LoanType.FULL_SETTLEMENT_LOAN) {
            return 'FULL_SETTLEMENT_LOAN';
        } else if (loanType === LoanType.RENEW_WITH_ENHANCEMENT) {
            return 'RENEW_WITH_ENHANCEMENT';
        }
    }
}


