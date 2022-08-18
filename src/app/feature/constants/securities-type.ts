export enum SecuritiesType {
    LAND_SECURITY = 'Land Security',
    VEHICLE_SECURITY = 'Vehicle Security',
    APARTMENT_SECURITY = 'Apartment Security',
    LAND_BUILDING_SECURITY = 'Land Building Security',
    PLANT_AND_MACHINERY_SECURITY = 'Plant and Machinery',
    FIXED_DEPOSIT_RECEIPT = 'Fixed Deposit Receipt',
    SHARE_SECURITY = 'Share Security',
    HYPOTHECATION_OF_STOCK = 'Hypothecation of Stock',
    // CORPORATE_GUARANTEE = 'Corporate Guarantee',
    // PERSONAL_GUARANTEE = 'Personal Guarantee',
    INSURANCE_POLICY_SECURITY = 'Insurance Policy Security',
    // ASSIGNMENT_OF_RECEIVABLES = 'Assignment of Receivables',
    LEASE_ASSIGNMENT = 'Lease Assignment',
    OTHER_SECURITY = 'Other Security'
}

export namespace SecuritiesType {
    export function values() {
        return Object.keys(SecuritiesType).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: SecuritiesType[elem],
            });
        });
        return enums;
    }
}
