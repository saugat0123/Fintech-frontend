export enum financedAssets {
    fixedAssets = 'FixedAssets',
    workingCapital = 'WorkingCapital'
}

export namespace financedAssets {
    export function values() {
        return Object.keys(financedAssets).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: financedAssets[elem],
            });
        });
        return enums;
    }

}



