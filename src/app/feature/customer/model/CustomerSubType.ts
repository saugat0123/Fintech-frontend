export enum CustomerSubType {
  PERSONAL = 'Personal',
  JOINT = 'Joint',
  PARTNERSHIP = 'Partnership',
  PROPRIETORSHIP = 'Proprietorship',
  PRIVATE_PUBLIC = 'Private Public'
}

export namespace CustomerSubType {
  export function values() {
    return Object.keys(CustomerSubType).filter(
        (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
    );
  }

  export function enumObject() {
    const enums = [];
    values().forEach(elem => {
      enums.push({
        key: elem,
        value: CustomerSubType[elem],
      });
    });
    return enums;
  }

}



