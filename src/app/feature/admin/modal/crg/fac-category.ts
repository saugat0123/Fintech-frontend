
export enum FacCategory {
    NOT_APPLICABLE= 'Not applicable',
    METROPOLITAN= 'Metropolitan',
    SUB_METROPOLITAN= 'Sub-metropolitan',
    MUNICIPALITY= 'Municipality',
    RURAL_MUNICIPALITY= 'Rural Municipality',
    AGRICULTURE= 'Agriculture'
}

export class FacCategoryMap {
    static facCategoryMap: Map<FacCategory, number> = new Map([
        [FacCategory.NOT_APPLICABLE, 3.00],
        [FacCategory.METROPOLITAN, 3.00],
        [FacCategory.SUB_METROPOLITAN, 2.70],
        [FacCategory.MUNICIPALITY, 2.25],
        [FacCategory.RURAL_MUNICIPALITY, 1.95],
        [FacCategory.AGRICULTURE, 1.25],
    ]);
}

export namespace FacCategory {
    export function values() {
        return Object.keys(FacCategory).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
                && type !== 'getEnum'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: FacCategory[elem],
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
