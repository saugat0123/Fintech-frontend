export enum CustomerCategory {
    SANA_BYABASAYI = 'Sana Byabasayi saral karja',
    SME_UPTO_TEN_MILLION = 'SME up to NPR 10 Million',
    SME_ABOVE_TEN_MILLION = 'SME above NPR 10 Million',
    AGRICULTURE_UPTO_TWO_MILLION = 'AgriDSL up to 2 Million',
    AGRICULTURE_TWO_TO_TEN_MILLION = 'AgriDSL above 2 million to 10 Million',
    AGRICULTURE_ABOVE_TEN_MILLION = 'AgriDSL above 10 Million',
    AGRICULTURE_UPTO_ZERO_POINT_FIVE_MILLION = 'AgriDSL upto 0.5 Million',
    DSL_WHOLE_SALE = 'DSL Whole Sale',
}

export namespace CustomerCategory {
    export function values() {
        return Object.keys(CustomerCategory).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(el => {
            enums.push({
                key: el,
                value: CustomerCategory[el],
            });
        });
        return enums;
    }
}
