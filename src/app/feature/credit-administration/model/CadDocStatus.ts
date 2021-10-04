export enum   CadDocStatus {
  OFFER_AND_LEGAL_PENDING = 'OFFER_AND_LEGAL_PENDING',
  OFFER_AND_LEGAL_APPROVED = 'OFFER_AND_LEGAL_APPROVED',
  OFFER_PENDING = 'OFFER_PENDING',
  LEGAL_PENDING = 'LEGAL_PENDING',
  DISBURSEMENT_PENDING = 'DISBURSEMENT_PENDING',
  OFFER_APPROVED = 'OFFER_APPROVED',
  LEGAL_APPROVED = 'LEGAL_APPROVED',
  DISBURSEMENT_APPROVED = 'DISBURSEMENT_APPROVED',
  DOC_CHECK_PENDING = 'Document Check Pending',
  DOC_CHECK_APPROVED = 'Document Check Approved',

}

export namespace CadDocStatus {

  export function key() {
    return Object.keys(CadDocStatus).filter(
        (type) => isNaN(<any>type) && type !== 'key' && type !== 'pair'
    );
  }
}
