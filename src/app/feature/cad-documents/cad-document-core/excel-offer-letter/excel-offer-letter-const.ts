// import {values} from '../../../credit-administration/mega-offer-letter-const';

export enum ExcelOfferLetterConst {
    DRISTIBANDHAKI,
    DPNOTEGUARANTOR,
    PLEDGEDEEDFIRST,
    DPNOTEBORROWER,
    PGFIRM,
    PGRETAILLOAN,
    CONTINUATIONDEED
}

export namespace ExcelOfferLetterConst {
    export function value(offerLetterConst: ExcelOfferLetterConst) {
        switch (offerLetterConst) {
            case ExcelOfferLetterConst.DRISTIBANDHAKI:
                return 'Dristibandhaki';
            case ExcelOfferLetterConst.DPNOTEGUARANTOR:
                return 'DP Note Guarantor';
            case ExcelOfferLetterConst.PLEDGEDEEDFIRST:
                return 'Pledge Deed First Party';
            case ExcelOfferLetterConst.DPNOTEBORROWER:
                return 'DP Note Borrower';
            case ExcelOfferLetterConst.PGFIRM:
                return 'PG Firm';
            case ExcelOfferLetterConst.PGRETAILLOAN:
                return 'PG Retail Loan';
            case ExcelOfferLetterConst.CONTINUATIONDEED:
                return 'Continuation Deed';
        }
    }

    export function values() {
        return Object.keys(ExcelOfferLetterConst).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'value' && type !== 'keysEnum' && type !== 'enumObject'
        );
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

    export function enumObject() {
        const enums = [];
        values().forEach(v => {
            enums.push({
                key: v,
                value: ExcelOfferLetterConst[v]
            });
        });
        return enums;
    }

}
