export enum OfferLetteDocrTypeEnum {
    DRAFT = 'DRAFT',
    SIGNED = 'SIGNED'
}

export namespace OfferLetterDocType {

    export function values() {
        return Object.keys(OfferLetteDocrTypeEnum).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'value'
        );
    }
    export function value() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: OfferLetteDocrTypeEnum[elem],
            });
        });
        return enums;
    }
}
