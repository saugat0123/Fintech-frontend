export enum RelationWithBank {
    MORE_THAN_2_YRS = 'More than 2 yrs',
    ONE_2_YRS  = '1-2 yrs',
    LESS_THAN_A_YEAR  = 'Less than a year',
    NO_PREVIOUS_BANKING  = 'No previous banking'
}

export class RelationWithBankMap {
    static map: Map<RelationWithBank, number> = new Map([
        [RelationWithBank.MORE_THAN_2_YRS, 1.50],
        [RelationWithBank.ONE_2_YRS, 1.13],
        [RelationWithBank.LESS_THAN_A_YEAR, 0.75],
        [RelationWithBank.NO_PREVIOUS_BANKING, 0.75]
    ]);
}

export namespace RelationWithBank {
    export function values() {
        return Object.keys(RelationWithBank).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
                && type !== 'getEnum'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: RelationWithBank[elem],
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
