export enum ValuatingField {
  LAND = 'Land',
  VEHICLE = 'Vehicle',
  LAND_BUILDING = 'Land & Building',
  PLANT_MACHINARY = 'Plant & Machinary'

}

export namespace ValuatingField {
  export function getKeyByValue(enumValue) {
    return Object.keys(ValuatingField).find(key => ValuatingField[key] === enumValue);
  }

  export function values() {
    return Object.keys(ValuatingField).filter(
        (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
    );
  }

  export function enumObject() {
    const enums = [];
    values().forEach(value => {
      enums.push({
        key: value,
        value: ValuatingField[value]
      });
    });
    return enums;
  }


}
