export enum MicroCustomerType {
    DIRECT = 'Direct Customer',
    INDIRECT = 'Indirect Customer'
}

export namespace MicroCustomerType {
    export function values() {
        return Object.keys(MicroCustomerType).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(value => {
            enums.push({
                key: value,
                value: MicroCustomerType[value]
            });
        });
        return enums;
    }
}
