export enum OfferLetterConst {
    BIRTHMARK_LETTER,
    SUCCESS_LETTER,
    DHITO_LIKHAT_MANJURINAMA,
    DHRISTI_BANDHAK,
    JAMANI_TAMSUK,
    KARARNAMA,
    KARJATAMSUK,
    MANJURINAMA,
    PRATIGYA_PATRA
}

export namespace OfferLetterConst {
    export function value(offerLetterConst: OfferLetterConst) {
        if (offerLetterConst === OfferLetterConst.DHITO_LIKHAT_MANJURINAMA) {
            return 'Dhito Likhat Manjurima';
        } else if (offerLetterConst === OfferLetterConst.DHRISTI_BANDHAK) {
            return 'Dhristi Bandhak';
        } else if (offerLetterConst === OfferLetterConst.JAMANI_TAMSUK) {
            return 'Jamani Tamsuk';
        } else if (offerLetterConst === OfferLetterConst.KARARNAMA) {
            return 'Kararnama';
        } else if (offerLetterConst === OfferLetterConst.KARJATAMSUK) {
            return 'Karjatamsuk';
        } else if (offerLetterConst === OfferLetterConst.MANJURINAMA) {
            return 'Manjurinama';
        } else if (offerLetterConst === OfferLetterConst.PRATIGYA_PATRA) {
            return 'Pratigya Patra';
        } else if (offerLetterConst === OfferLetterConst.BIRTHMARK_LETTER) {
            return 'Birth Mark Letter';
        } else if (offerLetterConst === OfferLetterConst.SUCCESS_LETTER) {
            return 'Success Letter';
        }
    }


    export function keysEnum(offerLetter: string) {
        let key = null;
        Object.keys(OfferLetterConst).forEach(o => {
            if (OfferLetterConst.value(OfferLetterConst[o]) === offerLetter) {
                key = OfferLetterConst[o];
            }
        });
        return key;
    }

}
