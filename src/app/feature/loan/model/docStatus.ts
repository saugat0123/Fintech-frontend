export enum DocStatus {
    PENDING,
    APPROVED,
    REJECTED,
    CLOSED,
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
        }
    }
}
