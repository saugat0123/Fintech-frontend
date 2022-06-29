export enum BusinessType {
  MANUFACTURING = 'Manufacturing',
  TRADING = 'Trading',
  SERVICE = 'Service',
  // CONSULTANCY = 'Consultancy',
  // CONSTRUCTION_SERVICE = 'Construction Service'
}

export namespace BusinessType {

  export function values() {
    return Object.keys(BusinessType).filter(
        (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
    );
  }

  export function enumObject() {
    const enums = [];
    values().forEach(value => {
      enums.push({
        key: value,
        value: BusinessType[value]
      });
    });
    return enums;
  }
}
