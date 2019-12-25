export enum ValuatingField {
    LAND = 'Land',
    VEHICLE = 'Vehicle'
}

export namespace ValuatingField {
    export function values() {
        return Object.keys(ValuatingField).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'value'
        );
    }
}
