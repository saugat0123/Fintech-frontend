export enum NrbDirective {
  PASS= 'Pass',
  WATCHLIST = 'watchlist',
  DOUBTFUL = 'Doubtful',
  SUBSTANDARD = 'Substandard',
  BAD = 'Bad',
  NOT_APPLICABLE = 'Not Applicable'
}


export namespace NrbDirective {
  export function values() {
    return Object.keys(NrbDirective).filter(
        (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
    );
  }

  export function enumObject() {
    const pairs = [];
    values().forEach(elem => {
      pairs.push({
        key: elem,
        value: NrbDirective[elem]
      });
    });
    return pairs;
  }
}
