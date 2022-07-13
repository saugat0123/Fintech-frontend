export enum RelationWithMega {
    DEPOSIT_RELATIONSHIP = 'Deposit Relationship',
    LOAN_RELATIONSHIP = 'Loan Relationship',
    NEW_WITH_NO_RELATIONSHIP = 'New with no relationship'
}

export class RelationWithMegaMap {
    static map: Map<RelationWithMega, number> = new Map([
        [RelationWithMega.DEPOSIT_RELATIONSHIP, 1.20],
        [RelationWithMega.LOAN_RELATIONSHIP, 1.50],
        [RelationWithMega.NEW_WITH_NO_RELATIONSHIP, 0.75]
    ]);
}

export namespace RelationWithMega {
    export function values() {
        return Object.keys(RelationWithMega).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
                && type !== 'getEnum'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: RelationWithMega[elem],
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
