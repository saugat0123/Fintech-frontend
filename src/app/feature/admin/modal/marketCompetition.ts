export enum MarketCompetition {
    DOMINANT = 'Dominant Player',
    MODERATE = 'Moderately Competitive',
    HIGH = 'Highly Competitive'
}

export class MarketCompetitionMap {
    static marketCompetitionMap: Map<string, number> = new Map([
        [MarketCompetition.DOMINANT, 1],
        [MarketCompetition.MODERATE, 0.50],
        [MarketCompetition.HIGH, 0]
    ]);
}

export namespace MarketCompetition {
    export function values() {
        return Object.keys(MarketCompetition).filter(
            (type) => isNaN(<any>type) && type !== 'values' &&
                type !== 'enumObject'
        );
    }

    export function enumObject() {
        const pairs = [];
        values().forEach(elem => {
            pairs.push({
                key: elem,
                value: MarketCompetition[elem]
            });
        });
        return pairs;
    }
}
