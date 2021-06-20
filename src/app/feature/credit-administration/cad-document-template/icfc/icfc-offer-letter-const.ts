export enum IcfcOfferLetterConst {
    LETTER_OF_ARRANGEMENTS,
    AC_DEBIT_AND_LOAN_DISBURSEMENT_AUTHORITY,
    BANK_GUARANTEE,
    BUSINESS_LOAN,
    CORPORATE_GUARANTEE,
    LETTER_OF_CONTINUITY,
    LETTER_OF_SET_OFF,
    PERSONAL_TERM_LOAN
}

export namespace IcfcOfferLetterConst {
    export function value(offerLetterConst: IcfcOfferLetterConst) {
        switch (offerLetterConst) {
            case IcfcOfferLetterConst.LETTER_OF_ARRANGEMENTS:
                return 'Letter of Arrangements';
            case IcfcOfferLetterConst.AC_DEBIT_AND_LOAN_DISBURSEMENT_AUTHORITY:
                return 'AC Debit and Loan Disbursement Authority';
            case IcfcOfferLetterConst.BANK_GUARANTEE:
                return 'Bank Guarantee';
            case IcfcOfferLetterConst.BUSINESS_LOAN:
                return 'Business Loan';
            case IcfcOfferLetterConst.CORPORATE_GUARANTEE:
                return 'Corporate Guarantee';
            case IcfcOfferLetterConst.LETTER_OF_CONTINUITY:
                return 'Letter of Continuity';
            case IcfcOfferLetterConst.LETTER_OF_SET_OFF:
                return 'Letter of Set Off';
            case IcfcOfferLetterConst.PERSONAL_TERM_LOAN:
                return 'Personal Term Loan';
        }
    }

    export function keysEnum(offerLetter: string) {
        let key = null;
        Object.keys(IcfcOfferLetterConst).forEach(o => {
            if (IcfcOfferLetterConst.value(IcfcOfferLetterConst[o]) === offerLetter) {
                key = IcfcOfferLetterConst[o];
            }
        });
        return key;
    }

    export function values() {
        return Object.keys(IcfcOfferLetterConst).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'value' && type !== 'keysEnum' && type !== 'enumObject'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(v => {
            enums.push({
                key: v,
                value: IcfcOfferLetterConst[v]
            });
        });
        return enums;
    }
}
