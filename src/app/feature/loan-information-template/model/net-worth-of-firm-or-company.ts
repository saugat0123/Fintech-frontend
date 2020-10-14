export enum NetWorthOfFirmOrCompany {
    NET_WORTH_INCREASING_TREND_WITH_CAPITAL_INJECTION_PLUS_INCREASE_IN_RESERVE_AND_SURPLUS  = 'Net worth increasing trend with capital injection plus increase in reserve and surplus',
    NET_WORTH_BROUGHT_TO_POSITIVE_WITH_CAPITAL_INJECTION_PROFIT_PLOUGH_BACK = 'Net worth brought to positive with capital injection/ profit plough back',
    NET_WORTH_POSITIVE_DUE_TO_PAID_UP_CAPITAL_DESPITE_ACCUMULATED_LOSS_IMPROVING_PROJECTION = 'Net worth positive due to paid up capital despite accumulated loss/ Improving projection',
    NEGATIVE_NET_WORTH_DUE_TO_ACCUMULATED_LOSS_BUT_NO_CAPITAL_INJECTED = 'Negative net worth due to accumulated loss but no capital injected'
}

export class NetWorthOfFirmOrCompanyPointsMap {
    static netWorthOfFirmOrCompanyPointsMap: Map<string, number> = new Map([
        [NetWorthOfFirmOrCompany.NET_WORTH_INCREASING_TREND_WITH_CAPITAL_INJECTION_PLUS_INCREASE_IN_RESERVE_AND_SURPLUS, 3],
        [NetWorthOfFirmOrCompany.NET_WORTH_BROUGHT_TO_POSITIVE_WITH_CAPITAL_INJECTION_PROFIT_PLOUGH_BACK, 2],
        [NetWorthOfFirmOrCompany.NET_WORTH_POSITIVE_DUE_TO_PAID_UP_CAPITAL_DESPITE_ACCUMULATED_LOSS_IMPROVING_PROJECTION, 1],
        [NetWorthOfFirmOrCompany.NEGATIVE_NET_WORTH_DUE_TO_ACCUMULATED_LOSS_BUT_NO_CAPITAL_INJECTED, 0]
    ]);
}

export namespace NetWorthOfFirmOrCompany {
    export function values() {
        return Object.keys(NetWorthOfFirmOrCompany).filter(
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
                value: NetWorthOfFirmOrCompany[value],
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
