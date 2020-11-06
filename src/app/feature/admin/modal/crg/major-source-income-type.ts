
export enum MajorSourceIncomeType {
    SALARY_RENTAL_BUSINESS= 'Salary/Rental/Business',
    SALARY_RENTAL_BUSINESS_REMITTANCE= 'Salary/Rental/Business and Remittance',
    SALARY_RENTAL_BUSINESS_COMMISSION= 'Salary/Rental/Business and Commission',
    SALARY_RENTAL_BUSINESS_TRANSPORTATION= 'Salary/Rental/Business and Transportation',
    SALARY_RENTAL_BUSINESS_AGRICULTURE= 'Salary/Rental/Business and Agriculture'
}

export class MajorSourceIncomeMap {
    static majorSourceIncomeMap: Map<MajorSourceIncomeType, number> = new Map([
        [MajorSourceIncomeType.SALARY_RENTAL_BUSINESS, 12],
        [MajorSourceIncomeType.SALARY_RENTAL_BUSINESS_REMITTANCE, 10.80],
        [MajorSourceIncomeType.SALARY_RENTAL_BUSINESS_COMMISSION, 9.00],
        [MajorSourceIncomeType.SALARY_RENTAL_BUSINESS_TRANSPORTATION, 7.20],
        [MajorSourceIncomeType.SALARY_RENTAL_BUSINESS_AGRICULTURE, 6.00],
    ]);
}

export namespace MajorSourceIncomeType {
    export function values() {
        return Object.keys(MajorSourceIncomeType).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
                && type !== 'getEnum'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: MajorSourceIncomeType[elem],
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
