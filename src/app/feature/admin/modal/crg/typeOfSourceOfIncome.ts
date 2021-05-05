export enum TypeOfSourceOfIncome {
    GOVERNMENT = 'Government ',
    BANKS_AND_FINANCIAL_INSTITUTIONS = 'Banks and financial institutions',
    INSURANCE_COMPANIES = 'Insurance companies',
    PUBLIC_LIMITED = 'Public Limited',
    PROFESSIONALS_WITH_PERMANENT_EMPLOYMENT = 'Professionals with permanent employment',
    BRITISH_GURKHA = 'British gurkha',
    SINGAPORE_POLICE = 'Singapore police',
    INDIAN_ARMY = 'Indian Army',
    CONTRACTUAL_EMPLOYEMENT = 'Contractual Employement',
    NGO_INGO_DEVELOPMENT_SECTOR = 'NGOs/INGOs/Development Sector',

    PRIME_COMMERCIAL = 'Prime Commercial',
    COMMERCIAL = 'Commercial ',
    RESIDENTIAL = 'Residential',
    AGRICULTURAL = 'Agricultural',
    BOTH_OR_ALL = 'Both or all',

    TAX_CLEARANCE_CERTIFICATE_PRESENT = 'Tax Clearance Certificate Present',
    TAX_PAID_RECEIPT_PRESENT = 'Tax paid receipt present',
    TAX_UNPAID_AS_OF_NOW = 'Tax unpaid as of now',

    REMITTANCE = 'Remittance',
    COMMISSION = 'Commission',
    TRANSPORTATION = 'Transportation',
    FREELANCING = 'Freelancing',
    AGRICULTURE = 'Agriculture',

    SALARY = 'Salary',
    RENTAL = 'Rental',
    BUSINESS = 'Business',

    INTEREST_INCOME = 'Interest Income',
    DIVIDEND = 'Dividend',
    OTHERS = 'Others'
}

export class TypeOfSourceOfIncomeMap {
    static typeOfSourceOfIncomePointsMap: Map<string, number> = new Map([
        [TypeOfSourceOfIncome.GOVERNMENT, 24],
        [TypeOfSourceOfIncome.BANKS_AND_FINANCIAL_INSTITUTIONS, 24],
        [TypeOfSourceOfIncome.INSURANCE_COMPANIES, 24],
        [TypeOfSourceOfIncome.PUBLIC_LIMITED, 24],
        [TypeOfSourceOfIncome.PROFESSIONALS_WITH_PERMANENT_EMPLOYMENT, 24],
        [TypeOfSourceOfIncome.NGO_INGO_DEVELOPMENT_SECTOR, 24],
        [TypeOfSourceOfIncome.BRITISH_GURKHA, 21.60],
        [TypeOfSourceOfIncome.SINGAPORE_POLICE, 21.60],
        [TypeOfSourceOfIncome.INDIAN_ARMY, 21.60],
        [TypeOfSourceOfIncome.CONTRACTUAL_EMPLOYEMENT, 16.80],

        [TypeOfSourceOfIncome.PRIME_COMMERCIAL, 24],
        [TypeOfSourceOfIncome.COMMERCIAL, 21.60],
        [TypeOfSourceOfIncome.RESIDENTIAL, 18],
        [TypeOfSourceOfIncome.AGRICULTURAL, 12],
        [TypeOfSourceOfIncome.BOTH_OR_ALL, 24],

        [TypeOfSourceOfIncome.TAX_CLEARANCE_CERTIFICATE_PRESENT, 24],
        [TypeOfSourceOfIncome.TAX_PAID_RECEIPT_PRESENT, 12],
        [TypeOfSourceOfIncome.TAX_UNPAID_AS_OF_NOW, 12],

        [TypeOfSourceOfIncome.REMITTANCE, 18],
        [TypeOfSourceOfIncome.COMMISSION, 18],
        [TypeOfSourceOfIncome.TRANSPORTATION, 18],
        [TypeOfSourceOfIncome.FREELANCING, 18],
        [TypeOfSourceOfIncome.AGRICULTURE, 12],

        // TODO: recalculate score specifications--
        [TypeOfSourceOfIncome.INTEREST_INCOME, 0],
        [TypeOfSourceOfIncome.DIVIDEND, 0],
        [TypeOfSourceOfIncome.OTHERS, 0],
    ]);
}

export class TypeOfSourceOfIncomeArray {
    static typeOfSourceOfIncomeArray = [
        TypeOfSourceOfIncome.SALARY,
        TypeOfSourceOfIncome.RENTAL,
        TypeOfSourceOfIncome.BUSINESS,
        TypeOfSourceOfIncome.REMITTANCE,
        TypeOfSourceOfIncome.COMMISSION,
        TypeOfSourceOfIncome.TRANSPORTATION,
        TypeOfSourceOfIncome.FREELANCING,
        TypeOfSourceOfIncome.AGRICULTURE,
        TypeOfSourceOfIncome.INTEREST_INCOME,
        TypeOfSourceOfIncome.DIVIDEND,
        TypeOfSourceOfIncome.OTHERS
    ];
    static salaryArray: Array<string> = [
        TypeOfSourceOfIncome.GOVERNMENT,
        TypeOfSourceOfIncome.BANKS_AND_FINANCIAL_INSTITUTIONS,
        TypeOfSourceOfIncome.INSURANCE_COMPANIES,
        TypeOfSourceOfIncome.PUBLIC_LIMITED,
        TypeOfSourceOfIncome.PROFESSIONALS_WITH_PERMANENT_EMPLOYMENT,
        TypeOfSourceOfIncome.NGO_INGO_DEVELOPMENT_SECTOR,
        TypeOfSourceOfIncome.BRITISH_GURKHA,
        TypeOfSourceOfIncome.SINGAPORE_POLICE,
        TypeOfSourceOfIncome.INDIAN_ARMY,
        TypeOfSourceOfIncome.CONTRACTUAL_EMPLOYEMENT];

    static rentalArray: Array<string> = [
        TypeOfSourceOfIncome.PRIME_COMMERCIAL,
        TypeOfSourceOfIncome.COMMERCIAL,
        TypeOfSourceOfIncome.RESIDENTIAL,
        TypeOfSourceOfIncome.AGRICULTURAL,
        TypeOfSourceOfIncome.BOTH_OR_ALL];

    static businessArray: Array<string> = [
        TypeOfSourceOfIncome.TAX_CLEARANCE_CERTIFICATE_PRESENT,
        TypeOfSourceOfIncome.TAX_PAID_RECEIPT_PRESENT,
        TypeOfSourceOfIncome.TAX_UNPAID_AS_OF_NOW];
}

export namespace TypeOfSourceOfIncome {
    export function values() {
        return Object.keys(TypeOfSourceOfIncome).filter(
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
                value: TypeOfSourceOfIncome[value],
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
