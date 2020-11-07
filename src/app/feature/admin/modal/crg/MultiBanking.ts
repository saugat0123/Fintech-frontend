
export enum MultiBanking {
    UPTO_TWO_POINT_FIVE= 'Loan upto NPR 2.5 Million',
    ABOVE_TWO_POINT_FIVE_TO_FIVE= 'Above NPR 2.5 Million to NPR 5 Million',
    ABOVE_FIVE_TO_SEVEN_POINT_FIVE= 'Above NPR 5 Million to NPR 7.5 Million',
    ABOVE_SEVEN_POINT_FIVE_TO_TEN= 'Above NPR 7.5 Million to NPR 10 Million',
    ABOVE_TEN= 'Above 10 Million',
    NOT_APPLICABLE= 'Not applicable',
}

export class MultiBankingMap {
    static majorSourceIncomeMap: Map<MultiBanking, number> = new Map([
        [MultiBanking.UPTO_TWO_POINT_FIVE, 2.50],
        [MultiBanking.ABOVE_TWO_POINT_FIVE_TO_FIVE, 2.25],
        [MultiBanking.ABOVE_FIVE_TO_SEVEN_POINT_FIVE, 1.88],
        [MultiBanking.ABOVE_SEVEN_POINT_FIVE_TO_TEN, 1.50],
        [MultiBanking.ABOVE_TEN, 1.25],
        [MultiBanking.NOT_APPLICABLE, 2.50],
    ]);
}

export namespace MultiBanking {
    export function values() {
        return Object.keys(MultiBanking).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
                && type !== 'getEnum'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: MultiBanking[elem],
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
