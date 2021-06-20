export enum IcfcOfferLetterConst {
    LETTER_OF_ARRANGEMENTS,
    LETTER_OF_AGREEMENT,
    CALL_DEED_SHARE_LOAN_COMPANY,
    CALL_DEED_SHARE_LOAN,
    PROMISSORY_NOTE,
    MORTGAGE_DEED_COMPANY,
    MORTGAGE_DEED_INDIVIDUAL_DIFFERENT_BORROWER,
    MORTGAGE_DEED_INDIVIDUAL_SAME,
}

export namespace IcfcOfferLetterConst {
    export function value(offerLetterConst: IcfcOfferLetterConst) {
        switch (offerLetterConst) {
            case IcfcOfferLetterConst.LETTER_OF_ARRANGEMENTS:
                return 'Letter of Arrangements';
            case IcfcOfferLetterConst.LETTER_OF_AGREEMENT:
                return 'Letter of Agreement';
            case IcfcOfferLetterConst.CALL_DEED_SHARE_LOAN_COMPANY:
                return 'Call deed share loan company';
            case IcfcOfferLetterConst.CALL_DEED_SHARE_LOAN:
                return 'Call deed share loan';
            case IcfcOfferLetterConst.PROMISSORY_NOTE:
                return 'Promissory Note';
            case IcfcOfferLetterConst.MORTGAGE_DEED_COMPANY:
                return 'Mortgage Deed Company';
            case IcfcOfferLetterConst.MORTGAGE_DEED_INDIVIDUAL_DIFFERENT_BORROWER:
                return 'Mortgage Deed Individual different borrower and owner';
            case IcfcOfferLetterConst.MORTGAGE_DEED_INDIVIDUAL_SAME:
                return 'Mortgage deed individual same borrower and owner';
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
