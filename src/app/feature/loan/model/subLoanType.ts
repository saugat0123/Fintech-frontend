export enum SubLoanType {
    WORKING_CAPITAL_FINANCING = 'Working Capital Financing',
    SHARE_LOAN = 'Share Loan',
    GOLD_LOAN = 'Gold Loan',
    CAPITAL_EXPENDITURE_FINANCING = 'Capital Expenditure Financing',
    FIXED_ASSETS_FINANCING = 'Fixed Assets Financing',
    VEHICLE_FINANCING = 'Vehicle Financing',
    REFINANCING_OF_ASSETS = 'Refinancing of Assets',
    LOAN_AGAINST_LC_DOCUMENT = 'Loan against LC  Document (Within LC Limit)',
    LOAN_AGAINST_TT_DD_DAP_DAA = 'Loan against TT/DD/DAP/DAA',
    PURCHASE_OF_LAND_BUILDING = 'Purchase of Land / Building',
    CONSTRUCTION_OF_BUILDING = 'Construction of  Building',
    BID_BOND_GUARANTEE= 'Bid Bond Guarantee',
    PERFORMANCE_GUARANTEE = 'Performance Guarantee',
    ADVANCE_PAYMENT_GUARANTEE = 'Advance Payment Guarantee'
}

export namespace SubLoanType {

    export function values() {
        return Object.keys(SubLoanType).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'value'
        );
    }

    export function value(loanType: string) {
        const enums = [];
        if (loanType.toLowerCase() === 'demand loan' || loanType.toLowerCase() === 'overdraft') {
            enums.push({
                key: getEnum(SubLoanType.WORKING_CAPITAL_FINANCING),
                value: SubLoanType.WORKING_CAPITAL_FINANCING
            });
            enums.push({
                key: getEnum(SubLoanType.GOLD_LOAN),
                value: SubLoanType.GOLD_LOAN
            });
            enums.push({
                key: getEnum(SubLoanType.SHARE_LOAN),
                value: SubLoanType.SHARE_LOAN
            });

        } else if (loanType.toLowerCase() === 'term loan') {
            enums.push({
                key: getEnum(SubLoanType.WORKING_CAPITAL_FINANCING),
                value: SubLoanType.WORKING_CAPITAL_FINANCING
            });
            enums.push({
                key: getEnum(SubLoanType.CAPITAL_EXPENDITURE_FINANCING),
                value: SubLoanType.CAPITAL_EXPENDITURE_FINANCING
            });
            enums.push({
                key: getEnum(SubLoanType.FIXED_ASSETS_FINANCING),
                value: SubLoanType.FIXED_ASSETS_FINANCING
            });
            enums.push({
                key: getEnum(SubLoanType.VEHICLE_FINANCING),
                value: SubLoanType.VEHICLE_FINANCING
            });
            enums.push({
                key: getEnum(SubLoanType.REFINANCING_OF_ASSETS),
                value: SubLoanType.REFINANCING_OF_ASSETS
            });

        } else if (loanType.toLowerCase() === 'trust receipt loan') {
            enums.push({
                key: getEnum(SubLoanType.WORKING_CAPITAL_FINANCING),
                value: SubLoanType.WORKING_CAPITAL_FINANCING
            });
            enums.push({
                key: getEnum(SubLoanType.LOAN_AGAINST_LC_DOCUMENT),
                value: SubLoanType.LOAN_AGAINST_LC_DOCUMENT
            });
            enums.push({
                key: getEnum(SubLoanType.LOAN_AGAINST_TT_DD_DAP_DAA),
                value: SubLoanType.LOAN_AGAINST_TT_DD_DAP_DAA
            });
        } else if (loanType.toLowerCase() === 'home loan') {
            enums.push({
                key: getEnum(SubLoanType.PURCHASE_OF_LAND_BUILDING),
                value: SubLoanType.PURCHASE_OF_LAND_BUILDING
            });
            enums.push({
                key: getEnum(SubLoanType.CONSTRUCTION_OF_BUILDING),
                value: SubLoanType.CONSTRUCTION_OF_BUILDING
            });
        } else if (loanType.toLowerCase() === 'bank guarantee') {
            enums.push({
                key: getEnum(SubLoanType.WORKING_CAPITAL_FINANCING),
                value: SubLoanType.WORKING_CAPITAL_FINANCING
            });
            enums.push({
                key: getEnum(SubLoanType.BID_BOND_GUARANTEE),
                value: SubLoanType.BID_BOND_GUARANTEE
            });
            enums.push({
                key: getEnum(SubLoanType.PERFORMANCE_GUARANTEE),
                value: SubLoanType.PERFORMANCE_GUARANTEE
            });
            enums.push({
                key: getEnum(SubLoanType.ADVANCE_PAYMENT_GUARANTEE),
                value: SubLoanType.ADVANCE_PAYMENT_GUARANTEE
            });
        } else if (loanType.toLowerCase() === 'sana byawasai karja' || loanType.toLowerCase() === 'sana byawasai karja - lite') {
            enums.push({
                key: getEnum(SubLoanType.WORKING_CAPITAL_FINANCING),
                value: SubLoanType.WORKING_CAPITAL_FINANCING
            });
            enums.push({
                key: getEnum(SubLoanType.CAPITAL_EXPENDITURE_FINANCING),
                value: SubLoanType.CAPITAL_EXPENDITURE_FINANCING
            });
            enums.push({
                key: getEnum(SubLoanType.FIXED_ASSETS_FINANCING),
                value: SubLoanType.FIXED_ASSETS_FINANCING
            });
            enums.push({
                key: getEnum(SubLoanType.VEHICLE_FINANCING),
                value: SubLoanType.VEHICLE_FINANCING
            });
            enums.push({
                key: getEnum(SubLoanType.REFINANCING_OF_ASSETS),
                value: SubLoanType.REFINANCING_OF_ASSETS
            });
        }
        return enums;
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: SubLoanType[elem],
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


