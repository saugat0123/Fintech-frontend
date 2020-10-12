export enum TaxCompliance {
    TCC_PROVIDED_OR_TAX_PAID_AMOUNT_MATCHES_WITH_TAX_LIABILITY_AS_PER_AUDITED_FINANCIALS = 'TCC provided or tax paid amount matches with tax liability as per audited financials',
    TCC_PROVIDED_OR_TAX_PAID_AMOUNT_DOES_NOT_MATCHES_WITH_TAX_LIABILITY_AS_PER_AUDITED_FINANCIALS = 'TCC provided or tax paid amount does not matches with tax liability as per audited financials'
}

export class TaxCompliancePointsMap {
    static taxCompliancePointsMap: Map<string, number> = new Map([
        [TaxCompliance.TCC_PROVIDED_OR_TAX_PAID_AMOUNT_MATCHES_WITH_TAX_LIABILITY_AS_PER_AUDITED_FINANCIALS, 3],
        [TaxCompliance.TCC_PROVIDED_OR_TAX_PAID_AMOUNT_DOES_NOT_MATCHES_WITH_TAX_LIABILITY_AS_PER_AUDITED_FINANCIALS, 0]
    ]);
}

export namespace TaxCompliance {
    export function values() {
        return Object.keys(TaxCompliance).filter(
            (type) => isNaN(<any>type)
                && type !== 'values'
                && type !== 'enumObject'
                && type !== 'getEnum',
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(value => {
            enums.push({
                key: value,
                value: TaxCompliance[value],
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
