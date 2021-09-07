export enum DocAction {
    DRAFT,
    FORWARD,
    BACKWARD,
    APPROVED,
    REJECT,
    CLOSED,
    TRANSFER,
    PULLED,
    BACKWARD_TO_COMMITTEE,
    RE_INITIATE,
    SEND_BACK_TO_SENDER,
    SEND_BACK_TO_AGENT
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
        } else if (docAction === DocAction.PULLED) {
            return 'PULLED';
        } else if (docAction === DocAction.BACKWARD_TO_COMMITTEE) {
            return 'BACKWARD TO COMMITTEE';
        } else if (docAction === DocAction.RE_INITIATE) {
            return 'RE_INITIATE';
        } else if (docAction === DocAction.SEND_BACK_TO_AGENT) {
            return 'SEND_BACK_TO_AGENT';
        } else if (docAction === DocAction.SEND_BACK_TO_SENDER) {
            return 'SEND_BACK_TO_SENDER';
        }
    }
}
