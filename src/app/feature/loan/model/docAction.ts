export enum DocAction {
    DRAFT,
    FORWARD,
    BACKWARD,
    APPROVED,
    REJECT,
    CLOSED,
    TRANSFER,
    NOTED
}

export namespace DocAction {
    export function value(docAction: DocAction) {
        if (docAction === DocAction.DRAFT) {
            return 'DRAFT';
        } else if (docAction === DocAction.FORWARD) {
            return 'FORWARD';
        } else if (docAction === DocAction.BACKWARD) {
            return 'BACKWARD';
        } else if (docAction === DocAction.APPROVED) {
            return 'APPROVED';
        } else if (docAction === DocAction.REJECT) {
            return 'REJECT';
        } else if (docAction === DocAction.CLOSED) {
            return 'CLOSED';
        } else if (docAction === DocAction.TRANSFER) {
            return 'TRANSFER';
        }
    }
}
