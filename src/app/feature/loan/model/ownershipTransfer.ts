export enum OwnershipTransfer {
  SALE = 'Sale',
  FAMILY_SEPARATION = 'Family Separation',
  GIFT_BAKASPATRA = 'Gift (Bakaspatra)',
}


export namespace OwnershipTransfer {
  export function values() {
    return Object.keys(OwnershipTransfer).filter(
        (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject' && type !== 'id'
    );
  }
  export function id(ownershipTransfer: OwnershipTransfer) {
    if (ownershipTransfer === OwnershipTransfer.SALE) {
      return 'SALE';
    } else if (ownershipTransfer === OwnershipTransfer.FAMILY_SEPARATION) {
      return 'FAMILY_SEPARATION';
    } else if (ownershipTransfer === OwnershipTransfer.GIFT_BAKASPATRA) {
      return 'GIFT_BAKASPATRA';
    }
  }
  export function enumObject() {
    const enums = [];
    values().forEach(value => {
      enums.push({
        key: value,
        value: OwnershipTransfer[value]
      });
    });
    return enums;
  }


}
