export enum ExcelOfferLetterConst {
    DRISTIBANDHAKI,
    DPNOTEGUARANTOR,
}

export namespace ExcelOfferLetterConst {
    export function value(offerLetterConst: ExcelOfferLetterConst) {
      switch (offerLetterConst) {
        case ExcelOfferLetterConst.DRISTIBANDHAKI:
          return 'Dristibandhaki';
        case ExcelOfferLetterConst.DPNOTEGUARANTOR:
          return 'DP Note Guarantor';
      }
    }


    export function keysEnum(offerLetter: string) {
        let key = null;
        Object.keys(ExcelOfferLetterConst).forEach(o => {
            if (ExcelOfferLetterConst.value(ExcelOfferLetterConst[o]) === offerLetter) {
                key = ExcelOfferLetterConst[o];
            }
        });
        return key;
    }

}
