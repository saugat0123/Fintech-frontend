
export enum RequiredDocumentListConst {
    PROMISSORY_NOTE = 'Promissory Note',
    BOARD_MINUTE = 'Board Minute',
    LOAN_DEED = 'Loan Deed',
    MORTGAGED_DEED = 'Mortgaged Deed',
    LETTER_OF_CONTINUITY = 'Letter Of Continuity',
    GENERAL_LETTER_OF_HYPOTHECATION_WITH_SUPPLEMENTARY_AGREEMENT = 'General Letter Of Hypothecation with Supplementary Agreement',
    ASSIGNMENT_OF_RECEIVABLES_WITH_POWER_OF_ATTORNEY = 'Assignment Of Receivables with Power Of Attorney',
    MULTIPLE_BANKING_DECLARATION = 'Multiple Banking Declaration',
    PERSONAL_GUARANTEE = 'Personal Guarantee',
    WEALTH_STATEMENT_OF_GUARANTOR = 'Wealth Statement Of Guarantor',
    INSURANCE_OF_STOCK = 'Insurance Of Stock',
    INSURANCE_OF_BUILDING = 'Insurance Of Building',
    INSURANCE_DECLARATION_STATEMENT = 'Insurance Declaration Statement',
    UNDERTAKING_LETTER = 'Undertaking Letter',
    DECLARATION_LETTER = 'Declaration Letter',
    LEASE_AGREEMENT = 'Lease Agreement',
    LETTER_OF_CONSENT_FROM_MORTGAGE_PROPERTY_OWNER_FOR_CONTINUATION_OF_EXISTING_MORTGAGE = 'Letter Of Consent from Mortgage Property Owner for Continuation Of Existing Mortgage',
    BUILDING_CONSTRUCTION_COMPLETE_CERTIFICATE = 'Building Construction Complete Certificate',
    HIRE_PURCHASE_AGREEMENT = 'Hire Purchase Agreement',
    COMPREHENSIVE_INSURANCE = 'Comprehensive Insurance',
    CONSENT_FOR_THIRD_PARTY_TRANSFER_IN_CASE_OF_DEFAULT = 'Consent for Third Party Transfer in Case Of Default',
    BLUE_BOOK = 'Blue Book',
    LOAN_SUBORDINATION_AGREEMENT = 'Loan Subordination Agreement',
    PARI_PASU_DEED = 'Pari-Pasu Deed',
    PARTNERSHIP_DEED = 'Partnership Deed',
    LETTER_OF_SET_OFF = 'Letter Of Set Off',
    VALUATION_REPORT = 'Valuation Report',
    CORPORATE_GUARANTEE = 'Corporate Guarantee'
}



export namespace RequiredDocumentListConst {
    export function values() {
        return Object.keys(RequiredDocumentListConst).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
                && type !== 'getEnum'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: RequiredDocumentListConst[elem],
            });
        });
        return enums;
    }
}

