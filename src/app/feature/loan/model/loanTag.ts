export enum LoanTag {
    GENERAL = 'GENERAL',
    FIXED_DEPOSIT = 'FIXED DEPOSIT'
}

export namespace LoanTag {
    export function values() {
        return Object.keys(LoanTag).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject' && type !== 'getKeyByValue'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(value => {
            enums.push({
                key: value,
                value: LoanTag[value]
            });
        });
        return enums;
    }

    export function getKeyByValue(enumValue) {
        return Object.keys(LoanTag).find(key => LoanTag[key] === enumValue);
    }
}
