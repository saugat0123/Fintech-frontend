export enum Buyer {
    GREATER_THAN_TEN = '> 10',
    BETWEEN_FIVE_AND_TEN = '5 - 10',
    BETWEEN_TWO_AND_FIVE = '2 - 5',
    LESS_THAN_TWO = '< 2'
}

export class BuyerMap {
    static buyerMap: Map<Buyer, number> = new Map([
        [Buyer.GREATER_THAN_TEN, 1.00],
        [Buyer.BETWEEN_FIVE_AND_TEN, 0.75],
        [Buyer.BETWEEN_TWO_AND_FIVE, 0.50],
        [Buyer.LESS_THAN_TWO, 0.00]
    ]);
}

export namespace Buyer {
    export function values() {
        return Object.keys(Buyer).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject' && type !== 'getEnum'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(value => {
            enums.push({
                key: value,
                value: Buyer[value]
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
