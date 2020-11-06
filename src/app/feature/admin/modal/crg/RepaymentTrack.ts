
export enum RepaymentTrack {
    BEFORE_DUE= 'Repayment done on or before due date as confirmed by CIC and account statement',
    WITHIN_SEVEN= 'Repayment done within 7 working days from due date as confirmed by CIC and account statement',
    WITHIN_THIRTY= 'Repayment done within 30 days from due date as confirmed by CIC and account statement',
    AFTER_THiRTY= 'Repayment done after 30 days from due date as confirmed by CIC and account statement',
    NEW_CLIENT= 'New client with no credit history at any bank'
}

export class RepaymentTrackMap {
    static majorSourceIncomeMap: Map<RepaymentTrack, number> = new Map([
        [RepaymentTrack.BEFORE_DUE, 2.500],
        [RepaymentTrack.WITHIN_SEVEN, 1.75],
        [RepaymentTrack.WITHIN_THIRTY, 2.40],
        [RepaymentTrack.AFTER_THiRTY, 1.25],
        [RepaymentTrack.NEW_CLIENT, 0.0],
    ]);
}

export namespace RepaymentTrack {
    export function values() {
        return Object.keys(RepaymentTrack).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
                && type !== 'getEnum'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: RepaymentTrack[elem],
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