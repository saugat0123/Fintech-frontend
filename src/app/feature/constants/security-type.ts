export enum SecurityType {
    AUTO= 'Auto',
    LAND_BUILDING = 'Land Building'
}

export namespace SecurityType {

    export function key() {
        return Object.keys(SecurityType).filter(
            (type) => isNaN(<any>type) && type !== 'key' && type !== 'pair'
        );
    }

    export function pair() {
        const enums = [];
        key().forEach(elem => {
            enums.push({
                key: elem,
                value: SecurityType[elem],
            });
        });
        return enums;
    }
}
