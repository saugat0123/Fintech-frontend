export enum LoanType {
    NEW_LOAN = 'New Loan',
    RENEWED_LOAN = 'Renewed Loan',
    CLOSURE_LOAN = 'Closure Loan',
    ENHANCED_LOAN = 'Enhanced Loan',
    PARTIAL_SETTLEMENT_LOAN = 'Partial Settlement Loan',
    FULL_SETTLEMENT_LOAN = 'Full Settlement Loan',
    RENEW_WITH_ENHANCEMENT = 'Renew with Enhancement',
    RELEASE_AND_REPLACEMENT= 'Release and Replacement',
    PARTIAL_RELEASE_OF_COLLATERAL= 'Partial Release of Collateral',
    INTEREST_RATE_REVISION= 'Interest Rate Revision'
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
    export function getKeyByValue(enumValue) {
        return Object.keys(LoanType).find(key => LoanType[key] === enumValue);
    }
}


