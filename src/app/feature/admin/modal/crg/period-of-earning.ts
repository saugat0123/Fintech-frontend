
export enum PeriodOfEarning {
    MORE_FIVE= 'Equivalent or More than 5 years',
    LESS_FIVE_OR_EQUAL_MORE_TWO= 'Equivalent to 2 years or less than 5 years',
    MORE_ONE_LESS_TWO= 'Equivalent or more than 1 year and less than 2 years',
    LESS_TWO= 'Less than one year'
}

export class MajorSourceIncomeMap {
    static majorSourceIncomeMap: Map<PeriodOfEarning, number> = new Map([
        [PeriodOfEarning.MORE_FIVE, 3],
        [PeriodOfEarning.LESS_FIVE_OR_EQUAL_MORE_TWO, 2.25],
        [PeriodOfEarning.MORE_ONE_LESS_TWO, 1.50],
        [PeriodOfEarning.LESS_TWO, 0.00],
    ]);
}

export namespace PeriodOfEarning {
    export function values() {
        return Object.keys(PeriodOfEarning).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
                && type !== 'getEnum'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: PeriodOfEarning[elem],
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
