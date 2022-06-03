
export enum RetailRequiredDocumentList {
    PROMISSORY_NOTE = 'Promissory Note',
    LETTER_OF_CONTINUITY = 'Letter Of Continuity',
    LOAN_DEED = 'Loan Deed',
    MORTGAGE_DEED = 'Mortgage Deed',
    REMORTGAGE_DEED = 'Re-Mortgage Deed',
    PERSONAL_GUARANTEE_AND_NETWORTH_STATEMENT = 'Personal Guarantee and Networth Statement',
    HIRE_PURCHASE_AGREEMENT = 'Hire Purchase Agreement',
    INSURANCE_POLICY_OF_VEHICLE = 'Insurance Policy of Vehicle',
    VEHICLE_BLUE_BOOK = 'Vehicle Blue Book',
    THIRD_PARTY_CONSENT = 'Third Party Consent',
    VALUATION_REPORT = 'Valuation Report',
    INSURANCE_OF_BUILDING = 'Insurance of Building',
    PAN = 'PAN',
    SELF_DECLARATION = 'Self Declaration',
    UNDERTAKING_LETTER = 'Undertaking Letter',
    SHARE_PLEDGE_DEED = 'Share Pledge Deed',
    NRB_DECLARATION_FORM = 'NRB Declaration Form',
    RISK_TAKER_DETAIL = 'Risk Taker Detail',
    SHARE_PLEDGE_CONFIRMATION = 'Share Pledge Confirmation',
    MULTI_BANKING_DECLARATION = 'Multi Banking Declaration',
    POD_RENEWABLE_APPLICATION = 'POD Renewable Application',
    FIVE_M_DECLARATION_LETTER = '5M Declaration Letter',
    HOUSE_COMPLETION_CERTIFICATE = 'House Completion Certificate',
    NEGATIVE_LIEN = 'Negative Lien',
    LETTER_OF_CONSENT_FORM_MORTGAGE_PROPERTY_OWNER_FOR_CONTINUATION_OF_EXISTING_MORTGAGE = 'Letter of Consent from Mortgage property owner for continuation of existing mortgage',
    DEBIT_AUTHORITY = 'Debit Authority',
    LETTER_OF_SET_OFF = 'Letter of Set Off',
    FIXED_DEPOSIT_CERTIFICATE = 'Fixed Deposit  Certificate'
}



export namespace RetailRequiredDocumentList {
    export function values() {
        return Object.keys(RetailRequiredDocumentList).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
                && type !== 'getEnum'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: RetailRequiredDocumentList[elem],
            });
        });
        return enums;
    }
}

