
export enum NabilOfferLetterConst {
    AUTO_LOAN ,
    EDUCATIONAL ,
    PERSONAL_LOAN ,
    PERSONAL_OVERDRAFT ,
    PERSONAL_OVERDRAFT_WITHOUT_COLLATERAL ,
    PERSONAL_LOAN_AND_PERSONAL_OVERDRAFT ,
    HOME_LOAN ,
    MORTAGE_LOAN ,
    SHARE_LOAN ,
    NABIL_SAHAYATRI_KARJA ,
    KISAN_KARJA_SUBSIDY ,
    UDYAMSIL_KARJA_SUBSIDY ,
    INTEREST_SUBSIDY_SANCTION_LETTER ,
    DDSL_WITHOUT_SUBSIDY ,
    CLASS_A ,
    COMBINED_LETTER
}

export namespace NabilOfferLetterConst {
    export function value(offerLetterConst: NabilOfferLetterConst) {
        switch (offerLetterConst) {
            case NabilOfferLetterConst.AUTO_LOAN:
                return 'Auto Loan';
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
            case NabilOfferLetterConst.PERSONAL_OVERDRAFT_WITHOUT_COLLATERAL:
                return 'Personal overdraft without collateral';
            case NabilOfferLetterConst.KISAN_KARJA_SUBSIDY:
                return 'Kisan Karja Subsidy';
            case NabilOfferLetterConst.UDYAMSIL_KARJA_SUBSIDY:
                return 'Udyamsil Karja Subsidy';
            case NabilOfferLetterConst.INTEREST_SUBSIDY_SANCTION_LETTER:
                return 'Interest subsidy sanction letter';
            case NabilOfferLetterConst.DDSL_WITHOUT_SUBSIDY:
                return 'DDSL Without Subsidy';
            case NabilOfferLetterConst.COMBINED_LETTER:
                return 'Combined Offer Letter';
            case NabilOfferLetterConst.SHARE_LOAN:
                return 'Share Loan';
            case NabilOfferLetterConst.CLASS_A:
                return 'Class A Sanction letter';
            case NabilOfferLetterConst.NABIL_SAHAYATRI_KARJA:
                return 'Nabil Sahayatri Karja';
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
