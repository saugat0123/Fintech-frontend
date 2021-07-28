export enum ProgressiveLegalDocConst {
  LETTER_OF_ARRANGEMENTS = '2000',
  LETTER_OF_INSTALLMENT = '2001',
  LETTER_OF_LEIN = '2002',
  PROMISSORY_NOTE = '2003',
  LOAN_DEED = '2004',
  PROMISSORY_NOTE_GUARANTOR = '2005',
  LETTER_OF_AGREEMENT = '2006',
  HIRE_PURCHASE_DEED = '2007',
  LETTER_OF_INDEMNITY = '2008',
  LETTER_OF_DISBURSEMENT = '2009',
  GUARANTEE_BOND_CORPORATE = '2010',
  LETTER_OF_CONTINUITY = '2011',
  GUARANTEE_BOND_PERSONAL = '2012',
  MORTGAGE_DEED = '2013',
  CROSS_GUARANTEE_BOND = '2014',
  A_HYPOTHECATION_OF_GOODS_AND_RECEIVABLES = '2015',
  B_HYPOTHECATION_OF_GOODS_AND_RECEIVABLES = '2016',
  PROMISSORY_NOTE_INSTITUTIONAL = '2017',
  BLACKLIST_CONSENT ='2020'

}

export namespace ProgressiveLegalDocConst {
  export function value(offerLetterConst: ProgressiveLegalDocConst) {
    switch (offerLetterConst) {
      case ProgressiveLegalDocConst.LETTER_OF_ARRANGEMENTS:
        return 'Letter of Arrangements';
      case ProgressiveLegalDocConst.LETTER_OF_INSTALLMENT:
        return 'Letter of Installment';
      case ProgressiveLegalDocConst.LETTER_OF_LEIN:
        return 'Letter of Lein';
      case ProgressiveLegalDocConst.PROMISSORY_NOTE:
        return 'Promissory Note';
      case ProgressiveLegalDocConst.LOAN_DEED:
        return 'Loan Deed';
      case ProgressiveLegalDocConst.PROMISSORY_NOTE_GUARANTOR:
        return 'Promissory Note Guarantor';
      case ProgressiveLegalDocConst.LETTER_OF_AGREEMENT:
        return 'Letter of Agreement';
      case ProgressiveLegalDocConst.HIRE_PURCHASE_DEED:
        return 'Hire Purchase Deed';
      case ProgressiveLegalDocConst.LETTER_OF_INDEMNITY:
        return 'Letter Of Indemnity';
      case ProgressiveLegalDocConst.LETTER_OF_DISBURSEMENT:
        return 'Letter Of Disbursement';
      case ProgressiveLegalDocConst.GUARANTEE_BOND_CORPORATE:
        return 'Guarantee Bond Corporate';
      case ProgressiveLegalDocConst.LETTER_OF_CONTINUITY:
        return 'Letter Of Continuity';
      case ProgressiveLegalDocConst.GUARANTEE_BOND_PERSONAL:
        return 'Guarantee Bond Personal';
      case ProgressiveLegalDocConst.MORTGAGE_DEED:
        return 'Mortgage Deed';
      case ProgressiveLegalDocConst.CROSS_GUARANTEE_BOND:
        return 'Cross Guarantee Bond';
      case ProgressiveLegalDocConst.A_HYPOTHECATION_OF_GOODS_AND_RECEIVABLES:
        return 'A Hypothecation of Goods and Receivables';
      case ProgressiveLegalDocConst.B_HYPOTHECATION_OF_GOODS_AND_RECEIVABLES:
        return 'B Hypothecation of Goods and Receivables';
      case ProgressiveLegalDocConst.PROMISSORY_NOTE_INSTITUTIONAL:
        return 'Promissory Note Institutional';
      case ProgressiveLegalDocConst.BLACKLIST_CONSENT:
        return 'Blacklist Consent';
    }
  }

  export function keysEnum(offerLetter: string) {
    let key = null;
    Object.keys(ProgressiveLegalDocConst).forEach(o => {
      if (ProgressiveLegalDocConst.value(ProgressiveLegalDocConst[o]) === offerLetter) {
        key = ProgressiveLegalDocConst[o];
      }
    });
    return key;
  }

  export function values() {
    return Object.keys(ProgressiveLegalDocConst).filter(
        (type) => isNaN(<any>type) && type !== 'values' && type !== 'value' && type !== 'keysEnum' && type !== 'enumObject'
    );
  }

  export function enumObject() {
    const enums = [];
    values().forEach(v => {
      enums.push({
        key: v,
        value: ProgressiveLegalDocConst[v]
      });
    });
    return enums;
  }
}
