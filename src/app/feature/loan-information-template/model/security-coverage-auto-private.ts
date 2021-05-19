export enum SecurityCoverageAutoPrivate {
    NEW_40_AND_BELOW_FINANCING = '40% and below financing - New',
    NEW_ABOVE_40_TO_50_FINANCING = 'Above 40% to 50% financing - New',
    USED_40_AND_BELOW_FINANCING = '40% and below financing - Used',
    USED_ABOVE_40_TO_50_FINANCING = 'Above 40% to 50% financing - Used',
}

export class SecurityCoverageAutoPrivatePointsMap {
    static securityCoverageAutoPrivatePointsMap: Map<string, number> = new Map([
        [SecurityCoverageAutoPrivate.NEW_40_AND_BELOW_FINANCING, 27.00],
        [SecurityCoverageAutoPrivate.NEW_ABOVE_40_TO_50_FINANCING, 24.30],
        [SecurityCoverageAutoPrivate.USED_40_AND_BELOW_FINANCING, 24.30],
        [SecurityCoverageAutoPrivate.USED_ABOVE_40_TO_50_FINANCING, 21.60],
    ]);
}

export namespace SecurityCoverageAutoPrivate {

    export function values() {
        return Object.keys(SecurityCoverageAutoPrivate).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
                && type !== 'getNew' && type !== 'getUsed');
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: SecurityCoverageAutoPrivate[elem],
            });
        });
        return enums;
    }

    export function getNew() {
        const pairs = enumObject().filter(elem =>
            elem.key === 'NEW_40_AND_BELOW_FINANCING' || elem.key === 'NEW_ABOVE_40_TO_50_FINANCING');
        return pairs;
    }

    export function getUsed() {
        const pairs = enumObject().filter(elem =>
            elem.key === 'USED_40_AND_BELOW_FINANCING' || elem.key === 'USED_ABOVE_40_TO_50_FINANCING');
        return pairs;
    }
}
