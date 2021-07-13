export enum ProgressiveOfferLetterConst {
    OFFER_LETTER_PERSONAL,
    OFFER_LETTER_CORPORATE
}

export namespace ProgressiveOfferLetterConst {
    export function value(offerLetterConst: ProgressiveOfferLetterConst) {
        switch (offerLetterConst) {
            case ProgressiveOfferLetterConst.OFFER_LETTER_PERSONAL:
                return 'Offer Letter Personal';
            case ProgressiveOfferLetterConst.OFFER_LETTER_CORPORATE:
                return 'Offer Letter Corporate';
        }
    }

    export function keysEnum(offerLetter: string) {
        let key = null;
        Object.keys(ProgressiveOfferLetterConst).forEach(o => {
            if (ProgressiveOfferLetterConst.value(ProgressiveOfferLetterConst[o]) === offerLetter) {
                key = ProgressiveOfferLetterConst[o];
            }
        });
        return key;
    }

    export function values() {
        return Object.keys(ProgressiveOfferLetterConst).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'value' && type !== 'keysEnum' && type !== 'enumObject'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(v => {
            enums.push({
                key: v,
                value: ProgressiveOfferLetterConst[v]
            });
        });
        return enums;
    }
}
