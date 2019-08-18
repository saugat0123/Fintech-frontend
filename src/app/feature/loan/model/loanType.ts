export enum LoanType {
    NEW_LOAN = 'New Loan',
    RENEWED_LOAN = 'Renewed Loan',
    CLOSURE_LOAN = 'Closure Loan'

}

export namespace LoanType {

    export function values() {
        return Object.keys(LoanType).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'value'
        );
    }

    export function value(loanType: LoanType) {
        if (loanType === LoanType.NEW_LOAN) {
            return 'New Loan';
        } else if (loanType === LoanType.RENEWED_LOAN) {
            return 'Renewed Loan ';
        } else if (loanType === LoanType.CLOSURE_LOAN) {
            return 'Closure';
        }
    }

}
