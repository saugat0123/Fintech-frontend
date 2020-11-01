export enum OfferLetterConst {
    BIRTHMARK_LETTER,
    SUCCESS_LETTER,
    DHITO_LIKHAT_MANJURINAMA,
    DHRISTI_BANDHAK,
    JAMANI_TAMSUK,
    KARARNAMA,
    KARJATAMSUK,
    MANJURINAMA,
    PRATIGYA_PATRA,
    HAYER_PURCHASE,
    RETAIL_MORTGAGE_LOAN,
    RETAIL_EDUCATIONAL,
    RETAIL_MORTGAGE_OVERDRAFT,
    RETAIL_HOUSING,
    RETAIL_PROFESSIONAL_LOAN,
    RETAIL_EDUCATIONAL_ENGLISH,
    SME
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
        } else if (offerLetterConst === OfferLetterConst.HAYER_PURCHASE) {
        return 'Hayer Purchase';
        } else if (offerLetterConst === OfferLetterConst.RETAIL_MORTGAGE_LOAN) {
        return 'Retail Mortgage Loan';
        } else if (offerLetterConst === OfferLetterConst.RETAIL_EDUCATIONAL_ENGLISH) {
        return 'Retail Educational English';
        } else if (offerLetterConst === OfferLetterConst.RETAIL_PROFESSIONAL_LOAN) {
        return 'Retail Professional Loan';
        } else if (offerLetterConst === OfferLetterConst.RETAIL_HOUSING) {
        return 'Retail Housing';
        } else if (offerLetterConst === OfferLetterConst.RETAIL_EDUCATIONAL) {
        return 'Retail Educational';
        } else if (offerLetterConst === OfferLetterConst.RETAIL_MORTGAGE_OVERDRAFT) {
        return 'Retail Mortgage Overdraft';
        } else if (offerLetterConst === OfferLetterConst.SME) {
            return 'SME';
        }
    }


    export function keysEnum(offerLetter: string) {
        let key = null;
        Object.keys(OfferLetterConst).forEach(a => {
            if (OfferLetterConst.value(OfferLetterConst[a]) === offerLetter) {
                key = OfferLetterConst[a];
            }
        });
        return key;
    }

}
