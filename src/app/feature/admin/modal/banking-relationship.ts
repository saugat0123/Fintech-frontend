export enum BankingRelationship {
    MORE_THAN_TWO = 'More than 2 years relationship with us',
    TWO_OR_LESS = '2 or less than 2 years relationship with us',
    NEW_CUSTOMER_WITH_MIN_TWO = 'New customer with minimum 2 years credit relationship with its existing bank',
    NEW_CUSTOMER_WITH_LESS_THAN_ONE = 'New customer with less than 1 year or No credit relationship with any bank'
}

export class BankingRelationshipMap {
    static bankingRelationshipMap: Map<string, number> = new Map([
        [BankingRelationship.MORE_THAN_TWO, 3],
        [BankingRelationship.TWO_OR_LESS, 1.50],
        [BankingRelationship.NEW_CUSTOMER_WITH_MIN_TWO, 1.50],
        [BankingRelationship.NEW_CUSTOMER_WITH_LESS_THAN_ONE, 0]
    ]);
}
export class BankingRelationshipIndividualMap {
    static bankingRelationshipMap: Map<string, number> = new Map([
        [BankingRelationship.MORE_THAN_TWO, 3.50],
        [BankingRelationship.TWO_OR_LESS, 1.75],
        [BankingRelationship.NEW_CUSTOMER_WITH_MIN_TWO, 1.75],
        [BankingRelationship.NEW_CUSTOMER_WITH_LESS_THAN_ONE, 0]
    ]);
}

export namespace BankingRelationship {
    export function values() {
        return Object.keys(BankingRelationship).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
                && type !== 'getEnum'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: BankingRelationship[elem],
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
