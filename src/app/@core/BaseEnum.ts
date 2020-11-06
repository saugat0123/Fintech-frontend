
export class BaseEnum<T> {

     values(obj: T) {
        return Object.keys(obj).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
                && type !== 'getEnum'
        );
    }

     enumObject(obj: T) {
        const enums = [];
        this.values(obj).forEach(elem => {
            enums.push({
                key: elem,
                value: obj[elem],
            });
        });
        return enums;
    }

     getEnum(value: string , obj: T) {
        for (const enumPair of this.enumObject(obj)) {
            if (enumPair.value === value) {
                return enumPair.key;
            }
        }
    }
}
