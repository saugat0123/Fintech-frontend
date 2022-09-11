export enum LoanType {
    NEW_LOAN = 'New Loan',
    RENEWED_LOAN = 'Renewal Loan',
    CLOSURE_LOAN = 'Closure Loan',
    ENHANCED_LOAN = 'Enhanced Loan',
    PARTIAL_SETTLEMENT_LOAN = 'Partial Settlement Loan',
    FULL_SETTLEMENT_LOAN = 'Full Settlement Loan',
    RENEW_WITH_ENHANCEMENT = 'Renew with Enhancement',
    SECURITY_FULL_RELEASE = 'Security Full Release',
    SECURITY_PARTIAL_RELEASE = 'Security Partial Release',
    REALIGNMENT = 'Realignment',
    INTEREST_REVISION = 'Interest Revision',
    OTHERS_MEMO = 'Others Memo',
    WAIVER_DEFFERAL_MEMO = 'waiver/defferal Memo'

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
}


