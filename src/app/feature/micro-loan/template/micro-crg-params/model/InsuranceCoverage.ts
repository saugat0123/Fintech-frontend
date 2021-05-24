export enum InsuranceCoverage {
    LOAN_SECURED_AT_DCGF_STOCK_INSURANCE = 'Loan secured at DCGF/Stock Insurance',
    LOAN_SECURED_AT_DCGF_STOCK_INSURANCE_WITH_FAC = 'Loan secured at DCGF/Stock Insurance with FAC',
    LOAN_SECURED_AT_DCGF_STOCK_INSURANCE_WITH_CUSHION_COLLATERAL = 'Loan secured at DCGF/Stock Insurance with Cushion Collateral',
    LOAN_SECURED_AT_DCGF_STOCK_INSURANCE_WITH_TIED_UP_COLLATERAL = 'Loan secured at DCGF/Stock Insurance with tied up collateral'
}

export class InsuranceCoverageMap {
    static map: Map<InsuranceCoverage, number> = new Map([
        [InsuranceCoverage.LOAN_SECURED_AT_DCGF_STOCK_INSURANCE, 28.00],
        [InsuranceCoverage.LOAN_SECURED_AT_DCGF_STOCK_INSURANCE_WITH_FAC, 40.00],
        [InsuranceCoverage.LOAN_SECURED_AT_DCGF_STOCK_INSURANCE_WITH_CUSHION_COLLATERAL, 32.00],
        [InsuranceCoverage.LOAN_SECURED_AT_DCGF_STOCK_INSURANCE_WITH_TIED_UP_COLLATERAL, 36.00]
    ]);
}

export namespace InsuranceCoverage {
    export function values() {
        return Object.keys(InsuranceCoverage).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
                && type !== 'getEnum'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: InsuranceCoverage[elem],
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
