export enum Succession {
    READY = 'Ready Succession (Second line already involved in business)',
    AVAILABLE = 'Succession Available (Second line available but not actively involved in business)',
    NO = 'No Succession planning'
}

export class SuccessionMap {
    static successionMap: Map<string, number> = new Map([
        [Succession.READY, 3],
        [Succession.AVAILABLE, 1.50],
        [Succession.NO, 0]
    ]);
}

export namespace Succession {

    export function values() {
        return Object.keys(Succession).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(value => {
            enums.push({
                key: value,
                value: Succession[value]
            });
        });
        return enums;
    }
}
