export enum MaritalStatus {
    SINGLE = 'Single',
    MARRIED = 'Married',
    SEPARATED = 'Separated',
    DIVORCED = 'Divorced',
}

export namespace MaritalStatus {
    export function values() {
        return Object.keys(MaritalStatus).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(value => {
            enums.push({
                key: value,
                value: MaritalStatus[value]
            });
        });
        return enums;
    }
}
