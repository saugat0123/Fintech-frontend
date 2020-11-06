
export enum GrossMonthlyIncomeExpenses {
    MORE_TWO= 'More than 2 times',
    TWO= '2 times',
    LESS_TWO= 'Less than two tim',
}

export class GrossMonthlyIncomeExpensesMap {
    static majorSourceIncomeMap: Map<GrossMonthlyIncomeExpenses, number> = new Map([
        [GrossMonthlyIncomeExpenses.MORE_TWO, 12],
        [GrossMonthlyIncomeExpenses.TWO, 9.6],
        [GrossMonthlyIncomeExpenses.LESS_TWO, 0],
    ]);
}

export namespace GrossMonthlyIncomeExpenses {
    export function values() {
        return Object.keys(GrossMonthlyIncomeExpenses).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
                && type !== 'getEnum'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: GrossMonthlyIncomeExpenses[elem],
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
