
export enum RepaymentTrackCurrentBank {
    BEFORE_DUE= 'Repayment done on or before due date',
    WITHIN_SEVEN= 'Repayment done within 7 working days from due date ',
    WITHIN_THIRTY= 'Repayment done within 30 days from due date',
    AFTER_THiRTY= 'Repayment done after 30 days from due date',
    NEW_CLIENT= 'New client with no credit history at any bank'
}

export class RepaymentTrackCurrentBankMap {
    static majorSourceIncomeMap: Map<RepaymentTrackCurrentBank, number> = new Map([
        [RepaymentTrackCurrentBank.BEFORE_DUE, 2.500],
        [RepaymentTrackCurrentBank.WITHIN_SEVEN, 1.75],
        [RepaymentTrackCurrentBank.WITHIN_THIRTY, 2.40],
        [RepaymentTrackCurrentBank.AFTER_THiRTY, 1.25],
        [RepaymentTrackCurrentBank.NEW_CLIENT, 0.0],
    ]);
}

export namespace RepaymentTrackCurrentBank {
    export function values() {
        return Object.keys(RepaymentTrackCurrentBank).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
                && type !== 'getEnum'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: RepaymentTrackCurrentBank[elem],
            });
        });
        return enums;
    }

    export function getEnum(value: string) {
        for (const enumPair of enumObject()) {
            if (enumPair.value === value) {
                return enumPair.key;
            }
        }
    }
}