export enum RegulatoryConcern {
    PRIORITY_SECTOR = 'Falls under priority sector of NRB/Manufacturing',
    TRADING_SERVICE = 'Trading/Service Organization',
    HIGHLY_REGULATED = 'Highly Regulated Industry'
}

export class RegulatoryConcernMap {
    static regulatoryConcernMap: Map<string, number> = new Map([
        [RegulatoryConcern.PRIORITY_SECTOR, 1],
        [RegulatoryConcern.TRADING_SERVICE, 0.50],
        [RegulatoryConcern.HIGHLY_REGULATED, 0]
    ]);
}

export namespace RegulatoryConcern {

    export function values() {
        return Object.keys(RegulatoryConcern).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(value => {
            enums.push({
                key: value,
                value: RegulatoryConcern[value]
            });
        });
        return enums;
    }
}
