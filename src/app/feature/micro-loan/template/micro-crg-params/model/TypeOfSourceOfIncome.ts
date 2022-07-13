export enum TypeOfSourceOfIncome {
    GOVERNMENT = 'Government ',
    BANKS_AND_FINANCIAL_INSTITUTIONS = 'Banks and financial institutions',
    INSURANCE_COMPANIES = 'Insurance companies',
    PUBLIC_LIMITED = 'Public Limited',
    PROFESSIONALS_WITH_PERMANENT_EMPLOYMENT = 'Professionals with permanent employment',
    PRIVATE_ORGANISATION_WITH_PERMANENT_EMPLOYMENT = 'Private organisation with permanent employment',
    BRITISH_GURKHA = 'British gurkha',
    SINGAPORE_POLICE = 'Singapore police',
    INDIAN_ARMY = 'Indian Army',
    CONTRACTUAL_EMPLOYEMENT = 'Contractual Employement',

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
    SELF_DECLARED_AGRICULTURE = 'Self declared agriculture',
    SELF_DECLARED_BUSINESS = 'Self declared business',

    SALARY = 'Salary',
    RENTAL = 'Rental',
    BUSINESS = 'Business',
}

export class TypeOfSourceOfIncomeMap {
    static typeOfSourceOfIncomePointsMap: Map<string, number> = new Map([
        [TypeOfSourceOfIncome.GOVERNMENT, 16],
        [TypeOfSourceOfIncome.BANKS_AND_FINANCIAL_INSTITUTIONS, 16],
        [TypeOfSourceOfIncome.INSURANCE_COMPANIES, 16],
        [TypeOfSourceOfIncome.PUBLIC_LIMITED, 16],
        [TypeOfSourceOfIncome.PROFESSIONALS_WITH_PERMANENT_EMPLOYMENT, 16],
        [TypeOfSourceOfIncome.PRIVATE_ORGANISATION_WITH_PERMANENT_EMPLOYMENT, 14.40],
        [TypeOfSourceOfIncome.BRITISH_GURKHA, 14.40],
        [TypeOfSourceOfIncome.SINGAPORE_POLICE, 14.40],
        [TypeOfSourceOfIncome.INDIAN_ARMY, 14.40],
        [TypeOfSourceOfIncome.CONTRACTUAL_EMPLOYEMENT, 11.20],

        [TypeOfSourceOfIncome.PRIME_COMMERCIAL, 16],
        [TypeOfSourceOfIncome.COMMERCIAL, 14.40],
        [TypeOfSourceOfIncome.RESIDENTIAL, 12],
        [TypeOfSourceOfIncome.AGRICULTURAL, 8],
        [TypeOfSourceOfIncome.BOTH_OR_ALL, 16],

        [TypeOfSourceOfIncome.TAX_CLEARANCE_CERTIFICATE_PRESENT, 14.40],
        [TypeOfSourceOfIncome.TAX_PAID_RECEIPT_PRESENT, 14.40],
        [TypeOfSourceOfIncome.TAX_UNPAID_AS_OF_NOW, 8],

        [TypeOfSourceOfIncome.REMITTANCE, 9.60],
        [TypeOfSourceOfIncome.COMMISSION, 9.60],
        [TypeOfSourceOfIncome.TRANSPORTATION, 9.60],
        [TypeOfSourceOfIncome.FREELANCING, 9.60],
        [TypeOfSourceOfIncome.SELF_DECLARED_AGRICULTURE, 11.20],
        [TypeOfSourceOfIncome.SELF_DECLARED_BUSINESS, 11.20],
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
        TypeOfSourceOfIncome.SELF_DECLARED_AGRICULTURE,
        TypeOfSourceOfIncome.SELF_DECLARED_BUSINESS,
    ];
    static salaryArray: Array<string> = [
        TypeOfSourceOfIncome.GOVERNMENT,
        TypeOfSourceOfIncome.BANKS_AND_FINANCIAL_INSTITUTIONS,
        TypeOfSourceOfIncome.INSURANCE_COMPANIES,
        TypeOfSourceOfIncome.PUBLIC_LIMITED,
        TypeOfSourceOfIncome.PROFESSIONALS_WITH_PERMANENT_EMPLOYMENT,
        TypeOfSourceOfIncome.PRIVATE_ORGANISATION_WITH_PERMANENT_EMPLOYMENT,
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
