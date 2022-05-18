export enum LandAndBuildingLocation {
    COMMERCIAL = 'Commercial Area',
    RESIDENTIAL = 'Residential Area',
    AGRICULTURAL = 'Agricultural Area'
}

export class LandAndBuildingLocationPointsMap {
    static landAndBuildingLocationPointsMap: Map<string, number> = new Map([
        [LandAndBuildingLocation.COMMERCIAL, 2.50],
        [LandAndBuildingLocation.RESIDENTIAL, 1.67],
        [LandAndBuildingLocation.AGRICULTURAL, 0.83]
    ]);
}

export namespace LandAndBuildingLocation {

    export function values() {
        return Object.keys(LandAndBuildingLocation).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: LandAndBuildingLocation[elem],
            });
        });
        return enums;
    }
}
