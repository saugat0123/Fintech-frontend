export enum SecurityOfferLetter {
    FIXED_DEPOSIT = 'FIXED_DEPOSIT',
    LAND = 'LAND',
    LAND_AND_BUILDING = 'LAND_AND_BUILDING'
}
export namespace SecurityOfferLetter {
    export function values() {
        return Object.keys(SecurityOfferLetter).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(val => {
            enums.push({
                key: val,
                value: SecurityOfferLetter[val],
            });
        });
        return enums;
    }

}

