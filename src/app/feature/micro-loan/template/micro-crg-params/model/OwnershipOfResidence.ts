export enum OwnershipOfResidence {
    LOCAL_RESIDENT_AND_OWNS_A_HOME  = 'Local resident and owns a home',
    MIGRATED_AND_OWNS_A_HOME = 'Migrated and owns a home',
    RESIDING_ON_RENTAL_HOME = 'Residing on rental home'
}

export class OwnershipOfResidenceMap {
    static map: Map<OwnershipOfResidence, number> = new Map([
        [OwnershipOfResidence.LOCAL_RESIDENT_AND_OWNS_A_HOME, 6.00],
        [OwnershipOfResidence.MIGRATED_AND_OWNS_A_HOME, 5.40],
        [OwnershipOfResidence.RESIDING_ON_RENTAL_HOME, 3.00]
    ]);
}

export namespace OwnershipOfResidence {
    export function values() {
        return Object.keys(OwnershipOfResidence).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
                && type !== 'getEnum'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: OwnershipOfResidence[elem],
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
