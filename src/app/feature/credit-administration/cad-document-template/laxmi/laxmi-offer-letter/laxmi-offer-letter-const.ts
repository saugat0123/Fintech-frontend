export enum LaxmiOfferLetterConst {
    LETTER_OF_COMMITMENT,
    PERSONAL_GUARANTEE,
    OFFER_LETTER
}

export namespace LaxmiOfferLetterConst {
    export function value(offerLetterConst: LaxmiOfferLetterConst) {
        switch (offerLetterConst) {
            case LaxmiOfferLetterConst.LETTER_OF_COMMITMENT:
                return 'Letter of Commitment and Assignment over Remittance';
            case LaxmiOfferLetterConst.PERSONAL_GUARANTEE:
                return 'PG';
            case LaxmiOfferLetterConst.OFFER_LETTER:
                return 'Offer Letter';
        }
    }

    export function keysEnum(offerLetter: string) {
        let key = null;
        Object.keys(LaxmiOfferLetterConst).forEach(o => {
            if (LaxmiOfferLetterConst.value(LaxmiOfferLetterConst[o]) === offerLetter) {
                key = LaxmiOfferLetterConst[o];
            }
        });
        return key;
    }

    export function values() {
        return Object.keys(LaxmiOfferLetterConst).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'value' && type !== 'keysEnum' && type !== 'enumObject'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(v => {
            enums.push({
                key: v,
                value: LaxmiOfferLetterConst[v]
            });
        });
        return enums;
    }
}
