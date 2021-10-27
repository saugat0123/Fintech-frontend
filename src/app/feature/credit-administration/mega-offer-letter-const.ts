
export enum MegaOfferLetterConst {
    RETAIL_HOUSING,
    RETAIL_EDUCATIONAL,
    RETAIL_MORTGAGE_OVERDRAFT,
    RETAIL_PROFESSIONAL_LOAN,
    HIRE_PURCHASE,
    SME,
    RETAIL_MORTGAGE_LOAN,
    RETAIL_EDUCATIONAL_ENGLISH,
    RETAIL_LOAN_AGAINST_INSURANCE,
    personal_overdraft,
    home_loan,
    personal_loan_and_personal_overdraft,
    PERSONAL_LOAN,
    Auto_Loan_Commercial

}

export namespace MegaOfferLetterConst {
    export function value(offerLetterConst: MegaOfferLetterConst) {
      switch (offerLetterConst) {
        case MegaOfferLetterConst.RETAIL_HOUSING:
          return 'Retail Housing';
        case MegaOfferLetterConst.RETAIL_EDUCATIONAL:
          return 'Retail Educational';
        case MegaOfferLetterConst.RETAIL_MORTGAGE_OVERDRAFT:
          return 'Retail Mortgage Overdraft';
        case MegaOfferLetterConst.RETAIL_PROFESSIONAL_LOAN:
          return 'Retail Professional Loan';
        case MegaOfferLetterConst.HIRE_PURCHASE:
          return 'Hire Purchase';
        case MegaOfferLetterConst.SME:
          return 'SME';
        case MegaOfferLetterConst.RETAIL_EDUCATIONAL_ENGLISH:
          return 'Retail Educational Loan English';
        case MegaOfferLetterConst.RETAIL_MORTGAGE_LOAN:
          return 'Retail Mortgage Loan';
          case MegaOfferLetterConst.RETAIL_LOAN_AGAINST_INSURANCE:
              return 'Retail Loan Against Insurance';
          case MegaOfferLetterConst.personal_overdraft:
              return 'personal overdraft';
          case MegaOfferLetterConst.PERSONAL_LOAN:
              return 'Personal Loan';
          case MegaOfferLetterConst.home_loan:
              return 'home loan';
          case MegaOfferLetterConst.Auto_Loan_Commercial:
              return 'Auto loan commercial';
      }
    }


    export function keysEnum(offerLetter: string) {
        let key = null;
        Object.keys(MegaOfferLetterConst).forEach(o => {
            if (MegaOfferLetterConst.value(MegaOfferLetterConst[o]) === offerLetter) {
                key = MegaOfferLetterConst[o];
            }
        });
        return key;
    }

    export function values() {
        return Object.keys(MegaOfferLetterConst).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'value' && type !== 'keysEnum' && type !== 'enumObject'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach( v => {
            enums.push({
                key: v,
                value: MegaOfferLetterConst[v]
            });
        });
        return enums;
    }

}
