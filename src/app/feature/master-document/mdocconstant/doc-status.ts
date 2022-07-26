export enum DocStatus {
    ACTIVE = 'ACTIVE', INACTIVE = 'INACTIVE'
}

export namespace DocStatus {
    export function values() {
        return Object.keys(DocStatus).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: DocStatus[elem],
            });
        });
        return enums;
    }

}
