
export enum AlternateIncomeSource {
    ABOVE_TWENTY= 'Equivalent or above 20% of EMI/EQI',
    EQUAL_OR_MORE_TWENTY= 'Equivalent or above 15% of EMI/EQI',
    EQUAL_OR_MORE_TEN= 'Equivalent or above 10% of EMI/EQI',
    EQUAL_OR_MORE_FIVE= 'Equivalent or above 5% of EMI/EQI',
    NO__OR_LESS_TWO= 'No alternate source of income or below 5%',
}

export class AlternateIncomeSourceMap {
    static majorSourceIncomeMap: Map<AlternateIncomeSource, number> = new Map([
        [AlternateIncomeSource.ABOVE_TWENTY, 6],
        [AlternateIncomeSource.EQUAL_OR_MORE_TWENTY, 5.40],
        [AlternateIncomeSource.EQUAL_OR_MORE_TEN, 4.50],
        [AlternateIncomeSource.EQUAL_OR_MORE_FIVE, 3],
        [AlternateIncomeSource.NO__OR_LESS_TWO, 0],
    ]);
}

export namespace AlterNateIncomeSource {
    export function values() {
        return Object.keys(AlterNateIncomeSource).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
                && type !== 'getEnum'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: AlterNateIncomeSource[elem],
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
