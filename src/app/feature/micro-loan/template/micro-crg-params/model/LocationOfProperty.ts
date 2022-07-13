export enum LocationOfProperty {
    RURAL_MUNICIPALITY = 'Rural Municipality',
    MUNCIPALITY = 'Muncipality',
    SUB_METRO_CITIES = 'Sub Metro Cities',
    METRO_CITIES = 'Metro Cities'
}

export class LocationOfPropertyMap {
    static map: Map<LocationOfProperty, number> = new Map([
        [LocationOfProperty.RURAL_MUNICIPALITY, 4.00],
        [LocationOfProperty.MUNCIPALITY, 6.40],
        [LocationOfProperty.SUB_METRO_CITIES, 7.20],
        [LocationOfProperty.METRO_CITIES, 8.00]
    ]);
}

export namespace LocationOfProperty {
    export function values() {
        return Object.keys(LocationOfProperty).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
                && type !== 'getEnum'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: LocationOfProperty[elem],
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
