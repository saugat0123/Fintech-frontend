export enum DocStatus {
    PENDING,
    APPROVED,
    REJECTED,
    CLOSED,
    DISCUSSION,
    DOCUMENTATION,
    VALUATION,
    UNDER_REVIEW,
    INITIAL,
    SEND_BACK_TO_SENDER,
    SEND_BACK_TO_AGENT,
    HSOV_PENDING
}

export namespace DocStatus {

    export function values() {
        return Object.keys(DocStatus).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'value'
        );
    }

    export function value(docStatus: DocStatus) {
        if (docStatus === DocStatus.PENDING) {
            return 'PENDING';
        } else if (docStatus === DocStatus.APPROVED) {
            return 'APPROVED';
        } else if (docStatus === DocStatus.REJECTED) {
            return 'REJECTED';
        } else if (docStatus === DocStatus.CLOSED) {
            return 'CLOSED';
        } else if (docStatus === DocStatus.DISCUSSION) {
            return 'DISCUSSION';
        } else if (docStatus === DocStatus.DOCUMENTATION) {
            return 'DOCUMENTATION';
        } else if (docStatus === DocStatus.VALUATION) {
            return 'VALUATION';
        } else if (docStatus === DocStatus.UNDER_REVIEW) {
            return 'UNDER_REVIEW';
        } else if (docStatus === DocStatus.INITIAL) {
            return 'INITIAL';
        } else if (docStatus === DocStatus.SEND_BACK_TO_SENDER) {
            return 'SEND_BACK_TO_SENDER';
        } else if (docStatus === DocStatus.SEND_BACK_TO_AGENT) {
            return 'SEND_BACK_TO_AGENT';
        } else if (docStatus === DocStatus.HSOV_PENDING) {
            return 'HSOV_PENDING';
        }
    }
}
