export enum IndustryGrowth {
    GROWING = 'Growing',
    STABLE = 'Stable',
    DECLINING = 'Declining'
}

export class IndustryGrowthMap {
    static industryGrowthMap: Map<string, number> = new Map([
        [IndustryGrowth.GROWING, 1],
        [IndustryGrowth.STABLE, 0.50],
        [IndustryGrowth.DECLINING, 0]
    ]);
}

export namespace IndustryGrowth {
    export function values() {
        return Object.keys(IndustryGrowth).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
        );
    }

    export function enumObject() {
        const pairs = [];
        values().forEach(elem => {
            pairs.push({
                key: elem,
                value: IndustryGrowth[elem]
            });
        });
        return pairs;
    }
}
