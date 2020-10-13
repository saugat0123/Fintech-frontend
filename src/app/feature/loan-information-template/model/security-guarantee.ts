export enum SecurityGuarantee {
    HIGH_NET_WORTH = 'Personal Guarantees with High Net Worth (Net Worth above 2 times FAC provided. ' +
        'Net Worth = Value of Personal Assets - Borrowings)',
    AVERAGE_FINANCIAL_STRENGTH = 'Personal Guarantees Average Financial Strength (Net Worth above 1.5 ' +
        'times of FAC provided)',
    SATISFACTORY_FINANCIAL_STRENGTH = 'Personal Guarantees Satisfactory Financial Strength (Net Worth ' +
        'equals to FAC provided)',
    LOW_FINANCIAL_STRENGTH = 'Personal Guarantees with Low Financial Strength(Net worth lower than FAC provided)'
}

export class SecurityGuaranteePointsMap {
    static securityGuaranteePointsMap: Map<string, number> = new Map([
        [SecurityGuarantee.HIGH_NET_WORTH, 2.50],
        [SecurityGuarantee.AVERAGE_FINANCIAL_STRENGTH, 2.00],
        [SecurityGuarantee.SATISFACTORY_FINANCIAL_STRENGTH, 1.50],
        [SecurityGuarantee.LOW_FINANCIAL_STRENGTH, 1.00]
    ]);
}

export namespace SecurityGuarantee {
    export function values() {
        return Object.keys(SecurityGuarantee).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
        );
    }

    export function enumObject() {
        const pairs = [];
        values().forEach(elem => {
            pairs.push({
                key: elem,
                value: SecurityGuarantee[elem]
            });
        });
        return pairs;
    }
}
