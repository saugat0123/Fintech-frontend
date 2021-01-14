export enum RemarksEnum {
  WAIVER = 'Waiver',
  OBTAINED = 'Obtained',
  DEFERRAL = 'Deferral',
  NA = 'N/A'
}



export namespace RemarksEnum {
  export function values() {
    return Object.keys(RemarksEnum).filter(
        (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
            && type !== 'getEnum'
    );
  }

  export function enumObject() {
    const enums = [];
    values().forEach(elem => {
      enums.push({
        key: elem,
        value: RemarksEnum[elem],
      });
    });
    return enums;
  }
}
