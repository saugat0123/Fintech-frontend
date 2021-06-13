export enum IcfcOfferLetterConst {
    LETTER_OF_ARRANGEMENTS,
}

export namespace IcfcOfferLetterConst {
    export function value(offerLetterConst: IcfcOfferLetterConst) {
        switch (offerLetterConst) {
            case IcfcOfferLetterConst.LETTER_OF_ARRANGEMENTS:
                return 'Letter of Arrangements';
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
