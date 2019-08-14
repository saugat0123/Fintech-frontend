export enum Security {
    LAND_SECURITY = 'Land Security',
    BUILDING_SECURITY = 'Building Security',
    VEHICLE_SECURITY = 'Vehicle Security',
    PROPERTY_AND_MACHINERY_SECURITY = 'Property and Machinery Security',
    FIXED_DEPOSIT_RECEIPT = 'Fixed Deposit Receipt',
    SHARE_STOCK = 'Share Stock',
    EDUCATION_CERTIFICATE = 'Education Certificate'
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

