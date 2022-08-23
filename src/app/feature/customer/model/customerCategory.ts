export enum CustomerCategory {
    SANA_BYABASAYI = 'Sana Byabasayi saral karja',
    SME_UPTO_TEN_MILLION = 'SME up to NPR 10 Million',
    SME_ABOVE_TEN_MILLION = 'SME above NPR 10 Million',
    AGRICULTURE_UPTO_TEN_MILLION = 'Agriculture up to NPR 10 Million',
    AGRICULTURE_ABOVE_TEN_MILLION = 'Agriculture above NPR 10 Million'
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
