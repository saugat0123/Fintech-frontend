export enum IcfcOfferLetterConst {
    // LETTER_OF_ARRANGEMENTS,
    AC_DEBIT_AND_LOAN_DISBURSEMENT_AUTHORITY,
    BANK_GUARANTEE,
    BUSINESS_LOAN,
    CORPORATE_GUARANTEE,
    LETTER_OF_CONTINUITY,
    LETTER_OF_SET_OFF,
    PERSONAL_TERM_LOAN,
    LETTER_OF_AGREEMENT,
    CALL_DEED_SHARE_LOAN_COMPANY,
    CALL_DEED_SHARE_LOAN,
    PROMISSORY_NOTE,
    MORTGAGE_DEED_COMPANY,
    MORTGAGE_DEED_INDIVIDUAL_DIFFERENT_BORROWER,
    MORTGAGE_DEED_INDIVIDUAL_SAME,
    LOAN_DEED_COMPANY,
    LOAN_DEED_PERSONAL_LOAN_HOME_LOAN,
    LOAN_DEED_SHARE_LOAN,
    LOAN_DEED_HIRE_PURCHASE,
    PERSONAL_GUARANTEE_COMPANY
}

export namespace IcfcOfferLetterConst {
    export function value(offerLetterConst: IcfcOfferLetterConst) {
        switch (offerLetterConst) {
            // case IcfcOfferLetterConst.LETTER_OF_ARRANGEMENTS:
            //     return 'Letter of Arrangements';
            case IcfcOfferLetterConst.AC_DEBIT_AND_LOAN_DISBURSEMENT_AUTHORITY:
                return 'AC Debit and Loan Disbursement Authority';
            case IcfcOfferLetterConst.BANK_GUARANTEE:
                return 'Bank Guarantee';
            case IcfcOfferLetterConst.BUSINESS_LOAN:
                return 'Business Loan';
            case IcfcOfferLetterConst.CORPORATE_GUARANTEE:
                return 'Corporate Guarantee';
            case IcfcOfferLetterConst.LETTER_OF_CONTINUITY:
                return 'Letter of Continuity';
            case IcfcOfferLetterConst.LETTER_OF_SET_OFF:
                return 'Letter of Set Off';
            case IcfcOfferLetterConst.PERSONAL_TERM_LOAN:
                return 'Personal Term Loan';
            case IcfcOfferLetterConst.LETTER_OF_AGREEMENT:
                return 'Letter of Agreement';
            case IcfcOfferLetterConst.CALL_DEED_SHARE_LOAN_COMPANY:
                return 'Call deed share loan company';
            case IcfcOfferLetterConst.CALL_DEED_SHARE_LOAN:
                return 'Call deed share loan';
            case IcfcOfferLetterConst.PROMISSORY_NOTE:
                return 'Promissory Note';
            case IcfcOfferLetterConst.MORTGAGE_DEED_COMPANY:
                return 'Mortgage Deed Company';
            case IcfcOfferLetterConst.MORTGAGE_DEED_INDIVIDUAL_DIFFERENT_BORROWER:
                return 'Mortgage Deed Individual different borrower and owner';
            case IcfcOfferLetterConst.MORTGAGE_DEED_INDIVIDUAL_SAME:
                return 'Mortgage deed individual same borrower and owner';
            case IcfcOfferLetterConst.LOAN_DEED_COMPANY:
                return 'Loan Deed Company';
            case IcfcOfferLetterConst.LOAN_DEED_SHARE_LOAN:
                return 'Loan Deed Share Loan';
            case IcfcOfferLetterConst.LOAN_DEED_HIRE_PURCHASE:
                return 'Loan Deed Hire Purchase';
            case IcfcOfferLetterConst.LOAN_DEED_PERSONAL_LOAN_HOME_LOAN:
                return 'Loan Deed Personal Loan Home Loan';
            case IcfcOfferLetterConst.PERSONAL_GUARANTEE_COMPANY:
                return 'Personal Guarantee Company';
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
