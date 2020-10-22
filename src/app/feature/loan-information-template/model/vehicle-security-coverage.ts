export enum VehicleSecurityCoverage {
    FULLY_BACKED = 'Fully Backed by FAC (New or Used Vehicles)',
    NEW_PARTIALLY_BACKED_ABOVE_50 = 'Partially Backed by FAC (above 50%) - New',
    NEW_PARTIALLY_BACKED_BELOW_50 = 'Partially Backed by FAC (below 50%) - New',
    NEW_VEHICLE_ONLY = 'Vehicle Only - New',
    USED_PARTIALLY_BACKED_ABOVE_50 = 'Partially Backed by FAC (above 50%) - Used',
    USED_PARTIALLY_BACKED_BELOW_50 = 'Partially Backed by FAC (below 50%) - Used',
    USED_VEHICLE_ONLY = 'Vehicle Only - Used'
}

export class VehicleSecurityCoveragePointsMap {
    static vehicleSecurityCoveragePointsMap: Map<string, number> = new Map([
        [VehicleSecurityCoverage.FULLY_BACKED, 42.50],
        [VehicleSecurityCoverage.NEW_PARTIALLY_BACKED_ABOVE_50, 38.25],
        [VehicleSecurityCoverage.NEW_PARTIALLY_BACKED_BELOW_50, 34],
        [VehicleSecurityCoverage.NEW_VEHICLE_ONLY, 31.88],
        [VehicleSecurityCoverage.USED_PARTIALLY_BACKED_ABOVE_50, 31.88],
        [VehicleSecurityCoverage.USED_PARTIALLY_BACKED_BELOW_50, 25.50],
        [VehicleSecurityCoverage.USED_VEHICLE_ONLY, 21.25]
    ]);
}

export namespace VehicleSecurityCoverage {

    export function values() {
        return Object.keys(VehicleSecurityCoverage).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
                && type !== 'getNew' && type !== 'getUsed');
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: VehicleSecurityCoverage[elem],
            });
        });
        return enums;
    }

    export function getNew() {
        const pairs = enumObject().filter(elem =>
            elem.key === 'NEW_PARTIALLY_BACKED_ABOVE_50' || elem.key === 'NEW_PARTIALLY_BACKED_BELOW_50' ||
            elem.key === 'NEW_VEHICLE_ONLY');
        return pairs;
    }

    export function getUsed() {
        const pairs = enumObject().filter(elem =>
            elem.key === 'USED_PARTIALLY_BACKED_ABOVE_50' || elem.key === 'USED_PARTIALLY_BACKED_BELOW_50' ||
            elem.key === 'USED_VEHICLE_ONLY');
        return pairs;
    }
}
