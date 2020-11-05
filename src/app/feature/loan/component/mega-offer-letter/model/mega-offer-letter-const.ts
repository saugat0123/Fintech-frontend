export enum MegaOfferLetterConst {
    HAYER_PURCHASE,
    RETAIL_MORTGAGE_LOAN,
    RETAIL_EDUCATIONAL,
    RETAIL_MORTGAGE_OVERDRAFT,
    RETAIL_HOUSING,
    RETAIL_PROFESSIONAL_LOAN,
    RETAIL_EDUCATIONAL_ENGLISH,
    SME
}

export namespace MegaOfferLetterConst {
    export function value(megaofferLetterConst: MegaOfferLetterConst) {
       if (megaofferLetterConst === MegaOfferLetterConst.HAYER_PURCHASE) {
        return 'Hayer Purchase';
        } else if (megaofferLetterConst === MegaOfferLetterConst.RETAIL_MORTGAGE_LOAN) {
        return 'Retail Mortgage Loan';
        } else if (megaofferLetterConst === MegaOfferLetterConst.RETAIL_EDUCATIONAL_ENGLISH) {
        return 'Retail Educational English';
        } else if (megaofferLetterConst === MegaOfferLetterConst.RETAIL_PROFESSIONAL_LOAN) {
        return 'Retail Professional Loan';
        } else if (megaofferLetterConst === MegaOfferLetterConst.RETAIL_HOUSING) {
        return 'Retail Housing';
        } else if (megaofferLetterConst === MegaOfferLetterConst.RETAIL_EDUCATIONAL) {
        return 'Retail Educational';
        } else if (megaofferLetterConst === MegaOfferLetterConst.RETAIL_MORTGAGE_OVERDRAFT) {
        return 'Retail Mortgage Overdraft';
        } else if (megaofferLetterConst === MegaOfferLetterConst.SME) {
            return 'SME';
        }
    }


    export function keysEnum(megaofferLetter: string) {
        let key = null;
        Object.keys(MegaOfferLetterConst).forEach(a => {
            if (MegaOfferLetterConst.value(MegaOfferLetterConst[a]) === megaofferLetter) {
                key = MegaOfferLetterConst[a];
            }
        });
        return key;
    }

}
