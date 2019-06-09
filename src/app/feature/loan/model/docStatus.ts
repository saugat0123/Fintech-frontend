export enum DocStatus {
    PENDING,
    APPROVED,
    REJECTED,
    CLOSED,
}

export namespace DocStatus {

    export function values() {
        return Object.keys(DocStatus).filter(
            (type) => isNaN(<any>type) && type !== 'values'
        );
    }
}
