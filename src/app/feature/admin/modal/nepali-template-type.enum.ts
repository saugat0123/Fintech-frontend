export enum NepaliTemplateType {
  HIRE_PURCHASE_KARJA_NIBEDAN = 'Hire Purchase Karja Nibedan',
  HIRE_PURCHASE_KARJA_BIKE = 'Hire Purchase Karja Bike',
  AABEDAK_FAMILY_BIBARAN = 'Aabedak Family Bibaran',
  JAMANI_BASEKO = 'Jamani Baseko'
}

export namespace NepaliTemplateType {
  export function values() {
    return Object.keys(NepaliTemplateType).filter(
        (type) => isNaN(<any>type)
            && type !== 'values'
            && type !== 'enumObject'
            && type !== 'getEnum',
    );
  }

  export function enumObject() {
    const enums = [];
    values().forEach(value => {
      enums.push({
        key: value,
        value: NepaliTemplateType[value],
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
