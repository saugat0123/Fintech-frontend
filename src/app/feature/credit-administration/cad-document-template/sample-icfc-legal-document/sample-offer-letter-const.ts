export enum SampleOfferLetterConst {
    AC_DEBIT_AND_LOAN_DISBURSEMENT_SAMPLE,
    BANK_GUARANTEE_SAMPLE,
    LETTER_OF_CONTINUITY_SAMPLE,
    LETTER_OF_AGREEMENT_SAMPLE,
}

export namespace SampleOfferLetterConst {
    export function value(offerLetterConst: SampleOfferLetterConst) {
        switch (offerLetterConst) {
            case SampleOfferLetterConst.AC_DEBIT_AND_LOAN_DISBURSEMENT_SAMPLE:
                return 'AC Debit and Loan Disbursement Sample';
            case SampleOfferLetterConst.BANK_GUARANTEE_SAMPLE:
                return 'Bank Guarantee Sample';
            case SampleOfferLetterConst.LETTER_OF_CONTINUITY_SAMPLE:
                return 'Letter Of Continuity Sample';
            case SampleOfferLetterConst.LETTER_OF_AGREEMENT_SAMPLE:
                return 'Letter Of Agreement Sample';
        }
    }

    export function keysEnum(offerLetter: string) {
        let key = null;
        Object.keys(SampleOfferLetterConst).forEach(o => {
            if (SampleOfferLetterConst.value(SampleOfferLetterConst[o]) === offerLetter) {
                key = SampleOfferLetterConst[o];
            }
        });
        return key;
    }

    export function values() {
        return Object.keys(SampleOfferLetterConst).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'value' && type !== 'keysEnum' && type !== 'enumObject'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(v => {
            enums.push({
                key: v,
                value: SampleOfferLetterConst[v]
            });
        });
        return enums;
    }
}
