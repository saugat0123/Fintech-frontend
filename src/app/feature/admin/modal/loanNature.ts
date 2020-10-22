export enum loanNature {
    Revolving = 'Revolving',
    Terminating = 'Terminating'
}

export namespace loanNature {
    export function values() {
        return Object.keys(loanNature).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: loanNature[elem],
            });
        });
        return enums;
    }

}



