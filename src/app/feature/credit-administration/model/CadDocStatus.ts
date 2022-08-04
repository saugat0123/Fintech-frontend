export enum CadDocStatus {
    OFFER_PENDING= 'OFFER_PENDING',
    LEGAL_PENDING= 'LEGAL_PENDING',
    DISBURSEMENT_PENDING= 'DISBURSEMENT_PENDING',
    OFFER_APPROVED= 'OFFER_APPROVED',
    LEGAL_APPROVED= 'LEGAL_APPROVED',
    DISBURSEMENT_APPROVED= 'DISBURSEMENT_APPROVED',
    DISCREPANCY_PENDING= 'DISCREPANCY_PENDING',
    PARTIAL_DISCREPANCY_PENDING= 'PARTIAL_DISCREPANCY_PENDING'
}

export namespace CadDocStatus {

    export function key() {
        return Object.keys(CadDocStatus).filter(
            (type) => isNaN(<any>type) && type !== 'key' && type !== 'pair'
        );
    }
}
