export enum ExpOfClient {
    MORE_THAN_3_YEARS = 'More than 3 years',
    ONE_TO_3_YEARS = '1 to 3 years',
    NO_EXPERIENCE = 'No experience'
}

export class ExpOfClientMap {
    static map: Map<ExpOfClient, number> = new Map([
        [ExpOfClient.MORE_THAN_3_YEARS, 6.00],
        [ExpOfClient.ONE_TO_3_YEARS, 4.80],
        [ExpOfClient.NO_EXPERIENCE, 2.70]
    ]);
}

export namespace ExpOfClient {
    export function values() {
        return Object.keys(ExpOfClient).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
                && type !== 'getEnum'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: ExpOfClient[elem],
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
