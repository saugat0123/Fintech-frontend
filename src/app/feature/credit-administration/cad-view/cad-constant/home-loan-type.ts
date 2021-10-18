export enum HomeLoanType {
    CONSTRUCTION = 'CONSTRUCTION',
    PURCHASE = 'PURCHASE',
    TAKE_OVER = 'TAKE OVER'
}

export namespace HomeLoanType {
    export function values() {
        return Object.keys(HomeLoanType).filter(
            (type ) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(element => {
            enums.push({
                key: element,
                value: HomeLoanType[element],
            });
        });
        return enums;
    }
}

