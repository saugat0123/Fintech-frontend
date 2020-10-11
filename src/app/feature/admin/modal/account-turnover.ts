export enum AccountTurnover {
    MORE_THAN_SEVENTY = 'Account turnover(total credit transaction amount) more than 70% of sales proceeds i.e. ' +
        'deposit via pure cash/cheque/IPS/RTGS only',
    FIFTY_TO_SEVENTY = 'Account turnover(total credit transaction amount) between 50% - 70% of sales proceeds i.e. ' +
        'deposit via pure cash/cheque/IPS/RTGS only',
    LESS_THAN_FIFTY = 'Account turnover(total credit transaction amount) less than 50% of sales proceeds',
    NO_HISTORY = 'New customer with no account history'
}

export class AccountTurnoverMap {
    static accountTurnoverMap: Map<AccountTurnover, number> = new Map([
        [AccountTurnover.MORE_THAN_SEVENTY, 3],
        [AccountTurnover.FIFTY_TO_SEVENTY, 2],
        [AccountTurnover.LESS_THAN_FIFTY, 1],
        [AccountTurnover.NO_HISTORY, 0],
    ]);
}

export namespace AccountTurnover {
    export function values() {
        return Object.keys(AccountTurnover).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject' &&
                type !== 'getEnum'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: AccountTurnover[elem],
            });
        });
        return enums;
    }

    export function getEnum(value: string)  {
        for (const elem of enumObject()) {
            if (elem.value === value) {
                return elem.key;
            }
        }
    }
}
