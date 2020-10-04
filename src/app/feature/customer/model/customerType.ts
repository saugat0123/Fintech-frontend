export enum CustomerType {
  INDIVIDUAL = 'INDIVIDUAL',
  INSTITUTION = 'INSTITUTION'
}

export namespace CustomerType {
  export function values() {
    return Object.keys(CustomerType).filter(
        (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
    );
  }

  export function enumObject() {
    const enums = [];
    values().forEach(elem => {
      enums.push({
        key: elem,
        value: CustomerType[elem],
      });
    });
    return enums;
  }

}



