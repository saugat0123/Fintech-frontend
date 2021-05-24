export enum RoadAccess {
    MORE_THAN_8_FT = 'More than 8 ft',
    MORE_THAN_4_FT_LESS_THAN_8_FT = 'More than 4ft less than 8ft',
    AGRICULTURE_LAND_WITHOUT_ROAD_ACCESS = 'Agriculture land without road access'
}

export class RoadAccessMap {
    static map: Map<RoadAccess, number> = new Map([
        [RoadAccess.MORE_THAN_8_FT, 8.00],
        [RoadAccess.MORE_THAN_4_FT_LESS_THAN_8_FT, 6.40],
        [RoadAccess.AGRICULTURE_LAND_WITHOUT_ROAD_ACCESS, 4.00]
    ]);
}

export namespace RoadAccess {
    export function values() {
        return Object.keys(RoadAccess).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
                && type !== 'getEnum'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: RoadAccess[elem],
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
