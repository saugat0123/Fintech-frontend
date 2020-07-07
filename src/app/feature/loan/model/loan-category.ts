export enum LoanCategory {
    PERSONAL = 'PERSONAL_TYPE',
    BUSINESS = 'BUSINESS_TYPE'
}

export namespace LoanCategory {
    export function values() {
        return Object.keys(LoanCategory).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: LoanCategory[elem],
            });
        });
        return enums;
    }

}
