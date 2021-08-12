export enum IcfcOfferLetterConst {
    BANK_GUARANTEE,
    BUSINESS_LOAN,
    PERSONAL_TERM_LOAN,
}

export namespace IcfcOfferLetterConst {
    export function value(offerLetterConst: IcfcOfferLetterConst) {
        switch (offerLetterConst) {
            case IcfcOfferLetterConst.BANK_GUARANTEE:
                return 'Bank Guarantee';
            case IcfcOfferLetterConst.BUSINESS_LOAN:
                return 'Business Loan';
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
