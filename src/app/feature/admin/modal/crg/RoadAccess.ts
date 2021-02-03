
export enum RoadAccess {
    NOT_APPLICABLE= 'Not applicable',
    SIXTEEN_to_TWENTY= '16 ft to 20 ft.',
    TEN_TO_FIFTEEN= '10 ft to 15 ft.',
    TEN= '10 ft.',
    LESS_TEN= 'Below 10 ft'
}

export class RoadAccessMap {
    static roadAccessMap: Map<RoadAccess, number> = new Map([
        [RoadAccess.NOT_APPLICABLE, 3.00],
        [RoadAccess.SIXTEEN_to_TWENTY, 3.00],
        [RoadAccess.TEN_TO_FIFTEEN, 2.70],
        [RoadAccess.TEN, 2.40],
        [RoadAccess.LESS_TEN, 2.10],
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
