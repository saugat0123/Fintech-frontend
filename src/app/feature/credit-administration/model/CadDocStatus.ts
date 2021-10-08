export enum CadDocStatus {
  OFFER_AND_LEGAL_PENDING = 'Offer and Legal Pending',
  OFFER_AND_LEGAL_APPROVED = 'Offer and Legal Approved',
  DOC_CHECK_PENDING = 'Document Check Pending',
  DOC_CHECK_APPROVED = 'Document Check Approved',
  DISBURSEMENT_PENDING = 'Disbursement Pending',
  DISBURSEMENT_APPROVED = 'Disbursement Approved',
  OFFER_PENDING = 'OFFER_PENDING',
  LEGAL_PENDING = 'LEGAL_PENDING',
  OFFER_APPROVED = 'OFFER_APPROVED',
  LEGAL_APPROVED = 'LEGAL_APPROVED',

}

export namespace CadDocStatus {

  export function key() {
    return Object.keys(CadDocStatus).filter(
        (type) => isNaN(<any>type) && type !== 'key' && type !== 'pair'
    );
  }
}
