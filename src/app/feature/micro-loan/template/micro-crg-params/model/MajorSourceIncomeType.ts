export enum MultipleSourceIncomeType {
    AGRICULTURE_BUSINESS = 'Agriculture/Business',
    AGRICULTURE_BUSINESS_SALARY = 'Agriculture/Business/Salary',
    AGRICULTURE_BUSINESS_SALARY_RENTAL = 'Agriculture/Business/Salary/Rental',
    AGRICULTURE_BUSINESS_SALARY_RENTAL_PENSION = 'Agriculture/Business/Salary/Rental/Pension'
}

export class MultipleSourceIncomeTypeMap {
    static map: Map<MultipleSourceIncomeType, number> = new Map([
        [MultipleSourceIncomeType.AGRICULTURE_BUSINESS, 8.40],
        [MultipleSourceIncomeType.AGRICULTURE_BUSINESS_SALARY, 9.60],
        [MultipleSourceIncomeType.AGRICULTURE_BUSINESS_SALARY_RENTAL, 10.80],
        [MultipleSourceIncomeType.AGRICULTURE_BUSINESS_SALARY_RENTAL_PENSION, 12.00]
    ]);
}

export namespace MultipleSourceIncomeType {
    export function values() {
        return Object.keys(MultipleSourceIncomeType).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
                && type !== 'getEnum'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: MultipleSourceIncomeType[elem],
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
