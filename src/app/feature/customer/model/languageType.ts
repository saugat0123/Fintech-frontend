export enum LanguageType {
    ENGLISH = 'ENG',
    NEPALI = 'NEP'
}

export namespace LanguageType {

    export function values() {
        return Object.keys(LanguageType).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(value => {
            enums.push({
                key: value,
                value: LanguageType[value]
            });
        });
        return enums;
    }
}
