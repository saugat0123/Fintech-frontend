
export enum NabilOfferLetterConst {
    // HOUSING_TAKEOVER_CASE,
    AUTO_LOAN,
    // HOUSING_CONSTRUCTION_CASE_1,
    // COMMERCIAL_AUTO,
    // HOUSING_PURCHASE_LOAN,
    EDUCATIONAL,
    PERSONAL_OVERDRAFT,
    PERSONAL_LOAN_AND_PERSONAL_OVERDRAFT,
    PERSONAL_LOAN,
    HOME_LOAN,
    MORTAGE_LOAN
}

export namespace NabilOfferLetterConst {
    export function value(offerLetterConst: NabilOfferLetterConst) {
        switch (offerLetterConst) {
            // case NabilOfferLetterConst.HOUSING_TAKEOVER_CASE:
            //     return 'Housing TakeOver Case';
            case NabilOfferLetterConst.AUTO_LOAN:
                return 'Auto Loan';
            // case NabilOfferLetterConst.HOUSING_CONSTRUCTION_CASE_1:
            //     return 'Housing Construction Case-1';
            // case NabilOfferLetterConst. COMMERCIAL_AUTO:
            //     return 'Commercial Auto';
            // case NabilOfferLetterConst. HOUSING_PURCHASE_LOAN:
            //     return 'Housing Purchase Loan';
            case NabilOfferLetterConst.EDUCATIONAL:
                return 'Educational Loan';
            case NabilOfferLetterConst.PERSONAL_OVERDRAFT:
                return 'Personal Overdraft';
            case NabilOfferLetterConst.PERSONAL_LOAN_AND_PERSONAL_OVERDRAFT:
                return 'Personal loan and personal overdraft';
            case NabilOfferLetterConst.HOME_LOAN:
                return 'Home Loan';
            case NabilOfferLetterConst.PERSONAL_LOAN:
                return 'Personal Loan';
            case NabilOfferLetterConst.MORTAGE_LOAN:
                return 'Mortage Loan';
        }
    }


    export function keysEnum(offerLetter: string) {
        let key = null;
        Object.keys(NabilOfferLetterConst).forEach(o => {
            if (NabilOfferLetterConst.value(NabilOfferLetterConst[o]) === offerLetter) {
                key = NabilOfferLetterConst[o];
            }
        });
        return key;
    }

    export function values() {
        return Object.keys(NabilOfferLetterConst).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'value' && type !== 'keysEnum' && type !== 'enumObject'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach( v => {
            enums.push({
                key: v,
                value: NabilOfferLetterConst[v]
            });
        });
        return enums;
    }

}
