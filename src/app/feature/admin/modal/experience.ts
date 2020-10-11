export enum Experience {
    MORE_THAN_FIVE = 'More than 5 years in the related line of business',
    TWO_TO_FIVE = '2-5 years in the related line of business',
    ONE_TO_TWO = '1-2 years in the related line of business',
    NO = 'No experience'
}

export class ExperienceMap {
    static experienceMap: Map<string, number> = new Map([
        [Experience.MORE_THAN_FIVE, 7],
        [Experience.TWO_TO_FIVE, 5.25],
        [Experience.ONE_TO_TWO, 3.50],
        [Experience.NO, 0]
    ]);
}

export namespace Experience {

    export function values() {
        return Object.keys(Experience).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(value => {
            enums.push({
                key: value,
                value: Experience[value]
            });
        });
        return enums;
    }
}
