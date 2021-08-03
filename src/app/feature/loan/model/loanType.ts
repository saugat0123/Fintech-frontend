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
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'value' && type !== 'getEnum'
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

    export function getEnum(loanValues: String) {
        for (const enumPair of value()) {
            if (enumPair.value === loanValues) {
                return enumPair.key;
            }
        }
    }
}


