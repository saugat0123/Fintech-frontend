export enum CustomerLoanOptions {
    NEW = 'NEW',
    EXISTING = 'EXISTING'
}

export namespace CustomerLoanOptions {
    export function values() {
        return Object.keys(CustomerLoanOptions).filter(
            (type ) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(element => {
            enums.push({
                key: element,
                value: CustomerLoanOptions[element],
            });
        });
        return enums;
    }
}

