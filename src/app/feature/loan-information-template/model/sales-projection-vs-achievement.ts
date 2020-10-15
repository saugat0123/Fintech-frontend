export enum SalesProjectionVsAchievement {
    ABOVE_80_ACHIEVEMENT_ON_LAST_YEAR_PROJECTED_SALES = 'Above 80% achievement on last year projected sales',
    MINIMUM_80_ACHIEVEMENT_ON_LAST_YEAR_PROJECTED_SALES = 'Minimum 80% achievement on last year projected sales',
    MINIMUM_60_ACHIEVEMENT_ON_LAST_YEAR_PROJECTED_SALES = 'Minimum 60% achievement on last year projected sales',
    MINIMUM_40_ACHIEVEMENT_ON_LAST_YEAR_PROJECTED_SALES = 'Minimum 40% achievement on last year projected sales',
    BELOW_40_ACHIEVEMENT_ON_LAST_YEAR_PROJECTED_SALES = 'Below 40% achievement on last year projected sales'
}

export class SalesProjectionVsAchievementPointsMap {
    static salesProjectionVsAchievementPointsMap: Map<string, number> = new Map([
        [SalesProjectionVsAchievement.ABOVE_80_ACHIEVEMENT_ON_LAST_YEAR_PROJECTED_SALES, 1.50],
        [SalesProjectionVsAchievement.MINIMUM_80_ACHIEVEMENT_ON_LAST_YEAR_PROJECTED_SALES, 1.25],
        [SalesProjectionVsAchievement.MINIMUM_60_ACHIEVEMENT_ON_LAST_YEAR_PROJECTED_SALES, 1],
        [SalesProjectionVsAchievement.MINIMUM_40_ACHIEVEMENT_ON_LAST_YEAR_PROJECTED_SALES, 0.75],
        [SalesProjectionVsAchievement.BELOW_40_ACHIEVEMENT_ON_LAST_YEAR_PROJECTED_SALES, 0]
    ]);
}

export namespace SalesProjectionVsAchievement {
    export function values() {
        return Object.keys(SalesProjectionVsAchievement).filter(
            (type) => isNaN(<any>type)
                && type !== 'values'
                && type !== 'enumObject'
                && type !== 'getEnum',
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(value => {
            enums.push({
                key: value,
                value: SalesProjectionVsAchievement[value],
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
