export enum Security {
    LAND_SECURITY = 'Land Security',
    BUILDING_SECURITY = 'Building Security',
    VEHICLE_SECURITY = 'Vehicle Security',
    PROPERTY_AND_MACHINERY_SECURITY = 'Property and Machinery Security',
    FIXED_DEPOSIT_RECEIPT = 'Fixed Deposit Receipt',
    PUBLIC_SHARE = 'Public Share',
    EDUCATION_CERTIFICATE = 'Education Certificate',
    MARKETABLE_SECURITIES = 'Marketable Securities',
    GOLD = 'Gold',
    PERSONAL_GUARANTOR = 'Personal Guarantor',
    PROMOTER_SHARE = 'Promoter Share'
}

export namespace Security {

    export function values() {
        return Object.keys(Security).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(value => {
            enums.push({
                key: value,
                value: Security[value]
            });
        });
        return enums;
    }
}

