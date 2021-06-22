export enum OwnershipTransfer {
  SALE = 'Sale(Rajinama)',
  FAMILY_SEPARATION = 'Family Separation',
  GIFT_BAKASPATRA = 'Gift (Bakaspatra)',
  OTHER = 'Other',
  PATRIARCHAL_PROPERTY = 'Patriarchal Property(Paitrik Sampathi)',
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
    } else if (ownershipTransfer === OwnershipTransfer.PATRIARCHAL_PROPERTY) {
      return 'PATRIARCHAL_PROPERTY';
    } else if (ownershipTransfer === OwnershipTransfer.OTHER) {
      return 'OTHER';
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
