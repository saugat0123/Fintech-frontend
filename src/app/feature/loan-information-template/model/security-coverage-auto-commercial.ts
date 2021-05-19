export enum SecurityCoverageAutoCommercial {
    NEW_FULLY_BACKED_BY_FAC_100_AND_ABOVE = 'Fully Backed by FAC (100% and Above FAC Coverage) - New',
    NEW_PARTIALLY_BACKED_BY_FAC_60_TO_90_COVERAGE = 'Partially Backed by FAC (60% to 99% FAC coverage) - New',
    NEW_PARTIALLY_BACKED_BY_FAC_40_TO_59_COVERAGE = 'Partially Backed by FAC (40% to 59% FAC coverage) - New ',
    NEW_PARTIALLY_BACKED_BY_FAC_BELOW_40_COVERAGE = 'Partially Backed by FAC (Below 40% FAC coverage) - New',
    NEW_VEHICLE_ONLY_AC = 'Vehicle Only - New',

    USED_FULLY_BACKED_BY_FAC_100_AND_ABOVE = 'Fully Backed by FAC (100% and Above FAC Coverage) - Used',
    USED_PARTIALLY_BACKED_BY_FAC_60_TO_90_COVERAGE = 'Partially Backed by FAC (60% to 99% FAC coverage) - Used',
    USED_PARTIALLY_BACKED_BY_FAC_40_TO_59_COVERAGE = 'Partially Backed by FAC (40% to 59% FAC coverage) - Used ',
    USED_PARTIALLY_BACKED_BY_FAC_BELOW_40_COVERAGE = 'Partially Backed by FAC (Below 40% FAC coverage) - Used',
    USED_VEHICLE_ONLY_AC = 'Vehicle Only - Used',
}

export class SecurityCoverageAutoCommercialPointsMap {
    static securityCoverageAutoCommercialPointsMap: Map<string, number> = new Map([
        [SecurityCoverageAutoCommercial.NEW_FULLY_BACKED_BY_FAC_100_AND_ABOVE, 27.00],
        [SecurityCoverageAutoCommercial.NEW_PARTIALLY_BACKED_BY_FAC_60_TO_90_COVERAGE, 21.60],
        [SecurityCoverageAutoCommercial.NEW_PARTIALLY_BACKED_BY_FAC_40_TO_59_COVERAGE, 16.20],
        [SecurityCoverageAutoCommercial.NEW_PARTIALLY_BACKED_BY_FAC_BELOW_40_COVERAGE, 13.50],
        [SecurityCoverageAutoCommercial.NEW_VEHICLE_ONLY_AC, 10.80],

        [SecurityCoverageAutoCommercial.USED_FULLY_BACKED_BY_FAC_100_AND_ABOVE, 24.30],
        [SecurityCoverageAutoCommercial.USED_PARTIALLY_BACKED_BY_FAC_60_TO_90_COVERAGE, 18.90],
        [SecurityCoverageAutoCommercial.USED_PARTIALLY_BACKED_BY_FAC_40_TO_59_COVERAGE, 13.50],
        [SecurityCoverageAutoCommercial.USED_PARTIALLY_BACKED_BY_FAC_BELOW_40_COVERAGE, 10.80],
        [SecurityCoverageAutoCommercial.USED_VEHICLE_ONLY_AC, 8.10],
    ]);
}

export namespace SecurityCoverageAutoCommercial {

    export function values() {
        return Object.keys(SecurityCoverageAutoCommercial).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
                && type !== 'getNew' && type !== 'getUsed');
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: SecurityCoverageAutoCommercial[elem],
            });
        });
        return enums;
    }

    export function getNew() {
        const pairs = enumObject().filter(elem =>
            elem.key === 'NEW_FULLY_BACKED_BY_FAC_100_AND_ABOVE' ||
            elem.key === 'NEW_PARTIALLY_BACKED_BY_FAC_60_TO_90_COVERAGE' ||
            elem.key === 'NEW_PARTIALLY_BACKED_BY_FAC_40_TO_59_COVERAGE' ||
            elem.key === 'NEW_VEHICLE_ONLY_AC' ||
            elem.key === 'NEW_PARTIALLY_BACKED_BY_FAC_BELOW_40_COVERAGE');
        return pairs;
    }

    export function getUsed() {
        const pairs = enumObject().filter(elem =>
            elem.key === 'USED_FULLY_BACKED_BY_FAC_100_AND_ABOVE' ||
            elem.key === 'USED_PARTIALLY_BACKED_BY_FAC_60_TO_90_COVERAGE' ||
            elem.key === 'USED_PARTIALLY_BACKED_BY_FAC_40_TO_59_COVERAGE' ||
            elem.key === 'USED_PARTIALLY_BACKED_BY_FAC_BELOW_40_COVERAGE' ||
            elem.key === 'USED_VEHICLE_ONLY_AC');
        return pairs;
    }
}
