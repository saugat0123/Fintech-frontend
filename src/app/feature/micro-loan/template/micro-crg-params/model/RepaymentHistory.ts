export enum RepaymentHistory {
    NEW_CLIENT = 'New client',
    NO_OVERDUE_NO_IRREGULARITY = 'No overdue/no irregularity',
    OVERDUE_IRREGULARITIES = 'Overdue/irregularities'
}

export class RepaymentHistoryMap {
    static map: Map<RepaymentHistory, number> = new Map([
        [RepaymentHistory.NEW_CLIENT, 0.5],
        [RepaymentHistory.NO_OVERDUE_NO_IRREGULARITY, 0.50],
        [RepaymentHistory.OVERDUE_IRREGULARITIES, 0.25]
    ]);
}

export namespace RepaymentHistory {
    export function values() {
        return Object.keys(RepaymentHistory).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
                && type !== 'getEnum'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: RepaymentHistory[elem],
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
