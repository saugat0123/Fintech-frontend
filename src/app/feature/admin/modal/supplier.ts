export enum Supplier {
    GREATER_THAN_TEN = '> 10',
    BETWEEN_FIVE_AND_TEN = '5 - 10',
    BETWEEN_TWO_AND_FIVE = '2 - 5',
    LESS_THAN_TWO = '< 2'
}

export class SupplierMap {
    static supplierMap: Map<Supplier, number> = new Map([
        [Supplier.GREATER_THAN_TEN, 1.00],
        [Supplier.BETWEEN_FIVE_AND_TEN, 0.75],
        [Supplier.BETWEEN_TWO_AND_FIVE, 0.50],
        [Supplier.LESS_THAN_TWO, 0.00]
    ]);
}

export namespace Supplier {

    export function values() {
        return Object.keys(Supplier).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject' && type !== 'getEnum'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(value => {
            enums.push({
                key: value,
                value: Supplier[value]
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
