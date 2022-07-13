export enum Multibanking {
    SOLE_BANKING = 'Sole Banking',
    MULTIPLE_BANKING = 'Multiple Banking'
}

export class MultibankingMap {
    static map: Map<Multibanking, number> = new Map([
        [Multibanking.SOLE_BANKING, 3.00],
        [Multibanking.MULTIPLE_BANKING, 1.50]
    ]);
}

export namespace Multibanking {
    export function values() {
        return Object.keys(Multibanking).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
                && type !== 'getEnum'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: Multibanking[elem],
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
