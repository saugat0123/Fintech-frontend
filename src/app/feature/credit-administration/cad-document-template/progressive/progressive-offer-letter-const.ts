export enum ProgressiveOfferLetterConst {
    LETTER_OF_ARRANGEMENTS,
    LETTER_OF_INSTALLMENT,
    LETTER_OF_LEIN,
    PROMISSORY_NOTE,
    LOAN_DEED,
    PROMISSORY_NOTE_GUARANTOR,
    LETTER_OF_AGREEMENT,
    HIRE_PURCHASE_DEED,
    LETTER_OF_INDEMNITY,
    LETTER_OF_DISBURSEMENT,
    GUARANTEE_BOND_CORPORATE,
    LETTER_OF_CONTINUITY,
    CROSS_GUARANTEE_BOND


}

export namespace ProgressiveOfferLetterConst {
    export function value(offerLetterConst: ProgressiveOfferLetterConst) {
        switch (offerLetterConst) {
            case ProgressiveOfferLetterConst.LETTER_OF_ARRANGEMENTS:
                return 'Letter of Arrangements';
            case ProgressiveOfferLetterConst.LETTER_OF_INSTALLMENT:
                return 'Letter of Installment';
            case ProgressiveOfferLetterConst.LETTER_OF_LEIN:
                return 'Letter of Lein';
            case ProgressiveOfferLetterConst.PROMISSORY_NOTE:
                return 'Promissory Note';
            case ProgressiveOfferLetterConst.LOAN_DEED:
                return 'Loan Deed';
            case ProgressiveOfferLetterConst.PROMISSORY_NOTE_GUARANTOR:
                return 'Promissory Note Guarantor';
            case ProgressiveOfferLetterConst.LETTER_OF_AGREEMENT:
                return 'Letter of Agreement';
            case ProgressiveOfferLetterConst.HIRE_PURCHASE_DEED:
                return 'Hire Purchase Deed';
            case ProgressiveOfferLetterConst.LETTER_OF_INDEMNITY:
                return 'Letter Of Indemnity';
            case ProgressiveOfferLetterConst.LETTER_OF_DISBURSEMENT:
                return 'Letter Of Disbursement';
            case ProgressiveOfferLetterConst.GUARANTEE_BOND_CORPORATE:
                return 'Guarantee Bond Corporate';
            case ProgressiveOfferLetterConst.LETTER_OF_CONTINUITY:
                return 'Letter Of Continuity';
            case ProgressiveOfferLetterConst.CROSS_GUARANTEE_BOND:
                return 'Cross Guarantee Bond';


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
